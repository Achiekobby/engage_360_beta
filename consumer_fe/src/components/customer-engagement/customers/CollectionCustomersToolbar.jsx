import { Download, Filter, RefreshCw, Search, Trash2 } from 'lucide-react';

export default function CollectionCustomersToolbar({
  searchQuery,
  onSearchChange,
  selectedCount,
  onRefresh,
  onDeleteSelected,
  onFilter,
  onExport,
}) {
  return (
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
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search customers..."
            className="w-full rounded-sm border border-[#E4E4E7] bg-[#FAFBFC] py-2.5 pl-10 pr-4 text-sm text-[#0B1354] outline-none transition-all focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border border-[#E4E4E7] bg-white text-[#717171] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary"
            aria-label="Refresh"
          >
            <RefreshCw className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm font-medium text-[#717171] transition-colors hover:border-[#E53935]/30 hover:bg-[#FEECEC] hover:text-[#E53935] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
            Delete
          </button>
          <button
            type="button"
            onClick={onFilter}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-[#2E7DAD]/30 bg-white px-3.5 py-2.5 text-sm font-semibold text-[#2E7DAD] transition-colors hover:bg-[#E8F4FC]"
          >
            <Filter className="h-4 w-4" strokeWidth={2} />
            Filters
          </button>
          <button
            type="button"
            onClick={onExport}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#0B1354] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
