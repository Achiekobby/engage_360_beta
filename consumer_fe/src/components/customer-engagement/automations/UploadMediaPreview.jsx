import { useEffect, useState } from 'react';
import { CheckCircle2, Trash2, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { ATTACHMENT_SIZE_GUIDES } from './settingsData';

function readMediaDimensions(previewUrl, isVideo) {
  return new Promise((resolve) => {
    if (!previewUrl) {
      resolve({ width: 0, height: 0 });
      return;
    }

    if (isVideo) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve({
          width: video.videoWidth || 0,
          height: video.videoHeight || 0,
        });
        video.remove();
      };
      video.onerror = () => {
        resolve({ width: 0, height: 0 });
        video.remove();
      };
      video.src = previewUrl;
      return;
    }

    const image = new Image();
    image.onload = () => {
      resolve({
        width: image.naturalWidth || 0,
        height: image.naturalHeight || 0,
      });
    };
    image.onerror = () => resolve({ width: 0, height: 0 });
    image.src = previewUrl;
  });
}

function evaluateAcceptance({
  sizeGuide,
  fileBytes,
  mimeType,
  width,
  height,
  attachmentType,
}) {
  const issues = [];

  if (sizeGuide?.acceptMimes?.length && mimeType) {
    const mimeOk =
      sizeGuide.acceptMimes.includes(mimeType) ||
      (attachmentType === 'video' && mimeType.startsWith('video/')) ||
      (attachmentType === 'image' &&
        ['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) ||
      (attachmentType === 'gif' && mimeType === 'image/gif');

    if (!mimeOk) {
      issues.push(`Format should be ${sizeGuide.formats}`);
    }
  }

  if (sizeGuide?.maxBytes && fileBytes > sizeGuide.maxBytes) {
    issues.push(`File exceeds max size of ${sizeGuide.maxSize}`);
  }

  if (
    width > 0 &&
    height > 0 &&
    sizeGuide?.recommendedWidth &&
    sizeGuide?.recommendedHeight
  ) {
    const widthDiff = Math.abs(width - sizeGuide.recommendedWidth) / sizeGuide.recommendedWidth;
    const heightDiff =
      Math.abs(height - sizeGuide.recommendedHeight) / sizeGuide.recommendedHeight;

    if (widthDiff > 0.15 || heightDiff > 0.15) {
      issues.push(`Dimensions differ from recommended ${sizeGuide.dimensions}`);
    }
  }

  const hardFail = issues.some(
    (issue) => issue.startsWith('File exceeds') || issue.startsWith('Format should'),
  );

  return {
    acceptable: !hardFail,
    warningOnly: !hardFail && issues.length > 0,
    issues,
  };
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[#F0F2F7] py-2 last:border-b-0">
      <span className="text-xs font-medium text-[#717171]">{label}</span>
      <span className="max-w-[60%] text-right text-xs font-semibold text-[#0B1354] break-all">
        {value}
      </span>
    </div>
  );
}

export default function UploadMediaPreview({
  previewUrl,
  fileName,
  fileSizeLabel,
  fileBytes = 0,
  mimeType = '',
  attachmentType = 'image',
  replaceInputId,
  onRemove,
}) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const sizeGuide = ATTACHMENT_SIZE_GUIDES[attachmentType] || ATTACHMENT_SIZE_GUIDES.image;
  const isVideo =
    attachmentType === 'video' || Boolean(mimeType?.startsWith('video/'));

  useEffect(() => {
    let active = true;

    readMediaDimensions(previewUrl, isVideo).then((result) => {
      if (active) setDimensions(result);
    });

    return () => {
      active = false;
    };
  }, [previewUrl, isVideo]);

  const acceptance = evaluateAcceptance({
    sizeGuide,
    fileBytes,
    mimeType,
    width: dimensions.width,
    height: dimensions.height,
    attachmentType,
  });

  const dimensionLabel =
    dimensions.width && dimensions.height
      ? `${dimensions.width} × ${dimensions.height} px`
      : 'Reading…';

  return (
    <div className="overflow-hidden rounded-sm border border-[#E4E4E7] bg-white">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="flex min-h-[14rem] bg-[#F4F5F7] p-3 md:h-full md:border-r md:border-[#E4E4E7]">
          <div className="flex min-h-[12.5rem] w-full flex-1 overflow-hidden rounded-sm border-2 border-[#0B1354]/20 bg-white shadow-[inset_0_0_0_1px_rgba(11,19,84,0.08)]">
            {isVideo ? (
              <video
                src={previewUrl}
                controls
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={previewUrl}
                alt={fileName || 'Upload preview'}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between p-4 sm:p-5">
          <div>
            <p className="text-sm font-bold text-[#0B1354]">Upload details</p>
            <div className="mt-3">
              <DetailRow label="Name" value={fileName || '—'} />
              <DetailRow label="Size" value={fileSizeLabel || '—'} />
              <DetailRow label="Dimensions" value={dimensionLabel} />
              <DetailRow label="Guide" value={sizeGuide.dimensions} />
              <DetailRow label="Max size" value={sizeGuide.maxSize} />
            </div>

            <div
              className={clsx(
                'mt-4 rounded-sm px-3 py-2.5',
                acceptance.acceptable
                  ? acceptance.warningOnly
                    ? 'bg-[#FFF8E1] text-[#C9A227]'
                    : 'bg-[#E8F8EF] text-[#1F9D55]'
                  : 'bg-[#FFF5F5] text-[#E5484D]',
              )}
            >
              <div className="flex items-start gap-2">
                {acceptance.acceptable ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.25} />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.25} />
                )}
                <div>
                  <p className="text-xs font-bold">
                    {acceptance.acceptable
                      ? acceptance.warningOnly
                        ? 'Acceptable with warnings'
                        : 'Acceptable'
                      : 'Not acceptable'}
                  </p>
                  {acceptance.issues.length ? (
                    <ul className="mt-1 space-y-0.5 text-[11px] leading-relaxed">
                      {acceptance.issues.map((issue) => (
                        <li key={issue}>• {issue}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-[11px] leading-relaxed">
                      File matches the recommended size and format guide.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {replaceInputId || onRemove ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {replaceInputId ? (
                <label
                  htmlFor={replaceInputId}
                  className="inline-flex cursor-pointer text-sm font-semibold text-primary hover:text-primary/80"
                >
                  Replace file
                </label>
              ) : null}
              {onRemove ? (
                <button
                  type="button"
                  onClick={onRemove}
                  className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-[#E5484D] transition-colors hover:text-[#C53B40]"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2.25} />
                  Remove
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
