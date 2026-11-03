import { useEffect } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { clsx } from 'clsx';
import AnimatedModal from '../../motion/AnimatedModal';

const TONE_STYLES = {
  danger: {
    bar: 'from-[#E53935] via-[#EF5350] to-[#F5A623]',
    badge: 'bg-[#FEECEC] text-[#E53935] ring-[#E53935]/15',
    wash: 'bg-[radial-gradient(circle,rgba(229,57,53,0.12)_0%,transparent_70%)]',
    confirm:
      'bg-[#E53935] text-white shadow-[0_8px_24px_rgba(229,57,53,0.28)] hover:bg-[#C62828] hover:shadow-[0_10px_28px_rgba(229,57,53,0.34)]',
    callout: 'border-[#FECACA] bg-[#FFF7F7] text-[#B42318]',
  },
  primary: {
    bar: 'from-primary via-[#6B4FE0] to-[#5B9FD4]',
    badge: 'bg-[#EDE8F8] text-primary ring-primary/15',
    wash: 'bg-[radial-gradient(circle,rgba(58,16,205,0.10)_0%,transparent_70%)]',
    confirm:
      'bg-primary text-white shadow-[0_8px_24px_rgba(58,16,205,0.28)] hover:bg-[#320EB8] hover:shadow-[0_10px_28px_rgba(58,16,205,0.34)]',
    callout: 'border-[#DDD6FE] bg-[#F7F8FF] text-[#4338CA]',
  },
};

export default function ActionConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  entityLabel,
  entityMeta,
  warning,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  icon: Icon = AlertTriangle,
  tone = 'danger',
  isLoading = false,
}) {
  const styles = TONE_STYLES[tone] || TONE_STYLES.danger;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !isLoading) onClose?.();
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
      panelClassName="relative w-full max-w-[26rem] overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_28px_72px_rgba(11,19,84,0.2)]"
    >
      <div className={`h-1 w-full bg-gradient-to-r ${styles.bar}`} aria-hidden="true" />
      <div
        className={`pointer-events-none absolute -right-14 -top-16 h-36 w-36 rounded-full ${styles.wash}`}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="absolute right-3 top-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm text-[#717171] transition-colors hover:bg-[#F7F8FF] hover:text-[#0B1354] disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Close"
      >
        <X className="h-5 w-5" strokeWidth={2} />
      </button>

      <div className="relative px-6 pb-6 pt-7 sm:px-7 sm:pb-7 sm:pt-8">
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-sm ring-1 ${styles.badge}`}>
          <Icon className="h-6 w-6" strokeWidth={2.25} />
        </div>

        <div className="mt-5 text-center">
          <h2 className="text-xl font-bold tracking-tight text-[#0B1354]">{title}</h2>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-[#717171]">{description}</p>
          ) : null}
        </div>

        {entityLabel ? (
          <div className="mt-5 rounded-sm border border-[#EEF0F4] bg-[#FAFBFC] px-4 py-3 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9AA0B0]">
              Selected
            </p>
            <p className="mt-1 truncate text-sm font-bold text-[#0B1354]">{entityLabel}</p>
            {entityMeta ? (
              <p className="mt-0.5 text-xs leading-relaxed text-[#717171]">{entityMeta}</p>
            ) : null}
          </div>
        ) : null}

        {warning ? (
          <div className={clsx('mt-4 rounded-sm border px-3.5 py-3 text-left text-xs leading-relaxed', styles.callout)}>
            {warning}
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer rounded-sm border border-[#E4E4E7] bg-white px-4 py-3 text-sm font-semibold text-[#0B1354] transition-colors hover:bg-[#F7F8FF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={clsx(
              'inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm px-4 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60',
              styles.confirm,
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                Please wait...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </AnimatedModal>
  );
}
