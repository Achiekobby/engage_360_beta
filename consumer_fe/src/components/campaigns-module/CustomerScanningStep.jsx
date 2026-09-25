import { Eye, Rocket, Ticket, X } from 'lucide-react';
import { clsx } from 'clsx';
import { FieldError, FieldLabel, inputClassName } from './WizardFormField';
import { formatReachCount } from './campaignsData';

function StatCard({ label, value, tone, icon: Icon, onView }) {
  const tones = {
    blue: 'bg-[#E8F4FC] text-[#1F9D55]',
    peach: 'bg-[#FFF0E8] text-[#E5484D]',
    grey: 'bg-[#F3F4F7] text-[#E5484D]',
  };

  return (
    <div
      className={clsx(
        'flex items-center justify-between rounded-sm px-4 py-4 sm:px-5 sm:py-5',
        tone === 'grey' ? tones.grey : tone === 'peach' ? tones.peach : tones.blue,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-white shadow-sm">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0B1354]">{label}</p>
          <p className="mt-1 text-2xl font-bold text-[#0B1354]">{value}</p>
        </div>
      </div>
      {onView ? (
        <button
          type="button"
          onClick={onView}
          className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-sm text-[#0B1354] transition-colors hover:bg-white/70"
          aria-label={`View ${label.toLowerCase()}`}
        >
          <Eye className="h-4 w-4" strokeWidth={2} />
        </button>
      ) : null}
    </div>
  );
}

const FIELD_HELP = {
  preferredReach:
    'Enter how many customers you want this campaign to reach, or use all estimated reach.',
};

export default function CustomerScanningStep({
  stats,
  reachMode,
  preferredReach,
  errors,
  onReachModeChange,
  onPreferredReachChange,
  onViewValid,
  onViewInvalid,
}) {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#EEF0F4] pb-4">
        <h2 className="text-lg font-bold text-[#0B1354]">Customer Scanning & Breakdown</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Customer Base"
          value={formatReachCount(stats.customerBase)}
          tone="blue"
          icon={Rocket}
        />
        <StatCard
          label="Estimated Reach"
          value={formatReachCount(stats.estimatedReach)}
          tone="peach"
          icon={Ticket}
        />
        <StatCard
          label="Valid Customers"
          value={formatReachCount(stats.validCustomers)}
          tone="blue"
          icon={Rocket}
          onView={onViewValid}
        />
        <StatCard
          label="Invalid Customers"
          value={formatReachCount(stats.invalidCustomers)}
          tone="peach"
          icon={Ticket}
          onView={onViewInvalid}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Total"
          value={formatReachCount(stats.quotaTotal)}
          tone="grey"
          icon={Ticket}
        />
        <StatCard
          label="Used"
          value={formatReachCount(stats.quotaUsed)}
          tone="grey"
          icon={Ticket}
        />
        <StatCard label="Left" value={formatReachCount(stats.quotaLeft)} tone="grey" icon={Ticket} />
      </div>

      <div className="space-y-3 border-t border-[#EEF0F4] pt-6">
        <FieldLabel htmlFor="preferredReach" help={FIELD_HELP.preferredReach}>
          Preferred Customer Reach
        </FieldLabel>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            id="preferredReach"
            value={preferredReach}
            onChange={(event) => onPreferredReachChange(event.target.value)}
            placeholder="Enter the number of customers"
            disabled={reachMode === 'all'}
            className={clsx(
              inputClassName(errors.preferredReach),
              reachMode === 'all' && 'cursor-not-allowed bg-[#FAFBFC] text-[#9AA0B0]',
            )}
            aria-invalid={Boolean(errors.preferredReach)}
          />

          <label className="inline-flex shrink-0 cursor-pointer items-center gap-2.5 text-sm font-medium text-[#0B1354]">
            <input
              type="checkbox"
              className="sr-only"
              checked={reachMode === 'all'}
              onChange={(event) => onReachModeChange(event.target.checked ? 'all' : 'custom')}
            />
            <span
              className={clsx(
                'flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors',
                reachMode === 'all' ? 'border-primary' : 'border-[#C8CDD8]',
              )}
            >
              {reachMode === 'all' ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
            </span>
            All Estimated Reach
          </label>
        </div>

        <FieldError message={errors.preferredReach} />
      </div>
    </div>
  );
}

export function CustomerListPreviewModal({ isOpen, title, customers, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[240] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#0B1354]/45"
        onClick={onClose}
        aria-label="Close preview"
      />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-sm bg-white shadow-[0_24px_64px_rgba(11,19,84,0.2)]">
        <div className="flex items-center justify-between border-b border-[#EEF0F4] px-5 py-4">
          <h3 className="text-base font-bold text-[#0B1354]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-[#717171] hover:bg-[#F7F8FF] hover:text-primary"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
        <ul className="max-h-80 divide-y divide-[#EEF0F4] overflow-y-auto">
          {customers.map((customer) => (
            <li key={customer.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
              <span className="font-semibold text-[#0B1354]">{customer.name}</span>
              <span className="text-[#717171]">{customer.contact}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
