export const EASE_OUT = [0.22, 1, 0.36, 1];

export const defaultTransition = {
  duration: 0.55,
  ease: EASE_OUT,
};

export const springTransition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
};

export const modalTransition = {
  duration: 0.32,
  ease: EASE_OUT,
};

export const stepTransition = {
  duration: 0.38,
  ease: EASE_OUT,
};

export const pageTransition = {
  duration: 0.38,
  ease: EASE_OUT,
};

export const accordionTransition = {
  duration: 0.32,
  ease: EASE_OUT,
};

export const VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -24 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -36 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 36 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
  floatUp: {
    hidden: { opacity: 0, y: 48, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0.06) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});
