import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownUp,
  Download,
  Filter,
  RefreshCw,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { clsx } from 'clsx';
import SlideDrawer from '../customer-engagement/customers/SlideDrawer';
import CampaignsPagination from './CampaignsPagination';
import {
  MOCK_PURCHASE_LOGS,
  PAYMENT_STATUS_STYLES,
  PURCHASE_LOG_DATE_OPTIONS,
  PURCHASE_LOG_FILTER_DEFAULTS,
  PURCHASE_LOG_STATUS_OPTIONS,
  PURCHASE_LOGS_PAGE_SIZE,
  countActivePurchaseLogFilters,
} from './campaignDetailData';

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function PurchaseLogsFilterDrawer({ isOpen, onClose, filters, onApply }) {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (isOpen) setDraft(filters);
  }, [isOpen, filters]);

  return (
    <SlideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Purchase Log Filters"
      subtitle="Narrow logs by payment status and date range."
      maxWidth="max-w-md"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setDraft({ ...PURCHASE_LOG_FILTER_DEFAULTS })}
            className="flex-1 cursor-pointer rounded-sm border border-[#E4E4E7] bg-white px-4 py-3 text-sm font-semibold text-[#0B1354] transition-colors hover:bg-[#F7F8FF]"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              onApply?.(draft);
              onClose();
            }}
            className="flex-1 cursor-pointer rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-colors hover:bg-[#320EB8]"
          >
            Apply filters
          </button>
        </div>
      }
    >
      <div className="space-y-7">
        <fieldset>
          <legend className="text-sm font-semibold text-[#0B1354]">Payment Status</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {PURCHASE_LOG_STATUS_OPTIONS.map((option) => {
              const active = draft.paymentStatuses.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      paymentStatuses: toggleValue(prev.paymentStatuses, option.id),
                    }))
                  }
                  className={clsx(
                    'cursor-pointer rounded-sm px-3.5 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-white'
                      : 'border border-[#E4E4E7] bg-white text-[#0B1354] hover:border-primary/30 hover:bg-[#F7F8FF]',
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-[#0B1354]">Date Range</legend>
          <div className="mt-3 space-y-2">
            {PURCHASE_LOG_DATE_OPTIONS.map((option) => {
              const active = draft.dateRange === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, dateRange: option.id }))}
                  className={clsx(
                    'flex w-full cursor-pointer items-center justify-between rounded-sm border px-3.5 py-2.5 text-left text-sm font-medium transition-colors',
                    active
                      ? 'border-primary bg-[#F7F8FF] text-primary'
                      : 'border-[#E4E4E7] bg-white text-[#0B1354] hover:border-primary/30',
                  )}
                >
                  {option.label}
                  <span
                    className={clsx(
                      'flex h-4 w-4 items-center justify-center rounded-full border-2',
                      active ? 'border-primary' : 'border-[#C8CDD8]',
                    )}
                  >
                    {active ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>
    </SlideDrawer>
  );
}

const COLUMNS = [
  { id: 'customerName', label: 'Customer Name' },
  { id: 'phone', label: 'Phone Number' },
  { id: 'email', label: 'Email address' },
  { id: 'productTitle', label: 'Product Title' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'amount', label: 'Amount (GHS)' },
  { id: 'dateTime', label: 'Date & Time' },
  { id: 'paymentStatus', label: 'Payment Status' },
];

export default function CampaignPurchaseLogsPanel({ logs = MOCK_PURCHASE_LOGS }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [rows, setRows] = useState(logs);
  const [filters, setFilters] = useState(PURCHASE_LOG_FILTER_DEFAULTS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortKey, setSortKey] = useState('dateTime');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);

  const activeFilterCount = countActivePurchaseLogFilters(filters);

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let next = rows.filter((row) => {
      if (filters.paymentStatuses.length && !filters.paymentStatuses.includes(row.paymentStatus)) {
        return false;
      }

      if (!query) return true;

      return (
        row.customerName.toLowerCase().includes(query) ||
        row.phone.toLowerCase().includes(query) ||
        row.email.toLowerCase().includes(query) ||
        row.productTitle.toLowerCase().includes(query) ||
        row.paymentStatus.toLowerCase().includes(query)
      );
    });

    next = [...next].sort((a, b) => {
      const left = String(a[sortKey] ?? '');
      const right = String(b[sortKey] ?? '');
      const compared = left.localeCompare(right, undefined, { numeric: true });
      return sortDir === 'asc' ? compared : -compared;
    });

    return next;
  }, [rows, searchQuery, filters, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PURCHASE_LOGS_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedRows = useMemo(
    () =>
      filteredRows.slice(
        (safePage - 1) * PURCHASE_LOGS_PAGE_SIZE,
        safePage * PURCHASE_LOGS_PAGE_SIZE,
      ),
    [filteredRows, safePage],
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filters, sortKey, sortDir]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const toggleSort = (columnId) => {
    if (sortKey === columnId) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(columnId);
    setSortDir('asc');
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    const pageIds = pagedRows.map((row) => row.id);
    const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

    if (allPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
      return;
    }

    setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
  };

  const handleDelete = () => {
    if (!selectedIds.length) return;
    setRows((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
    setSelectedIds([]);
  };

  const handleRefresh = () => {
    setRows(logs);
    setSelectedIds([]);
    setSearchQuery('');
    setPage(1);
  };

  const allPageSelected =
    pagedRows.length > 0 && pagedRows.every((row) => selectedIds.includes(row.id));

  return (
    <div className="space-y-4">
      <div className="rounded-sm border border-[#EEF0F4] bg-white p-4 shadow-[0_4px_20px_rgba(11,19,84,0.05)] sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative min-w-0 flex-1 xl:max-w-md">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717171]"
              strokeWidth={2}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search"
              className="w-full rounded-sm border border-[#E4E4E7] bg-[#FAFBFC] py-2.5 pl-10 pr-4 text-sm text-[#0B1354] outline-none transition-all placeholder:text-[#717171] focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border border-[#E4E4E7] bg-white text-[#717171] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary"
              aria-label="Refresh"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={selectedIds.length === 0}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm font-medium text-[#717171] transition-colors hover:border-[#E53935]/30 hover:bg-[#FEECEC] hover:text-[#E53935] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2} />
              Delete
            </button>
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-primary/25 bg-white px-3.5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-[#F7F8FF]"
            >
              <Filter className="h-4 w-4" strokeWidth={2} />
              Filters
              {activeFilterCount > 0 ? (
                <span className="ml-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#0B1354] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary"
            >
              <Download className="h-4 w-4" strokeWidth={2} />
              Export
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#0B1354] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary"
            >
              <Upload className="h-4 w-4" strokeWidth={2} />
              Import
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#EEF0F4] bg-[#FAFBFC]">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 cursor-pointer accent-primary"
                    aria-label="Select all purchase logs on this page"
                  />
                </th>
                {COLUMNS.map((column) => (
                  <th key={column.id} className="px-4 py-3 font-semibold text-[#0B1354]">
                    <button
                      type="button"
                      onClick={() => toggleSort(column.id)}
                      className="inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-primary"
                    >
                      {column.label}
                      <ArrowDownUp className="h-3.5 w-3.5 text-[#9AA0B0]" strokeWidth={2} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedRows.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="px-4 py-16 text-center text-[#717171]">
                    No purchase logs match your search or filters.
                  </td>
                </tr>
              ) : (
                pagedRows.map((row) => {
                  const selected = selectedIds.includes(row.id);

                  return (
                    <tr
                      key={row.id}
                      className={clsx(
                        'border-b border-[#F0F2F7] transition-colors last:border-b-0',
                        selected ? 'bg-[#F7F8FF]' : 'hover:bg-[#FAFBFC]',
                      )}
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleRow(row.id)}
                          className="h-4 w-4 cursor-pointer accent-primary"
                          aria-label={`Select ${row.customerName}`}
                        />
                      </td>
                      <td className="px-4 py-3.5 font-medium text-[#0B1354]">{row.customerName}</td>
                      <td className="px-4 py-3.5 text-[#545454]">{row.phone}</td>
                      <td className="px-4 py-3.5 text-[#545454]">{row.email}</td>
                      <td className="px-4 py-3.5 text-[#545454]">{row.productTitle}</td>
                      <td className="px-4 py-3.5 text-[#545454]">{row.quantity}</td>
                      <td className="px-4 py-3.5 text-[#545454]">{row.amount}</td>
                      <td className="px-4 py-3.5 text-[#545454]">{row.dateTime}</td>
                      <td
                        className={clsx(
                          'px-4 py-3.5 font-semibold',
                          PAYMENT_STATUS_STYLES[row.paymentStatus] || 'text-[#0B1354]',
                        )}
                      >
                        {row.paymentStatus}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 pb-4 sm:px-5">
          <CampaignsPagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredRows.length}
            pageSize={PURCHASE_LOGS_PAGE_SIZE}
            onPageChange={setPage}
            itemLabel="logs"
            className="mt-0 border-t border-[#F0F2F7] pt-4"
          />
        </div>
      </div>

      <PurchaseLogsFilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={setFilters}
      />
    </div>
  );
}
