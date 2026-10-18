import { clsx } from 'clsx';

export default function AutomationMetaBadge({
  icon: Icon,
  label,
  className,
  classNameExtra,
  align = 'center',
}) {
  return (
    <span
      className={clsx(
        'inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold leading-none',
        align === 'start' ? 'justify-start' : 'justify-center',
        className,
        classNameExtra,
      )}
    >
      {Icon ? <Icon className="h-3 w-3 shrink-0" strokeWidth={2.25} /> : null}
      <span className="truncate">{label}</span>
    </span>
  );
}
