import { Check, Sparkles, X } from 'lucide-react';
import { clsx } from 'clsx';
import AnimatedModal from '../motion/AnimatedModal';

const VARIANTS = {
  launch: {
    gradient: 'from-primary via-[#4F2BD4] to-[#6B4FE0]',
    ring: 'ring-primary/20',
    iconBg: 'bg-primary',
    glow: 'shadow-[0_12px_32px_rgba(58,16,205,0.35)]',
    button: 'bg-primary hover:bg-[#320EB8] shadow-[0_4px_16px_rgba(58,16,205,0.28)]',
    sparkle: 'text-[#C4B5FD]',
  },
  'test-blast': {
    gradient: 'from-[#1F9D55] via-[#22B564] to-[#34D399]',
    ring: 'ring-[#1F9D55]/20',
    iconBg: 'bg-[#1F9D55]',
    glow: 'shadow-[0_12px_32px_rgba(31,157,85,0.35)]',
    button: 'bg-[#1F9D55] hover:bg-[#178A47] shadow-[0_4px_16px_rgba(31,157,85,0.28)]',
    sparkle: 'text-[#A7F3D0]',
  },
};

export default function CampaignSuccessModal({
  isOpen,
  onClose,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'launch',
}) {
  const theme = VARIANTS[variant] || VARIANTS.launch;

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      panelClassName="relative w-full max-w-md overflow-hidden rounded-xl border-2 border-[#EEF0F4] bg-white shadow-[0_28px_72px_rgba(11,19,84,0.22)]"
    >
      <div className={clsx('relative h-28 bg-gradient-to-br px-6', theme.gradient)}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Sparkles
            className={clsx('absolute left-6 top-5 h-5 w-5 opacity-80', theme.sparkle)}
            strokeWidth={2}
          />
          <Sparkles
            className={clsx('absolute right-10 top-7 h-4 w-4 opacity-60', theme.sparkle)}
            strokeWidth={2}
          />
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 left-1/3 h-24 w-24 rounded-full bg-white/10" />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>

      <div className="relative -mt-10 px-6 pb-8 pt-0 text-center sm:px-8">
        <div
          className={clsx(
            'mx-auto flex h-[5.25rem] w-[5.25rem] items-center justify-center rounded-full bg-white ring-8',
            theme.ring,
            theme.glow,
          )}
        >
          <span
            className={clsx(
              'flex h-16 w-16 items-center justify-center rounded-full text-white',
              theme.iconBg,
            )}
          >
            <Check className="h-8 w-8" strokeWidth={3} />
          </span>
        </div>

        <h2 className="mt-5 text-xl font-bold leading-snug text-[#0B1354] sm:text-2xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#717171] sm:text-[15px]">
          {description}
        </p>

        <button
          type="button"
          onClick={onAction || onClose}
          className={clsx(
            'mt-8 w-full cursor-pointer rounded-sm px-4 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5',
            theme.button,
          )}
        >
          {actionLabel}
        </button>
      </div>
    </AnimatedModal>
  );
}
