import { useEffect, useId, useMemo, useState } from 'react';
import { Download, Filter, Search, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import AnimatedModal from '../motion/AnimatedModal';
import { PageBackLink } from '../layout/PageBackLink';
import BusinessesPagination from '../businesses/BusinessesPagination';
import { CAMPAIGN_PAGE_SIZE, formatCedi, formatCompact, paginate } from '../campaigns/campaignData';
import {
  buildCreditHistory,
  creditBalanceFor,
  formatCreditUnits,
  formatLedgerWhen,
} from './settingsData';

const TOOL =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-3 py-2 text-sm font-medium text-[#52525B] transition-colors hover:border-[#D4D4D8] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40';

function exportHistory(rows, businessName) {
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const lines = [
    ['Timestamp', 'Credit type', 'Amount', 'Units credited', 'Status'].join(','),
    ...rows.map((item) => [formatLedgerWhen(item.at), item.type, item.amount, item.units, item.status].map(escape).join(',')),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(businessName || 'business').toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}-top-ups.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function CreditBalanceRing({ value }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="flex w-[6.75rem] shrink-0 flex-col items-center">
      <div className="relative flex h-[6.75rem] w-[6.75rem] items-center justify-center">
        <svg viewBox="0 0 80 80" className="absolute inset-0" aria-hidden="true">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#EEF0F4" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="#2563EB"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.82} ${circumference}`}
            transform="rotate(-90 40 40)"
          />
        </svg>
        <p className="text-xl font-bold tabular-nums leading-none text-[#0B1354]">{formatCompact(value)}</p>
      </div>
      <p className="mt-2 text-center text-[11px] leading-none text-[#717171]">Credit balance</p>
    </div>
  );
}

export default function CreditHistoryModal({ business, onClose }) {
  const titleId = useId();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [removedIds, setRemovedIds] = useState(() => new Set());
  const [page, setPage] = useState(1);
  const seeded = useMemo(() => buildCreditHistory(business), [business?.id]);

  useEffect(() => {
    setQuery('');
    setStatus('all');
    setFiltersOpen(false);
    setSelectedIds(new Set());
    setRemovedIds(new Set());
    setPage(1);
  }, [business?.id]);

  const rows = useMemo(() => seeded.filter((item) => !removedIds.has(item.id)), [removedIds, seeded]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((item) => {
      if (status !== 'all' && item.status !== status) return false;
      if (!needle) return true;
      return [formatLedgerWhen(item.at), item.type, item.status, String(item.amount), String(item.units)]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [query, rows, status]);

  const paged = paginate(filtered, page);
  const allVisibleSelected = paged.rows.length > 0 && paged.rows.every((item) => selectedIds.has(item.id));

  const toggleAll = () => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (allVisibleSelected) paged.rows.forEach((item) => next.delete(item.id));
      else paged.rows.forEach((item) => next.add(item.id));
      return next;
    });
  };

  const toggleOne = (id) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const removeSelected = () => {
    setRemovedIds((current) => {
      const next = new Set(current);
      selectedIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectedIds(new Set());
    setPage(1);
  };

  return (
    <AnimatedModal
      isOpen={Boolean(business)}
      onClose={onClose}
      labelledBy={titleId}
      panelClassName="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
    >
      <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <PageBackLink onClick={onClose} />
          <h2 id={titleId} className="mt-3 text-lg font-bold tracking-tight text-[#0B1354]">
            {business?.companyName ?? 'Business'} top-ups
          </h2>
          <p className="mt-0.5 text-sm text-[#717171]">Credit purchases and the units they added to this workspace.</p>
        </div>
        <CreditBalanceRing value={business ? creditBalanceFor(business) : 0} />
      </div>

      <div className="flex flex-col gap-3 border-t border-[#F0F2F7] px-5 py-3 sm:flex-row sm:items-center sm:px-6">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search"
            className="w-full rounded-full border border-[#E4E4E7] bg-white py-2.5 pl-9 pr-3 text-sm text-[#0B1354] outline-none placeholder:text-[#A1A1AA] focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button type="button" disabled={selectedIds.size === 0} onClick={removeSelected} className={TOOL}>
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <div className="relative">
            <button type="button" onClick={() => setFiltersOpen((open) => !open)} className={TOOL}>
              <Filter className="h-4 w-4" />
              Filters
              {status !== 'all' ? (
                <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-white">
                  1
                </span>
              ) : null}
            </button>
            {filtersOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-48 admin-card rounded-xl border border-[#EEF0F4] bg-white p-3 shadow-[0_10px_28px_rgba(11,19,84,0.12)]">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#717171]">Status</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'Success', label: 'Success' },
                    { id: 'Failed', label: 'Failed' },
                  ].map((item) => (
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
          <button type="button" disabled={filtered.length === 0} onClick={() => exportHistory(filtered, business?.companyName)} className={TOOL}>
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-5 pb-2 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-[#EEF0F4]">
          {paged.rows.length ? (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#EEF0F4] bg-[#FAFBFC] text-xs font-medium uppercase tracking-wide text-[#717171]">
                <tr>
                  <th className="w-10 px-3 py-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleAll}
                      aria-label="Select all visible top-ups"
                      className="rounded border-[#D4D4D8]"
                    />
                  </th>
                  <th className="px-4 py-3 font-medium">Timestamp</th>
                  <th className="px-4 py-3 font-medium">Credit type</th>
                  <th className="px-4 py-3 font-medium text-right">Amount ₵</th>
                  <th className="px-4 py-3 font-medium text-right">Units credited</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {paged.rows.map((item) => (
                  <tr key={item.id} className="border-b border-[#F4F4F5] last:border-0">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleOne(item.id)}
                        aria-label={`Select ${item.type} top-up`}
                        className="rounded border-[#D4D4D8]"
                      />
                    </td>
                    <td className="px-4 py-3 tabular-nums text-[#717171]">{formatLedgerWhen(item.at)}</td>
                    <td className="px-4 py-3 text-[#3F3F46]">{item.type}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-[#0B1354]">{formatCedi(item.amount)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-[#0B1354]">{formatCreditUnits(item.units)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx(
                          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                          item.status === 'Success' ? 'bg-[#E8F8EF] text-[#157A42]' : 'bg-[#FDECEC] text-[#C0272C]',
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-6 py-16 text-center text-sm text-[#717171]">No top-ups match this search or filter.</p>
          )}
        </div>
        <BusinessesPagination
          currentPage={paged.current}
          totalPages={paged.totalPages}
          totalItems={filtered.length}
          pageSize={CAMPAIGN_PAGE_SIZE}
          onPageChange={setPage}
          label="Top-up pages"
        />
      </div>
    </AnimatedModal>
  );
}
