import { FolderOpen } from 'lucide-react';

export default function CollectionEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-[#E4E4E7] bg-white px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F8FF] text-primary">
        <FolderOpen className="h-6 w-6" strokeWidth={2} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-[#0B1354]">No collections found</h3>
      <p className="mt-2 max-w-sm text-sm text-[#717171]">
        Try adjusting your search or create a new customer category to get started.
      </p>
    </div>
  );
}
