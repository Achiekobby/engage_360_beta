import {
  CalendarDays,
  Filter,
  FolderOpen,
  Layers,
  LayoutDashboard,
} from 'lucide-react';
import { DASHBOARD_FILTERS } from './customerDashboardData';
import FilterDropdownChip from '../FilterDropdownChip';

const FILTER_META = {
  Category: { icon: Layers, options: ['All Categories', 'Retail', 'Hospitality', 'Finance', 'Telecom'] },
  Collection: { icon: FolderOpen, options: ['All Collections', 'VIP', 'New Leads', 'Dormant', 'High Value'] },
  'Advanced Filter': {
    icon: Filter,
    options: ['All Filters', 'Active Only', 'Incomplete Profiles', 'Has Phone', 'Has Email'],
  },
  Date: {
    icon: CalendarDays,
    options: ['Last 7 days', 'Last 30 days', 'Last 90 days', 'This Year', 'Custom Range'],
  },
};

export default function DashboardPageHeader() {
  return (
    <header className="relative overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.04)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[#6B4FE0] to-[#5B9FD4]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(58,16,205,0.08)_0%,rgba(58,16,205,0)_70%)]"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-[#717171]">
            <LayoutDashboard className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            <span>Customer Engagement</span>
            <span className="text-[#D4D4D8]" aria-hidden="true">
              /
            </span>
            <span className="text-primary">Dashboard</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1354] sm:text-[1.75rem] lg:text-[2rem]">
            Data Overview
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[#717171]">
            Monitor customer health, demographics, and data quality at a glance.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2 sm:justify-end lg:max-w-[28rem] xl:max-w-none">
          {DASHBOARD_FILTERS.map((filter) => {
            const meta = FILTER_META[filter];
            return (
              <FilterDropdownChip
                key={filter}
                label={filter}
                options={meta.options}
                icon={meta.icon}
              />
            );
          })}
        </div>
      </div>
    </header>
  );
}
