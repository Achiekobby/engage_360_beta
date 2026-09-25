import { Search } from 'lucide-react';

export default function HelpCenterSearch({ value, onChange, onSubmit }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
      className="overflow-hidden rounded-xl border border-[#E4E4E7] bg-white shadow-[0_4px_24px_rgba(11,19,84,0.06)]"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-1 items-center gap-3 px-4 py-3.5 sm:px-5">
          <Search className="h-5 w-5 shrink-0 text-[#A1A1AA]" />
          <input
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Ask a Question.."
            className="w-full bg-transparent text-sm text-[#0B1354] placeholder:text-[#A1A1AA] outline-none sm:text-base"
          />
        </div>
        <button
          type="submit"
          aria-label="Search"
          className="flex items-center justify-center bg-primary px-4 py-3.5 text-white transition-colors hover:bg-primary/90 sm:shrink-0 cursor-pointer sm:px-5"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
