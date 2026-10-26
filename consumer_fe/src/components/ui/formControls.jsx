import { AlertCircle } from 'lucide-react';

export const OTHER_VALUE = '__other__';

/** Shared look for text inputs, selects and textareas in recipient-facing forms. */
export function fieldClass(error, extra = '') {
  return `w-full rounded-xl border bg-white px-4 text-[15px] text-[#0B1354] outline-none transition-[border-color,box-shadow] placeholder:text-[#9AA0B4] disabled:cursor-not-allowed disabled:bg-[#F4F5F9] disabled:text-[#9AA0B4] focus:border-primary focus:shadow-[0_0_0_4px_rgba(58,16,205,0.12)] ${
    error ? 'border-[#E5484D] focus:border-[#E5484D] focus:shadow-[0_0_0_4px_rgba(229,72,77,0.12)]' : 'border-[#DDE0EA]'
  } ${extra}`;
}

export function FieldLabel({ htmlFor, children, optional }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center justify-between text-sm font-semibold text-[#0B1354]">
      <span>{children}</span>
      {optional ? <span className="text-xs font-medium text-[#8A90A6]">Optional</span> : null}
    </label>
  );
}

export function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-start gap-1.5 text-[13px] font-medium text-[#D6343A]">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
      <span>{children}</span>
    </p>
  );
}

export function FormAlert({ tone = 'error', children }) {
  if (!children) return null;
  const tones = {
    error: 'border-[#F7C9CB] bg-[#FFF3F3] text-[#B42328]',
    info: 'border-[#D6DAF5] bg-[#F3F4FF] text-[#2A2F7A]',
    success: 'border-[#BFE8D2] bg-[#EFFBF4] text-[#17734A]',
  };
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-[13px] font-medium leading-snug ${tones[tone]}`}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.25} />
      <span>{children}</span>
    </p>
  );
}
