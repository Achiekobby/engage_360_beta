import { ArrowLeft } from 'lucide-react';

export default function PageBackButton({
  onClick,
  label = 'Back',
  detail,
  ariaLabel,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || (detail ? `${label} to ${detail}` : label)}
      title={ariaLabel || (detail ? `${label} to ${detail}` : label)}
      className={`group relative inline-flex cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-sm border border-[#E4E4E7] bg-[#FAFBFC] px-3.5 py-2.5 text-sm font-semibold text-[#0B1354] shadow-[0_2px_8px_rgba(11,19,84,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0B1354]/18 hover:bg-white hover:shadow-[0_8px_20px_rgba(11,19,84,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1354]/15 focus-visible:ring-offset-2 ${className}`}
    >
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-white text-[#0B1354] ring-1 ring-[#EEF0F4] transition-all duration-200 group-hover:bg-[#0B1354] group-hover:text-white group-hover:ring-[#0B1354]">
        <ArrowLeft
          className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
          strokeWidth={2.25}
        />
      </span>
      <span className="flex min-w-0 flex-col items-start gap-0.5 text-left">
        <span className="leading-none">{label}</span>
        {detail ? (
          <span className="max-w-[9.5rem] truncate text-[11px] font-medium leading-none tracking-wide text-[#8B92A5] group-hover:text-[#717171]">
            {detail}
          </span>
        ) : null}
      </span>
    </button>
  );
}
