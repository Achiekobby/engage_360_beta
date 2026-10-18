import { Eye, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import AutomationMetaBadge from './AutomationMetaBadge';
import { APPROVAL_META, CHANNEL_META, STATUS_META } from './automationBadgeMeta';

const COLUMNS = [
  { id: 'select', label: '', width: 'w-10' },
  { id: 'preview', label: 'Preview', width: 'w-16' },
  { id: 'channel', label: 'Channel', width: 'min-w-[7.5rem]' },
  { id: 'timing', label: 'Timing', width: 'min-w-[10rem]' },
  { id: 'approval', label: 'Approval', width: 'min-w-[9.5rem]' },
  { id: 'status', label: 'Status', width: 'min-w-[9rem]' },
  { id: 'actions', label: 'Actions', width: 'min-w-[10rem]' },
];

export default function AutomationDataTable({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onViewItem,
  onDeleteItem,
}) {
  const allSelected = items.length > 0 && items.every((item) => selectedIds.has(item.id));
  const someSelected =
    items.some((item) => selectedIds.has(item.id)) && !allSelected;

  return (
    <div className="overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse">
          <thead>
            <tr className="border-b border-[#F0F2F7] bg-[#FAFBFC]">
              {COLUMNS.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={clsx(
                    'px-3 py-3.5 text-left text-xs font-semibold text-[#717171] first:pl-4 last:pr-4 sm:px-4',
                    column.width,
                  )}
                >
                  {column.id === 'select' ? (
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(node) => {
                        if (node) node.indeterminate = someSelected;
                      }}
                      onChange={onToggleSelectAll}
                      className="h-3.5 w-3.5 cursor-pointer rounded border-[#D4D4D8] text-primary focus:ring-primary/30"
                      aria-label="Select all on page"
                    />
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const selected = selectedIds.has(item.id);
              const channel = CHANNEL_META[item.channel] ?? CHANNEL_META.SMS;
              const approval = APPROVAL_META[item.approval] ?? APPROVAL_META['Auto-approval'];
              const status = STATUS_META[item.status] ?? STATUS_META.pending;

              return (
                <tr
                  key={item.id}
                  className={clsx(
                    'border-b border-[#F0F2F7] transition-colors last:border-b-0 hover:bg-[#FAFBFF]',
                    selected && 'bg-[#F7F8FF]/70',
                  )}
                >
                  <td className="px-3 py-3 first:pl-4 sm:px-4">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onToggleSelect?.(item.id)}
                      className="h-3.5 w-3.5 cursor-pointer rounded border-[#D4D4D8] text-primary focus:ring-primary/30"
                      aria-label={`Select ${item.timingLabel}`}
                    />
                  </td>
                  <td className="px-3 py-3 sm:px-4">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-[#F4F5F7]">
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                    </div>
                  </td>
                  <td className="px-3 py-3 sm:px-4">
                    <AutomationMetaBadge
                      icon={channel.icon}
                      label={item.channel}
                      className={channel.className}
                      classNameExtra="w-[6.5rem]"
                      align="start"
                    />
                  </td>
                  <td className="px-3 py-3 sm:px-4">
                    <p className="text-sm italic text-[#0B1354]/85">{item.timingLabel}</p>
                  </td>
                  <td className="px-3 py-3 sm:px-4">
                    <AutomationMetaBadge
                      icon={approval.icon}
                      label={item.approval}
                      className={approval.className}
                      classNameExtra="w-[9rem]"
                      align="start"
                    />
                  </td>
                  <td className="px-3 py-3 sm:px-4">
                    <AutomationMetaBadge
                      icon={status.icon}
                      label={item.statusLabel}
                      className={status.className}
                      classNameExtra="w-[8.5rem]"
                      align="start"
                    />
                  </td>
                  <td className="px-3 py-3 last:pr-4 sm:px-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onViewItem?.(item)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#E4E4E7] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#0B1354] transition-colors hover:border-primary/30"
                      >
                        <Eye className="h-3 w-3" strokeWidth={2} />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteItem?.(item)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#E4E4E7] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#0B1354] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" strokeWidth={2} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
