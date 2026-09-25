import { clsx } from 'clsx';

export function isVideoPromoVisual(promoVisual, mimeType = '') {
  if (mimeType.startsWith('video/')) return true;
  if (mimeType.startsWith('image/')) return false;
  return promoVisual === 'video';
}

export default function PromoVisualPreview({
  promoVisual = 'image',
  previewUrl,
  fileName,
  fileMimeType = '',
  className,
  emptyLabel = 'Upload a file to see the promo visual preview.',
  compact = false,
}) {
  if (!previewUrl) {
    return (
      <div
        className={clsx(
          'flex items-center justify-center rounded-sm border border-dashed border-[#E4E4E7] bg-[#FAFBFC] px-4 text-center text-sm text-[#9AA0B0]',
          compact ? 'min-h-[8rem]' : 'min-h-[11rem]',
          className,
        )}
      >
        {emptyLabel}
      </div>
    );
  }

  const isVideo = isVideoPromoVisual(promoVisual, fileMimeType);

  return (
    <div
      className={clsx(
        'overflow-hidden rounded-sm border border-[#E4E4E7] bg-[#0B1354]/5',
        compact ? 'min-h-[8rem]' : 'min-h-[11rem]',
        className,
      )}
    >
      {isVideo ? (
        <video
          src={previewUrl}
          controls
          className="h-full max-h-56 w-full object-contain"
          aria-label={fileName || 'Promo video preview'}
        />
      ) : (
        <img
          src={previewUrl}
          alt={fileName || 'Promo visual preview'}
          className="h-full max-h-56 w-full object-contain"
        />
      )}
    </div>
  );
}
