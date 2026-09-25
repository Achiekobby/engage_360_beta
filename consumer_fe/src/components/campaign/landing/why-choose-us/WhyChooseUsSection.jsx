import Images from '../../../../utils/Images';
import WhyChooseUsFeature from './WhyChooseUsFeature';
import { WHY_CHOOSE_US_FEATURES } from './whyChooseUsData';
import { Reveal, StaggerReveal, StaggerItem } from '../../../motion';

export default function WhyChooseUsSection() {
  return (
    <section className="w-full bg-[#F4F7FF]">
      <div className="mx-auto w-full max-w-8xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div>
            <Reveal>
              <h2 className="text-[1.75rem] font-bold tracking-tight text-[#0B1354] sm:text-[2rem] lg:text-[2.15rem]">
                Why Businesses Choose Us
              </h2>
            </Reveal>

            <StaggerReveal className="mt-8 space-y-7 sm:mt-10 sm:space-y-8" stagger={0.09}>
              {WHY_CHOOSE_US_FEATURES.map((feature) => (
                <StaggerItem key={feature.id}>
                  <WhyChooseUsFeature {...feature} />
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>

          <Reveal variant="fadeRight" delay={0.1} className="relative mx-auto w-full max-w-[min(100%,540px)] lg:max-w-none">
            <div
              className="pointer-events-none absolute -right-3 -top-3 h-24 w-24 rounded-2xl bg-[#F5A623]/35 sm:-right-4 sm:-top-4 sm:h-28 sm:w-28"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_20px_50px_rgba(11,19,84,0.12)] sm:rounded-[2rem]">
              <img
                src={Images.about.about_section}
                alt="Engage 360 team collaborating around a laptop in a modern office"
                className="h-auto w-full object-cover"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
