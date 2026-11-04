import { X } from 'lucide-react';
import { FORM_OPTIONS } from './collectionCustomersData';
import CollectionCustomersToolbar from './CollectionCustomersToolbar';

export default function ContactsFiltersBar({
  searchQuery,
  onSearchChange,
  selectedCount,
  onRefresh,
  onDeleteSelected,
  onExport,
  gender,
  location,
  onGenderChange,
  onLocationChange,
  onClearFilters,
  filtersOpen,
  onToggleFilters,
}) {
  const activeFilters = [
    gender ? { key: 'gender', label: `Gender: ${gender}` } : null,
    location ? { key: 'location', label: `Location: ${location}` } : null,
  ].filter(Boolean);

  return (
    <div className="space-y-3">
      <CollectionCustomersToolbar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedCount={selectedCount}
        onRefresh={onRefresh}
        onDeleteSelected={onDeleteSelected}
        onFilter={onToggleFilters}
        onExport={onExport}
      />

      {filtersOpen ? (
        <div className="rounded-sm border border-[#EEF0F4] bg-white p-4 shadow-[0_4px_20px_rgba(11,19,84,0.04)]">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-[#717171]">Gender</span>
              <select
                value={gender}
                onChange={(event) => onGenderChange(event.target.value)}
                className="w-full rounded-sm border border-[#E4E4E7] bg-[#FAFBFC] px-3 py-2.5 text-sm text-[#0B1354] outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              >
                <option value="">All genders</option>
                {FORM_OPTIONS.genders.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-[#717171]">Location</span>
              <select
                value={location}
                onChange={(event) => onLocationChange(event.target.value)}
                className="w-full rounded-sm border border-[#E4E4E7] bg-[#FAFBFC] px-3 py-2.5 text-sm text-[#0B1354] outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              >
                <option value="">All locations</option>
                {FORM_OPTIONS.locations.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      ) : null}

      {activeFilters.length ? (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => {
                if (filter.key === 'gender') onGenderChange('');
                if (filter.key === 'location') onLocationChange('');
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-[#F7F8FF] px-2.5 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/15"
            >
              {filter.label}
              <X className="h-3 w-3" strokeWidth={2.5} />
            </button>
          ))}
          <button
            type="button"
            onClick={onClearFilters}
            className="cursor-pointer text-xs font-semibold text-[#717171] transition-colors hover:text-primary"
          >
            Clear all
          </button>
        </div>
      ) : null}
    </div>
  );
}
