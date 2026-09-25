import { Search } from 'lucide-react';
import FilterDropdownChip from '../customer-engagement/FilterDropdownChip';
import { CalendarDays, Layers } from 'lucide-react';

const STATUS_OPTIONS = ['All Status', 'Active', 'Scheduled', 'Draft', 'Completed'];
const CHANNEL_OPTIONS = ['All Channels', 'SMS', 'Email', 'WhatsApp', 'Push Notification'];
const DATE_OPTIONS = ['All Time', 'Last 7 days', 'Last 30 days', 'This Year'];

export default function CampaignsToolbar({ searchQuery, onSearchChange, resultCount }) {
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
          <FilterDropdownChip label="Status" options={STATUS_OPTIONS} icon={Layers} />
          <FilterDropdownChip label="Channel" options={CHANNEL_OPTIONS} icon={Layers} />
          <FilterDropdownChip label="Date Filter" options={DATE_OPTIONS} icon={CalendarDays} />
        </div>
      </div>

      {searchQuery ? (
        <p className="mt-3 text-sm text-[#717171]">
          Showing <span className="font-semibold text-[#0B1354]">{resultCount}</span> matching
          campaign{resultCount === 1 ? '' : 's'}
        </p>
      ) : null}
    </div>
  );
}
