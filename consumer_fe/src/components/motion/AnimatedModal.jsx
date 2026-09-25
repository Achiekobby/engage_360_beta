import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { modalTransition } from './motionPresets';

export default function AnimatedModal({
  isOpen,
  onClose,
  children,
  panelClassName,
  backdropClassName = 'absolute inset-0 bg-[#0B1354]/50 backdrop-blur-sm',
  closeOnBackdrop = true,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.button
            type="button"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={modalTransition}
            className={backdropClassName}
            onClick={closeOnBackdrop ? onClose : undefined}
            aria-label="Close dialog"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={modalTransition}
            className={panelClassName}
          >
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
