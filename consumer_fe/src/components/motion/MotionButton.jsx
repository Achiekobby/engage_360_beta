import { motion, useReducedMotion } from 'framer-motion';

export default function MotionButton({ className, children, ...props }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <button type="button" className={className} {...props}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      className={className}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
