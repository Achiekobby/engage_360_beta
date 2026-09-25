import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Download, Eye, Filter, Megaphone, Search, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import AnimatedModal from '../motion/AnimatedModal';
import BusinessesPagination from '../businesses/BusinessesPagination';
import { PageHeading } from '../layout/PageBackLink';
import TableStatStrip, { statShare } from '../layout/TableStatStrip';
import {
  CAMPAIGN_CATEGORIES,
  CAMPAIGN_PAGE_SIZE,
  CAMPAIGN_STATUSES,
  campaignInitials,
  formatCreatedDate,
  formatNumber,
  getCampaigns,
  paginate,
  removeCampaigns,
  statusMeta,
} from './campaignData';

function exportCampaigns(rows, categoryLabel) {
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const header = ['Campaign', 'Status', 'Date created', 'Channel', 'Business'];
  const lines = [
    header.join(','),
    ...rows.map((item) =>
      [item.name, statusMeta(item.status).label, formatCreatedDate(item.createdAt), item.channel, item.businessName]
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
        className="h-12 w-12 shrink-0 rounded-lg object-cover"
      />
    );
  }
  return (
    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-sm font-semibold text-primary">
      {campaignInitials(campaign.name)}
    </span>
  );
}

export default function CampaignCategoryList({ categoryId, businesses }) {
  const category = CAMPAIGN_CATEGORIES.find((item) => item.id === categoryId);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [tick, setTick] = useState(0);
  const [page, setPage] = useState(1);
  const campaigns = useMemo(() => getCampaigns(), [tick]);

  const businessName = (id) => businesses.find((item) => item.id === id)?.companyName ?? 'Unknown business';

  const inCategory = campaigns.filter((item) => item.category === categoryId);
  const rows = inCategory
    .filter((item) => (status === 'all' ? true : item.status === status))
    .filter((item) => {
      const needle = query.trim().toLowerCase();
      if (!needle) return true;
      return [item.name, businessName(item.businessId)].join(' ').toLowerCase().includes(needle);
    })
    .map((item) => ({ ...item, businessName: businessName(item.businessId) }));
  const paged = paginate(rows, page);
  const counts = {
    total: inCategory.length,
    active: inCategory.filter((item) => item.status === 'active').length,
    expired: inCategory.filter((item) => item.status === 'expired').length,
    sent: inCategory.reduce((sum, item) => sum + (Number(item.sent) || 0), 0),
  };
  const selectStatus = (next) => {
    setStatus(next);
    setPage(1);
  };
  const stats = [
    {
      id: 'all',
      label: 'Total',
      value: formatNumber(counts.total),
      accent: '#0B1354',
      share: 100,
      detail: 'Campaigns in this type',
      onSelect: () => selectStatus('all'),
    },
    {
      id: 'active',
      label: 'Active',
      value: formatNumber(counts.active),
      accent: '#157A42',
      share: statShare(counts.active, counts.total),
      detail: `${statShare(counts.active, counts.total)}% of this list`,
      onSelect: () => selectStatus('active'),
    },
    {
      id: 'expired',
      label: 'Expired',
      value: formatNumber(counts.expired),
      accent: '#C0272C',
      share: statShare(counts.expired, counts.total),
      detail: `${statShare(counts.expired, counts.total)}% of this list`,
      onSelect: () => selectStatus('expired'),
    },
    {
      id: 'sent',
      label: 'Messages sent',
      value: formatNumber(counts.sent),
      accent: '#2563EB',
      share: counts.sent ? 100 : 0,
      detail: 'Across campaigns in this type',
    },
  ];

  const toggleRow = (id) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
    'inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-3 py-2 text-sm font-medium text-[#52525B] transition-colors hover:border-[#D4D4D8] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E4E4E7] disabled:hover:text-[#52525B]';

  if (category?.comingSoon) {
    return (
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <PageHeading
          title={
            <span className="inline-flex flex-wrap items-center gap-2">
              {category.label}
              <span className="rounded-md bg-[#FFF6E5] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#B45309]">
                Coming soon
              </span>
            </span>
          }
          description="Sales campaigns are not available yet. Use Promotion, Lead Generation, Advertisement, Service Alerts, or Events & Activations in the meantime."
        />
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageHeading
        title={category?.label ?? 'Campaigns'}
        description={category?.blurb}
        actions={
          categoryId === 'promotions' ||
          categoryId === 'lead-generation' ||
          categoryId === 'advertisement' ||
          categoryId === 'service-alerts' ||
          categoryId === 'events-activations' ? (
            <Link
              to={`/campaigns/analytics?category=${categoryId}`}
              className="inline-flex items-center gap-2 rounded-full border border-primary bg-white px-3 py-2 text-sm font-semibold text-primary hover:bg-[#EFF6FF]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                <BarChart3 className="h-3.5 w-3.5" />
              </span>
              View Analytics
            </Link>
          ) : null
        }
      >
        <div className="relative min-w-0 flex-1">
          <label htmlFor="campaign-search" className="sr-only">
            Search
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />
          <input
            id="campaign-search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search"
            className="w-full rounded-full border border-[#E4E4E7] bg-white py-2.5 pl-11 pr-4 text-sm text-[#0B1354] outline-none placeholder:text-[#A1A1AA] focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={selectedIds.size === 0}
            onClick={() => setConfirmDelete([...selectedIds])}
            className={toolButton}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <div className="relative">
            <button type="button" onClick={() => setFiltersOpen((open) => !open)} className={toolButton}>
              <Filter className="h-4 w-4" />
              Filters
              {status !== 'all' ? (
                <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-white">
                  1
                </span>
              ) : null}
            </button>
            {filtersOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-[#EEF0F4] bg-white p-3 shadow-[0_10px_28px_rgba(11,19,84,0.12)]">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#717171]">Status</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[{ id: 'all', label: 'All' }, ...CAMPAIGN_STATUSES].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setStatus(item.id);
                        setPage(1);
                        setFiltersOpen(false);
                      }}
                      className={clsx(
                        'rounded-full px-2.5 py-1 text-xs font-medium',
                        status === item.id ? 'bg-primary text-white' : 'bg-[#F4F4F5] text-[#3F3F46] hover:bg-[#E8EAEF]',
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
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
      </PageHeading>

      <div className="mt-5">
        <TableStatStrip items={stats} selectedId={status} />
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-[#EEF0F4] bg-white">
        {rows.length ? (
          paged.rows.map((item) => {
            const meta = statusMeta(item.status);
            const selected = selectedIds.has(item.id);
            return (
              <div
                key={item.id}
                className={clsx(
                  'flex flex-wrap items-center gap-3 border-b border-[#F4F4F5] px-4 py-3 last:border-0 sm:flex-nowrap sm:gap-6',
                  selected ? 'bg-[#F8FAFF]' : 'hover:bg-[#FAFBFC]',
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleRow(item.id)}
                  aria-pressed={selected}
                  aria-label={`${selected ? 'Deselect' : 'Select'} ${item.name}`}
                  className="shrink-0"
                >
                  <CampaignThumb campaign={item} />
                </button>
                <Link
                  to={`/campaigns/${item.id}`}
                  className="min-w-[8rem] flex-1 text-sm font-medium text-primary hover:underline"
                >
                  {item.name}
                </Link>
                <p className="w-full text-sm text-[#3F3F46] sm:w-auto sm:shrink-0">
                  Date created: {formatCreatedDate(item.createdAt)}
                </p>
                <span className={clsx('inline-flex min-w-[4.75rem] justify-center rounded-full px-3 py-1 text-xs font-semibold', meta.badge)}>
                  {meta.label}
                </span>
                <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete([item.id])}
                    aria-label={`Delete ${item.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#717171] hover:bg-[#F4F4F5] hover:text-[#C0272C]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <Link
                    to={`/campaigns/${item.id}`}
                    aria-label={`View ${item.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E4E4E7] bg-white text-[#52525B] hover:border-primary/40 hover:text-primary"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-6 py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-primary">
              <Megaphone className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-base font-semibold text-[#0B1354]">No matching campaigns</h2>
            <p className="mt-1 text-sm text-[#717171]">Try another search or status filter.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setStatus('all');
                setPage(1);
              }}
              className="mt-4 text-sm font-semibold text-primary"
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
        pageSize={CAMPAIGN_PAGE_SIZE}
        onPageChange={setPage}
        label="Campaign pages"
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
        <p className="mt-2 text-sm text-[#717171]">This removes the campaign from the list. It cannot be undone from this screen.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setConfirmDelete(null)}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0B1354] hover:bg-[#F4F4F5]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => removeIds(confirmDelete)}
            className="rounded-lg bg-[#DC2626] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#B91C1C]"
          >
            Delete
          </button>
        </div>
      </AnimatedModal>
    </div>
  );
}
