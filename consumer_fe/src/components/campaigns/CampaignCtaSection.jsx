import { useNavigate } from 'react-router-dom';
import { MotionButton, Reveal } from '../motion';
import { CAMPAIGN_CTA } from './campaignResultsData';

export default function CampaignCtaSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-8xl px-4 pb-16 text-center sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <Reveal variant="fadeUp" amount={0.2}>
          <h2 className="mx-auto max-w-3xl text-[1.65rem] font-bold leading-tight text-[#0B1354] sm:text-[2rem] lg:text-[2.25rem]">
            {CAMPAIGN_CTA.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#717171] sm:mt-5 sm:text-base sm:leading-7">
            {CAMPAIGN_CTA.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:mt-10">
            <MotionButton
              onClick={() => navigate('/signup')}
              className="rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(58,16,205,0.25)] transition-colors hover:bg-primary/90 cursor-pointer sm:px-9 sm:text-base"
            >
              {CAMPAIGN_CTA.primaryCta}
            </MotionButton>
            <MotionButton
              onClick={() => navigate('/contact')}
              className="rounded-lg border border-[#E4E4E7] bg-white px-8 py-3.5 text-sm font-semibold text-[#0B1354] transition-colors hover:bg-[#0B1354]/[0.03] cursor-pointer sm:px-9 sm:text-base"
            >
              {CAMPAIGN_CTA.secondaryCta}
            </MotionButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
