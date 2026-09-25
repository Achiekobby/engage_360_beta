import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { accordionTransition } from '../motion/motionPresets';

export default function FaqAccordion({ items }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? null);
  const reduceMotion = useReducedMotion();

  if (!items.length) {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={accordionTransition}
        className="rounded-xl border border-[#E4E4E7] bg-white px-5 py-10 text-center"
      >
        <p className="text-sm text-[#717171]">No results found. Try a different search or category.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={accordionTransition}
      className="divide-y divide-[#E4E4E7] rounded-xl border border-[#E4E4E7] bg-white"
    >
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#FAFAFA] cursor-pointer sm:px-6 sm:py-5"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-medium text-[#0B1354] sm:text-base">{item.question}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={accordionTransition}
                className="shrink-0"
              >
                <ChevronDown className="h-5 w-5 text-[#717171]" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={accordionTransition}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 sm:px-6 sm:pb-5">
                    <p className="text-sm leading-relaxed text-[#717171]">{item.answer}</p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.div>
  );
}
