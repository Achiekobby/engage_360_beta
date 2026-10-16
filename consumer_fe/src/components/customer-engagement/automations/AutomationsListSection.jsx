import { clsx } from 'clsx';
import { StaggerItem, StaggerReveal } from '../../motion';
import AutomationListItem from './AutomationListItem';
import AutomationsPagination from './AutomationsPagination';
import { AUTOMATION_VIEW_TABS } from './automationsData';

export default function AutomationsListSection({
  activeView,
  onViewChange,
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onViewItem,
  onDeleteItem,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) {
  const allPageSelected =
    items.length > 0 && items.every((item) => selectedIds.has(item.id));
  const somePageSelected =
    items.some((item) => selectedIds.has(item.id)) && !allPageSelected;

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold text-[#0B1354] sm:text-xl">
            {activeView === 'history' ? 'History' : 'Upcoming'}
          </h2>

          {items.length ? (
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#717171]">
              <input
                type="checkbox"
                checked={allPageSelected}
                ref={(node) => {
                  if (node) node.indeterminate = somePageSelected;
                }}
                onChange={onToggleSelectAll}
                className="h-4 w-4 cursor-pointer rounded border-[#D4D4D8] text-primary focus:ring-primary/30"
              />
              Select page
            </label>
          ) : null}
        </div>

        <div className="inline-flex self-start rounded-full bg-[#EDE8F8] p-1 sm:self-auto">
          {AUTOMATION_VIEW_TABS.map((tab) => {
            const active = activeView === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onViewChange(tab.id)}
                className={clsx(
                  'cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
                  active
                    ? 'bg-white text-primary shadow-sm'
                    : 'bg-transparent text-primary/80 hover:text-primary',
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        {items.length ? (
          <>
            <StaggerReveal
              key={`page-${currentPage}-${activeView}`}
              className="flex flex-col gap-1.5"
              stagger={0.04}
            >
              {items.map((item) => (
                <StaggerItem key={item.id}>
                  <AutomationListItem
                    item={item}
                    selected={selectedIds.has(item.id)}
                    onToggleSelect={onToggleSelect}
                    onView={onViewItem}
                    onDelete={onDeleteItem}
                  />
                </StaggerItem>
              ))}
            </StaggerReveal>

            <AutomationsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={onPageChange}
            />
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#E4E4E7] bg-white px-5 py-14 text-center">
            <p className="text-sm text-[#717171]">
              No {activeView === 'history' ? 'history' : 'upcoming'} automations for this selection.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
