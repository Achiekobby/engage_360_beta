import { RefreshCw, Tag, Target } from 'lucide-react';
import { Reveal, StaggerItem, StaggerReveal } from '../motion';
import { OUTCOME_FEATURES, OUTCOMES_SECTION } from './productOutcomesData';
import ProductOutcomesVisual from './ProductOutcomesVisual';

const ICONS = {
  target: Target,
  refreshCw: RefreshCw,
  tag: Tag,
};

function OutcomeFeature({ title, description, icon }) {
  const Icon = ICONS[icon];

  return (
    <article className="flex gap-4 sm:gap-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#14B8A6] text-white sm:h-12 sm:w-12">
        <Icon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-bold text-[#0B1354] sm:text-lg">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[#717171] sm:text-[15px] sm:leading-7">
          {description}
        </p>
      </div>
    </article>
  );
}

export default function ProductOutcomesSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-8xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="rounded-lg bg-[#F0F4FA] p-6 sm:p-10 lg:p-12 xl:p-14">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-16">
            <Reveal variant="fadeLeft" amount={0.2}>
              <h2 className="text-2xl font-bold text-[#0B1354] sm:text-3xl lg:text-[2rem] lg:leading-tight">
                {OUTCOMES_SECTION.title}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#717171] sm:text-base sm:leading-7">
                {OUTCOMES_SECTION.subtitle}
              </p>

              <StaggerReveal className="mt-10 space-y-8 sm:mt-12" stagger={0.1}>
                {OUTCOME_FEATURES.map((feature) => (
                  <StaggerItem key={feature.id}>
                    <OutcomeFeature {...feature} />
                  </StaggerItem>
                ))}
              </StaggerReveal>
            </Reveal>

            <Reveal variant="fadeRight" amount={0.2} delay={0.08} className="relative w-full">
              <ProductOutcomesVisual />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
