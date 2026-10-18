import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ban,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Download,
  Eye,
  Filter,
  Megaphone,
  PauseCircle,
  RefreshCw,
  Search,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { clsx } from 'clsx';
import AnimatedModal from '../motion/AnimatedModal';
import BusinessesPagination from '../businesses/BusinessesPagination';
import CampaignFiltersDrawer, {
  CAMPAIGN_FILTER_DEFAULTS,
  countActiveCampaignFilters,
} from './CampaignFiltersDrawer';
import {
  CAMPAIGN_CATEGORIES,
  campaignInitials,
  formatCreatedDate,
  formatNumber,
  getCampaigns,
  paginate,
  removeCampaigns,
  statusMeta,
} from './campaignData';

const CATEGORY_LIST_PAGE_SIZE = 8;

const STATUS_ICONS = {
  active: CheckCircle2,
  expired: Ban,
  scheduled: Clock3,
  completed: CheckCircle2,
  paused: PauseCircle,
  draft: CircleDashed,
};

function exportCampaigns(rows, categoryLabel) {
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const header = ['Campaign', 'Status', 'Date created', 'Channel', 'Business'];
  const lines = [
    header.join(','),
    ...rows.map((item) =>
      [
        item.name,
        statusMeta(item.status).label,
        formatCreatedDate(item.createdAt),
        item.channel,
        item.businessName,
      ]
        .map(escape)
        .join(','),
    ),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${categoryLabel.toLowerCase().replaceAll(' ', '-')}-campaigns.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function CampaignThumb({ campaign }) {
  const [failed, setFailed] = useState(false);
  if (campaign.imageUrl && !failed) {
    return (
      <img
        src={campaign.imageUrl}
        alt=""
        onError={() => setFailed(true)}
        className="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-[#EEF0F4]"
      />
    );
  }
  return (
    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-sm font-semibold text-primary ring-1 ring-[#E0E7FF]">
      {campaignInitials(campaign.name)}
    </span>
  );
}

function StatusBadge({ status }) {
  const meta = statusMeta(status);
  const Icon = STATUS_ICONS[status] ?? CircleDashed;

  return (
    <span
      className={clsx(
        'inline-flex min-w-[7.25rem] items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold',
        meta.badge,
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
      {meta.label}
    </span>
  );
}

function DateCreatedCell({ value }) {
  return (
    <div className="flex min-w-[9.5rem] items-center gap-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F4F5F7] text-[#52525B]">
        <CalendarDays className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#A1A1AA]">
          Date created
        </p>
        <p className="mt-0.5 text-sm font-semibold tabular-nums text-[#0B1354]">
          {formatCreatedDate(value)}
        </p>
      </div>
    </div>
  );
}

function SelectionCheckbox({ checked, indeterminate = false, onChange, label }) {
  return (
    <label className="relative inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        ref={(node) => {
          if (node) node.indeterminate = indeterminate;
        }}
        onChange={onChange}
        aria-label={label}
        className="peer sr-only"
      />
      <span
        className={clsx(
          'flex h-5 w-5 items-center justify-center rounded-[6px] border-2 transition-colors',
          checked || indeterminate
            ? 'border-primary bg-primary text-white'
            : 'border-[#D4D4D8] bg-white peer-hover:border-primary/50',
          'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30',
        )}
      >
        {checked ? (
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden="true">
            <path
              d="M3.5 8.5 6.5 11.5 12.5 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
        {indeterminate && !checked ? (
          <span className="h-0.5 w-2.5 rounded-full bg-white" aria-hidden="true" />
        ) : null}
      </span>
    </label>
  );
}

export default function CampaignCategoryList({ categoryId, businesses }) {
  const category = CAMPAIGN_CATEGORIES.find((item) => item.id === categoryId);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(CAMPAIGN_FILTER_DEFAULTS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [tick, setTick] = useState(0);
  const [page, setPage] = useState(1);
  const campaigns = useMemo(() => getCampaigns(), [tick]);

  const businessName = (id) =>
    businesses.find((item) => item.id === id)?.companyName ?? 'Unknown business';

  const inCategory = campaigns.filter((item) => item.category === categoryId);
  const rows = inCategory
    .filter((item) =>
      filters.statuses.length ? filters.statuses.includes(item.status) : true,
    )
    .filter((item) =>
      filters.channels.length ? filters.channels.includes(item.channel) : true,
    )
    .filter((item) => {
      const needle = query.trim().toLowerCase();
      if (!needle) return true;
      return [item.name, businessName(item.businessId)].join(' ').toLowerCase().includes(needle);
    })
    .map((item) => ({ ...item, businessName: businessName(item.businessId) }));

  const paged = paginate(rows, page, CATEGORY_LIST_PAGE_SIZE);
  const activeFilterCount = countActiveCampaignFilters(filters);
  const pageIds = paged.rows.map((item) => item.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const somePageSelected = pageIds.some((id) => selectedIds.has(id));

  const toggleRow = (id) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePage = () => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (allPageSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const removeIds = (ids) => {
    removeCampaigns(ids);
    setSelectedIds((current) => {
      const next = new Set(current);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    setTick((value) => value + 1);
    setConfirmDelete(null);
  };

  const toolButton =
    'inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-3.5 py-2 text-sm font-medium text-[#52525B] transition-colors hover:border-[#D4D4D8] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E4E4E7] disabled:hover:text-[#52525B]';

  if (category?.comingSoon) {
    return (
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="admin-card rounded-xl border border-[#EEF0F4] bg-white px-5 py-6">
          <h1 className="text-xl font-bold text-[#0B1354]">{category.label}</h1>
          <p className="mt-1 text-sm text-[#717171]">This campaign type is not available yet.</p>
        </div>
      </div>
    );
  }

  const analyticsEnabled = Boolean(categoryId);

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F0FF] text-primary">
              {categoryId === 'sales' ? (
                <ShoppingBag className="h-5 w-5" strokeWidth={2} />
              ) : (
                <Megaphone className="h-5 w-5" strokeWidth={2} />
              )}
            </span>
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-[#0B1354] sm:text-[1.35rem]">
                {category?.blurb ?? 'Manage campaigns in one place.'}
              </h1>
              <p className="mt-1 text-sm text-[#717171]">
                {formatNumber(inCategory.length)} campaigns
                {selectedIds.size > 0 ? ` · ${selectedIds.size} selected` : ''}
              </p>
            </div>
          </div>
        </div>

        {analyticsEnabled ? (
          <Link
            to={`/campaigns/analytics?category=${categoryId}`}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 self-start rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(58,16,205,0.22)] transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
              <BarChart3 className="h-3.5 w-3.5" strokeWidth={2.25} />
            </span>
            View Analytics
          </Link>
        ) : null}
      </header>

      <div className="admin-card-sm mt-5 flex flex-col gap-3 admin-card rounded-xl border border-[#EEF0F4] bg-white px-3 py-3 sm:flex-row sm:items-center sm:px-4">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="campaign-search" className="sr-only">
            Search
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />
          <input
            id="campaign-search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search"
            className="w-full rounded-full border border-[#E4E4E7] bg-[#FAFBFC] py-2.5 pl-10 pr-4 text-sm text-[#0B1354] outline-none placeholder:text-[#A1A1AA] focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedIds(new Set());
              setTick((value) => value + 1);
            }}
            aria-label="Refresh list"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] bg-white text-[#52525B] transition-colors hover:border-[#D4D4D8] hover:text-primary"
          >
            <RefreshCw className="h-4 w-4" strokeWidth={2} />
          </button>

          <button
            type="button"
            disabled={selectedIds.size === 0}
            onClick={() => setConfirmDelete([...selectedIds])}
            className={toolButton}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>

          <button type="button" onClick={() => setFiltersOpen(true)} className={toolButton}>
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 ? (
              <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            disabled={rows.length === 0}
            onClick={() => exportCampaigns(rows, category?.label ?? 'campaigns')}
            className={toolButton}
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 px-1">
        <SelectionCheckbox
          checked={allPageSelected}
          indeterminate={somePageSelected && !allPageSelected}
          onChange={togglePage}
          label="Select all campaigns on this page"
        />
        <p className="text-sm text-[#717171]">
          {allPageSelected
            ? `All ${pageIds.length} on this page selected`
            : 'Select campaigns for bulk delete'}
        </p>
      </div>

      <div className="mt-3 space-y-3">
        {rows.length ? (
          paged.rows.map((item) => {
            const selected = selectedIds.has(item.id);
            return (
              <article
                key={item.id}
                className={clsx(
                  'admin-card flex flex-col gap-4 rounded-xl border bg-white px-4 py-3.5 transition-colors sm:flex-row sm:items-center sm:gap-5 sm:px-5',
                  selected
                    ? 'border-primary/35 bg-[#F8FAFF]'
                    : 'border-[#EEF0F4] hover:border-[#E0E4EC]',
                )}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                  <SelectionCheckbox
                    checked={selected}
                    onChange={() => toggleRow(item.id)}
                    label={`${selected ? 'Deselect' : 'Select'} ${item.name}`}
                  />
                  <CampaignThumb campaign={item} />
                  <Link
                    to={`/campaigns/${item.id}?tab=purchases`}
                    className="inline-flex max-w-full items-center rounded-full bg-[#EDE8F8] px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-[#E4DBF8]"
                  >
                    <span className="truncate">{item.name}</span>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:ml-auto sm:flex-nowrap sm:gap-5">
                  <DateCreatedCell value={item.createdAt} />
                  <StatusBadge status={item.status} />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete([item.id])}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-medium text-[#717171] transition-colors hover:bg-[#F4F4F5] hover:text-[#C0272C]"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                    <Link
                      to={`/campaigns/${item.id}?tab=purchases`}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-3.5 py-2 text-sm font-semibold text-[#0B1354] transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="admin-card rounded-xl border border-[#EEF0F4] bg-white px-6 py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-primary">
              <Megaphone className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-base font-semibold text-[#0B1354]">No matching campaigns</h2>
            <p className="mt-1 text-sm text-[#717171]">Try another search or clear filters.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFilters(CAMPAIGN_FILTER_DEFAULTS);
                setPage(1);
              }}
              className="mt-4 cursor-pointer text-sm font-semibold text-primary"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <BusinessesPagination
        currentPage={paged.current}
        totalPages={paged.totalPages}
        totalItems={rows.length}
        pageSize={CATEGORY_LIST_PAGE_SIZE}
        onPageChange={(next) => {
          setPage(next);
          setSelectedIds(new Set());
        }}
        label="Campaign pages"
      />

      <CampaignFiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onApply={(next) => {
          setFilters(next);
          setPage(1);
          setSelectedIds(new Set());
        }}
      />

      <AnimatedModal
        isOpen={Boolean(confirmDelete?.length)}
        onClose={() => setConfirmDelete(null)}
        labelledBy="delete-campaigns-title"
        panelClassName="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 id="delete-campaigns-title" className="text-lg font-bold text-[#0B1354]">
          Delete {confirmDelete?.length === 1 ? 'this campaign' : `${confirmDelete?.length} campaigns`}?
        </h2>
        <p className="mt-2 text-sm text-[#717171]">
          This removes the campaign from the list. It cannot be undone from this screen.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setConfirmDelete(null)}
            className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0B1354] hover:bg-[#F4F4F5]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => removeIds(confirmDelete)}
            className="cursor-pointer rounded-lg bg-[#DC2626] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#B91C1C]"
          >
            Delete
          </button>
        </div>
      </AnimatedModal>
    </div>
  );
}
