import { useNavigate } from 'react-router-dom';
import { MotionButton, Reveal } from '../motion';
import { PRODUCT_CTA } from './productBenefitsData';

export default function ProductCtaSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-primary">
      <div className="mx-auto w-full max-w-8xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal variant="fadeUp" amount={0.2}>
          <h2 className="mx-auto max-w-3xl text-[1.65rem] font-bold leading-tight text-white sm:text-[2rem] lg:text-[2.25rem]">
            {PRODUCT_CTA.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:mt-5 sm:text-base sm:leading-7">
            {PRODUCT_CTA.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:mt-10">
            <MotionButton
              onClick={() => navigate('/signup')}
              className="rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-white/95 cursor-pointer sm:px-9 sm:text-base"
            >
              {PRODUCT_CTA.primaryCta}
            </MotionButton>
            <MotionButton
              onClick={() => navigate('/contact')}
              className="rounded-lg border border-white/70 bg-transparent px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 cursor-pointer sm:px-9 sm:text-base"
            >
              {PRODUCT_CTA.secondaryCta}
            </MotionButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
