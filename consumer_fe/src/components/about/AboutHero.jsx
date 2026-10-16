import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MotionButton, Reveal } from '../motion';
import Images from '../../utils/Images';
import { ABOUT_HERO } from './aboutData';

export default function AboutHero() {
  const navigate = useNavigate();

  return (
    <section className="relative -mt-16 overflow-hidden pt-16">
      <div className="relative min-h-[min(88vh,720px)]">
        <img
          src={Images.about.about_hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0B1354]/70 via-[#0B1354]/40 to-[#0B1354]/10"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0B1354]/35 via-transparent to-[#0B1354]/15"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex h-full min-h-[min(88vh,720px)] w-full max-w-8xl items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <Reveal when="load" variant="fadeLeft" delay={0.06} className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-[15px]">
              {ABOUT_HERO.eyebrow}
            </p>

            <h1 className="mt-4 text-[2.25rem] font-bold leading-[1.1] tracking-tight text-white sm:mt-5 sm:text-[2.75rem] lg:text-[3.1rem] xl:text-[3.4rem]">
              {ABOUT_HERO.title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:mt-6 sm:text-lg sm:leading-8 lg:text-xl lg:leading-8">
              {ABOUT_HERO.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4 lg:mt-10">
              <MotionButton
                onClick={() => navigate('/signup')}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(58,16,205,0.28)] transition-colors hover:bg-primary/90 sm:px-8 sm:text-base"
              >
                {ABOUT_HERO.primaryCta}
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </MotionButton>

              <MotionButton
                onClick={() => navigate('/contact')}
                className="cursor-pointer rounded-lg border border-white/70 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:px-8 sm:text-base"
              >
                {ABOUT_HERO.secondaryCta}
              </MotionButton>
            </div>

            <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-white/85 sm:mt-10 sm:text-[15px]">
              {ABOUT_HERO.highlights.map((item, index) => (
                <li key={item} className="flex items-center gap-3">
                  {index > 0 ? (
                    <span className="h-1 w-1 rounded-full bg-white/50" aria-hidden="true" />
                  ) : null}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
