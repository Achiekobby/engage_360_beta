import { StaggerItem, StaggerReveal } from '../motion';
import AcademySectionHeader from './AcademySectionHeader';
import { ACADEMY_STEPS, ACADEMY_STEPS_HEADER } from './academyData';

export default function AcademyHowItWorks() {
  return (
    <section>
      <AcademySectionHeader
        title={ACADEMY_STEPS_HEADER.title}
        subtitle={ACADEMY_STEPS_HEADER.subtitle}
      />

      <StaggerReveal
        className="mt-10 grid grid-cols-1 gap-8 sm:mt-12 sm:grid-cols-3 sm:gap-6 lg:gap-10"
        stagger={0.1}
      >
        {ACADEMY_STEPS.map((item, index) => (
          <StaggerItem key={item.id}>
            <div
              className={`relative h-full sm:px-2 ${
                index < ACADEMY_STEPS.length - 1
                  ? 'sm:border-r sm:border-[#E4E4E7]'
                  : ''
              }`}
            >
              <p className="text-sm font-semibold tracking-[0.16em] text-primary">{item.step}</p>
              <h3 className="mt-3 text-xl font-bold text-[#0B1354]">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#717171] sm:text-base sm:leading-7">
                {item.description}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerReveal>
    </section>
  );
}
