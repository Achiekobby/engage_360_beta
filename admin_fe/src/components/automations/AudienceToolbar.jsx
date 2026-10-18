import { Filter, RefreshCw, Search } from 'lucide-react';

export default function AudienceToolbar({
  searchQuery,
  onSearchChange,
  onRefresh,
  onOpenFilters,
  activeFilterCount = 0,
}) {
  return (
    <div className="admin-card-sm rounded-xl border border-[#E4E4E7] bg-white px-4 py-3 sm:px-5">
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
            placeholder="Search name, email, product number…"
            className="w-full rounded-full border border-[#E4E4E7] bg-white py-2.5 pl-10 pr-4 text-sm text-[#0B1354] outline-none transition-all placeholder:text-[#A1A1AA] focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Refresh audience"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-[#0B1354] transition-colors hover:bg-[#EFF6FF] hover:text-primary"
          >
            <RefreshCw className="h-4 w-4" strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#0B1354] transition-colors hover:bg-[#EFF6FF] hover:text-primary"
          >
            <Filter className="h-4 w-4" strokeWidth={2} />
            Filters
            {activeFilterCount > 0 ? (
              <span className="ml-0.5 rounded-md bg-primary px-1.5 py-0.5 text-xs font-semibold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </div>
  );
}
