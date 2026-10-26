import { BadgeCheck, Clock, LoaderCircle } from 'lucide-react';

const STATUS_META = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-[#FFF6E5] text-[#B45309]',
  },
  processing: {
    label: 'Processing',
    icon: LoaderCircle,
    className: 'bg-[#E8F1FF] text-[#1D4ED8]',
  },
  fulfilled: {
    label: 'Fulfilled',
    icon: BadgeCheck,
    className: 'bg-[#E7F8EE] text-[#157A42]',
  },
};

export default function RewardStatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.pending;
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex h-7 w-[7.75rem] items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold ${meta.className}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} aria-hidden="true" />
      <span className="truncate">{meta.label}</span>
    </span>
  );
}
