import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SmsTemplateDetailView from './SmsTemplateDetailView';

export default function SmsTemplateDetailModal({ template, isOpen, onClose, onUse }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return undefined;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && template ? (
        <div className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8">
          <motion.button
            type="button"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#0B1354]/45 backdrop-blur-[2px]"
            onClick={onClose}
            aria-label="Close template preview"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="template-detail-title"
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="relative z-10 flex h-[calc(100dvh-2rem)] max-h-[calc(100dvh-2rem)] w-[min(100%,74rem)] flex-col overflow-hidden rounded-xl border border-white/60 bg-white shadow-[0_28px_80px_rgba(11,19,84,0.28)] sm:h-[calc(100dvh-3rem)] sm:max-h-[calc(100dvh-3rem)] lg:h-[calc(100dvh-4rem)] lg:max-h-[calc(100dvh-4rem)]"
          >
            <SmsTemplateDetailView
              template={template}
              onBack={onClose}
              onUse={() => onUse(template)}
              embedded
            />
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
