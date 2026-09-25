import { Check } from 'lucide-react';
import { clsx } from 'clsx';
import { WIZARD_STEPS } from './campaignsData';

export default function CampaignWizardStepper({ currentStep, steps = WIZARD_STEPS }) {
  return (
    <ol className="flex items-center gap-1 sm:gap-2">
      {steps.map((step, index) => {
        const active = currentStep === step.id;
        const completed = currentStep > step.id;

        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
            <div className="flex min-w-0 flex-col items-center gap-2 sm:flex-row sm:gap-2.5">
              <span
                className={clsx(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300',
                  completed
                    ? 'bg-primary text-white shadow-[0_4px_12px_rgba(58,16,205,0.28)]'
                    : active
                      ? 'bg-primary text-white shadow-[0_4px_12px_rgba(58,16,205,0.28)] ring-4 ring-primary/15'
                      : 'bg-[#F0F2F7] text-[#717171]',
                )}
              >
                {completed ? <Check className="h-4 w-4" strokeWidth={3} /> : step.id}
              </span>
              <span
                className={clsx(
                  'truncate text-[11px] font-semibold sm:text-sm',
                  active ? 'text-primary' : completed ? 'text-[#0B1354]' : 'text-[#717171]',
                )}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 ? (
              <span
                className={clsx(
                  'mx-1 hidden h-0.5 flex-1 rounded-full transition-colors sm:block',
                  completed ? 'bg-primary' : 'bg-[#EEF0F4]',
                )}
                aria-hidden="true"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
