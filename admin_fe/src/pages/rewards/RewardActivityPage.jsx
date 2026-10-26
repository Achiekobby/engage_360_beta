import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Activity, Download, Filter, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { clsx } from 'clsx';
import { PageBackLink } from '../../components/layout/PageBackLink';
import ActivityDateFilter from '../../components/rewards/ActivityDateFilter';
import ActivityFiltersDrawer, { countActivityFilters } from '../../components/rewards/ActivityFiltersDrawer';
import ActivityTable from '../../components/rewards/ActivityTable';
import BusinessesPagination from '../../components/businesses/BusinessesPagination';
import { AnimatedModal } from '../../components/motion';
import {
  ACTIVITY_FILTER_DEFAULTS,
  ACTIVITY_PAGE_SIZE,
  DATE_FILTER_DEFAULT,
  countMatching,
  inWindow,
  last30Window,
  percentChange,
  previousWindow,
  resolveDateRange,
  trendCaption,
} from '../../constants/rewardActivity';
import { formatActivityWhen, rewardLineLabel } from '../../constants/rewards';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeRedemptions, setRedemptionStatus } from '../../store/slices/rewardsSlice';

function trendWindow(dateFilter, now) {
  const range = resolveDateRange(dateFilter, now);
  if (!range?.start) return { current: last30Window(now), previous: previousWindow(last30Window(now)) };
  return { current: range, previous: previousWindow(range) };
}

