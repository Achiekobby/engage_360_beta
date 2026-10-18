import { clsx } from 'clsx';
import { getAnalyticsQuickLinks } from './analyticsData';

export default function AnalyticsQuickLinks({
  activeTab,
  onTabChange,
  kindId = 'birthday',
}) {
  const tabs = getAnalyticsQuickLinks(kindId);

  return (
    <div className="inline-flex rounded-full bg-[#EDE8F8] p-1">
      {tabs.map((tab) => {
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
