import {
  AlertTriangle,
  CheckCircle2,
  Columns3,
  FileSpreadsheet,
  Loader2,
  Rows3,
  XCircle,
} from 'lucide-react';
import { clsx } from 'clsx';
import { IMPORT_STATUSES } from '../../../../utils/contact-import/constants';

const STATUS_META = {
  [IMPORT_STATUSES.IDLE]: { label: 'Ready', className: 'bg-[#F0F2F7] text-[#717171]' },
  [IMPORT_STATUSES.READY]: { label: 'Ready', className: 'bg-[#F0F2F7] text-[#717171]' },
  [IMPORT_STATUSES.PARSING]: {
    label: 'Parsing',
    className: 'bg-[#E8F4FC] text-[#2E7DAD]',
    spinning: true,
  },
  [IMPORT_STATUSES.VALIDATING]: {
    label: 'Validating',
    className: 'bg-[#E8F4FC] text-[#2E7DAD]',
    spinning: true,
  },
  [IMPORT_STATUSES.VALID]: { label: 'Valid', className: 'bg-[#E8F8EF] text-[#1F9D55]' },
  [IMPORT_STATUSES.NEEDS_ATTENTION]: {
    label: 'Needs attention',
    className: 'bg-[#FFF4E8] text-[#C56A12]',
  },
  [IMPORT_STATUSES.FIXING]: {
    label: 'Fixing',
    className: 'bg-[#E8F4FC] text-[#2E7DAD]',
    spinning: true,
  },
  [IMPORT_STATUSES.READY_TO_UPLOAD]: {
    label: 'Ready to upload',
    className: 'bg-[#E8F8EF] text-[#1F9D55]',
  },
  [IMPORT_STATUSES.UPLOADING]: {
    label: 'Uploading',
    className: 'bg-[#EDE8F8] text-primary',
    spinning: true,
  },
  [IMPORT_STATUSES.COMPLETE]: { label: 'Complete', className: 'bg-[#E8F8EF] text-[#1F9D55]' },
  [IMPORT_STATUSES.FAILED]: { label: 'Failed', className: 'bg-[#FEECEC] text-[#E53935]' },
};

function Metric({ icon: Icon, label, value, tone = 'default' }) {
  const tones = {
    default: 'text-[#0B1354]',
    success: 'text-[#1F9D55]',
    danger: 'text-[#E53935]',
    warning: 'text-[#C56A12]',
    muted: 'text-[#717171]',
  };

  return (
    <div className="rounded-sm border border-[#EEF0F4] bg-white px-3.5 py-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9AA0B0]">
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        {label}
      </div>
      <p className={clsx('mt-1.5 text-xl font-bold tabular-nums', tones[tone])}>{value}</p>
    </div>
  );
}

export default function ValidationSummary({
  status,
  progress = 0,
  progressMessage = '',
  validation,
  fileMeta,
  error = '',
  fixSummary = null,
}) {
  const meta = STATUS_META[status] || STATUS_META[IMPORT_STATUSES.IDLE];
  const showProgress =
    status === IMPORT_STATUSES.PARSING ||
    status === IMPORT_STATUSES.VALIDATING ||
    status === IMPORT_STATUSES.FIXING ||
    status === IMPORT_STATUSES.UPLOADING;

  return (
    <section className="space-y-4 rounded-sm border border-[#EEF0F4] bg-[#FAFBFC] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={clsx(
                'inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-semibold',
                meta.className,
              )}
            >
              {meta.spinning ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.25} />
              ) : status === IMPORT_STATUSES.READY_TO_UPLOAD ||
                status === IMPORT_STATUSES.COMPLETE ? (
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.25} />
              ) : status === IMPORT_STATUSES.FAILED ||
                status === IMPORT_STATUSES.NEEDS_ATTENTION ? (
                <AlertTriangle className="h-3.5 w-3.5" strokeWidth={2.25} />
              ) : null}
              {meta.label}
            </span>
            {fileMeta ? (
              <span className="inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-[#717171]">
                <FileSpreadsheet className="h-3.5 w-3.5 shrink-0 text-[#0F766E]" strokeWidth={2} />
                <span className="truncate">{fileMeta.name}</span>
                <span className="text-[#D4D4D8]">·</span>
                <span>{fileMeta.sizeLabel}</span>
              </span>
            ) : null}
          </div>
          {progressMessage ? (
            <p className="mt-2 text-sm text-[#717171]">{progressMessage}</p>
          ) : null}
        </div>
      </div>

      {showProgress ? (
        <div>
          <div className="h-2 overflow-hidden rounded-full bg-[#E8EBF2]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0F766E] to-[#2DD4BF] transition-all duration-300"
              style={{ width: `${Math.max(4, Math.min(100, progress))}%` }}
            />
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="flex items-start gap-2 rounded-sm border border-[#F5D0D0] bg-[#FFF7F7] px-3 py-2.5 text-sm text-[#B42318]">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          <p>{error}</p>
        </div>
      ) : null}

      {validation ? (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <Metric
              icon={Rows3}
              label="Total contacts"
              value={validation.totalRows}
            />
            <Metric
              icon={CheckCircle2}
              label="Valid rows"
              value={validation.validRows}
              tone="success"
            />
            <Metric
              icon={XCircle}
              label="Invalid rows"
              value={validation.invalidRows}
              tone={validation.invalidRows ? 'danger' : 'muted'}
            />
            <Metric
              icon={AlertTriangle}
              label="Empty rows"
              value={validation.emptyRows}
              tone={validation.emptyRows ? 'warning' : 'muted'}
            />
            <Metric
              icon={Columns3}
              label="Custom columns"
              value={validation.customColumns?.length || 0}
              tone="default"
            />
          </div>
          <p className="text-xs text-[#8B92A5]">
            Counts include data rows only — the Excel header row is never counted.
          </p>
        </>
      ) : null}

      {validation?.customColumns?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {validation.customColumns.map((column) => (
            <span
              key={column}
              className="rounded-sm bg-white px-2 py-1 text-[11px] font-semibold text-[#0B1354] ring-1 ring-[#EEF0F4]"
            >
              {column}
            </span>
          ))}
        </div>
      ) : null}

      {fixSummary ? (
        <p className="text-sm text-[#0F766E]">
          Automatic fixes applied:{' '}
          <span className="font-semibold">
            {fixSummary.emptyRowsRemoved} empty row
            {fixSummary.emptyRowsRemoved === 1 ? '' : 's'} removed
          </span>
          ,{' '}
          <span className="font-semibold">
            {fixSummary.phonesNormalized} phone
            {fixSummary.phonesNormalized === 1 ? '' : 's'} normalized
          </span>
          ,{' '}
          <span className="font-semibold">
            {fixSummary.cellsTrimmed} cell{fixSummary.cellsTrimmed === 1 ? '' : 's'} trimmed
          </span>
          .
        </p>
      ) : null}
    </section>
  );
}
