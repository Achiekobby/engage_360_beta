import {
  CalendarRange,
  List,
  MapPin,
  MapPinned,
  Pencil,
  Plus,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { FieldError, inputClassName } from './WizardFormField';
import SearchableSelect from './SearchableSelect';
import { SEGMENTATION_FILTER_TYPES, getLocationOptions } from './campaignsData';

const FILTER_META = {
  gender: {
    icon: UserRound,
    accent: 'from-[#EDE8F8] to-[#F5F0FF]',
    iconBg: 'bg-[#EDE8F8] text-primary',
    border: 'border-primary/20',
    chip: 'hover:border-primary/40 hover:bg-[#F7F8FF] hover:text-primary',
  },
  region: {
    icon: MapPin,
    accent: 'from-[#E8F4FC] to-[#F0F9FF]',
    iconBg: 'bg-[#E8F4FC] text-[#2E7DAD]',
    border: 'border-[#2E7DAD]/25',
    chip: 'hover:border-[#2E7DAD]/40 hover:bg-[#F0F9FF] hover:text-[#2E7DAD]',
  },
  location: {
    icon: MapPinned,
    accent: 'from-[#E8F8EF] to-[#F0FFF7]',
    iconBg: 'bg-[#E8F8EF] text-[#1F9D55]',
    border: 'border-[#1F9D55]/25',
    chip: 'hover:border-[#1F9D55]/40 hover:bg-[#F0FFF7] hover:text-[#1F9D55]',
  },
  age: {
    icon: CalendarRange,
    accent: 'from-[#FFF4E8] to-[#FFFAF3]',
    iconBg: 'bg-[#FFF4E8] text-[#E67E22]',
    border: 'border-[#E67E22]/25',
    chip: 'hover:border-[#E67E22]/40 hover:bg-[#FFFAF3] hover:text-[#E67E22]',
  },
};

function SegmentFilterCard({
  filter,
  meta,
  regionValue,
  errors,
  onValueChange,
  onRemove,
  onToggleCustom,
}) {
  const filterMeta = FILTER_META[filter.type] || FILTER_META.gender;
  const Icon = filterMeta.icon;
  const errorKey = `segmentFilters.${filter.id}`;
  const isRegion = filter.type === 'region';
  const isLocation = filter.type === 'location';
  const locationDisabled = isLocation && !regionValue;
  const locationOptions = isLocation ? getLocationOptions(regionValue) : [];
  const isConfigured = Boolean(filter.value);

  return (
    <article
      className={clsx(
        'group relative rounded-lg border-2 bg-white shadow-sm transition-all duration-200 hover:shadow-md',
        isConfigured ? filterMeta.border : 'border-[#C8CDD8]',
      )}
    >
      <div className={clsx('h-1 w-full bg-gradient-to-r', filterMeta.accent)} />

      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className={clsx(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                filterMeta.iconBg,
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0B1354]">{meta.label}</p>
              <p className="text-[11px] text-[#9AA0B0]">
                {isConfigured ? filter.value : 'Not set'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemove(filter.id)}
            className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent text-[#9AA0B0] transition-colors hover:border-[#FFE3E3] hover:bg-[#FFF5F5] hover:text-[#E5484D]"
            aria-label={`Remove ${meta.label} filter`}
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>

        {isRegion ? (
          <SearchableSelect
            id={`segment-${filter.id}`}
            value={filter.value}
            onChange={(value) => onValueChange(filter.id, value)}
            options={meta.options}
            placeholder="Search regions…"
            error={errors[errorKey]}
          />
        ) : isLocation ? (
          <>
            {filter.custom ? (
              <input
                id={`segment-${filter.id}`}
                type="text"
                value={filter.value}
                disabled={locationDisabled}
                placeholder="Enter a location"
                onChange={(event) => onValueChange(filter.id, event.target.value)}
                className={clsx(
                  inputClassName(errors[errorKey]),
                  'disabled:cursor-not-allowed disabled:bg-[#F5F6F8] disabled:text-[#9AA0B0]',
                )}
                aria-invalid={Boolean(errors[errorKey])}
              />
            ) : (
              <SearchableSelect
                id={`segment-${filter.id}`}
                value={filter.value}
                onChange={(value) => onValueChange(filter.id, value)}
                options={locationOptions}
                disabled={locationDisabled}
                placeholder={locationDisabled ? 'Select a region first' : 'Search locations…'}
                emptyMessage="No popular locations found for this region."
                error={errors[errorKey]}
              />
            )}
            <button
              type="button"
              disabled={locationDisabled}
              onClick={() => onToggleCustom(filter.id)}
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary transition-colors hover:underline disabled:cursor-not-allowed disabled:text-[#C8CDD8] disabled:no-underline"
            >
              {filter.custom ? (
                <>
                  <List className="h-3 w-3" strokeWidth={2.5} />
                  Choose from list
                </>
              ) : (
                <>
                  <Pencil className="h-3 w-3" strokeWidth={2.5} />
                  Enter manually
                </>
              )}
            </button>
          </>
        ) : (
          <select
            id={`segment-${filter.id}`}
            value={filter.value}
            onChange={(event) => onValueChange(filter.id, event.target.value)}
            className={clsx(inputClassName(errors[errorKey]), 'cursor-pointer')}
          >
            <option value="">Select {meta.label.toLowerCase()}</option>
            {meta.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        <FieldError message={errors[errorKey]} />
      </div>
    </article>
  );
}

export default function CustomerSegmentationSection({
  segmentFilters,
  errors,
  regionValue,
  availableSegmentTypes,
  pendingSegmentType,
  onPendingSegmentChange,
  onAddSegment,
  onValueChange,
  onRemove,
  onToggleCustom,
}) {
  const configuredCount = segmentFilters.filter((filter) => filter.value).length;
  const totalCount = segmentFilters.length;

  const handleQuickAdd = (type) => {
    onAddSegment(type);
  };

  return (
    <section className="rounded-lg border-2 border-[#C8CDD8] bg-white shadow-sm">
      <header className="border-b-2 border-[#E4E8EF] bg-gradient-to-br from-[#F7F8FF] via-white to-[#FAFBFC] px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#6B4FE0] text-white shadow-[0_8px_20px_rgba(58,16,205,0.25)]">
              <SlidersHorizontal className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-[#0B1354]">Customer Segmentation</h3>
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                  {configuredCount} of {totalCount} set
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-[#717171]">
                Layer demographic and location filters to sharpen your campaign reach.
              </p>
            </div>
          </div>

          {availableSegmentTypes.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#9AA0B0]">
                Add filter
              </span>
              {availableSegmentTypes.map((type) => {
                const meta = SEGMENTATION_FILTER_TYPES[type];
                const typeMeta = FILTER_META[type];
                const Icon = typeMeta?.icon || Plus;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleQuickAdd(type)}
                    className={clsx(
                      'inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-[#C8CDD8] bg-white px-3 py-1.5 text-xs font-semibold text-[#0B1354] transition-all',
                      typeMeta?.chip,
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </header>

      <div className="p-5 sm:p-6">
        {segmentFilters.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {segmentFilters.map((filter) => (
              <SegmentFilterCard
                key={filter.id}
                filter={filter}
                meta={SEGMENTATION_FILTER_TYPES[filter.type]}
                regionValue={regionValue}
                errors={errors}
                onValueChange={onValueChange}
                onRemove={onRemove}
                onToggleCustom={onToggleCustom}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#B8BECD] bg-[#FAFBFC] px-6 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDE8F8] text-primary">
              <SlidersHorizontal className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <p className="mt-3 text-sm font-semibold text-[#0B1354]">No filters applied yet</p>
            <p className="mt-1 max-w-sm text-xs text-[#717171]">
              Add segmentation filters below to target specific audience groups.
            </p>

            {availableSegmentTypes.length > 0 ? (
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {availableSegmentTypes.map((type) => {
                  const meta = SEGMENTATION_FILTER_TYPES[type];
                  const typeMeta = FILTER_META[type];
                  const Icon = typeMeta?.icon || Plus;

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleQuickAdd(type)}
                      className={clsx(
                        'inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-[#C8CDD8] bg-white px-3.5 py-2 text-xs font-semibold text-[#0B1354] shadow-sm transition-all',
                        typeMeta?.chip,
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                      Add {meta.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}

        <FieldError message={errors.pendingSegment} />

        {segmentFilters.length > 0 && availableSegmentTypes.length > 0 ? (
          <div className="mt-5 flex flex-col gap-3 border-t border-[#EEF0F4] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#717171]">
              Removed a filter? Add it back with one click.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={pendingSegmentType}
                onChange={(event) => onPendingSegmentChange(event.target.value)}
                className={clsx(
                  inputClassName(errors.pendingSegment),
                  'min-w-[11rem] cursor-pointer py-2 text-xs',
                )}
              >
                <option value="">Choose filter type…</option>
                {availableSegmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {SEGMENTATION_FILTER_TYPES[type].label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => onAddSegment()}
                disabled={!pendingSegmentType}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(58,16,205,0.28)] transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-[#C8CDD8] disabled:shadow-none"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                Add filter
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
