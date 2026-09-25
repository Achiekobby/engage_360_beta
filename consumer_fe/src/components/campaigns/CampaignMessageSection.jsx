import { Reveal } from '../motion';
import { CAMPAIGN_MESSAGE_SECTION } from './campaignScaleData';

export default function CampaignMessageSection() {
  return (
    <section className="bg-[#F7F8FF]">
      <div className="mx-auto w-full max-w-8xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal variant="fadeUp" amount={0.2} className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl lg:text-[2rem]">
            {CAMPAIGN_MESSAGE_SECTION.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#717171] sm:text-base sm:leading-7">
            {CAMPAIGN_MESSAGE_SECTION.subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
