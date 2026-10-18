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
        'admin-card-sm flex rounded-xl border border-[#EEF0F4] bg-white',
        compact
          ? 'min-w-0 flex-col items-start gap-2.5 px-3.5 py-3.5 sm:px-4'
          : 'items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4',
      )}
    >
      <span
        className={clsx(
          'inline-flex shrink-0 items-center justify-center rounded-md bg-[#F4F5F7]',
          compact ? 'h-9 w-9' : 'h-11 w-11',
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
            compact ? 'text-xs leading-snug sm:text-[13px]' : 'truncate text-sm',
          )}
        >
          {label}
        </p>
        <p className={clsx('text-[#717171]', compact ? 'mt-1 text-sm' : 'mt-0.5 text-sm')}>
          {value}
        </p>
      </div>
    </article>
  );
}
