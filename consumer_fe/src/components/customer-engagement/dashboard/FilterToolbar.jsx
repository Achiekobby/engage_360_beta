import { ChevronDown } from 'lucide-react';
import { DASHBOARD_FILTERS } from './customerDashboardData';

export default function FilterToolbar() {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {DASHBOARD_FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#0B1354] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF]"
        >
          {filter}
          <ChevronDown className="h-4 w-4 text-[#717171]" strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
