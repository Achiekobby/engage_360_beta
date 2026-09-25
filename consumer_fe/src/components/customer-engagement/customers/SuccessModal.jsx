import { Check, X } from 'lucide-react';
import AnimatedModal from '../../motion/AnimatedModal';

function SuccessBadge() {
  return (
    <div className="relative mx-auto flex h-[4.75rem] w-[4.75rem] items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full text-primary drop-shadow-[0_8px_24px_rgba(58,16,205,0.28)]"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M50 2 61.8 28.2 90 24.6 73.8 46.8 82.4 74 50 62 17.6 74 26.2 46.8 10 24.6 38.2 28.2Z"
        />
      </svg>
      <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary/95">
        <Check className="h-6 w-6 text-white" strokeWidth={3} />
      </span>
    </div>
  );
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      panelClassName="relative w-full max-w-md overflow-hidden rounded-sm border border-[#EEF0F4] bg-white px-6 py-8 shadow-[0_24px_64px_rgba(11,19,84,0.18)] sm:px-8 sm:py-10"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm text-[#717171] transition-colors hover:bg-[#F7F8FF] hover:text-[#0B1354]"
        aria-label="Close"
      >
        <X className="h-5 w-5" strokeWidth={2} />
      </button>

      <div className="flex flex-col items-center text-center">
        <SuccessBadge />

        <h2 className="mt-6 text-xl font-bold leading-snug text-[#0B1354] sm:text-[1.35rem]">
          {title}
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#717171] sm:text-base">
          {description}
        </p>

        <button
          type="button"
          onClick={onAction || onClose}
          className="mt-8 w-full cursor-pointer rounded-sm bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#320EB8] hover:shadow-[0_8px_24px_rgba(58,16,205,0.32)]"
        >
          {actionLabel}
        </button>
      </div>
    </AnimatedModal>
  );
}

export const ONBOARD_SUCCESS = {
  title: 'Customer Onboarded Successfully',
  description: 'The customer profile has been successfully created and activated.',
  actionLabel: 'Onboard More Customer',
};

export const NOTE_PUBLISHED_SUCCESS = {
  title: 'Note Published Successfully',
  description: 'Your note has been published and is now available for viewing.',
  actionLabel: 'Complete',
};

export const CATEGORY_CREATED_SUCCESS = {
  title: 'Customer Category Created',
  description: 'You have successfully created your customer category.',
  actionLabel: 'Create Collection',
};

export const COLLECTION_CREATED_SUCCESS = {
  title: 'Collection Creation Successful',
  description:
    'You have successfully created your collection. Start onboarding your customers.',
  actionLabel: 'Add Customers',
};
