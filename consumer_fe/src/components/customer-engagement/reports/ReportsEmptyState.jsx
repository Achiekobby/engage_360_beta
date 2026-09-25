import { Database, FileBarChart } from 'lucide-react';

export default function ReportsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-[#E4E4E7] bg-white px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F8FF] text-primary">
        <FileBarChart className="h-6 w-6" strokeWidth={2} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-[#0B1354]">No reports found</h3>
      <p className="mt-2 max-w-sm text-sm text-[#717171]">
        Adjust your filters or add a new collection to start building customer reports.
      </p>
    </div>
  );
}

export function ReportDatabaseIcon({ iconBg, status }) {
  return (
    <div className="relative shrink-0">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ring-1 ring-black/5 ${iconBg}`}
      >
        <Database className="h-6 w-6" strokeWidth={2} />
      </div>
      {status === 'ready' ? (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#1F9D55] ring-2 ring-white">
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" aria-hidden="true">
            <path
              d="M2.5 6.2 4.8 8.5 9.5 3.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#F5A623] ring-2 ring-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
        </span>
      )}
    </div>
  );
}
