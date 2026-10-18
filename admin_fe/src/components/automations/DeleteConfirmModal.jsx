import { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { AnimatedModal } from '../motion';

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  count = 1,
  itemLabel,
}) {
  const confirmRef = useRef(null);
  const isBulk = count > 1;
  const subject = itemLabel
    ? itemLabel
    : isBulk
      ? `${count} automations`
      : 'this automation';

  useEffect(() => {
    if (!open) return undefined;
    confirmRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatedModal
      isOpen={open}
      onClose={onClose}
      labelledBy="automation-delete-title"
      panelClassName="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#FEE2E2] bg-white text-foreground shadow-[0_24px_60px_rgba(11,19,84,0.18)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F87171] via-[#EF4444] to-[#DC2626]" />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 cursor-pointer rounded-lg p-1 text-[#717171] transition-colors hover:bg-[#F4F4F5] hover:text-[#0B1354]"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="px-6 pb-6 pt-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEF2F2] text-[#DC2626] ring-8 ring-[#FEF2F2]/60">
          <AlertTriangle className="h-7 w-7" strokeWidth={2} />
        </div>

        <h2
          id="automation-delete-title"
          className="mt-5 text-center text-xl font-bold tracking-tight text-[#0B1354]"
        >
          {isBulk ? 'Delete automations?' : 'Delete automation?'}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-relaxed text-[#717171]">
          You are about to permanently remove{' '}
          <span className="font-semibold text-[#0B1354]">{subject}</span> from the platform list.
          This action cannot be undone.
        </p>

        <div className="mt-6 rounded-xl border border-[#FEE2E2] bg-[#FFF7F7] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#B91C1C]">
            What happens next
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-[#7F1D1D]">
            <li>Selected rows leave the upcoming / history list immediately.</li>
            <li>Businesses may lose the related schedule until reconfigured.</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-[#E4E4E7] bg-white px-5 py-2.5 text-sm font-semibold text-[#0B1354] transition-colors hover:bg-[#F4F4F5]"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#DC2626] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(220,38,38,0.28)] transition-colors hover:bg-[#B91C1C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]/35"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
            {isBulk ? `Delete ${count}` : 'Delete'}
          </button>
        </div>
      </div>
    </AnimatedModal>
  );
}
