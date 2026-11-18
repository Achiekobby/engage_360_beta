import { motion } from 'framer-motion';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Eye,
  FileSpreadsheet,
  UserPlus,
  Loader2,
  Upload,
  Users,
} from 'lucide-react';
import { clsx } from 'clsx';
import { BULK_UPLOAD_STATUS } from './collectionBulkUploadsData';
import RowActionMenu from './RowActionMenu';

const COLUMNS = [
  { key: 'file', label: 'Upload file', hint: 'XLSX only', align: 'left', className: 'min-w-[16rem] w-[34%]' },
  { key: 'rows', label: 'Rows', hint: 'Imported', align: 'right', className: 'min-w-[6rem] w-[12%]' },
  { key: 'result', label: 'Result', hint: 'Success / failed', align: 'left', className: 'min-w-[9rem] w-[16%]' },
  { key: 'status', label: 'Status', hint: 'Processing state', align: 'left', className: 'min-w-[7.5rem] w-[12%]' },
  { key: 'date', label: 'Uploaded', hint: 'Date & time', align: 'left', className: 'min-w-[11.5rem] w-[16%]' },
  { key: 'actions', label: 'Actions', hint: 'Open', align: 'right', className: 'min-w-[5.5rem] w-[8%]' },
];

function StatusIcon({ status }) {
  if (status === 'pending' || status === 'processing') {
    return <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.25} aria-hidden="true" />;
  }
  if (status === 'failed') {
    return <AlertCircle className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />;
  }
  if (status === 'partial') {
    return <AlertCircle className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />;
  }
  return <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />;
}

