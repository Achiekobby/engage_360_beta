import { Play } from 'lucide-react';
import { clsx } from 'clsx';

export default function WebinarPlayButton({ size = 'md', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-lg bg-[#FF0000] shadow-lg',
        size === 'lg' && 'h-16 w-24 sm:h-[72px] sm:w-[104px]',
        size === 'md' && 'h-12 w-[4.5rem] sm:h-14 sm:w-20',
        size === 'sm' && 'h-10 w-14',
        className,
      )}
      aria-hidden="true"
    >
      <Play className="ml-0.5 h-[42%] w-[42%] fill-white text-white" />
    </span>
  );
}
