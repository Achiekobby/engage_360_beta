import { Filter, Search } from 'lucide-react';
import { clsx } from 'clsx';

export default function CampaignsToolbar({
  searchQuery,
  onSearchChange,
  resultCount,
  onOpenFilters,
  activeFilterCount = 0,
}) {
  return (
    <div className="rounded-sm border border-[#EEF0F4] bg-white p-4 shadow-[0_4px_20px_rgba(11,19,84,0.05)] sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative min-w-0 flex-1 lg:max-w-md">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717171]"
            strokeWidth={2}
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search campaigns..."
            className="w-full rounded-sm border border-[#E4E4E7] bg-[#FAFBFC] py-2.5 pl-10 pr-4 text-sm text-[#0B1354] outline-none transition-all placeholder:text-[#717171] focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenFilters}
            className={clsx(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-sm border px-3.5 py-2.5 text-sm font-semibold transition-colors',
              activeFilterCount > 0
                ? 'border-primary/30 bg-[#F7F8FF] text-primary'
                : 'border-[#E4E4E7] bg-white text-[#0B1354] hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary',
            )}
          >
            <Filter className="h-4 w-4" strokeWidth={2} />
            Filters
            {activeFilterCount > 0 ? (
              <span className="ml-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {searchQuery || activeFilterCount > 0 ? (
        <p className="mt-3 text-sm text-[#717171]">
          Showing <span className="font-semibold text-[#0B1354]">{resultCount}</span> matching
          campaign{resultCount === 1 ? '' : 's'}
        </p>
      ) : null}
    </div>
  );
}
