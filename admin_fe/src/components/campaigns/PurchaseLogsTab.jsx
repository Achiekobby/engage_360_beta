import { useMemo, useRef, useState } from 'react';
import { ChevronsUpDown, Download, FileText, Filter, Search, Upload } from 'lucide-react';
import { clsx } from 'clsx';
import AnimatedModal from '../motion/AnimatedModal';
import BusinessesPagination from '../businesses/BusinessesPagination';
import TableStatStrip, { statShare } from '../layout/TableStatStrip';
import {
  CAMPAIGN_PAGE_SIZE,
  formatCedi,
  formatInvoiceWhen,
  formatNumber,
  getPurchaseLogs,
  paginate,
} from './campaignData';

const STATUSES = ['Pending', 'Paid'];

const COLUMNS = [
  { id: 'customer', label: 'Customer Name', sort: true },
  { id: 'invoiceNumber', label: 'Invoice Number', sort: true },
  { id: 'email', label: 'Email Address' },
  { id: 'productType', label: 'Product Type' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'amount', label: 'Amount (GH₵)' },
  { id: 'at', label: 'Date & Time', sort: true },
  { id: 'status', label: 'Invoice Status', sort: true },
];

const CSV_HEADER = COLUMNS.map((column) => column.label);

function escapeCsv(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function exportLogs(rows, name) {
  const lines = [
    CSV_HEADER.map(escapeCsv).join(','),
    ...rows.map((item) =>
      [
        item.customer,
        item.invoiceNumber,
        item.email,
        item.productType,
        item.quantity,
        item.amount,
        formatInvoiceWhen(item.at),
        item.status,
      ]
        .map(escapeCsv)
        .join(','),
    ),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name.toLowerCase().replaceAll(' ', '-')}-purchase-logs.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function parseCsv(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const cells = [];
      let current = '';
      let quoted = false;
      for (const char of line) {
        if (char === '"') {
          quoted = !quoted;
          continue;
        }
        if (char === ',' && !quoted) {
          cells.push(current.trim());
          current = '';
          continue;
        }
        current += char;
      }
      cells.push(current.trim());
      return cells;
    });
}

function parseImportedWhen(value) {
  const match = String(value ?? '').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2})$/);
  if (match) {
    const [, day, month, year, hour, minute] = match;
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)).toISOString();
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function cellValue(item, key) {
  if (key === 'at') return Date.parse(item.at) || 0;
  if (key === 'amount' || key === 'quantity') return Number(item[key]) || 0;
  return String(item[key] ?? '').toLowerCase();
}

