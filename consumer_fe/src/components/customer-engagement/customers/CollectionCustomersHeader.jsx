import { Link } from 'react-router-dom';
import { ArrowLeft, FolderOpen, Plus } from 'lucide-react';

export default function CollectionCustomersHeader({ collection, onAddCustomer }) {
  return (
    <header className="relative overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.04)]">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${collection?.accent || 'from-primary to-[#6B4FE0]'}`}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
        <div className="min-w-0">
          <Link
            to="/customer-engagement/customers"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#717171] transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Back to collections
          </Link>

          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#717171]">
            <FolderOpen className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            <span>{collection?.name}</span>
          </div>

          <h1 className="mt-2 text-xl font-bold tracking-tight text-[#0B1354] sm:text-2xl">
            Manage all your customers at one place
          </h1>
          <p className="mt-1.5 text-sm text-[#717171] sm:text-base">
            View, segment, and onboard customers in this collection.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddCustomer}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#320EB8]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add Customers
        </button>
      </div>
    </header>
  );
}
