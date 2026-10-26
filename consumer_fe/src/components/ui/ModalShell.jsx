import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { modalTransition } from '../motion/motionPresets';

/**
 * Accessible modal: focus is moved in, trapped, and restored on close; Escape and
 * backdrop dismiss (unless `dismissible` is false); page scroll is locked with a
 * reference count so stacked modals never fight over `body` overflow.
 */
let scrollLocks = 0;
let previousOverflow = '';

function lockScroll() {
  if (scrollLocks === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  scrollLocks += 1;
}

function unlockScroll() {
  scrollLocks = Math.max(0, scrollLocks - 1);
  if (scrollLocks === 0) document.body.style.overflow = previousOverflow;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const SIZES = {
  sm: 'sm:max-w-[400px]',
  md: 'sm:max-w-[440px]',
  lg: 'sm:max-w-[520px]',
  xl: 'sm:max-w-[600px]',
};

function ModalLayer({ onClose, labelledBy, dismissible, size, panelClassName, children }) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef(null);
  const latest = useRef({ dismissible, onClose });

  // Keep the key handler current without re-running the focus/scroll-lock effect below.
  useEffect(() => {
    latest.current = { dismissible, onClose };
  });

  useEffect(() => {
    const panel = panelRef.current;
    const previouslyFocused = document.activeElement;
    lockScroll();

    if (panel && !panel.contains(document.activeElement)) panel.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && latest.current.dismissible) {
        event.stopPropagation();
        latest.current.onClose?.();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const focusable = [...panel.querySelectorAll(FOCUSABLE)].filter(
        (element) => element.offsetParent !== null,
      );
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      unlockScroll();
      if (previouslyFocused instanceof HTMLElement && document.contains(previouslyFocused)) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4">
      <motion.button
        type="button"
        tabIndex={-1}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={modalTransition}
        onClick={dismissible ? onClose : undefined}
        aria-label="Close dialog"
        className={`absolute inset-0 bg-[#0B1354]/55 backdrop-blur-[3px] ${
          dismissible ? 'cursor-pointer' : 'cursor-default'
        }`}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 28, scale: 0.97 }}
        transition={modalTransition}
        className={`relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_30px_80px_rgba(11,19,84,0.35)] outline-none sm:rounded-3xl ${
          SIZES[size] || SIZES.md
        } ${panelClassName || ''}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function ModalShell({
  open,
  onClose,
  labelledBy,
  dismissible = true,
  size = 'md',
  panelClassName,
  children,
}) {
  return (
    <AnimatePresence>
      {open ? (
        <ModalLayer
          key="modal-layer"
          onClose={onClose}
          labelledBy={labelledBy}
          dismissible={dismissible}
          size={size}
          panelClassName={panelClassName}
        >
          {children}
        </ModalLayer>
      ) : null}
    </AnimatePresence>
  );
}
