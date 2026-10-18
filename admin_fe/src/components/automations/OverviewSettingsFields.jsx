import { ChevronDown, CircleHelp, ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';

export function OverviewHelp({ text }) {
  if (!text) return null;

  return (
    <span className="group/help relative ml-1.5 inline-flex align-middle">
      <span
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[#9AA0B0]"
        aria-hidden="true"
      >
        <CircleHelp className="h-4 w-4" strokeWidth={2.25} />
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-50 hidden w-56 -translate-x-1/2 rounded-md bg-[#0B1354] px-3 py-2 text-left text-[11px] leading-relaxed text-white shadow-[0_8px_24px_rgba(11,19,84,0.22)] group-hover/help:block sm:left-0 sm:translate-x-0"
      >
        {text}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#0B1354] sm:left-2 sm:translate-x-0" />
      </span>
    </span>
  );
}

export function OverviewLabel({ children, optional = false, help }) {
  return (
    <p className="relative mb-1.5 flex items-center text-sm font-semibold text-[#0B1354]">
      {children}
      {optional ? <span className="ml-1 font-medium text-[#717171]">(Optional)</span> : null}
      <OverviewHelp text={help} />
    </p>
  );
}

export function OverviewTextField({ label, value, optional = false, help, multiline = false, rows = 4 }) {
  return (
    <div>
      <OverviewLabel optional={optional} help={help}>
        {label}
      </OverviewLabel>
      {multiline ? (
        <div
          className="min-h-[7.5rem] w-full whitespace-pre-wrap rounded-md border border-[#E4E4E7] bg-[#FAFBFC] px-3.5 py-2.5 text-sm leading-relaxed text-[#0B1354]"
          style={{ minHeight: `${Math.max(rows, 3) * 1.55}rem` }}
        >
          {value || '—'}
        </div>
      ) : (
        <div className="w-full rounded-md border border-[#E4E4E7] bg-[#FAFBFC] px-3.5 py-2.5 text-sm text-[#0B1354]">
          {value || '—'}
        </div>
      )}
    </div>
  );
}

export function OverviewSelectField({ label, value, optional = false, help }) {
  return (
    <div>
      <OverviewLabel optional={optional} help={help}>
        {label}
      </OverviewLabel>
      <div className="relative">
        <div className="w-full rounded-md border border-[#E4E4E7] bg-[#FAFBFC] px-3.5 py-2.5 pr-10 text-sm text-[#0B1354]">
          {value || '—'}
        </div>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717171]"
          strokeWidth={2}
        />
      </div>
    </div>
  );
}

export function OverviewMediaField({ label, previewUrl, fileName, optional = false, help }) {
  return (
    <div>
      <OverviewLabel optional={optional} help={help}>
        {label}
      </OverviewLabel>
      {previewUrl ? (
        <div className="overflow-hidden rounded-md border border-[#E4E4E7] bg-[#FAFBFC]">
          <div className="h-28 w-full sm:h-32">
            <img
              src={previewUrl}
              alt={fileName || label}
              className="h-full w-full object-cover"
            />
          </div>
          {fileName ? (
            <p className="truncate border-t border-[#EEF0F4] px-3 py-2 text-xs text-[#717171]">
              {fileName}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="flex min-h-[7.5rem] flex-col items-center justify-center rounded-md border border-dashed border-[#D4D8E4] bg-[#FAFBFC] px-4 py-5 text-center">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE8F8] text-primary">
            <ImageIcon className="h-4 w-4" strokeWidth={2} />
          </span>
          <p className="mt-3 text-sm font-semibold text-[#0B1354]">No media uploaded</p>
        </div>
      )}
    </div>
  );
}

export function OverviewBadge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#E4E4E7] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#717171]">
      {children}
    </span>
  );
}

export function OverviewSection({ title, actions, children, showBody = true }) {
  return (
    <section className="admin-card rounded-xl border border-[#EEF0F4] bg-white p-5 sm:p-6 lg:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-base font-bold text-primary sm:text-lg">{title}</h2>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div className="mt-3 h-px w-full bg-[#EDE8F8]" aria-hidden="true" />
      {showBody && children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}

export function OverviewStatusToggle({ enabled }) {
  return (
    <div className="inline-flex rounded-full bg-[#F0F2F7] p-1">
      <span
        className={clsx(
          'rounded-full px-5 py-2 text-sm font-semibold',
          enabled ? 'bg-primary text-white shadow-sm' : 'text-[#717171]',
        )}
      >
        Enable
      </span>
      <span
        className={clsx(
          'rounded-full px-5 py-2 text-sm font-semibold',
          !enabled ? 'bg-primary text-white shadow-sm' : 'text-[#717171]',
        )}
      >
        Disable
      </span>
    </div>
  );
}
