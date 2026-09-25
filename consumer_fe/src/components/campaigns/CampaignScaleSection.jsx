import { Reveal, StaggerItem, StaggerReveal } from '../motion';
import CampaignScaleCard from './CampaignScaleCard';
import { CAMPAIGN_SCALE_FEATURES, CAMPAIGN_SCALE_SECTION } from './campaignScaleData';

export default function CampaignScaleSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-8xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal
          variant="fadeUp"
          amount={0.2}
          className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10"
        >
          <h2 className="max-w-xl text-2xl font-bold text-[#0B1354] sm:text-3xl lg:text-[2rem]">
            {CAMPAIGN_SCALE_SECTION.title}
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-[#717171] sm:text-base sm:leading-7 lg:text-right">
            {CAMPAIGN_SCALE_SECTION.subtitle}
          </p>
        </Reveal>

        <StaggerReveal
          className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-6"
          stagger={0.08}
        >
          {CAMPAIGN_SCALE_FEATURES.map((feature) => (
            <StaggerItem key={feature.id} className={feature.colSpan}>
              <CampaignScaleCard {...feature} />
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
