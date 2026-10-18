import { useMemo, useState } from 'react';
import {
  Ban,
  CheckCircle2,
  ChevronsUpDown,
  Clock3,
  CloudUpload,
  Download,
  Filter,
  RefreshCw,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { clsx } from 'clsx';
import BusinessesPagination from '../businesses/BusinessesPagination';
import {
  formatCedi,
  formatInvoiceWhen,
  formatNumber,
  getPurchaseLogs,
  paginate,
} from './campaignData';

const STATUSES = ['Pending', 'Paid', 'Failed'];

const COLUMNS = [
  { id: 'customer', label: 'Customer Name', sort: true },
  { id: 'phone', label: 'Phone Number', sort: true },
  { id: 'email', label: 'Email address' },
  { id: 'productTitle', label: 'Product Title' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'amount', label: 'Amount (GHS)' },
  { id: 'at', label: 'Date & Time', sort: true },
  { id: 'status', label: 'Payment Status', sort: true },
];

const STATUS_META = {
  Paid: {
    label: 'Paid',
    icon: CheckCircle2,
    className: 'bg-[#E8F8EF] text-[#157A42]',
  },
  Pending: {
    label: 'Pending',
    icon: Clock3,
    className: 'bg-[#FFF6E5] text-[#B45309]',
  },
  Failed: {
    label: 'Failed',
    icon: Ban,
    className: 'bg-[#FDECEC] text-[#C0272C]',
  },
};

function cellValue(item, key) {
  if (key === 'at') return Date.parse(item.at) || 0;
  if (key === 'amount' || key === 'quantity') return Number(item[key]) || 0;
  return String(item[key] ?? '').toLowerCase();
}

function PaymentStatusBadge({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META.Pending;
  const Icon = meta.icon;
  return (
    <span
      className={clsx(
        'inline-flex min-w-[6.5rem] items-center justify-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        meta.className,
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
      {meta.label}
    </span>
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

function SoonButton({ icon: Icon, label }) {
  return (
    <button
      type="button"
      disabled
      title="Coming soon"
      className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-[#Fafafa] px-3.5 py-2 text-sm font-medium text-[#A1A1AA]"
    >
      <Icon className="h-4 w-4" />
      {label}
      <span className="rounded-md bg-[#FFF6E5] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#B45309]">
        Soon
      </span>
    </button>
  );
}

function StatCard({ label, value, hint, tone = 'neutral', active, onClick }) {
  const tones = {
    good: 'border-[#BBF7D0] bg-[#F0FDF4]',
    warn: 'border-[#FDE68A] bg-[#FFFBEB]',
    bad: 'border-[#FECACA] bg-[#FEF2F2]',
    neutral: 'border-[#EEF0F4] bg-white',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'admin-card cursor-pointer rounded-xl border px-4 py-4 text-left transition-colors',
        tones[tone],
        active ? 'ring-2 ring-primary/25' : 'hover:border-[#D4D4D8]',
      )}
    >
      <p className="text-sm font-medium text-[#717171]">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-[#0B1354]">{value}</p>
      {hint ? <p className="mt-2 text-xs text-[#A1A1AA]">{hint}</p> : null}
    </button>
  );
}

export default function PurchaseLogsTab({ campaign }) {
  const seed = useMemo(() => getPurchaseLogs(campaign), [campaign]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [sort, setSort] = useState({ key: 'at', dir: 'asc' });
  const [page, setPage] = useState(1);
  const [tick, setTick] = useState(0);

  const ledger = useMemo(() => {
    void tick;
    return seed;
  }, [seed, tick]);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = ledger.filter((item) => {
      if (status !== 'all' && item.status !== status) return false;
      if (!needle) return true;
      return [item.customer, item.phone, item.email, item.productTitle, item.status]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
    return filtered.sort((a, b) => {
      const left = cellValue(a, sort.key);
      const right = cellValue(b, sort.key);
      if (left < right) return sort.dir === 'asc' ? -1 : 1;
      if (left > right) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [ledger, query, sort, status]);

  const pageSize = 8;
  const paged = paginate(rows, page, pageSize);
  const pageRows = paged.rows;
  const pageIds = pageRows.map((item) => item.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const somePageSelected = pageIds.some((id) => selectedIds.has(id));

  const paid = ledger.filter((item) => item.status === 'Paid');
  const pending = ledger.filter((item) => item.status === 'Pending');
  const failed = ledger.filter((item) => item.status === 'Failed');
  const paidTotal = paid.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const toggleSort = (key) => {
    setSort((current) =>
      current.key === key ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
    );
    setPage(1);
  };

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
      if (allPageSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  return (
    <div className="mt-5 space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total purchases"
          value={formatNumber(ledger.length)}
          hint="Logged against this campaign"
          active={status === 'all'}
          onClick={() => {
            setStatus('all');
            setPage(1);
          }}
        />
        <StatCard
          label="Paid"
          value={formatNumber(paid.length)}
          hint={formatCedi(paidTotal)}
          tone="good"
          active={status === 'Paid'}
          onClick={() => {
            setStatus('Paid');
            setPage(1);
          }}
        />
        <StatCard
          label="Pending"
          value={formatNumber(pending.length)}
          hint="Awaiting payment confirmation"
          tone="warn"
          active={status === 'Pending'}
          onClick={() => {
            setStatus('Pending');
            setPage(1);
          }}
        />
        <StatCard
          label="Failed"
          value={formatNumber(failed.length)}
          hint="Payment did not complete"
          tone="bad"
          active={status === 'Failed'}
          onClick={() => {
            setStatus('Failed');
            setPage(1);
          }}
        />
      </div>

      <div className="admin-card rounded-xl border border-[#EEF0F4] bg-white px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <label htmlFor="purchase-search" className="sr-only">
              Search
            </label>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />
            <input
              id="purchase-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search"
              className="w-full rounded-full border border-[#E4E4E7] bg-[#FAFBFC] py-2.5 pl-11 pr-4 text-sm text-[#0B1354] outline-none placeholder:text-[#A1A1AA] focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
            />
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedIds(new Set());
                setTick((value) => value + 1);
              }}
              aria-label="Refresh purchase logs"
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] bg-white text-[#52525B] transition-colors hover:border-[#D4D4D8] hover:text-primary"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={2} />
            </button>

            <SoonButton icon={Trash2} label="Delete" />

            <div className="relative">
              <button
                type="button"
                onClick={() => setFiltersOpen((open) => !open)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-3.5 py-2 text-sm font-medium text-[#52525B] transition-colors hover:border-[#D4D4D8] hover:text-primary"
              >
                <Filter className="h-4 w-4" />
                Filters
                {status !== 'all' ? (
                  <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-white">
                    1
                  </span>
                ) : null}
              </button>
              {filtersOpen ? (
                <div className="absolute right-0 z-20 mt-2 w-56 admin-card rounded-xl border border-[#EEF0F4] bg-white p-3 shadow-[0_10px_28px_rgba(11,19,84,0.12)]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#717171]">
                    Payment status
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {['all', ...STATUSES].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setStatus(item);
                          setPage(1);
                          setFiltersOpen(false);
                        }}
                        className={clsx(
                          'cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium',
                          status === item
                            ? 'bg-primary text-white'
                            : 'bg-[#F4F4F5] text-[#3F3F46] hover:bg-[#E8EAEF]',
                        )}
                      >
                        {item === 'all' ? 'All' : item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <SoonButton icon={Download} label="Export" />
            <SoonButton icon={Upload} label="Import" />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto border-t border-[#F0F2F7] pt-4">
          {rows.length ? (
            <table className="w-full min-w-[78rem] text-left text-sm">
              <thead>
                <tr className="border-b border-[#EEF0F4] text-[#8B8B93]">
                  <th className="w-12 px-3 py-3">
                    <SelectionCheckbox
                      checked={allPageSelected}
                      indeterminate={somePageSelected && !allPageSelected}
                      onChange={togglePage}
                      label="Select all purchase logs on this page"
                    />
                  </th>
                  {COLUMNS.map((column) => (
                    <th key={column.id} className="px-3 py-3 font-medium">
                      {column.sort ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(column.id)}
                          className="inline-flex cursor-pointer items-center gap-1 hover:text-[#0B1354]"
                        >
                          {column.label}
                          <ChevronsUpDown className="h-3 w-3" />
                        </button>
                      ) : (
                        column.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((item) => {
                  const selected = selectedIds.has(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={clsx(
                        'border-b border-[#F4F4F5] last:border-0',
                        selected ? 'bg-[#F8FAFF]' : 'hover:bg-[#FAFBFC]',
                      )}
                    >
                      <td className="px-3 py-3">
                        <SelectionCheckbox
                          checked={selected}
                          onChange={() => toggleRow(item.id)}
                          label={`${selected ? 'Deselect' : 'Select'} ${item.customer}`}
                        />
                      </td>
                      <td className="px-3 py-3 font-medium text-[#0B1354]">{item.customer}</td>
                      <td className="px-3 py-3 tabular-nums text-[#3F3F46]">{item.phone}</td>
                      <td className="px-3 py-3 text-[#3F3F46]">{item.email}</td>
                      <td className="px-3 py-3 text-[#3F3F46]">{item.productTitle}</td>
                      <td className="px-3 py-3 tabular-nums text-[#3F3F46]">{item.quantity}</td>
                      <td className="px-3 py-3 tabular-nums text-[#3F3F46]">
                        {formatNumber(item.amount)}
                      </td>
                      <td className="px-3 py-3 text-[#3F3F46]">{formatInvoiceWhen(item.at)}</td>
                      <td className="px-3 py-3">
                        <PaymentStatusBadge status={item.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-16 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-primary">
                <CloudUpload className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-[#0B1354]">No purchases yet</h2>
              <p className="mt-1 text-sm text-[#717171]">
                {seed.length
                  ? 'No rows match this search or filter.'
                  : 'Redemptions will show here after customers act on the campaign.'}
              </p>
            </div>
          )}
        </div>

        <BusinessesPagination
          currentPage={paged.current}
          totalPages={paged.totalPages}
          totalItems={rows.length}
          pageSize={pageSize}
          onPageChange={(next) => {
            setPage(next);
            setSelectedIds(new Set());
          }}
          label="Purchase log pages"
        />
      </div>
    </div>
  );
}
