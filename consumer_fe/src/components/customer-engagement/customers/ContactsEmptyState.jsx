import { Upload } from 'lucide-react';

export default function ContactsEmptyState({ onImport }) {
  return (
    <div className="rounded-sm border border-dashed border-[#C9E8E3] bg-gradient-to-br from-white via-[#F7FBFA] to-[#EEF8F6] px-6 py-14 text-center shadow-[0_4px_20px_rgba(15,118,110,0.05)] sm:px-8">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-sm bg-gradient-to-br from-[#0F766E] to-[#14B8A6] text-white shadow-[0_8px_24px_rgba(15,118,110,0.28)]">
        <Upload className="h-6 w-6" strokeWidth={2.25} aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-[#0B1354]">No contacts yet</h2>
      <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-[#5C7A76]">
        Your contacts will appear here after you import your first contact list.
      </p>
      {onImport ? (
        <button
          type="button"
          onClick={onImport}
          className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-sm bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(15,118,110,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#0D9488]"
        >
          <Upload className="h-4 w-4" strokeWidth={2.25} />
          Import Contacts
        </button>
      ) : null}
    </div>
  );
}
