import { Settings } from 'lucide-react';
import ServiceIconBadge from './ServiceIconBadge';
import ServiceFeatureList from './ServiceFeatureList';
import FeedbackSurveyVisual from './FeedbackSurveyVisual';
import { FEEDBACK_FEATURES } from './platformServicesData';

export default function FeedbackSurveyCard() {
  return (
    <article className="group w-full overflow-hidden rounded-[1.25rem] bg-[#EAF3FA] p-6 transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(11,19,84,0.08)] sm:p-7 lg:p-8">
      <div className="rounded-[1rem] bg-gradient-to-br from-white/85 to-white/60 p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] backdrop-blur-sm sm:p-6">
        <ServiceIconBadge icon={Settings} variant="orange" />
        <h3 className="mt-4 text-lg font-bold tracking-tight text-[#0B1354] sm:text-xl">
          Feedback, Survey & Insights
        </h3>
        <p className="mt-2.5 text-[13px] leading-relaxed text-[#717171] sm:text-sm">
          Capture voice of the customer through Web, SMS, USSD, and WhatsApp surveys. Real-time
          analytics at your fingertips.
        </p>
        <ServiceFeatureList items={FEEDBACK_FEATURES} />
      </div>
      <FeedbackSurveyVisual />
    </article>
  );
}
