import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  Download,
  Filter,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { PageHeading } from '../../components/layout/PageBackLink';
import { BUSINESS_PAGE_SIZE, formatOnboardedDate } from '../../constants/businesses';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeBusinesses } from '../../store/slices/businessesSlice';
import AnimatedModal from '../../components/motion/AnimatedModal';
import BusinessFilterDrawer, {
  EMPTY_BUSINESS_FILTERS,
  businessMatchesFilters,
  countActiveFilters,
} from '../../components/businesses/BusinessFilterDrawer';
import BusinessCreditModal from '../../components/businesses/BusinessCreditModal';
import BusinessEditDrawer from '../../components/businesses/BusinessEditDrawer';
import BusinessesPagination from '../../components/businesses/BusinessesPagination';
import BusinessesTable from '../../components/businesses/BusinessesTable';

function exportBusinesses(rows) {
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const header = ['Business', 'Contact', 'Email', 'Phone', 'Onboarded', 'Status'];
  const lines = [
    header.join(','),
    ...rows.map((business) =>
      [
        business.companyName,
        business.contactPersonName,
        business.companyEmail,
        business.companyPhone,
        formatOnboardedDate(business.onboardedAt),
        business.status,
      ]
        .map(escape)
        .join(','),
    ),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'businesses.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function BusinessesPage() {
  const dispatch = useAppDispatch();
  const businesses = useAppSelector((state) => state.businesses.items);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(EMPTY_BUSINESS_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [creditId, setCreditId] = useState(null);

  const statuses = useMemo(
    () => [...new Set(businesses.map((business) => business.status).filter(Boolean))].sort(),
    [businesses],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return businesses.filter((business) => {
      if (!businessMatchesFilters(business, filters)) return false;
      if (!needle) return true;
      return [
        business.companyName,
        business.companyEmail,
        business.contactPersonName,
        business.contactEmail,
        business.companyPhone,
      ]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [businesses, query, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / BUSINESS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * BUSINESS_PAGE_SIZE,
    currentPage * BUSINESS_PAGE_SIZE,
  );
  const activeFilters = countActiveFilters(filters);
  const hasSearchOrFilters = Boolean(query.trim()) || activeFilters > 0;
  const year = new Date().getFullYear();
  const yearStart = `${year}-01-01`;
  const stats = useMemo(() => {
    const total = businesses.length;
    const count = (status) => businesses.filter((business) => business.status === status).length;
    const share = (value) => (total ? Math.round((value / total) * 100) : 0);
    const active = count('active');
    const suspended = count('suspended');
    const added = businesses.filter((business) => business.onboardedAt.slice(0, 10) >= yearStart).length;
    return [
      {
        id: 'total',
        label: 'Total businesses',
        detail: 'All accounts',
        value: total,
        share: total ? 100 : 0,
        accent: '#2563EB',
        filters: EMPTY_BUSINESS_FILTERS,
      },
      {
        id: 'active',
        label: 'Active',
        detail: total ? `${share(active)}% of accounts` : 'No accounts',
        value: active,
        share: share(active),
        accent: '#1F9D55',
        filters: { status: 'active', from: '', to: '' },
      },
      {
        id: 'suspended',
        label: 'Suspended',
        detail: suspended ? `${share(suspended)}% of accounts` : 'None right now',
        value: suspended,
        share: share(suspended),
        accent: '#D97706',
        filters: { status: 'suspended', from: '', to: '' },
      },
      {
        id: 'year',
        label: `Added in ${year}`,
        detail: 'Since January',
        value: added,
        share: share(added),
        accent: '#0B1354',
        filters: { status: 'all', from: yearStart, to: '' },
      },
    ];
  }, [businesses, year, yearStart]);
  const selectedStat =
    stats.find(
      (stat) =>
        stat.filters.status === filters.status &&
        stat.filters.from === filters.from &&
        stat.filters.to === filters.to,
    )?.id ?? null;

  const changePage = (nextPage) => {
    setPage(nextPage);
    const scroller = document.querySelector('[data-admin-scroll]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller?.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const resetView = () => {
    setQuery('');
    setFilters(EMPTY_BUSINESS_FILTERS);
    setSelectedIds(new Set());
    setPage(1);
  };

  const toggleOne = (id) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePage = (ids, select) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      ids.forEach((id) => {
        if (select) next.add(id);
        else next.delete(id);
      });
      return next;
    });
  };

  const toolButton =
    'inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-[#52525B] transition-colors hover:bg-[#EFF6FF] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30';

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageHeading
        title="Business Management"
        description="Manage all business accounts in one place."
        actions={
          <>
            <Link
              to="/businesses/analytics"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary bg-white px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                <BarChart3 className="h-3.5 w-3.5" />
              </span>
              View Analytics
            </Link>
            <Link
              to="/businesses/new"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/50">
                <Plus className="h-3.5 w-3.5" />
              </span>
              Add Business
            </Link>
          </>
        }
      />

      <div className="mt-5 admin-card overflow-hidden rounded-xl border border-[#EEF0F4] bg-white">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const selected = selectedStat === stat.id;
            return (
              <button
                key={stat.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setFilters(stat.filters);
                  setPage(1);
                }}
                className={`relative border-[#EEF0F4] px-4 py-4 text-left transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30 max-lg:[&:nth-child(-n+2)]:border-b max-lg:odd:border-r lg:border-r lg:last:border-r-0 ${
                  selected ? 'bg-[#F8FAFF]' : 'hover:bg-[#FAFAFA]'
                }`}
              >
                <span
                  className="absolute inset-x-0 top-0 h-0.5"
                  style={{ backgroundColor: selected ? stat.accent : 'transparent' }}
                  aria-hidden="true"
                />
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: stat.accent }} aria-hidden="true" />
                  <span className="text-xs font-medium text-[#717171]">{stat.label}</span>
                </span>
                <span className="mt-2 block text-[1.75rem] font-semibold tabular-nums leading-none tracking-tight text-[#0B1354]">
                  {stat.value}
                </span>
                <span className="mt-3 block h-1 overflow-hidden rounded-full bg-[#F4F4F5]" aria-hidden="true">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${stat.share}%`, backgroundColor: stat.accent }}
                  />
                </span>
                <span className="mt-1.5 block text-[11px] text-[#A1A1AA]">{stat.detail}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="business-search" className="sr-only">
            Search
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />
          <input
            id="business-search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search"
            className="w-full rounded-lg border border-[#E4E4E7] bg-white py-2.5 pl-10 pr-3 text-sm text-[#0B1354] outline-none transition-colors placeholder:text-[#A1A1AA] focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => selectedIds.size && setConfirmDelete(true)}
            disabled={selectedIds.size === 0}
            className={`${toolButton} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#52525B]`}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <button type="button" onClick={() => setFiltersOpen(true)} className={`${toolButton} relative`}>
            <Filter className="h-4 w-4" />
            Filters
            {activeFilters > 0 ? (
              <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-white">
                {activeFilters}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => exportBusinesses(filtered)}
            disabled={filtered.length === 0}
            className={`${toolButton} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#52525B]`}
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="mt-5">
        {filtered.length ? (
          <>
            <BusinessesTable
              businesses={pageItems}
              selectedIds={selectedIds}
              onToggle={toggleOne}
              onTogglePage={togglePage}
              onEdit={(business) => setEditingId(business.id)}
              onCredit={(business) => setCreditId(business.id)}
            />
            <BusinessesPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={BUSINESS_PAGE_SIZE}
              onPageChange={changePage}
            />
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-[#E4E4E7] bg-white px-6 py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-primary">
              <Building2 className="h-5 w-5" />
            </span>
            {businesses.length === 0 ? (
              <>
                <h2 className="mt-4 text-base font-semibold text-[#0B1354]">No businesses yet</h2>
                <p className="mx-auto mt-1 max-w-sm text-sm text-[#717171]">
                  Add the first company to give them an active Engage360 account.
                </p>
                <Link
                  to="/businesses/new"
                  className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Business
                </Link>
              </>
            ) : (
              <>
                <h2 className="mt-4 text-base font-semibold text-[#0B1354]">No matching businesses</h2>
                <p className="mx-auto mt-1 max-w-sm text-sm text-[#717171]">
                  Nothing matches the current search or filters.
                </p>
                {hasSearchOrFilters ? (
                  <button
                    type="button"
                    onClick={resetView}
                    className="mt-5 cursor-pointer text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    Clear search and filters
                  </button>
                ) : null}
              </>
            )}
          </div>
        )}
      </div>

      <BusinessFilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        statuses={statuses}
        onApply={(next) => {
          setFilters(next);
          setPage(1);
        }}
      />
      <BusinessEditDrawer
        business={businesses.find((business) => business.id === editingId) ?? null}
        onClose={() => setEditingId(null)}
      />
      <BusinessCreditModal
        business={businesses.find((business) => business.id === creditId) ?? null}
        onClose={() => setCreditId(null)}
      />

      <AnimatedModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        labelledBy="delete-businesses-title"
        panelClassName="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 id="delete-businesses-title" className="text-lg font-bold text-[#0B1354]">
          Delete {selectedIds.size} {selectedIds.size === 1 ? 'business' : 'businesses'}?
        </h2>
        <p className="mt-2 text-sm text-[#717171]">
          This removes the selected accounts from the list. It cannot be undone from this screen.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0B1354] hover:bg-[#F4F4F5]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch(removeBusinesses([...selectedIds]));
              setSelectedIds(new Set());
              setConfirmDelete(false);
              setPage(1);
            }}
            className="cursor-pointer rounded-lg bg-[#DC2626] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#B91C1C]"
          >
            Delete
          </button>
        </div>
      </AnimatedModal>
    </div>
  );
}
