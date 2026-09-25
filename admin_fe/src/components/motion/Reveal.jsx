import { motion, useReducedMotion } from 'framer-motion';
import { VARIANTS, defaultTransition } from './motionPresets';

export default function Reveal({
  children,
  className,
  variant = 'fadeUp',
  delay = 0,
  duration,
  once = true,
  amount = 0.18,
  when = 'scroll',
  as = 'div',
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as] ?? motion.div;
  const transition = {
    ...defaultTransition,
    delay,
    ...(duration != null ? { duration } : {}),
  };

  const motionProps =
    when === 'load'
      ? { initial: 'hidden', animate: 'visible' }
      : {
          initial: 'hidden',
          whileInView: 'visible',
          viewport: { once, amount },
        };

  return (
    <MotionTag
      className={className}
      variants={VARIANTS[variant] ?? VARIANTS.fadeUp}
      transition={transition}
      {...motionProps}
    >
      {children}
    </MotionTag>
  );
}
