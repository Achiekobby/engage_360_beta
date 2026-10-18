import { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { clsx } from 'clsx';
import { Images } from 'lucide-react';
import {
  ATTACHMENT_SIZE_GUIDES,
  ATTACHMENT_TYPE_OPTIONS,
} from './settingsData';
import { useSettingsKindCopy } from './settingsKindContext';
import {
  SettingsFieldError,
  SettingsLabel,
  assignUploadFields,
} from './AutomationSettingsFields';
import MediaTypeCards from './MediaTypeCards';
import UploadMediaPreview from './UploadMediaPreview';

const ACCEPT_BY_TYPE = {
  image: 'image/png,image/jpeg,image/webp',
  video: 'video/*',
  gif: 'image/gif',
};

export default function AttachmentOnlySetup() {
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const { help } = useSettingsKindCopy();
  const uploadError = Boolean(touched.attachmentName && errors.attachmentName);
  const activeType = values.attachmentType || 'image';
  const sizeGuide = ATTACHMENT_SIZE_GUIDES[activeType] || ATTACHMENT_SIZE_GUIDES.image;
  const previewUrl = values.attachmentPreviewUrl;

  useEffect(() => {
    if (!values.attachmentType) {
      setFieldValue('attachmentType', 'image');
    }
  }, [values.attachmentType, setFieldValue]);

  const handleFile = (file) => {
    assignUploadFields(setFieldValue, {
      nameKey: 'attachmentName',
      previewKey: 'attachmentPreviewUrl',
      sizeKey: 'attachmentFileSize',
      bytesKey: 'attachmentFileBytes',
      mimeKey: 'attachmentMimeType',
      file,
      previousPreviewUrl: values.attachmentPreviewUrl,
    });
  };

  return (
    <div className="space-y-5">
      <MediaTypeCards
        label="Attachment type"
        help={help.attachmentType}
        options={ATTACHMENT_TYPE_OPTIONS}
        value={activeType}
        onChange={(next) => setFieldValue('attachmentType', next)}
        errorName="attachmentType"
        centered
      />

      <div>
        <SettingsLabel htmlFor="attachment-only-upload" help={help.attachmentUpload}>
          Upload {ATTACHMENT_TYPE_OPTIONS.find((item) => item.value === activeType)?.label}
        </SettingsLabel>

        <div className="mb-3 rounded-sm border border-[#EDE8F8] bg-[#F7F8FF] px-3 py-2.5 text-[11px] leading-relaxed text-[#5B5F7B]">
          <p className="font-semibold text-[#0B1354]">Size guide</p>
          <p className="mt-1">
            Recommended {sizeGuide.dimensions} · Max {sizeGuide.maxSize} · {sizeGuide.formats}
          </p>
        </div>

        {previewUrl ? (
          <>
            <UploadMediaPreview
              previewUrl={previewUrl}
              fileName={values.attachmentName}
              fileSizeLabel={values.attachmentFileSize}
              fileBytes={values.attachmentFileBytes || 0}
              mimeType={values.attachmentMimeType}
              attachmentType={activeType}
              replaceInputId="attachment-only-upload"
              onRemove={() => {
                handleFile(null);
                const input = document.getElementById('attachment-only-upload');
                if (input) input.value = '';
              }}
            />
            <input
              id="attachment-only-upload"
              type="file"
              accept={ACCEPT_BY_TYPE[activeType] || 'image/*,video/*'}
              className="sr-only"
              onChange={(event) => handleFile(event.target.files?.[0] || null)}
            />
          </>
        ) : (
          <label
            htmlFor="attachment-only-upload"
            className={clsx(
              'flex min-h-[12rem] cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed px-4 py-8 text-center transition-colors',
              uploadError
                ? 'border-[#E5484D] bg-[#FFF5F5]'
                : 'border-[#D4D8E4] bg-[#F4F5F7] hover:border-primary/35 hover:bg-[#F7F8FF]',
            )}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              handleFile(event.dataTransfer.files?.[0] || null);
            }}
          >
            <input
              id="attachment-only-upload"
              type="file"
              accept={ACCEPT_BY_TYPE[activeType] || 'image/*,video/*'}
              className="sr-only"
              onChange={(event) => handleFile(event.target.files?.[0] || null)}
            />
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-sm">
              <Images className="h-5 w-5" strokeWidth={2} />
            </span>
            <p className="mt-3 text-sm font-semibold text-[#0B1354]">Images, Video</p>
            <p className="mt-1 text-xs text-[#717171]">Drag them over here</p>
            <p className="mt-2 text-[11px] text-[#9AA0B0]">
              {sizeGuide.dimensions} · up to {sizeGuide.maxSize}
            </p>
          </label>
        )}
        <SettingsFieldError name="attachmentName" />
      </div>
    </div>
  );
}
