import { Reveal, StaggerItem, StaggerReveal } from '../motion';
import { PRODUCT_BENEFITS, PRODUCT_BENEFITS_SECTION } from './productBenefitsData';

function BenefitStat({ value, label, tagline }) {
  return (
    <article className="flex h-full flex-col">
      <p className="text-3xl font-semibold text-primary sm:text-4xl lg:text-[2.5rem]">{value}</p>
      <h3 className="mt-3 text-base font-bold text-[#0B1354] sm:text-lg">{label}</h3>
      <p className="mt-1.5 text-[11px] font-medium tracking-wide text-[#717171] sm:text-xs">
        {tagline}
      </p>
      <div className="mt-6 h-px w-full bg-[#B8DDD4] sm:mt-8" aria-hidden="true" />
    </article>
  );
}

export default function ProductBenefitsSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-8xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal variant="fadeUp" amount={0.2} className="text-center">
          <h2 className="text-2xl font-bold text-[#0B1354] sm:text-3xl lg:text-[2rem]">
            {PRODUCT_BENEFITS_SECTION.title}
          </h2>
        </Reveal>

        <StaggerReveal
          className="mt-12 grid grid-cols-1 gap-10 sm:mt-14 sm:grid-cols-2 sm:gap-8 lg:mt-16 lg:grid-cols-4 lg:gap-6"
          stagger={0.08}
        >
          {PRODUCT_BENEFITS.map((benefit) => (
            <StaggerItem key={benefit.id}>
              <BenefitStat {...benefit} />
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
