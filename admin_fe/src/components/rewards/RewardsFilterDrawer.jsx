import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import SlideOver from '../businesses/SlideOver';
import { AIRTIME_AMOUNTS_GHS, REWARD_STATUSES, TELCO_NETWORKS } from '../../constants/rewards';

export const REWARD_FILTER_DEFAULTS = {
  networks: [],
  statuses: [],
  amounts: [],
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
              aria-pressed={active}
              onClick={() => onToggle(option.id)}
              className={clsx(
                'cursor-pointer rounded-full px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
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

export function countActiveRewardFilters(filters = REWARD_FILTER_DEFAULTS) {
  return ['networks', 'statuses', 'amounts'].filter((key) => filters[key]?.length).length;
}

export default function RewardsFilterDrawer({ open, onClose, filters, onApply }) {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const amountOptions = AIRTIME_AMOUNTS_GHS.map((amount) => ({
    id: String(amount),
    label: `GHS ${amount}`,
  }));

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
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <p className="text-sm leading-relaxed text-[#717171]">
            Narrow the catalog by network, status, and airtime amount. Search still matches the reward name.
          </p>
          <FilterChipGroup
            label="Network"
            options={TELCO_NETWORKS}
            selected={draft.networks}
            onToggle={(value) => setDraft((current) => ({ ...current, networks: toggleValue(current.networks, value) }))}
          />
          <FilterChipGroup
            label="Status"
            options={REWARD_STATUSES}
            selected={draft.statuses}
            onToggle={(value) => setDraft((current) => ({ ...current, statuses: toggleValue(current.statuses, value) }))}
          />
          <FilterChipGroup
            label="Amount"
            options={amountOptions}
            selected={draft.amounts}
            onToggle={(value) => setDraft((current) => ({ ...current, amounts: toggleValue(current.amounts, value) }))}
          />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-[#F0F2F7] px-5 py-4">
          <button
            type="button"
            onClick={() => setDraft(REWARD_FILTER_DEFAULTS)}
            className="cursor-pointer text-sm font-semibold text-[#717171] hover:text-[#0B1354]"
          >
            Reset
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-[#E4E4E7] bg-white px-4 py-2 text-sm font-semibold text-[#0B1354] hover:bg-[#F4F4F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Apply
            </button>
          </div>
        </div>
      </form>
    </SlideOver>
  );
}
