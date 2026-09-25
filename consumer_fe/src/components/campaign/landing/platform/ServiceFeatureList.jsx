import { Check } from 'lucide-react';
import { clsx } from 'clsx';

export default function ServiceFeatureList({ items, variant = 'light', className }) {
  const isDark = variant === 'dark';

  return (
    <ul className={clsx('mt-5 space-y-2.5 sm:space-y-3', className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 sm:gap-3">
          <span
            className={clsx(
              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full sm:h-[1.35rem] sm:w-[1.35rem]',
              isDark
                ? 'bg-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]'
                : 'bg-gradient-to-br from-[#5F8FE0] to-[#4F7FD4] shadow-[0_2px_6px_rgba(79,127,212,0.35)]',
            )}
          >
            <Check
              className={clsx('h-3 w-3', isDark ? 'text-white' : 'text-white')}
              strokeWidth={3}
            />
          </span>
          <span
            className={clsx(
              'text-[13px] leading-snug sm:text-sm sm:leading-relaxed',
              isDark ? 'text-white/90' : 'text-[#4A5568]',
            )}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
