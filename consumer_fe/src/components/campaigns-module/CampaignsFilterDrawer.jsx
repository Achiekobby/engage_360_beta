import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import SlideDrawer from '../customer-engagement/customers/SlideDrawer';
import { CAMPAIGN_CATEGORIES } from './campaignsNavData';
import {
  CAMPAIGN_FILTER_CHANNEL_OPTIONS,
  CAMPAIGN_FILTER_DATE_OPTIONS,
  CAMPAIGN_FILTER_DEFAULTS,
  CAMPAIGN_FILTER_STATUS_OPTIONS,
} from './campaignDetailData';

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
                'cursor-pointer rounded-sm px-3.5 py-2 text-sm font-medium transition-colors',
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

export default function CampaignsFilterDrawer({ isOpen, onClose, filters, onApply }) {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (isOpen) setDraft(filters);
  }, [isOpen, filters]);

  const categoryOptions = CAMPAIGN_CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
  }));

  const handleReset = () => {
    setDraft({ ...CAMPAIGN_FILTER_DEFAULTS });
  };

  const handleApply = () => {
    onApply?.(draft);
    onClose();
  };

  return (
    <SlideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Campaigns"
      subtitle="Narrow by campaign type, channel, status, and date."
      maxWidth="max-w-md"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 cursor-pointer rounded-sm border border-[#E4E4E7] bg-white px-4 py-3 text-sm font-semibold text-[#0B1354] transition-colors hover:bg-[#F7F8FF]"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 cursor-pointer rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-colors hover:bg-[#320EB8]"
          >
            Apply filters
          </button>
        </div>
      }
    >
      <div className="space-y-7">
        <FilterChipGroup
          label="Campaign Type"
          options={categoryOptions}
          selected={draft.categories}
          onToggle={(value) =>
            setDraft((prev) => ({ ...prev, categories: toggleValue(prev.categories, value) }))
          }
        />

        <FilterChipGroup
          label="Channel"
          options={CAMPAIGN_FILTER_CHANNEL_OPTIONS}
          selected={draft.channels}
          onToggle={(value) =>
            setDraft((prev) => ({ ...prev, channels: toggleValue(prev.channels, value) }))
          }
        />

        <FilterChipGroup
          label="Status"
          options={CAMPAIGN_FILTER_STATUS_OPTIONS}
          selected={draft.statuses}
          onToggle={(value) =>
            setDraft((prev) => ({ ...prev, statuses: toggleValue(prev.statuses, value) }))
          }
        />

        <fieldset>
          <legend className="text-sm font-semibold text-[#0B1354]">Date Created</legend>
          <div className="mt-3 space-y-2">
            {CAMPAIGN_FILTER_DATE_OPTIONS.map((option) => {
              const active = draft.dateRange === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, dateRange: option.id }))}
                  className={clsx(
                    'flex w-full cursor-pointer items-center justify-between rounded-sm border px-3.5 py-2.5 text-left text-sm font-medium transition-colors',
                    active
                      ? 'border-primary bg-[#F7F8FF] text-primary'
                      : 'border-[#E4E4E7] bg-white text-[#0B1354] hover:border-primary/30',
                  )}
                >
                  {option.label}
                  <span
                    className={clsx(
                      'flex h-4 w-4 items-center justify-center rounded-full border-2',
                      active ? 'border-primary' : 'border-[#C8CDD8]',
                    )}
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
