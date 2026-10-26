import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { AnimatedModal } from '../motion';

export default function RewardStatusModal({ reward, onClose, onConfirm }) {
  const confirmRef = useRef(null);
  const open = Boolean(reward);

  useEffect(() => {
    if (!open) return undefined;
    confirmRef.current?.focus();
    return undefined;
  }, [open]);

  return (
    <AnimatedModal
      isOpen={open}
      onClose={onClose}
      labelledBy="reward-status-title"
      panelClassName="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#FDE68A] bg-white text-foreground shadow-[0_24px_60px_rgba(11,19,84,0.18)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[#D97706]" />
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 cursor-pointer rounded-lg p-1 text-[#717171] transition-colors hover:bg-[#F4F4F5] hover:text-[#0B1354]"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="px-6 pb-6 pt-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF7E6] text-[#D97706] ring-8 ring-[#FFF7E6]/70">
          <AlertTriangle className="h-7 w-7" strokeWidth={2} />
        </div>
        <h2 id="reward-status-title" className="mt-5 text-center text-xl font-bold tracking-tight text-[#0B1354]">
          Deactivate {reward?.headline}?
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-relaxed text-[#717171]">
          <span className="font-semibold text-[#0B1354]">{reward?.title}</span> will leave the recipient shop until
          you activate it again. Past redemptions stay in the activity log.
        </p>
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
            onClick={onConfirm}
            className="cursor-pointer rounded-full bg-[#D97706] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#B45309]"
          >
            Deactivate
          </button>
        </div>
      </div>
    </AnimatedModal>
  );
}
