import { Download, Filter, RefreshCw, Search, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

export default function AutomationsToolbar({
  searchQuery,
  onSearchChange,
  onRefresh,
  onOpenFilters,
  onDeleteSelected,
  selectedCount = 0,
  activeFilterCount = 0,
}) {
  const canBulkDelete = selectedCount >= 2;

  return (
    <div className="rounded-2xl border border-[#E4E4E7] bg-white px-4 py-3 shadow-[0_2px_12px_rgba(11,19,84,0.04)] sm:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-0 flex-1 lg:max-w-xl xl:max-w-2xl">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]"
            strokeWidth={2}
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search"
            className="w-full rounded-full border border-[#E4E4E7] bg-white py-2.5 pl-10 pr-4 text-sm text-[#0B1354] outline-none transition-all placeholder:text-[#A1A1AA] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Refresh"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#0B1354] transition-colors hover:bg-[#F7F8FF]"
          >
            <RefreshCw className="h-4 w-4" strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={onDeleteSelected}
            disabled={!canBulkDelete}
            title={
              canBulkDelete
                ? `Delete ${selectedCount} selected`
                : 'Select at least 2 automations to delete'
            }
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors',
              canBulkDelete
                ? 'cursor-pointer text-red-600 hover:bg-red-50'
                : 'cursor-not-allowed text-[#A1A1AA]',
            )}
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
            Delete
            {canBulkDelete ? (
              <span className="ml-0.5 rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-700">
                {selectedCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-[#0B1354] transition-colors hover:bg-[#F7F8FF]"
          >
            <Filter className="h-4 w-4" strokeWidth={2} />
            Filters
            {activeFilterCount > 0 ? (
              <span className="ml-0.5 rounded-full bg-primary px-1.5 py-0.5 text-xs font-semibold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-3.5 py-2 text-sm font-semibold text-[#0B1354] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF]"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
