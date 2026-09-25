import { Reveal, StaggerItem, StaggerReveal } from '../motion';
import CampaignGrowthCard from './CampaignGrowthCard';
import { CAMPAIGN_GROWTH_FEATURES, CAMPAIGN_GROWTH_SECTION } from './campaignGrowthData';

export default function CampaignGrowthSection() {
  return (
    <section className="bg-[#F7F8FF]">
      <div className="mx-auto w-full max-w-8xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal variant="fadeUp" amount={0.2} className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl lg:text-[2rem]">
            {CAMPAIGN_GROWTH_SECTION.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#717171] sm:text-base sm:leading-7">
            {CAMPAIGN_GROWTH_SECTION.subtitle}
          </p>
        </Reveal>

        <StaggerReveal
          className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          stagger={0.08}
        >
          {CAMPAIGN_GROWTH_FEATURES.map((feature) => (
            <StaggerItem key={feature.id}>
              <CampaignGrowthCard {...feature} />
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
