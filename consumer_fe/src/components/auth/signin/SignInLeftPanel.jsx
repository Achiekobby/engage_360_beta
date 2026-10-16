import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { defaultTransition } from '../../motion/motionPresets';
import { SIGN_IN_SLIDES } from './signInData';

const INTERVAL_MS = 6000;

export default function SignInLeftPanel() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((s) => (s + 1) % SIGN_IN_SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const slide = SIGN_IN_SLIDES[activeSlide];

  return (
    <div className="relative hidden min-h-[520px] w-full shrink-0 self-stretch overflow-hidden lg:flex lg:w-[44%] lg:flex-col">
      <AnimatePresence mode="wait">
        <motion.img
          key={slide.id}
          src={slide.image}
          alt=""
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ...defaultTransition, duration: 0.65 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#3A10CD]/45 via-[#0B1354]/40 to-[#3A10CD]/30"
        aria-hidden="true"
      />

      <div className="relative z-[1] flex w-full flex-1 flex-col justify-between self-stretch p-8 xl:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={defaultTransition}
            className="max-w-sm"
          >
            <h2 className="text-xl font-bold leading-tight tracking-tight text-white xl:text-2xl">
              {slide.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/90 xl:text-[15px]">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-2">
          {SIGN_IN_SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveSlide(index)}
              className="cursor-pointer"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeSlide ? 'true' : undefined}
            >
              <motion.span
                animate={{
                  width: index === activeSlide ? 32 : 8,
                  backgroundColor: index === activeSlide ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className="block h-2 rounded-full"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
