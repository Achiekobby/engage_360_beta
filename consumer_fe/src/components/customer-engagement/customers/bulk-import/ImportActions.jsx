import {
  Download,
  Loader2,
  RefreshCw,
  Upload,
  Wand2,
} from 'lucide-react';
import { clsx } from 'clsx';
import { IMPORT_STATUSES } from '../../../../utils/contact-import/constants';

export default function ImportActions({
  status,
  canAutoFix,
  canImport,
  validation,
  fileSelected = false,
  onDownloadTemplate,
  onAutoFix,
  onDownloadCleaned,
  onReupload,
  onImport,
  busy = false,
}) {
  const importing = status === IMPORT_STATUSES.UPLOADING;
  const hasValidation = Boolean(validation);
  const hasInvalidRows =
    (validation?.invalidRows || 0) > 0 || (validation?.emptyRows || 0) > 0;
  const showFileActions = Boolean(onReupload) && (fileSelected || hasValidation);

  return (
    <div className="space-y-3">
      {canImport && validation ? (
        <div className="rounded-sm border border-[#D1FAE5] bg-[#ECFDF5] px-4 py-3 text-sm text-[#047857]">
          <span className="font-semibold">
            {validation.validRows.toLocaleString()} contact
            {validation.validRows === 1 ? '' : 's'}
          </span>{' '}
          {validation.validRows === 1 ? 'is' : 'are'} ready to import.
          {validation.customColumns?.length ? (
            <>
              {' '}
              <span className="font-semibold">
                {validation.customColumns.length} custom column
                {validation.customColumns.length === 1 ? '' : 's'}
              </span>{' '}
              will also be imported.
            </>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={onDownloadTemplate}
          disabled={busy}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#0B1354] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" strokeWidth={2} />
          Download template
        </button>

        {hasValidation && hasInvalidRows && canAutoFix ? (
          <button
            type="button"
            onClick={onAutoFix}
            disabled={busy}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-[#C9E8E3] bg-[#F0FAF8] px-3.5 py-2.5 text-sm font-semibold text-[#0F766E] transition-colors hover:bg-[#E6F7F4] disabled:cursor-not-allowed disabled:opacity-50"
          >
                {status === IMPORT_STATUSES.FIXING ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                ) : (
                  <Wand2 className="h-4 w-4" strokeWidth={2} />
                )}
                Fix automatically
          </button>
        ) : null}

        {hasValidation && hasInvalidRows ? (
          <button
            type="button"
            onClick={onDownloadCleaned}
            disabled={busy}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#0B1354] transition-colors hover:border-[#0F766E]/30 hover:bg-[#F0FAF8] hover:text-[#0F766E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            Download cleaned Excel
          </button>
        ) : null}

        {showFileActions ? (
          <button
            type="button"
            onClick={onReupload}
            disabled={busy}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#717171] transition-colors hover:border-[#0B1354]/20 hover:text-[#0B1354] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" strokeWidth={2} />
            {hasInvalidRows ? 'Re-upload corrected file' : 'Remove & upload new file'}
          </button>
        ) : null}

        <button
          type="button"
          onClick={onImport}
          disabled={busy || !canImport}
          className={clsx(
            'inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:ml-auto',
            canImport
              ? 'bg-primary shadow-[0_4px_16px_rgba(58,16,205,0.28)] hover:-translate-y-0.5 hover:bg-[#320EB8]'
              : 'bg-[#C4C4C4]',
          )}
        >
          {importing ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
          ) : (
            <Upload className="h-4 w-4" strokeWidth={2.5} />
          )}
          {importing ? 'Importing…' : 'Import contacts'}
        </button>
      </div>
    </div>
  );
}
