import { FolderOpen, Layers, Plus } from 'lucide-react';
import PageBackButton from './PageBackButton';

export default function CustomersPageHeader({
  category = null,
  collectionCount = 0,
  categoryCount = 0,
  onAddCategory,
  onAddCollection,
  onBack,
}) {
  const insideCategory = Boolean(category);

  return (
    <header className="relative overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.04)]">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
          category?.accent || 'from-primary via-[#0F766E] to-[#E67E22]'
        }`}
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full ${
          category?.wash || 'bg-[radial-gradient(circle,rgba(58,16,205,0.08)_0%,transparent_70%)]'
        }`}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-6 lg:py-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#717171]">
            {insideCategory ? (
              <>
                <FolderOpen className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                <span>Categories</span>
                <span className="text-[#D4D4D8]" aria-hidden="true">
                  /
                </span>
                <span className="text-primary">{category.name}</span>
              </>
            ) : (
              <>
                <Layers className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                <span>Customer Engagement</span>
                <span className="text-[#D4D4D8]" aria-hidden="true">
                  /
                </span>
                <span className="text-primary">Customers</span>
              </>
            )}
          </div>

          <h1 className="mt-2 text-xl font-bold tracking-tight text-[#0B1354] sm:text-2xl lg:text-[1.75rem]">
            {insideCategory ? category.name : 'Customer categories'}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#717171] sm:text-base">
            {insideCategory
              ? 'Create collections in this category. Contacts are uploaded and stored inside a collection.'
              : 'Create a category, then add collections inside it. Each collection is where contacts are stored.'}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-end lg:w-auto">
          {insideCategory ? (
            <>
              <PageBackButton onClick={onBack} detail="Categories" />
              <span
                className="hidden h-auto w-px self-stretch bg-[#EEF0F4] sm:mx-0.5 sm:block"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={onAddCollection}
                className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#320EB8] hover:shadow-[0_8px_24px_rgba(58,16,205,0.32)]"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add Collection
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onAddCategory}
              className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#320EB8] hover:shadow-[0_8px_24px_rgba(58,16,205,0.32)]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Customer Category
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-[#F0F2F7] px-5 py-3 sm:px-6">
        {insideCategory ? (
          <>
            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-sm ${category.iconBg}`}>
              <FolderOpen className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="text-sm text-[#717171]">
              <span className="font-semibold text-[#0B1354]">{collectionCount} collections</span> in{' '}
              {category.name}
            </span>
          </>
        ) : (
          <>
            <Layers className="h-4 w-4 text-primary" strokeWidth={2} />
            <span className="text-sm text-[#717171]">
              <span className="font-semibold text-[#0B1354]">{categoryCount} categories</span> in your
              workspace
            </span>
          </>
        )}
      </div>
    </header>
  );
}
