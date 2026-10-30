import { clsx } from 'clsx';

export default function SignUpProgress({ steps, activeStep, completedCount }) {
  const progressPercent = (completedCount / steps.length) * 100;

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-xs text-[#717171] sm:text-sm">
        <span>Overall Progress</span>
        <span className="font-medium text-[#0B1354]">
          {completedCount}/{steps.length} Steps Completed
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#E8EAEF]">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div
        className="mt-5 flex flex-nowrap items-center gap-1.5 sm:justify-center sm:gap-3"
        role="list"
        aria-label="Signup steps"
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeStep;
          const isComplete = index < activeStep;

          return (
            <div
              key={step.id}
              role="listitem"
              aria-current={isActive ? 'step' : undefined}
              aria-label={step.label}
              className={clsx(
                'flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full border px-2 py-1.5 text-[11px] font-medium transition-colors sm:flex-none sm:gap-2 sm:px-4 sm:py-2 sm:text-xs',
                isActive || isComplete
                  ? 'border-primary bg-primary text-white'
                  : 'border-[#E4E4E7] bg-white text-[#717171]',
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" strokeWidth={2} />
              <span className="truncate sm:hidden">{step.shortLabel || step.label}</span>
              <span className="hidden whitespace-nowrap sm:inline">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