export default function PurchaseLogsTab({ campaign }) {
  const seed = useMemo(() => getPurchaseLogs(campaign), [campaign]);
  const [imported, setImported] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [sort, setSort] = useState({ key: 'at', dir: 'asc' });
  const [page, setPage] = useState(1);
  const fileRef = useRef(null);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = [...seed, ...imported].filter((item) => {
      if (status !== 'all' && item.status !== status) return false;
      if (!needle) return true;
      return [item.customer, item.invoiceNumber, item.email, item.productType, item.status]
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
  }, [imported, query, seed, sort, status]);

  const paged = paginate(rows, page);
  const pageRows = paged.rows;
  const selected = rows.find((item) => item.id === selectedId) ?? pageRows[0] ?? null;
  const ledger = [...seed, ...imported];
  const paid = ledger.filter((item) => item.status === 'Paid');
  const pending = ledger.filter((item) => item.status === 'Pending');
  const paidTotal = paid.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const selectInvoiceStatus = (next) => {
    setStatus(next);
    setPage(1);
  };
  const stats = [
    {
      id: 'all',
      label: 'Invoices',
      value: formatNumber(ledger.length),
      accent: '#0B1354',
      share: 100,
      detail: 'Logged against this campaign',
      onSelect: () => selectInvoiceStatus('all'),
    },
    {
      id: 'Paid',
      label: 'Paid',
      value: formatNumber(paid.length),
      accent: '#157A42',
      share: statShare(paid.length, ledger.length),
      detail: `${statShare(paid.length, ledger.length)}% settled`,
      onSelect: () => selectInvoiceStatus('Paid'),
    },
    {
      id: 'Pending',
      label: 'Pending',
      value: formatNumber(pending.length),
      accent: '#D97706',
      share: statShare(pending.length, ledger.length),
      detail: `${statShare(pending.length, ledger.length)}% outstanding`,
      onSelect: () => selectInvoiceStatus('Pending'),
    },
    {
      id: 'revenue',
      label: 'Paid value',
      value: formatCedi(paidTotal),
      accent: '#2563EB',
      share: statShare(paid.length, ledger.length),
      detail: 'Collected on paid invoices',
      onSelect: () => selectInvoiceStatus('Paid'),
    },
  ];

  const toggleSort = (key) => {
    setSort((current) =>
      current.key === key ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
    );
    setPage(1);
  };

  const importFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const text = await file.text();
    const parsed = parseCsv(text);
    if (!parsed.length) return;
    const start = parsed[0][0]?.toLowerCase().includes('customer') ? parsed.slice(1) : parsed;
    const next = start
      .map((cells, index) => ({
        id: `${campaign.id}-import-${Date.now()}-${index}`,
        customer: cells[0] || 'Unknown',
        invoiceNumber: cells[1] || String(2023046471967 + index),
        email: cells[2] || '—',
        productType: cells[3] || campaign.name,
        quantity: Number(cells[4]) || 1,
        amount: Number(String(cells[5] ?? '').replace(/[^\d.]/g, '')) || 0,
        at: parseImportedWhen(cells[6]),
        status: STATUSES.includes(cells[7]) ? cells[7] : 'Pending',
      }))
      .filter((item) => item.customer !== 'Unknown' || item.invoiceNumber);
    setImported((current) => [...current, ...next]);
    setPage(1);
  };

  const toolButton =
    'inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-3 py-2 text-sm font-medium text-[#52525B] transition-colors hover:border-[#D4D4D8] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E4E4E7] disabled:hover:text-[#52525B]';

  return (
    <div className="mt-5">
      <TableStatStrip items={stats} selectedId={status} />

      <div className="mt-5 rounded-xl border border-[#EEF0F4] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(11,19,84,0.04)] sm:px-5">
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
            className="w-full rounded-full border border-[#E4E4E7] bg-white py-2.5 pl-11 pr-4 text-sm text-[#0B1354] outline-none placeholder:text-[#A1A1AA] focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={!rows.length}
            onClick={() => {
              if (!selectedId && selected) setSelectedId(selected.id);
              setDetailsOpen(true);
            }}
            className={toolButton}
          >
            <FileText className="h-4 w-4" />
            Details
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
              <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-[#EEF0F4] bg-white p-3 shadow-[0_10px_28px_rgba(11,19,84,0.12)]">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#717171]">Invoice status</p>
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
                        'rounded-full px-2.5 py-1 text-xs font-medium',
                        status === item ? 'bg-primary text-white' : 'bg-[#F4F4F5] text-[#3F3F46] hover:bg-[#E8EAEF]',
                      )}
                    >
                      {item === 'all' ? 'All' : item}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            disabled={rows.length === 0}
            onClick={() => exportLogs(rows, campaign.name)}
            className={toolButton}
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className={toolButton}>
            <Upload className="h-4 w-4" />
            Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            tabIndex={-1}
            aria-hidden="true"
            onChange={importFile}
          />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto border-t border-[#F0F2F7] pt-4">
        {rows.length ? (
          <table className="w-full min-w-[72rem] text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEF0F4] text-[#8B8B93]">
                {COLUMNS.map((column) => (
                  <th key={column.id} className="px-3 py-3 font-medium">
                    {column.sort ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column.id)}
                        className="inline-flex items-center gap-1 hover:text-[#0B1354]"
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
                const active = item.id === selectedId;
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={clsx(
                      'cursor-pointer border-b border-[#F4F4F5] last:border-0',
                      active ? 'bg-[#F8FAFF]' : 'hover:bg-[#FAFBFC]',
                    )}
                  >
                    <td className="px-3 py-3 font-medium text-[#0B1354]">{item.customer}</td>
                    <td className="px-3 py-3 tabular-nums text-[#3F3F46]">{item.invoiceNumber}</td>
                    <td className="px-3 py-3 text-[#3F3F46]">{item.email}</td>
                    <td className="px-3 py-3 text-[#3F3F46]">{item.productType}</td>
                    <td className="px-3 py-3 tabular-nums text-[#3F3F46]">{item.quantity}</td>
                    <td className="px-3 py-3 tabular-nums text-[#3F3F46]">{formatNumber(item.amount)}</td>
                    <td className="px-3 py-3 text-[#3F3F46]">{formatInvoiceWhen(item.at)}</td>
                    <td className="px-3 py-3 text-[#3F3F46]">{item.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-16 text-center">
            <h2 className="text-base font-semibold text-[#0B1354]">No purchases yet</h2>
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
        pageSize={CAMPAIGN_PAGE_SIZE}
        onPageChange={setPage}
        label="Purchase log pages"
      />

      <AnimatedModal
        isOpen={detailsOpen && Boolean(selected)}
        onClose={() => setDetailsOpen(false)}
        labelledBy="purchase-details-title"
        panelClassName="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 id="purchase-details-title" className="text-lg font-bold text-[#0B1354]">
          Invoice details
        </h2>
        {selected ? (
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-[#717171]">Customer name</dt>
              <dd className="mt-1 text-sm text-[#0B1354]">{selected.customer}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[#717171]">Invoice number</dt>
              <dd className="mt-1 text-sm tabular-nums text-[#0B1354]">{selected.invoiceNumber}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[#717171]">Email address</dt>
              <dd className="mt-1 text-sm text-[#0B1354]">{selected.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[#717171]">Product type</dt>
              <dd className="mt-1 text-sm text-[#0B1354]">{selected.productType}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[#717171]">Quantity</dt>
              <dd className="mt-1 text-sm tabular-nums text-[#0B1354]">{selected.quantity}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[#717171]">Amount</dt>
              <dd className="mt-1 text-sm tabular-nums text-[#0B1354]">{formatCedi(selected.amount)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[#717171]">Date & time</dt>
              <dd className="mt-1 text-sm text-[#0B1354]">{formatInvoiceWhen(selected.at)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[#717171]">Invoice status</dt>
              <dd className="mt-1 text-sm text-[#0B1354]">{selected.status}</dd>
            </div>
          </dl>
        ) : null}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setDetailsOpen(false)}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Close
          </button>
        </div>
      </AnimatedModal>
      </div>
    </div>
  );
}
