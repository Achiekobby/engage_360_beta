import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { MotionButton, Reveal } from '../motion';
import Images from '../../utils/Images';
import { ACADEMY_CTA } from './academyData';

export default function AcademyCtaSection() {
  const navigate = useNavigate();

  return (
    <Reveal variant="fadeUp" amount={0.15} delay={0.08}>
      <div className="rounded-2xl border border-[#E4E4E7] bg-[#E8ECF8]/60 px-6 py-10 sm:px-10 sm:py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
            <img
              src={Images.contact_us.help_desk}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>

          <h2 className="mt-4 text-2xl font-bold text-[#0B1354] sm:text-3xl">
            {ACADEMY_CTA.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#717171] sm:text-base">
            {ACADEMY_CTA.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <MotionButton
              onClick={() => navigate('/webinars')}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 sm:px-8 sm:text-base"
            >
              {ACADEMY_CTA.primaryCta}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </MotionButton>

            <MotionButton
              onClick={() => navigate('/resources')}
              className="cursor-pointer rounded-lg border border-[#0B1354] bg-white px-7 py-3.5 text-sm font-semibold text-[#0B1354] transition-colors hover:bg-[#0B1354]/[0.03] sm:px-8 sm:text-base"
            >
              {ACADEMY_CTA.secondaryCta}
            </MotionButton>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
