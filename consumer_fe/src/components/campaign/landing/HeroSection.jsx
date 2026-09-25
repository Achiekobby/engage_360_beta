import HeroContent from './HeroContent';
import HeroVisual from './HeroVisual';
import { Reveal } from '../../motion';

export default function HeroSection({ onContact, onBookDemo }) {
  return (
    <section className="relative flex w-full min-h-[90vh] items-start overflow-x-hidden bg-white pt-16">
      <div className="mx-auto w-full max-w-8xl px-4 pb-8 pt-1 sm:px-6 sm:pb-10 sm:pt-2 lg:px-8 lg:pb-12">
        <div className="grid min-w-0 grid-cols-1 items-start gap-12 lg:grid-cols-[1.18fr_0.82fr] lg:gap-10 xl:gap-14">
          <Reveal when="load" variant="fadeLeft" delay={0.05} className="min-w-0">
            <HeroContent onContact={onContact} onBookDemo={onBookDemo} />
          </Reveal>
          <Reveal when="load" variant="fadeRight" delay={0.15} duration={0.65} className="min-w-0">
            <HeroVisual />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
