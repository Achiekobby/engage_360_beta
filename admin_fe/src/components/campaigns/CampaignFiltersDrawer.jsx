import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import SlideOver from '../businesses/SlideOver';
import { CAMPAIGN_CHANNELS, CAMPAIGN_STATUSES } from './campaignData';

export const CAMPAIGN_FILTER_DEFAULTS = {
  statuses: [],
  channels: [],
};

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function FilterChipGroup({ label, options, selected, onToggle }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-[#0B1354]">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onToggle(option.id)}
              className={clsx(
                'cursor-pointer rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-white'
                  : 'border border-[#E4E4E7] bg-white text-[#0B1354] hover:border-primary/30 hover:bg-[#EFF6FF]',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function countActiveCampaignFilters(filters = CAMPAIGN_FILTER_DEFAULTS) {
  let count = 0;
  if (filters.statuses?.length) count += 1;
  if (filters.channels?.length) count += 1;
  return count;
}

export default function CampaignFiltersDrawer({ open, onClose, filters, onApply }) {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  return (
    <SlideOver open={open} onClose={onClose} title="Filters">
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          onApply?.(draft);
          onClose();
        }}
      >
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <p className="text-sm leading-relaxed text-[#717171]">
            Narrow this list by status and channel. Search still matches campaign and business names.
          </p>

          <FilterChipGroup
            label="Status"
            options={CAMPAIGN_STATUSES}
            selected={draft.statuses}
            onToggle={(value) =>
              setDraft((prev) => ({ ...prev, statuses: toggleValue(prev.statuses, value) }))
            }
          />

          <FilterChipGroup
            label="Channel"
            options={CAMPAIGN_CHANNELS}
            selected={draft.channels}
            onToggle={(value) =>
              setDraft((prev) => ({ ...prev, channels: toggleValue(prev.channels, value) }))
            }
          />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#F0F2F7] px-5 py-4">
          <button
            type="button"
            onClick={() => setDraft(CAMPAIGN_FILTER_DEFAULTS)}
            className="cursor-pointer text-sm font-semibold text-[#717171] hover:text-[#0B1354]"
          >
            Reset
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-[#E4E4E7] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B1354] hover:bg-[#F8FAFF]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Apply filters
            </button>
          </div>
        </div>
      </form>
    </SlideOver>
  );
}
