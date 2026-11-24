import { clsx } from 'clsx';
import { normalizeSegment, SEGMENT_STYLES } from './collectionCustomersData';

export default function SegmentBadge({ segment, className = '' }) {
  const label = normalizeSegment(segment);

  if (!label) {
    return (
      <span
        className={clsx(
          'inline-flex max-w-full truncate rounded-sm bg-[#F4F5F7] px-2.5 py-1 text-xs font-semibold text-[#717171] ring-1 ring-[#E4E4E7]',
          className,
        )}
      >
        Not tagged
      </span>
    );
  }

  return (
    <span
      className={clsx(
        'inline-flex max-w-full truncate rounded-sm px-2.5 py-1 text-xs font-semibold ring-1',
        SEGMENT_STYLES[label] || 'bg-[#F0F2F7] text-[#717171] ring-[#717171]/15',
        className,
      )}
    >
      {label}
    </span>
  );
}