export default function CollectionBulkUploadsPanel({
  uploads,
  isLoading = false,
  error = '',
  onRetry,
  onSelectUpload,
  onAddCustomer,
  onViewAll,
  onBulkUpload,
}) {
  if (isLoading && !uploads.length) {
    return (
      <section className="rounded-sm border border-[#EEF0F4] bg-white px-5 py-12 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#0F766E]" strokeWidth={2} />
        <p className="mt-3 text-sm text-[#717171]">Loading uploads…</p>
      </section>
    );
  }

  if (error && !uploads.length) {
    return (
      <section className="rounded-sm border border-[#F5D0D0] bg-[#FFF7F7] px-5 py-12 text-center">
        <h2 className="text-lg font-bold text-[#0B1354]">Uploads could not be loaded</h2>
        <p className="mt-1 text-sm text-[#B42318]">{error}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex cursor-pointer rounded-sm border border-[#F5D0D0] bg-white px-4 py-2 text-sm font-semibold text-[#B42318]"
          >
            Try again
          </button>
        ) : null}
      </section>
    );
  }

  if (!uploads.length) {
    return (
      <section className="overflow-hidden rounded-sm border border-dashed border-[#C9E8E3] bg-gradient-to-br from-white via-[#F7FBFA] to-[#EEF8F6] px-5 py-12 text-center shadow-[0_4px_20px_rgba(15,118,110,0.06)] sm:px-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-sm bg-gradient-to-br from-[#0F766E] to-[#14B8A6] text-white shadow-[0_8px_24px_rgba(15,118,110,0.28)]">
          <Upload className="h-6 w-6" strokeWidth={2.25} />
        </div>
        <h2 className="mt-4 text-lg font-bold text-[#0B1354]">No bulk uploads yet</h2>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-[#5C7A76]">
          Upload an XLSX file to add contacts to this collection. Your import history will show up
          here first.
        </p>
        {onBulkUpload ? (
          <button
            type="button"
            onClick={onBulkUpload}
            className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-sm bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(15,118,110,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#0D9488]"
          >
            <FileSpreadsheet className="h-4 w-4" strokeWidth={2} />
            Upload XLSX file
          </button>
        ) : null}
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)]">
      <div className="flex flex-col gap-3 border-b border-[#F0F2F7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-base font-bold text-[#0B1354] sm:text-lg">Bulk uploads</h2>
          <p className="mt-0.5 text-sm text-[#717171]">
            XLSX imports for this collection. Open one to review its contacts, or view all together.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-sm bg-[#E6F7F4] px-2.5 py-1 text-xs font-semibold text-[#0F766E] ring-1 ring-[#0F766E]/15">
            <FileSpreadsheet className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            {uploads.length} {uploads.length === 1 ? 'file' : 'files'}
          </span>
          {onViewAll ? (
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-[#E4E4E7] bg-white px-3 py-2 text-xs font-semibold text-[#0B1354] transition-all hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary"
            >
              <Users className="h-3.5 w-3.5" strokeWidth={2} />
              View all
            </button>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] table-fixed border-collapse">
          <caption className="sr-only">Bulk XLSX uploads for this collection</caption>
          <thead>
            <tr className="border-b border-[#E8EBF2] bg-gradient-to-b from-[#F8F9FC] to-[#F3F5FA]">
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={clsx(
                    'px-4 py-3.5 first:pl-6 last:pr-6 sm:px-5',
                    column.align === 'right' ? 'text-right' : 'text-left',
                    column.className,
                  )}
                >
                  <div
                    className={clsx(
                      'flex flex-col gap-0.5',
                      column.align === 'right' ? 'items-end' : 'items-start',
                    )}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5C647A]">
                      {column.label}
                    </span>
                    <span className="text-[10px] font-medium tracking-wide text-[#9AA0B0]">
                      {column.hint}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload, index) => {
              const statusMeta = BULK_UPLOAD_STATUS[upload.status] || BULK_UPLOAD_STATUS.completed;

              return (
                <motion.tr
                  key={upload.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.28,
                    delay: Math.min(index, 8) * 0.03,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group border-b border-[#F0F2F7] transition-colors last:border-b-0 hover:bg-[#F7FBFA]/80 even:bg-[#FAFBFC]/55"
                >
                  <td className="relative px-4 py-4 first:pl-6 sm:px-5">
                    <span
                      className="absolute inset-y-2 left-0 w-[3px] scale-y-0 rounded-r-full bg-[#0F766E] transition-transform duration-200 group-hover:scale-y-100"
                      aria-hidden="true"
                    />
                    <div className="flex min-w-0 items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[#E6F7F4] text-[#0F766E] ring-1 ring-[#0F766E]/10">
                        <FileSpreadsheet className="h-5 w-5" strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-bold leading-snug text-[#0B1354]">
                          {upload.fileName}
                        </p>
                        <p className="mt-1 truncate text-xs font-medium text-[#8B92A5]">
                          {upload.fileSizeLabel}
                          {upload.storedFileName && upload.storedFileName !== upload.fileName
                            ? ` · ${upload.storedFileName}`
                            : ` · ${upload.uploadedBy}`}
                        </p>
                        {upload.errorMessage ? (
                          <p className="mt-1 truncate text-xs font-medium text-[#E53935]" title={upload.errorMessage}>
                            {upload.errorMessage}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-right sm:px-5">
                    <span className="inline-flex items-center justify-end gap-1.5 tabular-nums text-[15px] font-bold text-[#0B1354]">
                      <Users className="h-3.5 w-3.5 text-[#9AA0B0]" strokeWidth={2} aria-hidden="true" />
                      {upload.rowCount}
                    </span>
                  </td>

                  <td className="px-4 py-4 sm:px-5">
                    <p className="text-sm font-semibold text-[#0B1354]">
                      <span className="text-[#1F9D55]">{upload.successCount}</span>
                      <span className="mx-1 text-[#D4D4D8]">/</span>
                      <span className={upload.failedCount ? 'text-[#E53935]' : 'text-[#9AA0B0]'}>
                        {upload.failedCount}
                      </span>
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-[#9AA0B0]">ok / failed</p>
                  </td>

                  <td className="px-4 py-4 sm:px-5">
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
                        statusMeta.className,
                      )}
                    >
                      <StatusIcon status={upload.status} />
                      {statusMeta.label}
                    </span>
                  </td>

                  <td className="px-4 py-4 sm:px-5">
                    <div className="inline-flex items-start gap-2">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#F0F2F7] text-[#717171]">
                        <Calendar className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="whitespace-nowrap text-sm font-semibold text-[#0B1354]">
                          {upload.uploadedAt}
                        </p>
                        <p className="mt-0.5 text-[11px] font-medium text-[#9AA0B0]">
                          {upload.processedAt ? `Processed ${upload.processedAt}` : 'XLSX import'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-right last:pr-6 sm:px-5">
                    <div className="flex justify-end">
                      <RowActionMenu
                        label={`Actions for ${upload.fileName}`}
                        items={[
                          onAddCustomer
                            ? {
                                key: 'add',
                                label: 'Add customer',
                                icon: UserPlus,
                                onSelect: () => onAddCustomer(upload),
                              }
                            : null,
                          {
                            key: 'view',
                            label: 'View contacts',
                            icon: Eye,
                            onSelect: () => onSelectUpload?.(upload),
                          },
                        ]}
                      />
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
