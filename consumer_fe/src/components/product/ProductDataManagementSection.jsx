import { Reveal, StaggerItem, StaggerReveal } from '../motion';
import ProductDataManagementCard from './ProductDataManagementCard';
import {
  DATA_MANAGEMENT_FEATURES,
  DATA_MANAGEMENT_SECTION,
} from './productDataManagementData';

export default function ProductDataManagementSection() {
  return (
    <section className="bg-[#F8F9FC]">
      <div className="mx-auto w-full max-w-8xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal variant="fadeUp" amount={0.2} className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl lg:text-[2rem]">
            {DATA_MANAGEMENT_SECTION.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#717171] sm:text-base sm:leading-7">
            {DATA_MANAGEMENT_SECTION.subtitle}
          </p>
        </Reveal>

        <StaggerReveal
          className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-6"
          stagger={0.08}
        >
          {DATA_MANAGEMENT_FEATURES.map((feature) => (
            <StaggerItem key={feature.id} className={feature.colSpan}>
              <ProductDataManagementCard {...feature} />
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
