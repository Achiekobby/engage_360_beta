export default function ContactsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)]">
      <div className="border-b border-[#F0F2F7] bg-[#FAFBFC] px-4 py-3.5">
        <div className="h-3 w-40 animate-pulse rounded bg-[#E8EBF2]" />
      </div>
      <div className="divide-y divide-[#F0F2F7]">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 px-4 py-4">
            <div className="h-4 w-4 animate-pulse rounded bg-[#E8EBF2]" />
            <div className="h-4 w-36 animate-pulse rounded bg-[#E8EBF2]" />
            <div className="hidden h-4 w-24 animate-pulse rounded bg-[#E8EBF2] sm:block" />
            <div className="hidden h-4 w-40 animate-pulse rounded bg-[#E8EBF2] md:block" />
            <div className="ml-auto h-4 w-20 animate-pulse rounded bg-[#E8EBF2]" />
          </div>
        ))}
      </div>
    </div>
  );
}
