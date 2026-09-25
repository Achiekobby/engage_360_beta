import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { stepTransition } from './motionPresets';

export default function AnimateStep({ stepKey, children, className, direction = 1 }) {
  const reduceMotion = useReducedMotion();
  const offset = direction >= 0 ? 24 : -24;

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: offset }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -offset }}
        transition={stepTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
