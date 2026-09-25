import CommunicationCampaignCard from './CommunicationCampaignCard';
import CustomerEngagementCard from './CustomerEngagementCard';
import FeedbackSurveyCard from './FeedbackSurveyCard';
import OperationsWorkflowCard from './OperationsWorkflowCard';
import PlatformSectionBackground from './PlatformSectionBackground';
import PlatformSectionHeader from './PlatformSectionHeader';
import { Reveal, StaggerReveal, StaggerItem } from '../../../motion';

export default function PlatformControlSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <PlatformSectionBackground />

      <div className="relative z-[1] mx-auto w-full max-w-8xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <PlatformSectionHeader />
        </Reveal>

        <StaggerReveal
          className="mt-12 flex flex-col gap-5 sm:mt-14 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-6 lg:mt-16"
          stagger={0.1}
        >
          <div className="contents lg:flex lg:h-full lg:flex-col lg:gap-4">
            <StaggerItem className="order-1 w-full lg:order-none">
              <CommunicationCampaignCard />
            </StaggerItem>
            <StaggerItem className="order-3 w-full lg:order-none lg:mt-auto">
              <FeedbackSurveyCard />
            </StaggerItem>
          </div>

          <div className="contents lg:flex lg:h-full lg:flex-col lg:gap-5">
            <StaggerItem className="order-2 w-full lg:order-none">
              <CustomerEngagementCard />
            </StaggerItem>
            <StaggerItem className="order-4 w-full lg:order-none lg:mt-auto">
              <OperationsWorkflowCard />
            </StaggerItem>
          </div>
        </StaggerReveal>
      </div>
    </section>
  );
}
