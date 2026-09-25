import { StaggerReveal, StaggerItem } from '../motion';
import { MISSION_VISION } from './aboutData';

function MissionVisionCard({ title, description }) {
  return (
    <div className="h-full rounded-xl border border-[#E4E4E7] bg-gradient-to-r from-[#E8ECF8] via-[#F3F5FA] to-white px-8 py-10 sm:px-10 sm:py-12">
      <h3 className="text-xl font-bold text-black sm:text-2xl">{title}</h3>
      <p className="mt-5 text-sm leading-relaxed text-black sm:text-base sm:leading-7">
        {description}
      </p>
    </div>
  );
}

export default function MissionVisionCards() {
  return (
    <StaggerReveal
      className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-2"
      stagger={0.1}
    >
      <StaggerItem>
        <MissionVisionCard
          title={MISSION_VISION.mission.title}
          description={MISSION_VISION.mission.description}
        />
      </StaggerItem>
      <StaggerItem>
        <MissionVisionCard
          title={MISSION_VISION.vision.title}
          description={MISSION_VISION.vision.description}
        />
      </StaggerItem>
    </StaggerReveal>
  );
}
