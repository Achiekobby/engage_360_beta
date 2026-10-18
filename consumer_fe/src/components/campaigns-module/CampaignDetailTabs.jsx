import { ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { CAMPAIGN_DETAIL_TABS } from './campaignDetailData';

export default function CampaignDetailTabs({ activeTab, onTabChange, onBack, tabs = CAMPAIGN_DETAIL_TABS }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div
        className="inline-flex w-full max-w-xl overflow-x-auto rounded-sm bg-[#EDE8F8] p-1 sm:w-auto"
        role="tablist"
        aria-label="Campaign detail sections"
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                'shrink-0 cursor-pointer rounded-sm px-3.5 py-2 text-sm font-semibold transition-all duration-200 sm:px-4',
                active
                  ? 'bg-white text-primary shadow-[0_2px_8px_rgba(58,16,205,0.12)]'
                  : 'text-[#545454] hover:text-primary',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="inline-flex cursor-pointer items-center gap-2 self-end text-sm font-semibold text-primary transition-colors hover:text-[#320EB8] sm:self-auto"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_12px_rgba(58,16,205,0.28)]">
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
        </span>
        Back
      </button>
    </div>
  );
}
