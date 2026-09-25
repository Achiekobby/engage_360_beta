import { clsx } from 'clsx';

export default function BlogCategoryFilters({ categories, activeCategory, onChange }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max gap-3">
        {categories.map((category) => {
          const isActive = category.id === activeCategory;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.id)}
              className={clsx(
                'shrink-0 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer sm:px-5 sm:text-base',
                isActive
                  ? 'border-primary bg-primary text-white'
                  : 'border-primary bg-white text-[#0B1354] hover:bg-primary/5',
              )}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
