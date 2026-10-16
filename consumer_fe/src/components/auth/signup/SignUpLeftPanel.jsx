import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { clsx } from 'clsx';
import { defaultTransition } from '../../motion/motionPresets';

export default function SignUpLeftPanel({
  panel,
  activeStep = 0,
  totalSteps = 0,
  showProgress = true,
}) {
  return (
    <div className="relative hidden overflow-hidden lg:flex lg:h-full lg:w-[42%] lg:shrink-0 xl:w-[44%]">
      <AnimatePresence mode="wait">
        <motion.img
          key={panel.id}
          src={panel.image}
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
            key={panel.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={defaultTransition}
            className="max-w-md"
          >
            <h2 className="text-[1.65rem] font-bold leading-tight tracking-tight text-white xl:text-[1.85rem]">
              {panel.title}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/90 xl:text-base">
              {panel.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div>
          {showProgress ? (
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <motion.span
                  key={index}
                  animate={{
                    width: index === activeStep ? 32 : 8,
                    backgroundColor:
                      index === activeStep ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  className="h-2 rounded-full"
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : null}
          <p className={clsx('text-sm text-white/90', showProgress && 'mt-6')}>
            Already have an account?{' '}
            <Link
              to="/signin"
              className="font-semibold text-white underline-offset-2 hover:underline"
            >
              Sign in
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
