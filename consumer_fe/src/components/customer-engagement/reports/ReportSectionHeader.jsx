import { CalendarDays, FolderOpen, Layers } from 'lucide-react';
import FilterDropdownChip from '../FilterDropdownChip';
import { REPORT_FILTER_OPTIONS } from './reportsAnalyticsData';

export default function ReportSectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex items-start gap-3">
        {Icon ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EDE8F8] text-primary">
            <Icon className="h-4 w-4" strokeWidth={2} />
          </div>
        ) : null}
        <div>
          <h1 className="text-xl font-bold text-[#0B1354] sm:text-2xl">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#717171] sm:text-base">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-2 sm:gap-3">
        <FilterDropdownChip
          label="Date Filter"
          options={REPORT_FILTER_OPTIONS.date}
          icon={CalendarDays}
        />
        <FilterDropdownChip
          label="Category"
          options={REPORT_FILTER_OPTIONS.category}
          icon={Layers}
        />
        <FilterDropdownChip
          label="Collection"
          options={REPORT_FILTER_OPTIONS.collection}
          icon={FolderOpen}
        />
      </div>
    </div>
  );
}
