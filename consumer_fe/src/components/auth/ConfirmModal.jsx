import { useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { clsx } from 'clsx';
import { AnimatedModal } from '../motion';
import {
  authPrimaryBtnClass,
  authSecondaryBtnClass,
} from './authStyles';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Continue',
  cancelLabel = 'Cancel',
  icon: Icon,
  isLoading = false,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isLoading, onClose]);

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      closeOnBackdrop={!isLoading}
      panelClassName="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(11,19,84,0.18)] sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="absolute right-4 top-4 rounded-lg p-1.5 text-[#717171] transition-colors hover:bg-[#F4F4F5] hover:text-[#0B1354] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      {Icon ? (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
      ) : null}

      <div className={clsx('text-center', Icon && 'px-2')}>
        <h2 id="confirm-modal-title" className="text-lg font-bold text-[#0B1354] sm:text-xl">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#717171]">{description}</p>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className={clsx(authSecondaryBtnClass, 'sm:w-auto sm:min-w-[120px]')}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={clsx(authPrimaryBtnClass, 'sm:w-auto sm:min-w-[120px]')}
        >
          {isLoading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Please wait...
            </span>
          ) : (
            confirmLabel
          )}
        </button>
      </div>
    </AnimatedModal>
  );
}
