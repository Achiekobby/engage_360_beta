import { Eye, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

export function ReportActions({ report, onDelete, onView, compact = false, viewLabel = 'View Customers' }) {
  return (
    <div className={clsx('flex items-center', compact ? 'gap-1' : 'gap-2')}>
      <button
        type="button"
        onClick={() => onDelete(report)}
        aria-label={`Delete ${report.type} report`}
        className={clsx(
          'inline-flex cursor-pointer items-center justify-center rounded-sm text-[#717171] transition-colors hover:bg-[#FEECEC] hover:text-[#E53935]',
          compact ? 'h-9 w-9' : 'gap-1.5 px-3 py-2 text-sm font-medium',
        )}
      >
        <Trash2 className="h-4 w-4" strokeWidth={2} />
        {!compact && 'Delete'}
      </button>
      <button
        type="button"
        onClick={() => onView(report)}
        aria-label={viewLabel}
        className={clsx(
          'inline-flex cursor-pointer items-center justify-center rounded-sm border border-[#E4E4E7] bg-white font-semibold text-[#0B1354] shadow-sm transition-all duration-200 hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary',
          compact ? 'h-9 gap-1 px-2.5 text-xs sm:px-3 sm:text-sm' : 'gap-1.5 px-3.5 py-2 text-sm',
        )}
      >
        <Eye className="h-4 w-4 shrink-0" strokeWidth={2} />
        {!compact && viewLabel}
        {compact && <span className="hidden sm:inline">{viewLabel}</span>}
      </button>
    </div>
  );
}
