import { useCallback, useRef, useState } from 'react';
import { FileSpreadsheet, RefreshCw, Trash2, UploadCloud } from 'lucide-react';
import { clsx } from 'clsx';
import { isAcceptedExcelFile } from '../../../../services/customer-engagement/contactImport';

export default function ExcelUploader({
  disabled = false,
  fileMeta = null,
  onFileSelected,
  onRemoveFile,
  onRejected,
}) {
  const inputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (fileList) => {
      const file = fileList?.[0];
      if (!file) return;
      if (!isAcceptedExcelFile(file)) {
        onRejected?.('Only .xlsx or .xls Excel files are supported.');
        return;
      }
      onFileSelected?.(file);
    },
    [onFileSelected, onRejected],
  );

  if (fileMeta) {
    return (
      <div className="space-y-3">
        <div className="flex flex-col gap-3 rounded-sm border border-[#C9E8E3] bg-[#F7FBFA] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#E6F7F4] text-[#0F766E]">
              <FileSpreadsheet className="h-5 w-5" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#0B1354]">{fileMeta.name}</p>
              <p className="text-xs font-medium text-[#8B92A5]">
                {fileMeta.sizeLabel} · Selected for validation
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => replaceInputRef.current?.click()}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-[#E4E4E7] bg-white px-3 py-2 text-xs font-semibold text-[#0B1354] transition-colors hover:border-[#0F766E]/30 hover:bg-white hover:text-[#0F766E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
              Replace file
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onRemoveFile?.()}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-[#E4E4E7] bg-white px-3 py-2 text-xs font-semibold text-[#717171] transition-colors hover:border-[#E53935]/30 hover:bg-[#FEECEC] hover:text-[#E53935] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
              Remove
            </button>
            <input
              ref={replaceInputRef}
              type="file"
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              className="hidden"
              disabled={disabled}
              onChange={(event) => {
                handleFiles(event.target.files);
                event.target.value = '';
              }}
            />
          </div>
        </div>
        <p className="text-xs text-[#717171]">
          Remove this file to start over, or replace it with another Excel spreadsheet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (disabled) return;
          handleFiles(event.dataTransfer.files);
        }}
        className={clsx(
          'group relative flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-sm border border-dashed px-5 py-10 text-center transition-all',
          dragging
            ? 'border-[#0F766E] bg-[#F0FAF8] shadow-[0_8px_28px_rgba(15,118,110,0.12)]'
            : 'border-[#C9E8E3] bg-gradient-to-br from-white via-[#F7FBFA] to-[#EEF8F6] hover:border-[#0F766E]/45 hover:bg-[#F7FBFA]',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-sm bg-gradient-to-br from-[#0F766E] to-[#14B8A6] text-white shadow-[0_8px_24px_rgba(15,118,110,0.28)]">
          <UploadCloud className="h-6 w-6" strokeWidth={2.25} />
        </span>
        <p className="mt-4 text-base font-bold text-[#0B1354]">
          Drag & drop your Excel file here
        </p>
        <p className="mt-1 max-w-md text-sm text-[#5C7A76]">
          or click to browse. Accepts <span className="font-semibold">.xlsx</span> and{' '}
          <span className="font-semibold">.xls</span> only.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          className="hidden"
          disabled={disabled}
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </button>
    </div>
  );
}
