import { motion, useReducedMotion } from 'framer-motion';
import { VARIANTS, defaultTransition, staggerContainer } from './motionPresets';

export function StaggerReveal({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0.06,
  once = true,
  amount = 0.12,
  when = 'scroll',
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const motionProps =
    when === 'load'
      ? { initial: 'hidden', animate: 'visible' }
      : {
          initial: 'hidden',
          whileInView: 'visible',
          viewport: { once, amount },
        };

  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger, delayChildren)}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variant = 'fadeUp',
  transition = defaultTransition,
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={VARIANTS[variant] ?? VARIANTS.fadeUp}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
