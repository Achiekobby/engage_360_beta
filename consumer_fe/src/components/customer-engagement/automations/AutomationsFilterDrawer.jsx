import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import SlideDrawer from '../customers/SlideDrawer';
import {
  AUTOMATION_APPROVAL_OPTIONS,
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
                  : 'border border-[#E4E4E7] bg-white text-[#0B1354] hover:border-primary/30 hover:bg-[#F7F8FF]',
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

export default function AutomationsFilterDrawer({
  isOpen,
  onClose,
  filters,
  onApply,
}) {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (isOpen) setDraft(filters);
  }, [isOpen, filters]);

  const handleReset = () => {
    setDraft({ ...AUTOMATION_FILTER_DEFAULTS });
  };

  const handleApply = () => {
    onApply?.(draft);
    onClose();
  };

  return (
    <SlideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Filters"
      subtitle="Narrow automations by channel, approval, status, and timing."
      maxWidth="max-w-md"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 cursor-pointer rounded-full border border-[#E4E4E7] bg-white px-4 py-3 text-sm font-semibold text-[#0B1354] transition-colors hover:bg-[#F7F8FF]"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 cursor-pointer rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-colors hover:bg-[#320EB8]"
          >
            Apply filters
          </button>
        </div>
      }
    >
      <div className="space-y-7">
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
                    'flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors',
                    active
                      ? 'border-primary bg-[#F7F8FF] text-primary'
                      : 'border-[#E4E4E7] bg-white text-[#0B1354] hover:border-primary/30 hover:bg-[#FAFBFC]',
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
    </SlideDrawer>
  );
}
