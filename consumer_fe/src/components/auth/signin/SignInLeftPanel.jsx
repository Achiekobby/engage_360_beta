import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="relative hidden overflow-hidden lg:flex lg:h-full lg:w-1/2 lg:shrink-0">
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

      <div className="relative z-[1] flex h-full w-full flex-col justify-between p-10 xl:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={defaultTransition}
            className="max-w-md"
          >
            <h2 className="text-[1.65rem] font-bold leading-tight tracking-tight text-white xl:text-[1.85rem]">
              {slide.title}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/90 xl:text-base">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div>
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
          <p className="mt-6 text-sm text-white/90">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-white underline-offset-2 hover:underline"
            >
              Sign up
            </Link>
          </p>
          <Link
            to="/"
            className="mt-3 inline-block text-xs text-white/70 transition-colors hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
