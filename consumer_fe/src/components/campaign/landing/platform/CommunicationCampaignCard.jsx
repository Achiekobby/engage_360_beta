import { Megaphone } from 'lucide-react';
import ServiceIconBadge from './ServiceIconBadge';
import ServiceFeatureList from './ServiceFeatureList';
import { COMMUNICATION_FEATURES } from './platformServicesData';

export default function CommunicationCampaignCard() {
  return (
    <article className="group w-full rounded-[1.25rem] bg-gradient-to-br from-[#EDF5FB] to-[#DFEDF7] p-5 ring-1 ring-black/[0.03] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(11,19,84,0.1)] sm:p-6">
      <ServiceIconBadge icon={Megaphone} variant="blue" />
      <h3 className="mt-3.5 text-lg font-bold tracking-tight text-[#0B1354] sm:text-xl">
        Communication & Campaign
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-[#717171] sm:text-sm">
        Multi-channel reach including SMS, Email, and WhatsApp. Precision scheduling and
        customer segmentation.
      </p>
      <ServiceFeatureList
        items={COMMUNICATION_FEATURES}
        className="mt-4 space-y-2 sm:space-y-2.5"
      />
    </article>
  );
}
