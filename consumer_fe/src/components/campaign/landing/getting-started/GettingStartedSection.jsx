import { GETTING_STARTED_STEPS } from './gettingStartedData';
import { Reveal, StaggerReveal, StaggerItem } from '../../../motion';

export default function GettingStartedSection() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-8xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <h2 className="text-center text-[1.75rem] font-bold tracking-tight text-[#0B1354] sm:text-[2rem] lg:text-[2.15rem]">
            Getting Started is Simple
          </h2>
        </Reveal>

        <div className="relative mt-12 sm:mt-14 lg:mt-16">
          <div
            className="pointer-events-none absolute left-[8%] right-[8%] top-7 hidden h-px bg-[#E4E6EC] md:block lg:top-8"
            aria-hidden="true"
          />

          <StaggerReveal
            className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-10"
            stagger={0.12}
          >
            {GETTING_STARTED_STEPS.map(({ step, title, description }) => (
              <StaggerItem key={step}>
                <article className="flex flex-col items-center text-center">
                  <div className="relative z-[1] flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white shadow-[0_8px_24px_rgba(58,16,205,0.25)] sm:h-16 sm:w-16 sm:text-2xl">
                    {step}
                  </div>
                  <h3 className="mt-5 text-base font-bold text-[#0B1354] sm:mt-6 sm:text-lg">
                    {title}
                  </h3>
                  <p className="mt-2.5 max-w-[17rem] text-[13px] leading-relaxed text-[#717171] sm:text-sm">
                    {description}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}
