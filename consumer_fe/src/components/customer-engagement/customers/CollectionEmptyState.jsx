import { FolderOpen, Plus } from 'lucide-react';

export default function CollectionEmptyState({
  title = 'No collections found',
  description = 'Try adjusting your search or add a collection in this category.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-[#E4E4E7] bg-white px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F8FF] text-primary">
        <FolderOpen className="h-6 w-6" strokeWidth={2} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-[#0B1354]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-[#717171]">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.22)] transition-all hover:bg-[#320EB8]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
