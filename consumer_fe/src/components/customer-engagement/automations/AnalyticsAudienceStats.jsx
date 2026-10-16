import { CircleUser, FolderKanban, Users, UserRound } from 'lucide-react';
import { clsx } from 'clsx';
import { ANALYTICS_AUDIENCE_STATS } from './analyticsData';

const ICON_MAP = {
  users: Users,
  male: UserRound,
  female: CircleUser,
  collections: FolderKanban,
};

export default function AnalyticsAudienceStats({ stats = ANALYTICS_AUDIENCE_STATS }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
      {stats.map((stat) => {
        const Icon = ICON_MAP[stat.icon] || Users;

        return (
          <article
            key={stat.id}
            className="relative overflow-hidden rounded-sm border border-[#EEF0F4] bg-white p-4 shadow-[0_4px_20px_rgba(11,19,84,0.04)] sm:p-5"
          >
            <div
              className={clsx('absolute inset-x-0 top-0 h-1', stat.accentClass)}
              aria-hidden="true"
            />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#717171]">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-[#0B1354]">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-[#717171]">{stat.hint}</p>
              </div>
              <span
                className={clsx(
                  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm',
                  stat.iconWrapClass,
                )}
              >
                <Icon className={clsx('h-5 w-5', stat.iconClass)} strokeWidth={2} />
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
