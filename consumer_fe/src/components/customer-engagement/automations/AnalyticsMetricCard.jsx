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

export default function AnalyticsMetricCard({ label, value, tone = 'rocket' }) {
  const meta = TONE_META[tone] || TONE_META.rocket;
  const Icon = meta.icon;

  return (
    <article className="flex items-center gap-3 rounded-sm bg-[#F4F5F7] px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-white shadow-sm">
        <Icon className={clsx('h-5 w-5', meta.iconClass)} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-[#0B1354]">{label}</p>
        <p className="mt-0.5 text-sm text-[#717171]">{value}</p>
      </div>
    </article>
  );
}
