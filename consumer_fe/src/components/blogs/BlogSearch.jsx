import { Info, Search } from 'lucide-react';

export default function BlogSearch({ value, onChange }) {
  return (
    <div className="flex w-full max-w-xs items-center gap-2 rounded-full border border-[#E4E4E7] bg-white px-4 py-2.5 shadow-sm sm:max-w-sm sm:py-3">
      <Search className="h-4 w-4 shrink-0 text-[#A1A1AA]" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="search..."
        className="w-full bg-transparent text-sm text-[#0B1354] placeholder:text-[#A1A1AA] outline-none"
      />
      <button
        type="button"
        aria-label="Search tips"
        className="shrink-0 text-[#A1A1AA] transition-colors hover:text-primary cursor-pointer"
      >
        <Info className="h-4 w-4" />
      </button>
    </div>
  );
}
