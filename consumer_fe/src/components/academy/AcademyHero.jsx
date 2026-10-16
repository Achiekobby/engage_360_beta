import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MotionButton, Reveal } from '../motion';
import Images from '../../utils/Images';
import { ACADEMY_HERO } from './academyData';

export default function AcademyHero() {
  const navigate = useNavigate();

  return (
    <section className="relative -mt-16 overflow-hidden pt-16">
      <div className="relative min-h-[min(72vh,600px)]">
        <img
          src={Images.academy.academy_hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0B1354]/55 via-[#0B1354]/28 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0B1354]/25 via-transparent to-[#0B1354]/10"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex h-full min-h-[min(72vh,600px)] w-full max-w-8xl items-center px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <Reveal when="load" variant="fadeLeft" delay={0.06} className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/85 sm:text-[15px]">
              {ACADEMY_HERO.eyebrow}
            </p>

            <h1 className="mt-3 text-[2.15rem] font-bold leading-[1.1] tracking-tight text-white sm:mt-4 sm:text-[2.6rem] lg:text-[3rem] xl:text-[3.25rem]">
              {ACADEMY_HERO.title}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:mt-5 sm:text-lg sm:leading-8">
              {ACADEMY_HERO.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <MotionButton
                onClick={() => navigate('/signup')}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(58,16,205,0.28)] transition-colors hover:bg-primary/90 sm:px-8 sm:text-base"
              >
                {ACADEMY_HERO.primaryCta}
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </MotionButton>

              <MotionButton
                onClick={() => navigate('/webinars')}
                className="cursor-pointer rounded-lg border border-white/70 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:px-8 sm:text-base"
              >
                {ACADEMY_HERO.secondaryCta}
              </MotionButton>
            </div>

            <ul className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-white/90 sm:text-[15px]">
              {ACADEMY_HERO.tracks.map((item, index) => (
                <li key={item} className="flex items-center gap-3">
                  {index > 0 ? (
                    <span className="h-1 w-1 rounded-full bg-white/55" aria-hidden="true" />
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
