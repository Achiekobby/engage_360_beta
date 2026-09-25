import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { StaggerItem, StaggerReveal } from '../motion';
import WebinarVideoCard from './WebinarVideoCard';

export default function WebinarGrid({ webinars }) {
  const reduceMotion = useReducedMotion();

  if (!webinars.length) {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[#E4E4E7] bg-white px-5 py-12 text-center"
      >
        <p className="text-sm text-[#717171]">No webinars found for this category.</p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={webinars.map((webinar) => webinar.id).join('-')}
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <StaggerReveal
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-7"
          stagger={0.08}
        >
          {webinars.map((webinar) => (
            <StaggerItem key={webinar.id}>
              <WebinarVideoCard webinar={webinar} />
            </StaggerItem>
          ))}
        </StaggerReveal>
      </motion.div>
    </AnimatePresence>
  );
}
