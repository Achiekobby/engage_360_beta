import { Eye, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import AutomationMetaBadge from './AutomationMetaBadge';
import { APPROVAL_META, CHANNEL_META, STATUS_META } from './automationBadgeMeta';

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
        'grid-cols-[auto_auto_1fr] sm:grid-cols-[auto_auto_minmax(6.5rem,7rem)_minmax(7rem,1fr)_minmax(9rem,9.5rem)_minmax(8.5rem,9rem)_auto]',
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
          <AutomationMetaBadge
            icon={channel.icon}
            label={item.channel}
            className={channel.className}
            classNameExtra="w-[6.5rem] sm:w-full"
            align="start"
          />

          <p className="min-w-0 truncate text-xs italic text-[#0B1354]/80 sm:px-1">
            {item.timingLabel}
          </p>

          <AutomationMetaBadge
            icon={approval.icon}
            label={item.approval}
            className={approval.className}
            classNameExtra="w-[9rem] sm:w-full"
            align="start"
          />

          <AutomationMetaBadge
            icon={status.icon}
            label={item.statusLabel}
            className={status.className}
            classNameExtra="w-[8.5rem] sm:w-full"
            align="start"
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
