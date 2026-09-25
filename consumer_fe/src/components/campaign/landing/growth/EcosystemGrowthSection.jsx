import Images from '../../../../utils/Images';
import GrowthFeatureCard from './GrowthFeatureCard';
import { GROWTH_FEATURES, GROWTH_INTRO } from './ecosystemGrowthData';
import { Reveal, StaggerReveal, StaggerItem } from '../../../motion';

export default function EcosystemGrowthSection() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-[#EAF3FA] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20 xl:py-24">
          <div className="mx-auto w-full max-w-xl lg:ml-auto lg:max-w-[34rem] xl:pr-10">
            <Reveal>
              <h2 className="text-[1.75rem] font-bold tracking-tight text-[#0B1354] sm:text-[2rem] lg:text-[2.15rem]">
                Ecosystem of Growth
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#717171] sm:text-[17px] lg:mt-5">
                {GROWTH_INTRO}
              </p>
            </Reveal>

            <StaggerReveal className="mt-8 space-y-4 sm:mt-10 sm:space-y-5" stagger={0.09}>
              {GROWTH_FEATURES.map((feature) => (
                <StaggerItem key={feature.id}>
                  <GrowthFeatureCard {...feature} />
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>
        </div>

        <Reveal variant="fadeRight" className="flex items-center justify-center bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="relative w-full max-w-[min(100%,520px)] lg:max-w-[560px]">
            <img
              src={Images.growth.growth_section}
              alt="Professional leaping toward growth with rising momentum"
              className="h-auto w-full object-contain"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
