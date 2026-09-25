import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import AnimatedModal from '../../motion/AnimatedModal';

export default function WriteNoteModal({ isOpen, onClose, customer, onPublish }) {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) setNote('');
  }, [isOpen, customer?.id]);

  const handlePublish = () => {
    if (!note.trim() || !customer) return;
    onPublish(customer, note.trim());
    onClose();
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      panelClassName="relative w-full max-w-lg overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_24px_64px_rgba(11,19,84,0.18)]"
    >
      <div className="border-b border-[#F0F2F7] px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#0B1354]">Write Note</h2>
            <p className="mt-1 text-sm text-[#717171]">
              Add a note for{' '}
              <span className="font-semibold text-[#0B1354]">{customer?.fullName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm text-[#717171] transition-colors hover:bg-[#F7F8FF] hover:text-[#0B1354]"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6">
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={6}
          placeholder="Write your note..."
          className="w-full resize-none rounded-sm border border-[#E4E4E7] bg-[#FAFBFC] px-4 py-3 text-sm text-[#0B1354] outline-none transition-all placeholder:text-[#717171] focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10"
        />
      </div>

      <div className="border-t border-[#F0F2F7] px-5 py-4 sm:px-6">
        <button
          type="button"
          onClick={handlePublish}
          disabled={!note.trim()}
          className="w-full cursor-pointer rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.25)] transition-all hover:bg-[#320EB8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Publish
        </button>
      </div>
    </AnimatedModal>
  );
}
