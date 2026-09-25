import { clsx } from 'clsx';
import { SEGMENT_STYLES } from './collectionCustomersData';

export default function SegmentBadge({ segment, className = '' }) {
  return (
    <span
      className={clsx(
        'inline-flex max-w-full truncate rounded-sm px-2.5 py-1 text-xs font-semibold ring-1 sm:text-sm',
        SEGMENT_STYLES[segment] || 'bg-[#F0F2F7] text-[#717171] ring-[#717171]/15',
        className,
      )}
    >
      {segment}
    </span>
  );
}
