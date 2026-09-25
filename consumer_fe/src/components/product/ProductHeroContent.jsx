import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MotionButton, Reveal } from '../motion';
import { PRODUCT_HERO } from './productHeroData';

export default function ProductHeroContent() {
  const navigate = useNavigate();

  return (
    <Reveal when="load" variant="fadeLeft" delay={0.05} className="w-full max-w-2xl lg:max-w-3xl xl:max-w-[44rem]">
      <h1 className="text-[2.25rem] font-bold leading-[1.1] tracking-tight sm:text-[2.75rem] lg:text-[3.1rem] xl:text-[3.4rem]">
        <span className="text-[#0B1354]">{PRODUCT_HERO.titleLead} </span>
        <span className="text-primary">{PRODUCT_HERO.titleHighlight}</span>
      </h1>

      <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#717171] sm:max-w-2xl sm:text-[19px] lg:mt-6 lg:max-w-[36rem] lg:text-xl lg:leading-8">
        {PRODUCT_HERO.description}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4 lg:mt-10">
        <MotionButton
          onClick={() => navigate('/signup')}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(58,16,205,0.28)] transition-colors hover:bg-primary/90 cursor-pointer sm:px-8 sm:text-base"
        >
          {PRODUCT_HERO.primaryCta}
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </MotionButton>

        <MotionButton
          onClick={() => navigate('/contact')}
          className="rounded-lg border border-[#0B1354] bg-white px-7 py-3.5 text-sm font-semibold text-[#0B1354] transition-colors hover:bg-[#0B1354]/[0.03] cursor-pointer sm:px-8 sm:text-base"
        >
          {PRODUCT_HERO.secondaryCta}
        </MotionButton>
      </div>
    </Reveal>
  );
}
