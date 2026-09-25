import { Banknote, Cog, Globe2, Rocket, Unlink } from 'lucide-react';
import { Reveal, StaggerItem, StaggerReveal } from '../motion';
import { CAMPAIGN_RESULTS, CAMPAIGN_RESULTS_SECTION } from './campaignResultsData';

const ICONS = {
  reach: Globe2,
  roi: Banknote,
  zeroGaps: Unlink,
  automated: Cog,
};

function ResultItem({ title, description, icon }) {
  const Icon = ICONS[icon];

  return (
    <article className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
        <Icon className="h-5 w-5 text-white" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-bold text-white sm:text-lg">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-white/80 sm:text-[15px] sm:leading-7">
          {description}
        </p>
      </div>
    </article>
  );
}

export default function CampaignResultsSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-8xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:pb-12 lg:pt-24">
        <Reveal variant="fadeUp" amount={0.2}>
          <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <Rocket
              className="pointer-events-none absolute -right-4 -top-2 h-28 w-28 text-white/10 sm:-right-2 sm:top-0 sm:h-36 sm:w-36 lg:h-44 lg:w-44"
              strokeWidth={1.25}
              aria-hidden="true"
            />

            <h2 className="relative max-w-md text-xl font-bold text-white sm:text-2xl lg:text-[1.75rem]">
              {CAMPAIGN_RESULTS_SECTION.title}
            </h2>

            <StaggerReveal
              className="relative mt-10 grid grid-cols-1 gap-8 sm:mt-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-10 lg:gap-x-16"
              stagger={0.08}
            >
              {CAMPAIGN_RESULTS.map((result) => (
                <StaggerItem key={result.id}>
                  <ResultItem {...result} />
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
