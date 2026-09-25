import { AlertCircle, HelpCircle, Upload } from 'lucide-react';
import { clsx } from 'clsx';
import { isVideoPromoVisual } from './PromoVisualPreview';

const inputClass =
  'w-full rounded-sm border bg-white px-3.5 py-2.5 text-sm text-[#0B1354] outline-none transition-all placeholder:text-[#9AA0B0] focus:ring-2 focus:ring-primary/10';

export function inputClassName(hasError) {
  return clsx(
    inputClass,
    hasError
      ? 'border-[#E5484D] focus:border-[#E5484D]'
      : 'border-[#E4E4E7] focus:border-primary/40',
  );
}

export function FieldHelp({ text }) {
  return (
    <span className="group/help relative ml-1.5 inline-flex align-middle">
      <HelpCircle
        className="h-3.5 w-3.5 cursor-help text-[#9AA0B0] transition-colors group-hover/help:text-primary"
        strokeWidth={2.25}
        aria-hidden="true"
      />
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-0 z-50 hidden w-52 rounded-sm bg-[#0B1354] px-3 py-2 text-left text-[11px] leading-relaxed text-white shadow-[0_8px_24px_rgba(11,19,84,0.22)] group-hover/help:block"
      >
        {text}
        <span className="absolute left-2 top-full border-4 border-transparent border-t-[#0B1354]" />
      </span>
    </span>
  );
}

export function FieldLabel({ htmlFor, children, help }) {
  return (
    <label
      htmlFor={htmlFor}
      className="relative mb-1.5 flex items-center text-sm font-semibold text-[#0B1354]"
    >
      {children}
      {help ? <FieldHelp text={help} /> : null}
    </label>
  );
}

export function FieldError({ message }) {
  if (!message) return null;

  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-[#E5484D]">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
      <span>{message}</span>
    </p>
  );
}

export function FileUploadZone({
  onChange,
  fileName,
  error,
  help,
  label = 'Attachment',
  id,
  compact = false,
  previewUrl,
  promoVisual = 'image',
  fileMimeType = '',
  accept = 'image/*,video/*',
  emptyTitle = 'Images, Video',
  emptyHint = 'Click here to upload',
  hidePreview = false,
}) {
  const hasPreview = Boolean(previewUrl);
  const isVideo = isVideoPromoVisual(promoVisual, fileMimeType);

  return (
    <div>
      <FieldLabel htmlFor={id} help={help}>
        {label}
      </FieldLabel>

      {hasPreview && !hidePreview ? (
        <div
          className={clsx(
            'relative flex min-h-[11rem] flex-col overflow-hidden rounded-sm border border-[#E4E4E7] bg-[#0B1354]/5',
            compact ? 'min-h-[11rem]' : 'min-h-[14rem]',
          )}
        >
          <div className="flex min-h-0 flex-1 items-center justify-center p-2">
            {isVideo ? (
              <video
                src={previewUrl}
                controls
                className="max-h-52 w-full object-contain"
                aria-label={fileName || 'Promo video preview'}
              />
            ) : (
              <img
                src={previewUrl}
                alt={fileName || 'Promo visual preview'}
                className="max-h-52 w-full object-contain"
              />
            )}
          </div>
          <label
            htmlFor={id}
            className="cursor-pointer border-t border-[#E4E4E7] bg-white/95 px-3 py-2 text-center text-xs font-semibold text-primary transition-colors hover:bg-[#F7F8FF]"
          >
            Replace file
            <input
              id={id}
              type="file"
              className="sr-only"
              accept={accept}
              onChange={(event) => onChange(event.target.files?.[0] || null)}
            />
          </label>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={clsx(
            'flex cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed text-center transition-colors',
            compact ? 'min-h-[11rem] px-4 py-6' : 'min-h-[14rem] px-4 py-8',
            error
              ? 'border-[#E5484D] bg-[#FFF5F5]'
              : 'border-[#D4D8E4] bg-[#FAFBFC] hover:border-primary/35 hover:bg-[#F7F8FF]',
          )}
        >
          <input
            id={id}
            type="file"
            className="sr-only"
            accept={accept}
            onChange={(event) => onChange(event.target.files?.[0] || null)}
          />
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE8F8] text-primary">
            <Upload className="h-4 w-4" strokeWidth={2} />
          </span>
          <p className="mt-3 text-sm font-semibold text-[#0B1354]">{emptyTitle}</p>
          <p className="mt-1 text-xs text-[#717171]">{fileName || emptyHint}</p>
        </label>
      )}

      <FieldError message={error} />
    </div>
  );
}
