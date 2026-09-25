import { Link } from 'react-router-dom';
import { BarChart3, FileBarChart, Plus } from 'lucide-react';

export default function ReportsPageHeader({ onAddCollection, reportCount = 0 }) {
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

      <div className="relative flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-[#717171]">
            <BarChart3 className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            <span>Customer Engagement</span>
            <span className="text-[#D4D4D8]" aria-hidden="true">
              /
            </span>
            <Link to="/customer-engagement/reports" className="text-primary">
              Reports
            </Link>
          </div>

          <h1 className="mt-2 text-xl font-bold tracking-tight text-[#0B1354] sm:text-2xl lg:text-[1.75rem]">
            Customer insight reports & collections
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#717171] sm:text-base">
            Generate, review, and export audience reports built from your customer data.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddCollection}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#320EB8] hover:shadow-[0_8px_24px_rgba(58,16,205,0.32)]"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
          Add Collection
        </button>
      </div>

      <div className="flex items-center gap-2 border-t border-[#F0F2F7] px-5 py-3 sm:px-6">
        <FileBarChart className="h-4 w-4 text-primary" strokeWidth={2} />
        <span className="text-sm text-[#717171]">
          <span className="font-semibold text-[#0B1354]">{reportCount} reports</span> available in
          your library
        </span>
      </div>
    </header>
  );
}
