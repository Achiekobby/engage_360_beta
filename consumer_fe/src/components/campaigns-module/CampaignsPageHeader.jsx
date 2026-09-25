import { Link } from 'react-router-dom';
import { ArrowLeft, Megaphone, Plus } from 'lucide-react';

export default function CampaignsPageHeader({ onCreateCampaign, campaignCount = 0 }) {
  return (
    <header className="relative overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.04)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[#6B4FE0] to-[#5B9FD4]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(58,16,205,0.1)_0%,rgba(58,16,205,0)_70%)]"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-[#717171]">
            <Link to="/dashboard" className="inline-flex items-center gap-1 hover:text-primary">
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
              Platform Home
            </Link>
            <span className="text-[#D4D4D8]">/</span>
            <span className="text-primary">Campaigns</span>
          </div>

          <div className="mt-3 flex items-start gap-3">
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[#EDE8F8] text-primary sm:flex">
              <Megaphone className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#0B1354] sm:text-2xl lg:text-[1.75rem]">
                Campaign Management
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#717171] sm:text-base">
                Track active, scheduled, and draft campaigns. Create new ones from scratch or templates.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onCreateCampaign}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#320EB8] hover:shadow-[0_8px_24px_rgba(58,16,205,0.32)]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Create Campaign
        </button>
      </div>

      <div className="flex items-center gap-2 border-t border-[#F0F2F7] px-5 py-3 sm:px-6">
        <span className="rounded-sm bg-[#F7F8FF] px-2.5 py-1 text-sm font-semibold text-primary ring-1 ring-primary/10">
          {campaignCount}
        </span>
        <span className="text-sm text-[#717171]">campaigns in your workspace</span>
      </div>
    </header>
  );
}
