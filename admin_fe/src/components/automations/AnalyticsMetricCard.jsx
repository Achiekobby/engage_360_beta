import { Rocket, Ticket } from 'lucide-react';
import { clsx } from 'clsx';

const TONE_META = {
  rocket: {
    icon: Rocket,
    iconClass: 'text-[#22C55E]',
  },
  ticket: {
    icon: Ticket,
    iconClass: 'text-[#EF4444]',
  },
};

export default function AnalyticsMetricCard({
  label,
  value,
  tone = 'rocket',
  compact = false,
}) {
  const meta = TONE_META[tone] || TONE_META.rocket;
  const Icon = meta.icon;

  return (
    <article
      className={clsx(
        'admin-card-sm flex rounded-xl border border-[#EEF0F4]',
        compact
          ? 'min-w-0 flex-row items-center gap-3 bg-[#F7F8FA] px-3.5 py-3.5 sm:px-4'
          : 'items-center gap-3 bg-white px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4',
      )}
    >
      <span
        className={clsx(
          'inline-flex shrink-0 items-center justify-center rounded-lg bg-white shadow-[0_1px_3px_rgba(11,19,84,0.08)] ring-1 ring-[#EEF0F4]',
          compact ? 'h-10 w-10' : 'h-11 w-11',
        )}
      >
        <Icon
          className={clsx(compact ? 'h-4 w-4' : 'h-5 w-5', meta.iconClass)}
          strokeWidth={2}
        />
      </span>
      <div className="min-w-0">
        <p
          className={clsx(
            'font-bold text-[#0B1354]',
            compact ? 'truncate text-[13px] leading-snug' : 'truncate text-sm',
          )}
        >
          {label}
        </p>
        <p
          className={clsx(
            'tabular-nums text-[#717171]',
            compact ? 'mt-0.5 text-sm font-medium' : 'mt-0.5 text-sm',
          )}
        >
          {value}
        </p>
      </div>
    </article>
  );
}
