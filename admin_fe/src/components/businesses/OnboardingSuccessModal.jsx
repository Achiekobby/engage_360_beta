import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import LogoMark from '../brand/LogoMark';
import { AnimatedModal } from '../motion';

export default function OnboardingSuccessModal({ business, onView, onBackToList }) {
  const primaryRef = useRef(null);
  const isOpen = Boolean(business);

  useEffect(() => {
    if (!isOpen) return undefined;
    primaryRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') onView();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onView]);

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onView}
      closeOnBackdrop={false}
      labelledBy="onboarding-success-title"
      panelClassName="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white text-foreground shadow-2xl"
    >
      <button
        type="button"
        onClick={onView}
        className="absolute right-4 top-4 cursor-pointer rounded-lg p-1 text-[#717171] transition-colors hover:bg-[#F4F4F5] hover:text-[#0B1354]"
        aria-label="Close and view business"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="px-6 pb-6 pt-8 text-center">
        <LogoMark size={64} variant="on-white" className="mx-auto" />
        <h2 id="onboarding-success-title" className="mt-5 text-xl font-bold text-[#0B1354]">
          Business onboarded
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#717171]">
          <span className="font-medium text-[#0B1354]">{business?.companyName}</span> is active and can
          sign in with {business?.companyEmail}. No verification step was required.
        </p>

        <div className="mt-6 space-y-2">
          <button
            ref={primaryRef}
            type="button"
            onClick={onView}
            className="w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            View business
          </button>
          <button
            type="button"
            onClick={onBackToList}
            className="w-full cursor-pointer rounded-lg py-3 text-sm font-semibold text-[#0B1354] transition-colors hover:bg-[#F4F4F5]"
          >
            Back to businesses
          </button>
        </div>
      </div>
    </AnimatedModal>
  );
}
