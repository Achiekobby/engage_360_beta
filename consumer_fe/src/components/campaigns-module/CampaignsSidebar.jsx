import {
  Search,
} from 'lucide-react';
import { clsx } from 'clsx';
import { CAMPAIGN_CATEGORIES } from './campaignsNavData';
import { CATEGORY_ICONS } from './campaignCategoryMeta';

export default function CampaignsSidebar({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  categoryCounts = {},
}) {
  const filteredCategories = CAMPAIGN_CATEGORIES.filter((category) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return category.label.toLowerCase().includes(query);
  });

  return (
    <aside className="hidden h-full w-[18rem] shrink-0 flex-col overflow-hidden border-r border-[#EEF0F4] bg-white lg:flex xl:w-[19rem]">
      <div className="flex h-full flex-col">
        <div className="shrink-0 border-b border-[#EEF0F4] px-5 pb-5 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            Browse
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-[#0B1354]">Categories</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-[#717171]">
            Filter campaigns by goal or campaign type.
          </p>

          <div className="relative mt-4">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA0B0]"
              strokeWidth={2}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search categories"
              className="w-full rounded-sm border border-[#E4E4E7] bg-[#FAFBFC] py-2.5 pl-10 pr-3 text-sm text-[#0B1354] outline-none transition-all placeholder:text-[#9AA0B0] focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        <nav
          className="scrollbar-thin min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 py-4"
          aria-label="Campaign categories"
        >
          {filteredCategories.map((category) => {
            const active = activeCategory === category.id;
            const count = categoryCounts[category.id] ?? 0;
            const Icon = CATEGORY_ICONS[category.id] || CATEGORY_ICONS.promotions;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={clsx(
                  'group relative flex w-full cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 text-left transition-all duration-200',
                  active
                    ? 'bg-[#F3F0FF] text-primary shadow-[inset_3px_0_0_0_#3A10CD]'
                    : 'text-[#545454] hover:bg-[#F7F8FF] hover:text-[#0B1354]',
                )}
              >
                <span
                  className={clsx(
                    'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm transition-colors',
                    active
                      ? 'bg-primary text-white'
                      : 'bg-[#F4F5F8] text-[#717171] group-hover:bg-[#EDE8F8] group-hover:text-primary',
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>

                <span
                  className={clsx(
                    'min-w-0 flex-1 truncate text-sm',
                    active ? 'font-semibold' : 'font-medium',
                  )}
                >
                  {category.label}
                </span>

                <span
                  className={clsx(
                    'inline-flex min-w-[1.5rem] shrink-0 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'bg-[#F0F2F7] text-[#9AA0B0] group-hover:bg-[#EDE8F8] group-hover:text-primary',
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {filteredCategories.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-[#717171]">
              No categories match your search.
            </p>
          ) : null}
        </nav>
      </div>
    </aside>
  );
}
