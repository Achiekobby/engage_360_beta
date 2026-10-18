import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import SlideOver from '../businesses/SlideOver';
import {
  AUDIENCE_CATEGORY_OPTIONS,
  AUDIENCE_COLLECTION_OPTIONS,
  AUDIENCE_FILTER_DEFAULTS,
  AUDIENCE_GENDER_OPTIONS,
} from './analyticsData';

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

export default function AudienceFilterDrawer({ open, onClose, filters, onApply }) {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  return (
    <SlideOver open={open} onClose={onClose} title="Audience filters">
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
            Narrow audience contacts by gender, category, and collection. Search still covers
            free-text matches.
          </p>

          <FilterChipGroup
            label="Gender"
            options={AUDIENCE_GENDER_OPTIONS}
            selected={draft.genders}
            onToggle={(value) =>
              setDraft((prev) => ({ ...prev, genders: toggleValue(prev.genders, value) }))
            }
          />

          <FilterChipGroup
            label="Category"
            options={AUDIENCE_CATEGORY_OPTIONS}
            selected={draft.categories}
            onToggle={(value) =>
              setDraft((prev) => ({
                ...prev,
                categories: toggleValue(prev.categories, value),
              }))
            }
          />

          <FilterChipGroup
            label="Collection"
            options={AUDIENCE_COLLECTION_OPTIONS}
            selected={draft.collections}
            onToggle={(value) =>
              setDraft((prev) => ({
                ...prev,
                collections: toggleValue(prev.collections, value),
              }))
            }
          />
        </div>

        <div className="flex gap-3 border-t border-[#F0F2F7] px-5 py-4">
          <button
            type="button"
            onClick={() => setDraft({ ...AUDIENCE_FILTER_DEFAULTS })}
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
