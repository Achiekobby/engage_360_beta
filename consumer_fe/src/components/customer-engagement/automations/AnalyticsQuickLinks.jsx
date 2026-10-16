import { clsx } from 'clsx';
import { ANALYTICS_QUICK_LINKS } from './analyticsData';

export default function AnalyticsQuickLinks({ activeTab, onTabChange }) {
  return (
    <div className="inline-flex rounded-full bg-[#EDE8F8] p-1">
      {ANALYTICS_QUICK_LINKS.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange?.(tab.id)}
            className={clsx(
              'cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors sm:px-6',
              active
                ? 'bg-white text-primary shadow-sm'
                : 'bg-transparent text-primary/80 hover:text-primary',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
