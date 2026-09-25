import { Reveal } from '../motion';
import Images from '../../utils/Images';
import { ABOUT_HERO } from './aboutData';

export default function AboutHero() {
  return (
    <section className="relative -mt-16 overflow-hidden pt-16">
      <div className="relative min-h-[min(88vh,720px)]">
        <img
          src={Images.about.about_hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0B1354]/95 via-[#0B1354]/75 to-[#0B1354]/20"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex h-full min-h-[min(88vh,720px)] w-full max-w-8xl items-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <Reveal when="load" variant="fadeLeft" delay={0.06} className="max-w-2xl">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.65rem] lg:leading-[1.15]">
              {ABOUT_HERO.title}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base lg:mt-6 lg:text-[15px] lg:leading-7">
              {ABOUT_HERO.description}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
