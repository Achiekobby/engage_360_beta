import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Megaphone, Search, Tag } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppSelector } from '../../store/hooks';
import BusinessesPagination from '../../components/businesses/BusinessesPagination';
import CampaignCategoryList from '../../components/campaigns/CampaignCategoryList';
import { PageHeading } from '../../components/layout/PageBackLink';
import TableStatStrip, { statShare } from '../../components/layout/TableStatStrip';
import {
  CAMPAIGN_CATEGORIES,
  CAMPAIGN_CHANNELS,
  CAMPAIGN_PAGE_SIZE,
  formatNumber,
  formatWhen,
  getCampaigns,
  labelFor,
  paginate,
  statusMeta,
} from '../../components/campaigns/campaignData';

export default function CampaignsPage() {
  const businesses = useAppSelector((state) => state.businesses.items);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = CAMPAIGN_CATEGORIES.some((item) => item.id === searchParams.get('category'))
    ? searchParams.get('category')
    : 'all';
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [channel, setChannel] = useState('all');
  const [tick, setTick] = useState(0);
  const [page, setPage] = useState(1);
  const campaigns = useMemo(() => getCampaigns(), [tick]);

  const businessName = (id) => businesses.find((item) => item.id === id)?.companyName ?? 'Unknown business';

  const filtered = campaigns.filter((item) => {
    if (category !== 'all' && item.category !== category) return false;
    if (status !== 'all' && item.status !== status) return false;
    if (channel !== 'all' && item.channel !== channel) return false;
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return [item.name, businessName(item.businessId), item.channel].join(' ').toLowerCase().includes(needle);
  });
  const paged = paginate(filtered, page);

  const counts = {
    total: campaigns.length,
    active: campaigns.filter((item) => item.status === 'active').length,
    scheduled: campaigns.filter((item) => item.status === 'scheduled').length,
    completed: campaigns.filter((item) => item.status === 'completed').length,
    draft: campaigns.filter((item) => item.status === 'draft').length,
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
      detail: 'Across every campaign type',
      onSelect: () => selectStatus('all'),
    },
    {
      id: 'active',
      label: 'Active',
      value: formatNumber(counts.active),
      accent: '#157A42',
      share: statShare(counts.active, counts.total),
      detail: `${statShare(counts.active, counts.total)}% of all campaigns`,
      onSelect: () => selectStatus('active'),
    },
    {
      id: 'scheduled',
      label: 'Scheduled',
      value: formatNumber(counts.scheduled),
      accent: '#D97706',
      share: statShare(counts.scheduled, counts.total),
      detail: `${statShare(counts.scheduled, counts.total)}% of all campaigns`,
      onSelect: () => selectStatus('scheduled'),
    },
    {
      id: 'completed',
      label: 'Completed',
      value: formatNumber(counts.completed),
      accent: '#2563EB',
      share: statShare(counts.completed, counts.total),
      detail: `${statShare(counts.completed, counts.total)}% of all campaigns`,
      onSelect: () => selectStatus('completed'),
    },
    {
      id: 'draft',
      label: 'Draft',
      value: formatNumber(counts.draft),
      accent: '#717171',
      share: statShare(counts.draft, counts.total),
      detail: `${statShare(counts.draft, counts.total)}% of all campaigns`,
      onSelect: () => selectStatus('draft'),
    },
  ];

  if (category !== 'all') {
    return <CampaignCategoryList categoryId={category} businesses={businesses} />;
  }

  const setCategory = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id === 'all') next.delete('category');
    else next.set('category', id);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageHeading
        title="Campaign Management"
        description="Review targeted outreach campaigns across SMS, email, and WhatsApp."
      />

      <div className="mt-5">
        <TableStatStrip items={stats} selectedId={status} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {CAMPAIGN_CATEGORIES.map((item) => {
          const count = campaigns.filter((campaign) => campaign.category === item.id).length;
          const selected = category === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(selected ? 'all' : item.id)}
              className={clsx(
                'rounded-xl border bg-white p-4 text-left',
                selected ? 'border-primary/40 bg-[#F8FAFF]' : 'border-[#EEF0F4] hover:border-[#D4D4D8]',
              )}
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-[#0B1354]">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span className="min-w-0 truncate">{item.label}</span>
                {item.comingSoon ? (
                  <span className="shrink-0 rounded-md bg-[#FFF6E5] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#B45309]">
                    Coming soon
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-xs text-[#717171]">{item.blurb}</p>
              <p className="mt-3 text-lg font-bold tabular-nums text-[#0B1354]">{count}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search campaigns or businesses"
            className="w-full rounded-lg border border-[#E4E4E7] bg-white py-2.5 pl-10 pr-3 text-sm text-[#0B1354] outline-none placeholder:text-[#A1A1AA] focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <select
          value={channel}
          onChange={(event) => {
            setChannel(event.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-[#E4E4E7] bg-white px-3 py-2.5 text-sm text-[#0B1354]"
        >
          <option value="all">All channels</option>
          {CAMPAIGN_CHANNELS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-[#EEF0F4] bg-white">
        {filtered.length ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#EEF0F4] bg-[#FAFBFC] text-xs font-medium uppercase tracking-wide text-[#717171]">
              <tr>
                <th className="px-4 py-3 font-medium">Campaign</th>
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Channel</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Sent</th>
                <th className="px-4 py-3 font-medium">Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {paged.rows.map((item) => {
                const meta = statusMeta(item.status);
                return (
                  <tr key={item.id} className="border-b border-[#F4F4F5] last:border-0 hover:bg-[#F8FAFF]">
                    <td className="px-4 py-3">
                      <Link to={`/campaigns/${item.id}`} className="font-semibold text-[#0B1354] hover:text-primary">
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[#3F3F46]">{businessName(item.businessId)}</td>
                    <td className="px-4 py-3 text-[#3F3F46]">{labelFor(CAMPAIGN_CATEGORIES, item.category)}</td>
                    <td className="px-4 py-3 text-[#3F3F46]">{labelFor(CAMPAIGN_CHANNELS, item.channel)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: meta.tone }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.tone }} />
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-[#0B1354]">{formatNumber(item.sent)}</td>
                    <td className="px-4 py-3 text-[#717171]">{formatWhen(item.scheduledAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-primary">
              <Megaphone className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-base font-semibold text-[#0B1354]">No matching campaigns</h2>
            <p className="mt-1 text-sm text-[#717171]">Try another filter or search.</p>
            <button type="button" onClick={() => { setQuery(''); setStatus('all'); setChannel('all'); setCategory('all'); setPage(1); setTick((value) => value + 1); }} className="mt-4 text-sm font-semibold text-primary">
              Clear filters
            </button>
          </div>
        )}
      </div>

      <BusinessesPagination
        currentPage={paged.current}
        totalPages={paged.totalPages}
        totalItems={filtered.length}
        pageSize={CAMPAIGN_PAGE_SIZE}
        onPageChange={setPage}
        label="Campaign pages"
      />
    </div>
  );
}
