import { useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { clsx } from 'clsx';
import { FieldError, FieldLabel } from './WizardFormField';
import {
  useCustomerListValidation,
  VALIDATION_ERROR,
  VALIDATION_SUCCESS,
  VALIDATION_VALIDATING,
} from './useCustomerListValidation';

const ACCEPT_ATTR =
  '.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';

export default function CustomerListUploadZone({
  id = 'external-customer-list',
  file,
  fileName,
  onFileSelect,
  onValidationChange,
  error,
  help,
}) {
  const { status, result, error: validationError, validateFile, reset } = useCustomerListValidation();

  useEffect(() => {
    if (file) {
      validateFile(file);
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    if (status === VALIDATION_SUCCESS) {
      onValidationChange?.({ status: 'success', ...result });
    } else if (status === VALIDATION_ERROR) {
      onValidationChange?.({ status: 'error', message: validationError });
    } else {
      onValidationChange?.(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, result, validationError]);

  const handleFile = (selectedFile) => {
    if (selectedFile) onFileSelect(selectedFile);
  };

  return (
    <div className="flex h-full flex-col">
      <FieldLabel htmlFor={id} help={help}>
        Upload Customer List
      </FieldLabel>

      {!fileName ? (
        <label
          htmlFor={id}
          className={clsx(
            'flex min-h-[11rem] flex-1 cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed px-4 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-colors',
            error
              ? 'border-[#E5484D] bg-[#FFF5F5]'
              : 'border-[#8E96A8] bg-[#EEF1F6] hover:border-primary/70 hover:bg-[#E8EDFF]',
          )}
        >
          <input
            id={id}
            type="file"
            className="sr-only"
            accept={ACCEPT_ATTR}
            onChange={(event) => handleFile(event.target.files?.[0] || null)}
          />
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#C5D9E8] bg-[#E8F4FC] text-[#2E7DAD] shadow-sm">
            <FileSpreadsheet className="h-5 w-5" strokeWidth={2} />
          </span>
          <p className="mt-3 text-sm font-semibold text-[#0B1354]">Excel files only</p>
          <p className="mt-1 text-xs text-[#717171]">.xlsx or .xls — Click here to upload</p>
        </label>
      ) : (
        <div
          className={clsx(
            'flex min-h-[11rem] flex-1 flex-col justify-between rounded-sm border-2 px-4 py-4 shadow-sm transition-colors',
            status === VALIDATION_ERROR
              ? 'border-[#E5484D] bg-[#FFF5F5]'
              : status === VALIDATION_SUCCESS
                ? 'border-[#1F9D55] bg-[#F0FFF5]'
                : 'border-[#8E96A8] bg-white',
          )}
        >
          <div className="flex items-start gap-3">
            <span
              className={clsx(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-sm',
                status === VALIDATION_ERROR
                  ? 'bg-[#FFE3E3] text-[#E5484D]'
                  : status === VALIDATION_SUCCESS
                    ? 'bg-[#E8F8EF] text-[#1F9D55]'
                    : 'bg-[#EDE8F8] text-primary',
              )}
            >
              {status === VALIDATION_VALIDATING ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              ) : status === VALIDATION_SUCCESS ? (
                <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
              ) : status === VALIDATION_ERROR ? (
                <AlertTriangle className="h-4 w-4" strokeWidth={2} />
              ) : (
                <FileSpreadsheet className="h-4 w-4" strokeWidth={2} />
              )}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#0B1354]">{fileName}</p>
              {status === VALIDATION_VALIDATING ? (
                <p className="mt-0.5 text-xs text-[#717171]">
                  Validating on a background thread…
                </p>
              ) : status === VALIDATION_SUCCESS && result ? (
                <p className="mt-0.5 text-xs text-[#1F9D55]">
                  {result.validRows.toLocaleString()} of {result.totalRows.toLocaleString()} rows
                  are ready to use
                </p>
              ) : status === VALIDATION_ERROR ? (
                <p className="mt-0.5 text-xs text-[#E5484D]">{validationError}</p>
              ) : null}
            </div>
          </div>

          {status === VALIDATION_SUCCESS && result ? (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-sm border border-[#C8CDD8] bg-white px-3 py-2 text-center shadow-sm">
                <p className="text-[11px] text-[#717171]">Valid</p>
                <p className="text-base font-bold text-[#1F9D55]">{result.validRows}</p>
              </div>
              <div className="rounded-sm border border-[#C8CDD8] bg-white px-3 py-2 text-center shadow-sm">
                <p className="text-[11px] text-[#717171]">Invalid</p>
                <p className="text-base font-bold text-[#E5484D]">{result.invalidRows}</p>
              </div>
            </div>
          ) : null}

          {status === VALIDATION_SUCCESS && result?.errors?.length > 0 ? (
            <ul className="mt-3 max-h-20 space-y-1 overflow-y-auto rounded-sm border border-[#C8CDD8] bg-white px-3 py-2 text-[11px] text-[#717171] shadow-sm">
              {result.errors.slice(0, 5).map((item) => (
                <li key={item.row}>
                  Row {item.row}: {item.reason}
                </li>
              ))}
            </ul>
          ) : null}

          <label
            htmlFor={id}
            className="mt-3 inline-flex w-fit cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <RotateCcw className="h-3 w-3" strokeWidth={2.5} />
            Replace file
            <input
              id={id}
              type="file"
              className="sr-only"
              accept={ACCEPT_ATTR}
              onChange={(event) => handleFile(event.target.files?.[0] || null)}
            />
          </label>
        </div>
      )}

      <FieldError message={error} />
    </div>
  );
}
