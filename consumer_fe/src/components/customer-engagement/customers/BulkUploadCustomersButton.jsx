import { FileSpreadsheet, Upload } from 'lucide-react';
import { clsx } from 'clsx';

export default function BulkUploadCustomersButton({
  onClick,
  className,
  disabled = false,
  size = 'md',
}) {
  const compact = size === 'sm';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Bulk upload customers"
      className={clsx(
        'group relative inline-flex cursor-pointer items-stretch overflow-hidden rounded-sm border border-[#C9E8E3] bg-white text-left shadow-[0_4px_18px_rgba(15,118,110,0.12)] transition-all duration-200',
        'hover:-translate-y-0.5 hover:border-[#0F766E]/35 hover:shadow-[0_10px_28px_rgba(15,118,110,0.16)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/25 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_18px_rgba(15,118,110,0.12)]',
        className,
      )}
    >
      <span
        className={clsx(
          'relative flex shrink-0 items-center justify-center bg-gradient-to-br from-[#0F766E] to-[#14B8A6] text-white',
          compact ? 'w-11' : 'w-12',
        )}
        aria-hidden="true"
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.28),transparent_55%)]" />
        <Upload
          className={clsx(
            'relative transition-transform duration-200 group-hover:-translate-y-0.5',
            compact ? 'h-4 w-4' : 'h-[18px] w-[18px]',
          )}
          strokeWidth={2.25}
        />
      </span>

      <span
        className={clsx(
          'flex min-w-0 flex-1 flex-col justify-center gap-0.5',
          compact ? 'px-3 py-2' : 'px-3.5 py-2.5',
        )}
      >
        <span className="inline-flex items-center gap-1.5 text-sm font-bold leading-none text-[#0B1354]">
          Bulk Upload
          <FileSpreadsheet
            className="h-3.5 w-3.5 text-[#0F766E] opacity-80"
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>
        <span className="text-[11px] font-medium leading-none tracking-wide text-[#5C7A76]">
          Import XLSX contact file
        </span>
      </span>

      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-[#0F766E] to-[#2DD4BF] transition-transform duration-300 group-hover:scale-x-100"
        aria-hidden="true"
      />
    </button>
  );
}
