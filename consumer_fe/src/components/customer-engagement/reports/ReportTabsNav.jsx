import { clsx } from 'clsx';
import { REPORT_TABS } from './reportsAnalyticsData';

export default function ReportTabsNav({ activeTab, onTabChange }) {
  return (
    <nav
      className="border-b border-[#EEF0F4] bg-white"
      aria-label="Report sections"
    >
      <div className="mx-auto flex max-w-8xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
        {REPORT_TABS.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                'relative shrink-0 cursor-pointer whitespace-nowrap px-3 py-3.5 text-sm font-medium transition-colors sm:px-4',
                active
                  ? 'text-primary'
                  : 'text-[#717171] hover:text-[#0B1354]',
              )}
            >
              {tab.label}
              {active ? (
                <span
                  className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-primary sm:inset-x-4"
                  aria-hidden="true"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
