import { ErrorMessage, Field, useFormikContext } from 'formik';
import { AlertCircle, ChevronDown, CircleHelp, Upload } from 'lucide-react';
import { clsx } from 'clsx';
import UploadMediaPreview from './UploadMediaPreview';

export function SettingsFieldError({ name }) {
  return (
    <ErrorMessage name={name}>
      {(message) => (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-[#E5484D]">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
          <span>{message}</span>
        </p>
      )}
    </ErrorMessage>
  );
}

export function SettingsHelp({ text }) {
  if (!text) return null;

  return (
    <span className="group/help relative ml-1.5 inline-flex align-middle">
      <button
        type="button"
        className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full text-[#9AA0B0] transition-colors group-hover/help:text-primary"
        aria-label="Field help"
      >
        <CircleHelp className="h-4 w-4" strokeWidth={2.25} />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-50 hidden w-56 -translate-x-1/2 rounded-sm bg-[#0B1354] px-3 py-2 text-left text-[11px] leading-relaxed text-white shadow-[0_8px_24px_rgba(11,19,84,0.22)] group-hover/help:block sm:left-0 sm:translate-x-0"
      >
        {text}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#0B1354] sm:left-2 sm:translate-x-0" />
      </span>
    </span>
  );
}

export function SettingsLabel({ htmlFor, children, optional = false, help }) {
  return (
    <label
      htmlFor={htmlFor}
      className="relative mb-1.5 flex items-center text-sm font-semibold text-[#0B1354]"
    >
      {children}
      {optional ? <span className="ml-1 font-medium text-[#717171]">(Optional)</span> : null}
      <SettingsHelp text={help} />
    </label>
  );
}

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function assignUploadFields(setFieldValue, {
  nameKey,
  previewKey,
  sizeKey,
  bytesKey,
  mimeKey,
  file,
  previousPreviewUrl,
}) {
  if (previousPreviewUrl) URL.revokeObjectURL(previousPreviewUrl);

  if (!file) {
    setFieldValue(nameKey, '');
    setFieldValue(previewKey, '');
    setFieldValue(sizeKey, '');
    if (bytesKey) setFieldValue(bytesKey, 0);
    if (mimeKey) setFieldValue(mimeKey, '');
    return;
  }

  setFieldValue(nameKey, file.name);
  setFieldValue(previewKey, URL.createObjectURL(file));
  setFieldValue(sizeKey, formatFileSize(file.size));
  if (bytesKey) setFieldValue(bytesKey, file.size);
  if (mimeKey) setFieldValue(mimeKey, file.type || '');
}

export function SettingsTextField({
  id,
  name,
  label,
  placeholder,
  optional = false,
  type = 'text',
  help,
}) {
  const { errors, touched } = useFormikContext();
  const hasError = Boolean(touched[name] && errors[name]);

  return (
    <div>
      <SettingsLabel htmlFor={id} optional={optional} help={help}>
        {label}
      </SettingsLabel>
      <Field
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className={clsx(
          'w-full rounded-sm border bg-white px-3.5 py-2.5 text-sm text-[#0B1354] outline-none transition-all placeholder:text-[#9AA0B0] focus:ring-2 focus:ring-primary/10',
          hasError
            ? 'border-[#E5484D] focus:border-[#E5484D]'
            : 'border-[#E4E4E7] focus:border-primary/40',
        )}
      />
      <SettingsFieldError name={name} />
    </div>
  );
}

export function SettingsSelectField({
  id,
  name,
  label,
  placeholder,
  options,
  optional = false,
  help,
}) {
  const { errors, touched } = useFormikContext();
  const hasError = Boolean(touched[name] && errors[name]);

  return (
    <div>
      <SettingsLabel htmlFor={id} optional={optional} help={help}>
        {label}
      </SettingsLabel>
      <div className="relative">
        <Field
          as="select"
          id={id}
          name={name}
          className={clsx(
            'w-full cursor-pointer appearance-none rounded-sm border bg-white px-3.5 py-2.5 pr-10 text-sm text-[#0B1354] outline-none transition-all focus:ring-2 focus:ring-primary/10',
            hasError
              ? 'border-[#E5484D] focus:border-[#E5484D]'
              : 'border-[#E4E4E7] focus:border-primary/40',
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Field>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717171]"
          strokeWidth={2}
        />
      </div>
      <SettingsFieldError name={name} />
    </div>
  );
}

export function SettingsTextArea({
  id,
  name,
  label,
  placeholder,
  rows = 4,
  optional = false,
  help,
  fillHeight = false,
}) {
  const { errors, touched } = useFormikContext();
  const hasError = Boolean(touched[name] && errors[name]);

  return (
    <div className={clsx(fillHeight && 'flex h-full flex-col')}>
      <SettingsLabel htmlFor={id} optional={optional} help={help}>
        {label}
      </SettingsLabel>
      <Field
        as="textarea"
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        className={clsx(
          'w-full rounded-sm border bg-white px-3.5 py-2.5 text-sm text-[#0B1354] outline-none transition-all placeholder:text-[#9AA0B0] focus:ring-2 focus:ring-primary/10',
          fillHeight ? 'min-h-[9.5rem] flex-1 resize-none' : 'resize-y',
          hasError
            ? 'border-[#E5484D] focus:border-[#E5484D]'
            : 'border-[#E4E4E7] focus:border-primary/40',
        )}
      />
      <SettingsFieldError name={name} />
    </div>
  );
}

export function SettingsUploadField({
  id,
  name,
  label,
  optional = false,
  accept = 'image/*,video/*',
  help,
  previewKey,
  sizeKey,
  bytesKey,
  mimeKey,
  sizeGuide,
  attachmentType = 'image',
}) {
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const hasError = Boolean(touched[name] && errors[name]);
  const fileName = values[name];
  const previewUrl = previewKey ? values[previewKey] : '';
  const fileSize = sizeKey ? values[sizeKey] : '';
  const fileBytes = bytesKey ? values[bytesKey] || 0 : 0;
  const mimeType = mimeKey ? values[mimeKey] : '';

  const applyFile = (file) => {
    assignUploadFields(setFieldValue, {
      nameKey: name,
      previewKey,
      sizeKey,
      bytesKey,
      mimeKey,
      file,
      previousPreviewUrl: previewUrl,
    });
  };

  return (
    <div className="flex h-full flex-col">
      <SettingsLabel htmlFor={id} optional={optional} help={help}>
        {label}
      </SettingsLabel>

      {previewUrl ? (
        <>
          <UploadMediaPreview
            previewUrl={previewUrl}
            fileName={fileName}
            fileSizeLabel={fileSize}
            fileBytes={fileBytes}
            mimeType={mimeType}
            attachmentType={attachmentType}
            replaceInputId={id}
            onRemove={() => {
              applyFile(null);
              const input = document.getElementById(id);
              if (input) input.value = '';
            }}
          />
          <input
            id={id}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(event) => applyFile(event.target.files?.[0] || null)}
          />
        </>
      ) : (
        <label
          htmlFor={id}
          className={clsx(
            'flex min-h-[9.5rem] flex-1 cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed px-4 py-5 text-center transition-colors',
            hasError
              ? 'border-[#E5484D] bg-[#FFF5F5]'
              : 'border-[#D4D8E4] bg-[#FAFBFC] hover:border-primary/35 hover:bg-[#F7F8FF]',
          )}
        >
          <input
            id={id}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(event) => applyFile(event.target.files?.[0] || null)}
          />
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE8F8] text-primary">
            <Upload className="h-4 w-4" strokeWidth={2} />
          </span>
          <p className="mt-3 text-sm font-semibold text-[#0B1354]">Images, Video</p>
          <p className="mt-1 text-xs text-[#717171]">Click to upload</p>
          {sizeGuide ? (
            <p className="mt-3 max-w-[16rem] text-[11px] leading-relaxed text-[#717171]">
              Recommended {sizeGuide.dimensions} · Max {sizeGuide.maxSize} · {sizeGuide.formats}
            </p>
          ) : null}
        </label>
      )}
      <SettingsFieldError name={name} />
    </div>
  );
}

export function SettingsSection({ title, actions, children, showBody = true }) {
  return (
    <section className="rounded-sm border border-[#EEF0F4] bg-white p-5 shadow-[0_4px_20px_rgba(11,19,84,0.04)] sm:p-6 lg:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-base font-bold text-primary sm:text-lg">{title}</h2>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div className="mt-3 h-px w-full bg-[#EDE8F8]" aria-hidden="true" />
      {showBody && children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}

export function ToolbarSelect({
  value,
  onChange,
  options,
  ariaLabel,
  hasError = false,
  minWidthClass = 'min-w-[10.5rem]',
}) {
  return (
    <div className={clsx('relative', minWidthClass)}>
      <select
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
        className={clsx(
          'w-full cursor-pointer appearance-none rounded-full border bg-white py-2 pl-4 pr-10 text-sm font-semibold outline-none transition-colors',
          hasError
            ? 'border-[#E5484D] text-[#E5484D]'
            : 'border-[#E4E4E7] text-[#0B1354] hover:border-primary/30',
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717171]"
        strokeWidth={2.25}
      />
    </div>
  );
}
