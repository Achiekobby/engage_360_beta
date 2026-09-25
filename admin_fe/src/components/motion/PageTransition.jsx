import { motion, useReducedMotion } from 'framer-motion';
import { pageTransition } from './motionPresets';

export default function PageTransition({ children, className }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
