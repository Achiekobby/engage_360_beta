import {
  Building2,
  CheckCircle2,
  Clock3,
  Eye,
  Mail,
  MessageCircle,
  MessageSquare,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { clsx } from 'clsx';

const CHANNEL_META = {
  SMS: {
    icon: MessageSquare,
    className: 'bg-[#EDE8F8] text-primary',
  },
  Email: {
    icon: Mail,
    className: 'bg-[#E8F4FC] text-[#2E7DAD]',
  },
  WhatsApp: {
    icon: MessageCircle,
    className: 'bg-[#E8F8EF] text-[#1F9D55]',
  },
};

const APPROVAL_META = {
  'Auto-approval': {
    icon: ShieldCheck,
    className: 'bg-[#3F3F46] text-white',
  },
  'Business-approval': {
    icon: Building2,
    className: 'bg-[#52525B] text-white',
  },
};

const STATUS_META = {
  pending: {
    icon: Clock3,
    className: 'bg-[#FFF1E8] text-[#E67E22]',
  },
  'pending-review': {
    icon: Eye,
    className: 'bg-[#FFF8E1] text-[#C9A227]',
  },
  sent: {
    icon: CheckCircle2,
    className: 'bg-[#E8F8EF] text-[#1F9D55]',
  },
};

function MetaBadge({ icon: Icon, label, className, classNameExtra }) {
  return (
    <span
      className={clsx(
        'inline-flex h-7 w-full items-center justify-center gap-1 rounded-full px-2.5 text-[11px] font-semibold leading-none',
        className,
        classNameExtra,
      )}
    >
      <Icon className="h-3 w-3 shrink-0" strokeWidth={2.25} />
      <span className="truncate">{label}</span>
    </span>
  );
}

export default function AutomationListItem({
  item,
  selected = false,
  onToggleSelect,
  onView,
  onDelete,
}) {
  const channel = CHANNEL_META[item.channel] ?? CHANNEL_META.SMS;
  const approval = APPROVAL_META[item.approval] ?? APPROVAL_META['Auto-approval'];
  const status = STATUS_META[item.status] ?? STATUS_META.pending;

  return (
    <article
      className={clsx(
        'grid items-center gap-x-3 gap-y-2 rounded-xl border px-3 py-2.5 transition-colors',
        'grid-cols-[auto_auto_1fr] sm:grid-cols-[auto_auto_minmax(4.5rem,5.5rem)_minmax(7rem,1fr)_minmax(7.5rem,8.5rem)_minmax(7rem,8rem)_auto]',
        selected
          ? 'border-primary/30 bg-[#F7F8FF]'
          : 'border-[#EEF0F4] bg-[#F8F9FB]',
      )}
    >
      <label className="flex cursor-pointer items-center">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect?.(item.id)}
          className="h-3.5 w-3.5 cursor-pointer rounded border-[#D4D4D8] text-primary focus:ring-primary/30"
          aria-label={`Select automation ${item.timingLabel}`}
        />
      </label>

      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white">
        <img src={item.image} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="min-w-0 sm:contents">
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:contents">
          <MetaBadge
            icon={channel.icon}
            label={item.channel}
            className={channel.className}
            classNameExtra="sm:w-full"
          />

          <p className="min-w-0 truncate text-xs italic text-[#0B1354]/80 sm:px-1">
            {item.timingLabel}
          </p>

          <MetaBadge
            icon={approval.icon}
            label={item.approval}
            className={approval.className}
            classNameExtra="sm:w-full"
          />

          <MetaBadge
            icon={status.icon}
            label={item.statusLabel}
            className={status.className}
            classNameExtra="sm:w-full"
          />
        </div>
      </div>

      <div className="col-span-3 flex shrink-0 items-center justify-end gap-1.5 sm:col-span-1 sm:ml-0">
        <button
          type="button"
          onClick={() => onView?.(item)}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#E4E4E7] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#0B1354] transition-colors hover:border-primary/30"
        >
          <Eye className="h-3 w-3" strokeWidth={2} />
          View
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(item)}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#E4E4E7] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#0B1354] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-3 w-3" strokeWidth={2} />
          Delete
        </button>
      </div>
    </article>
  );
}
