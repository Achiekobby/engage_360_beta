import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import SlideOver from '../businesses/SlideOver';
import {
  AUTOMATION_APPROVAL_OPTIONS,
  AUTOMATION_BUSINESS_OPTIONS,
  AUTOMATION_CHANNEL_OPTIONS,
  AUTOMATION_FILTER_DEFAULTS,
  AUTOMATION_STATUS_OPTIONS,
  AUTOMATION_TIMING_OPTIONS,
} from './automationsData';

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

export default function AutomationsFilterDrawer({ open, onClose, filters, onApply }) {
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
            Narrow automations by business, channel, approval, status, and timing. Search still covers
            free-text matches.
          </p>

          <FilterChipGroup
            label="Business"
            options={AUTOMATION_BUSINESS_OPTIONS}
            selected={draft.businesses}
            onToggle={(value) =>
              setDraft((prev) => ({
                ...prev,
                businesses: toggleValue(prev.businesses, value),
              }))
            }
          />

          <FilterChipGroup
            label="Channel"
            options={AUTOMATION_CHANNEL_OPTIONS}
            selected={draft.channels}
            onToggle={(value) =>
              setDraft((prev) => ({ ...prev, channels: toggleValue(prev.channels, value) }))
            }
          />

          <FilterChipGroup
            label="Approval type"
            options={AUTOMATION_APPROVAL_OPTIONS}
            selected={draft.approvals}
            onToggle={(value) =>
              setDraft((prev) => ({ ...prev, approvals: toggleValue(prev.approvals, value) }))
            }
          />

          <FilterChipGroup
            label="Status"
            options={AUTOMATION_STATUS_OPTIONS}
            selected={draft.statuses}
            onToggle={(value) =>
              setDraft((prev) => ({ ...prev, statuses: toggleValue(prev.statuses, value) }))
            }
          />

          <fieldset>
            <legend className="text-sm font-semibold text-[#0B1354]">Timing window</legend>
            <div className="mt-3 space-y-2">
              {AUTOMATION_TIMING_OPTIONS.map((option) => {
                const active = draft.timingWindow === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, timingWindow: option.id }))}
                    className={clsx(
                      'flex w-full cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors',
                      active
                        ? 'border-primary bg-[#EFF6FF] text-primary'
                        : 'border-[#E4E4E7] bg-white text-[#0B1354] hover:border-primary/30 hover:bg-[#F8FAFC]',
                    )}
                  >
                    {option.label}
                    <span
                      className={clsx(
                        'flex h-4 w-4 items-center justify-center rounded-full border',
                        active ? 'border-primary' : 'border-[#D4D4D8]',
                      )}
                      aria-hidden="true"
                    >
                      {active ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="flex gap-3 border-t border-[#F0F2F7] px-5 py-4">
          <button
            type="button"
            onClick={() => setDraft({ ...AUTOMATION_FILTER_DEFAULTS })}
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
