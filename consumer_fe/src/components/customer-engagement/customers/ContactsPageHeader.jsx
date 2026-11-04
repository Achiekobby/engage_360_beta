import { useNavigate } from 'react-router-dom';
import { FolderOpen, Plus } from 'lucide-react';
import PageBackButton from './PageBackButton';

export default function ContactsPageHeader({
  collection,
  totalContacts = 0,
  uploadLabel = null,
  onAddCustomer,
}) {
  const navigate = useNavigate();

  const backToUploads = () => {
    navigate(`/customer-engagement/customers/${collection?.id || ''}`, {
      state: collection ? { collection, categoryId: collection.categoryId } : null,
    });
  };

  return (
    <header className="relative overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.04)]">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${collection?.accent || 'from-primary to-[#6B4FE0]'}`}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-10 -top-16 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(15,118,110,0.08)_0%,rgba(58,16,205,0.05)_42%,transparent_72%)]"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-6 lg:py-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#717171]">
            <FolderOpen className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            {collection?.category ? <span>{collection.category}</span> : null}
            {collection?.category ? (
              <span className="text-[#D4D4D8]" aria-hidden="true">
                /
              </span>
            ) : null}
            <span className="text-primary">{collection?.name || 'Collection'}</span>
          </div>

          <h1 className="mt-2 text-xl font-bold tracking-tight text-[#0B1354] sm:text-2xl">
            Contacts
          </h1>
          <p className="mt-1.5 text-sm text-[#717171] sm:text-base">
            Manage, search and review your contacts
            {collection?.name ? (
              <>
                {' '}
                in <span className="font-semibold text-[#0B1354]">{collection.name}</span>
              </>
            ) : null}
            {uploadLabel ? (
              <>
                {' '}
                from <span className="font-semibold text-[#0B1354]">{uploadLabel}</span>
              </>
            ) : null}
            .
          </p>
          {totalContacts != null ? (
            <p className="mt-2 text-sm font-semibold tabular-nums text-[#0F766E]">
              {Number(totalContacts).toLocaleString()} contact
              {Number(totalContacts) === 1 ? '' : 's'}
            </p>
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-end lg:w-auto">
          <PageBackButton onClick={backToUploads} detail="Uploads" />

          {onAddCustomer ? (
            <>
              <span
                className="hidden h-auto w-px self-stretch bg-[#EEF0F4] sm:mx-0.5 sm:block"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={onAddCustomer}
                className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#320EB8]"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add Customer
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
