import { AnimatePresence, motion } from 'framer-motion';
import { Layers, LayoutGrid, Plus, Table2 } from 'lucide-react';
import { clsx } from 'clsx';
import CategoryCard from './CategoryCard';
import CategoryTable from './CategoryTable';

const VIEW_OPTIONS = [
  { id: 'cards', label: 'Cards', icon: LayoutGrid },
  { id: 'table', label: 'Table', icon: Table2 },
];

export default function CategoriesView({
  categories,
  collectionCountById,
  viewMode,
  onViewModeChange,
  onOpen,
  onEdit,
  onDelete,
  onAddCategory,
  searchActive = false,
}) {
  if (categories.length === 0) {
    if (searchActive) {
      return (
        <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-[#E4E4E7] bg-white px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F8FF] text-primary">
            <Layers className="h-6 w-6" strokeWidth={2} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-[#0B1354]">No matching categories</h3>
          <p className="mt-2 max-w-sm text-sm text-[#717171]">
            Try another category or collection name.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-[#E4E4E7] bg-white px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F8FF] text-primary">
          <Layers className="h-6 w-6" strokeWidth={2} />
        </div>
        <h3 className="mt-4 text-lg font-bold text-[#0B1354]">No categories yet</h3>
        <p className="mt-2 max-w-sm text-sm text-[#717171]">
          Create a category first. Collections, and the contacts inside them, live under a category.
        </p>
        <button
          type="button"
          onClick={onAddCategory}
          className="mt-6 inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.22)] transition-all hover:bg-[#320EB8]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Customer Category
        </button>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)]">
      <div className="flex flex-col gap-4 border-b border-[#F0F2F7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-base font-bold text-[#0B1354] sm:text-lg">Customer Categories</h2>
          <p className="mt-0.5 text-sm text-[#717171]">
            Open a category to create the collections that store your contacts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-sm bg-[#F7F8FF] px-2.5 py-1 text-sm font-semibold text-primary ring-1 ring-primary/10">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </span>

          <div
            className="inline-flex rounded-sm border border-[#E4E4E7] bg-[#FAFBFC] p-1"
            role="tablist"
            aria-label="Category view mode"
          >
            {VIEW_OPTIONS.map(({ id, label, icon: Icon }) => {
              const active = viewMode === id;

              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onViewModeChange(id)}
                  className={clsx(
                    'relative inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-3 py-2 text-sm font-semibold transition-colors duration-200',
                    active ? 'text-primary' : 'text-[#717171] hover:text-[#0B1354]',
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="category-view-pill"
                      className="absolute inset-0 rounded-sm bg-white shadow-[0_2px_8px_rgba(11,19,84,0.08)] ring-1 ring-[#EEF0F4]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <Icon className="relative h-4 w-4" strokeWidth={2} />
                  <span className="relative hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'cards' ? (
          <motion.div
            key="category-cards"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3"
          >
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                collectionCount={collectionCountById[category.id] || 0}
                index={index}
                onOpen={onOpen}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="category-table"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="pb-2 pt-1"
          >
            <CategoryTable
              categories={categories}
              collectionCountById={collectionCountById}
              onOpen={onOpen}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
