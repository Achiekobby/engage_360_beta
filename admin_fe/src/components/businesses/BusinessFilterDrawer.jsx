import { useEffect, useState } from 'react';
import SlideOver from './SlideOver';

export const EMPTY_BUSINESS_FILTERS = {
  status: 'all',
  from: '',
  to: '',
};

export function countActiveFilters(filters) {
  return [filters.status !== 'all', filters.from, filters.to].filter(Boolean).length;
}

export function businessMatchesFilters(business, filters) {
  if (filters.status !== 'all' && business.status !== filters.status) return false;
  const day = business.onboardedAt.slice(0, 10);
  if (filters.from && day < filters.from) return false;
  if (filters.to && day > filters.to) return false;
  return true;
}

export default function BusinessFilterDrawer({ open, onClose, value, statuses, onApply }) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const update = (key, next) => setDraft((current) => ({ ...current, [key]: next }));

  return (
    <SlideOver open={open} onClose={onClose} title="Filters">
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          onApply(draft);
          onClose();
        }}
      >
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <p className="text-sm leading-relaxed text-[#717171]">
            Narrow the table by status and the date a business was onboarded. Name, email, phone, and contact stay in search.
          </p>

          <div>
            <label htmlFor="filter-status" className="mb-1.5 block text-sm font-medium text-[#0B1354]">
              Status
            </label>
            <select
              id="filter-status"
              value={draft.status}
              onChange={(event) => update('status', event.target.value)}
              className="w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#0B1354] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            >
              <option value="all">All statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-[#0B1354]">Onboarded</legend>
            <div>
              <label htmlFor="filter-from" className="mb-1.5 block text-xs text-[#717171]">
                From
              </label>
              <input
                id="filter-from"
                type="date"
                value={draft.from}
                max={draft.to || undefined}
                onChange={(event) => update('from', event.target.value)}
                className="w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#0B1354] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div>
              <label htmlFor="filter-to" className="mb-1.5 block text-xs text-[#717171]">
                To
              </label>
              <input
                id="filter-to"
                type="date"
                value={draft.to}
                min={draft.from || undefined}
                onChange={(event) => update('to', event.target.value)}
                className="w-full rounded-lg border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#0B1354] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </fieldset>
        </div>

        <div className="flex gap-3 border-t border-[#F0F2F7] px-5 py-4">
          <button
            type="button"
            onClick={() => setDraft(EMPTY_BUSINESS_FILTERS)}
            className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0B1354] hover:bg-[#F4F4F5]"
          >
            Clear
          </button>
          <button
            type="submit"
            className="ml-auto cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Apply filters
          </button>
        </div>
      </form>
    </SlideOver>
  );
}
