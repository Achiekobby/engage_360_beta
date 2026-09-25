import { clsx } from 'clsx';
import { Check } from 'lucide-react';
import { ONBOARDING_STEPS } from '../../constants/businesses';

export default function OnboardingStepper({ step, onStepSelect }) {
  const progress = ((step + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <nav aria-label="Onboarding progress" className="mb-8">
      <div className="mb-3 flex items-center justify-between text-xs text-[#717171] sm:text-sm">
        <span>
          Step {step + 1} of {ONBOARDING_STEPS.length}
        </span>
        <span className="font-medium text-[#0B1354]">{ONBOARDING_STEPS[step].label}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#E8EAEF]" aria-hidden="true">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
        {ONBOARDING_STEPS.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === step;
          const isComplete = index < step;
          const canSelect = index < step;

          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={index > step}
                onClick={() => canSelect && onStepSelect(index)}
                aria-current={isActive ? 'step' : undefined}
                className={clsx(
                  'flex w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors sm:px-3 sm:py-2.5',
                  isActive && 'border-primary bg-primary text-white shadow-[0_8px_20px_rgba(37,99,235,0.18)]',
                  isComplete &&
                    'cursor-pointer border-primary/20 bg-[#EFF6FF] text-primary hover:border-primary/40',
                  !isActive && !isComplete && 'cursor-default border-[#E4E4E7] bg-white text-[#717171]',
                )}
              >
                <span
                  className={clsx(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                    isActive && 'bg-white/15',
                    isComplete && 'bg-primary text-white',
                    !isActive && !isComplete && 'bg-[#F4F4F5]',
                  )}
                >
                  {isComplete ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold sm:text-sm">{item.label}</span>
                  <span
                    className={clsx(
                      'hidden truncate text-[11px] sm:block',
                      isActive ? 'text-white/75' : 'text-[#717171]',
                    )}
                  >
                    {item.description}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