function StatCard({ label, value, change, caption, selected, onSelect }) {
  const up = change >= 0;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={clsx(
        'rounded-2xl border bg-white px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        selected ? 'border-primary shadow-[0_8px_20px_rgba(37,99,235,0.12)]' : 'border-[#D7E6FB] hover:border-primary/40',
      )}
    >
      <p className="text-sm text-[#717171]">{label}</p>
      <p className="mt-2 text-[1.75rem] font-semibold tabular-nums leading-none tracking-tight text-[#0B1354]">
        {value.toLocaleString()}
      </p>
      <p className="mt-3 flex items-center gap-2 text-xs text-[#717171]">
        <span
          className={clsx(
            'inline-flex items-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums',
            up ? 'bg-[#EDE9FE] text-[#6D28D9]' : 'bg-[#FEE2E2] text-[#B91C1C]',
          )}
        >
          {up ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
        </span>
        {caption}
      </p>
    </button>
  );
}

function exportRows(rows, rewardsById) {
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const header = ['Date & Time', 'Phone number', 'Email', 'Reward', 'Points', 'Status'];
  const lines = [
    header.join(','),
    ...rows.map((row) =>
      [
        formatActivityWhen(row.createdAt),
        row.phone,
        row.email,
        rewardLineLabel(rewardsById.get(row.rewardId)),
        row.points,
        row.status,
      ]
        .map(escape)
        .join(','),
    ),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'reward-activity.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function RewardActivityPage() {
  const dispatch = useAppDispatch();
  const rewards = useAppSelector((state) => state.rewards.items);
  const redemptions = useAppSelector((state) => state.rewards.redemptions || []);
  const [searchParams, setSearchParams] = useSearchParams();
  const rewardId = searchParams.get('reward') || '';
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(ACTIVITY_FILTER_DEFAULTS);
  const [dateFilter, setDateFilter] = useState(DATE_FILTER_DEFAULT);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState({ key: 'createdAt', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const rewardsById = useMemo(() => new Map(rewards.map((reward) => [reward.id, reward])), [rewards]);
  const focusedReward = rewardsById.get(rewardId) || null;
  const range = resolveDateRange(dateFilter);
  const activeFilters = countActivityFilters(filters);
  const now = useMemo(() => new Date(), [redemptions, dateFilter]);

  const matchesRow = (row, { useDate = true, statuses = filters.statuses } = {}) => {
    if (focusedReward && row.rewardId !== focusedReward.id) return false;
    if (statuses.length && !statuses.includes(row.status)) return false;
    const reward = rewardsById.get(row.rewardId);
    if (filters.networks.length && !filters.networks.includes(reward?.network)) return false;
    if (useDate && range?.start && !inWindow(row.createdAt, range)) return false;
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return [row.phone, row.email, rewardLineLabel(reward), String(row.points), row.status].join(' ').toLowerCase().includes(needle);
  };

  const visible = useMemo(() => {
    const filtered = redemptions.filter((row) => matchesRow(row));
    const direction = sort.direction === 'asc' ? 1 : -1;
    return filtered.sort((left, right) => {
      const rewardLeft = rewardLineLabel(rewardsById.get(left.rewardId));
      const rewardRight = rewardLineLabel(rewardsById.get(right.rewardId));
      const values = {
        createdAt: new Date(left.createdAt) - new Date(right.createdAt),
        phone: left.phone.localeCompare(right.phone),
        email: left.email.localeCompare(right.email),
        reward: rewardLeft.localeCompare(rewardRight),
        points: left.points - right.points,
        status: left.status.localeCompare(right.status),
      };
      return (values[sort.key] || 0) * direction;
    });
  }, [dateFilter, filters, focusedReward, query, range, redemptions, rewardsById, sort]);

  const pageCount = Math.max(1, Math.ceil(visible.length / ACTIVITY_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = visible.slice((currentPage - 1) * ACTIVITY_PAGE_SIZE, currentPage * ACTIVITY_PAGE_SIZE);

  const stats = useMemo(() => {
    const { current, previous } = trendWindow(dateFilter, now);
    const recent = last30Window(now);
    const prior = previousWindow(recent);
    const inCurrent = (row, status) => inWindow(row.createdAt, current) && (!status || row.status === status);
    const inPrevious = (row, status) => inWindow(row.createdAt, previous) && (!status || row.status === status);
    const scoped = (row) => !focusedReward || row.rewardId === focusedReward.id;
    const pool = redemptions.filter(scoped);
    const dated = pool.filter((row) => !range?.start || inWindow(row.createdAt, range));
    return {
      overall: pool.length,
      overallChange: percentChange(
        countMatching(pool, (row) => inWindow(row.createdAt, recent)),
        countMatching(pool, (row) => inWindow(row.createdAt, prior)),
      ),
      total: dated.length,
      totalChange: percentChange(countMatching(pool, (row) => inCurrent(row)), countMatching(pool, (row) => inPrevious(row))),
      pending: dated.filter((row) => row.status === 'pending').length,
      pendingChange: percentChange(
        countMatching(pool, (row) => inCurrent(row, 'pending')),
        countMatching(pool, (row) => inPrevious(row, 'pending')),
      ),
      fulfilled: dated.filter((row) => row.status === 'fulfilled').length,
      fulfilledChange: percentChange(
        countMatching(pool, (row) => inCurrent(row, 'fulfilled')),
        countMatching(pool, (row) => inPrevious(row, 'fulfilled')),
      ),
    };
  }, [dateFilter, focusedReward, now, range, redemptions]);

  const caption = trendCaption(dateFilter);
  const statusSelection = filters.statuses.length === 1 ? filters.statuses[0] : filters.statuses.length === 0 ? 'all' : '';

  const selectStatus = (status) => {
    setFilters((current) => ({ ...current, statuses: status === 'all' ? [] : [status] }));
    setPage(1);
  };

  const resetView = () => {
    setQuery('');
    setFilters(ACTIVITY_FILTER_DEFAULTS);
    setDateFilter(DATE_FILTER_DEFAULT);
    setSort({ key: 'createdAt', direction: 'desc' });
    setPage(1);
    setSelectedIds(new Set());
    if (rewardId) setSearchParams({}, { replace: true });
  };

  const toggleSort = (key) => {
    setSort((current) => {
      if (current.key === key) return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      return { key, direction: key === 'createdAt' || key === 'points' ? 'desc' : 'asc' };
    });
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageBackLink to="/rewards" label="rewards" />

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-[#6D28D9]">
            <Activity className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0B1354]">Reward Activity Overview</h1>
            <p className="mt-0.5 text-sm text-[#717171]">Monitor all rewards redeemed</p>
          </div>
        </div>
        <ActivityDateFilter
          value={dateFilter}
          onChange={(next) => {
            setDateFilter(next);
            setPage(1);
          }}
          countFor={(nextRange) =>
            countMatching(redemptions, (row) => {
              if (focusedReward && row.rewardId !== focusedReward.id) return false;
              return !nextRange?.start || inWindow(row.createdAt, nextRange);
            })
          }
        />
      </div>

      {focusedReward ? (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#D7E6FB] bg-[#F8FBFF] py-1 pl-3 pr-1 text-sm text-[#0B1354]">
          Showing <span className="font-semibold">{rewardLineLabel(focusedReward)}</span>
          <Link
            to="/rewards/activity"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#717171] hover:bg-white hover:text-[#0B1354]"
            aria-label="Show every reward"
          >
            <X className="h-3.5 w-3.5" />
          </Link>
        </p>
      ) : null}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Overall (All-Time)"
          value={stats.overall}
          change={stats.overallChange}
          caption="Last 30 days"
          selected={statusSelection === 'all' && !range?.start}
          onSelect={() => selectStatus('all')}
        />
        <StatCard
          label="Total"
          value={stats.total}
          change={stats.totalChange}
          caption={caption}
          selected={statusSelection === 'all' && Boolean(range?.start)}
          onSelect={() => selectStatus('all')}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          change={stats.pendingChange}
          caption={caption}
          selected={statusSelection === 'pending'}
          onSelect={() => selectStatus(statusSelection === 'pending' ? 'all' : 'pending')}
        />
        <StatCard
          label="Fulfilled"
          value={stats.fulfilled}
          change={stats.fulfilledChange}
          caption={caption}
          selected={statusSelection === 'fulfilled'}
          onSelect={() => selectStatus(statusSelection === 'fulfilled' ? 'all' : 'fulfilled')}
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#EEF0F4] bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <div className="relative w-full sm:max-w-sm">
          <label htmlFor="activity-search" className="sr-only">
            Search redemptions
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />
          <input
            id="activity-search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search"
            className="w-full rounded-lg border border-[#E4E4E7] bg-white py-2.5 pl-10 pr-3 text-sm text-[#0B1354] outline-none placeholder:text-[#A1A1AA] focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1">
          <button
            type="button"
            aria-label="Refresh activity"
            onClick={() => {
              setRefreshing(true);
              window.setTimeout(() => setRefreshing(false), 500);
              resetView();
            }}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#52525B] hover:bg-[#EFF6FF] hover:text-primary"
          >
            <RefreshCw className={clsx('h-4 w-4', refreshing && 'animate-spin')} />
          </button>
          <button
            type="button"
            disabled={selectedIds.size === 0}
            onClick={() => setConfirmDelete(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-[#52525B] hover:bg-[#FEF2F2] hover:text-[#DC2626] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-[#52525B] hover:bg-[#EFF6FF] hover:text-primary"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilters > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-white">
                {activeFilters}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            disabled={visible.length === 0}
            onClick={() => exportRows(visible, rewardsById)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#E4E4E7] px-3 py-2 text-sm font-medium text-[#52525B] hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white">
        {visible.length ? (
          <ActivityTable
            rows={pageRows}
            rewardsById={rewardsById}
            sort={sort}
            onSort={toggleSort}
            selectedIds={selectedIds}
            onToggle={(id) => {
              setSelectedIds((current) => {
                const next = new Set(current);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
              });
            }}
            onTogglePage={(ids, select) => {
              setSelectedIds((current) => {
                const next = new Set(current);
                ids.forEach((id) => (select ? next.add(id) : next.delete(id)));
                return next;
              });
            }}
            onSetStatus={(id, status) => dispatch(setRedemptionStatus({ id, status }))}
          />
        ) : (
          <div className="px-6 py-16 text-center">
            <h2 className="text-base font-semibold text-[#0B1354]">No redemptions in this view</h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[#717171]">
              Nothing matches the date range, search, or filters. Try Last 30 days, or clear the range to see every redemption.
            </p>
            <button type="button" onClick={resetView} className="mt-4 cursor-pointer text-sm font-semibold text-primary">
              Clear search, filters, and date
            </button>
          </div>
        )}
      </div>

      <BusinessesPagination
        currentPage={currentPage}
        totalPages={pageCount}
        totalItems={visible.length}
        pageSize={ACTIVITY_PAGE_SIZE}
        onPageChange={setPage}
        label="Reward activity pages"
      />

      <ActivityFiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onApply={(next) => {
          setFilters(next);
          setPage(1);
        }}
      />

      <AnimatedModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        labelledBy="delete-redemptions-title"
        panelClassName="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 id="delete-redemptions-title" className="text-lg font-bold text-[#0B1354]">
          Delete {selectedIds.size} {selectedIds.size === 1 ? 'redemption' : 'redemptions'}?
        </h2>
        <p className="mt-2 text-sm text-[#717171]">
          This removes the selected rows from the activity log. The reward itself stays in the catalog.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="cursor-pointer rounded-full border border-[#E4E4E7] px-4 py-2 text-sm font-semibold text-[#0B1354]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch(removeRedemptions([...selectedIds]));
              setSelectedIds(new Set());
              setConfirmDelete(false);
            }}
            className="cursor-pointer rounded-full bg-[#DC2626] px-4 py-2 text-sm font-semibold text-white"
          >
            Delete
          </button>
        </div>
      </AnimatedModal>
    </div>
  );
}
