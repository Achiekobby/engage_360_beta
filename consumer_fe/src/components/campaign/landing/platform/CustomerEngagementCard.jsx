import { Users } from 'lucide-react';
import ServiceIconBadge from './ServiceIconBadge';
import ServiceFeatureList from './ServiceFeatureList';
import CustomerEngagementWidgets from './CustomerEngagementWidgets';
import { CUSTOMER_FEATURES } from './platformServicesData';

export default function CustomerEngagementCard() {
  return (
    <article className="group flex h-full flex-col rounded-[1.25rem] bg-gradient-to-br from-[#EFF1FA] to-[#E1E4F3] p-6 ring-1 ring-black/[0.03] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(11,19,84,0.1)] sm:p-7 lg:p-8">
      <ServiceIconBadge icon={Users} variant="lavender" />
      <h3 className="mt-4 text-lg font-bold tracking-tight text-[#0B1354] sm:text-xl">
        Customer & Engagement Management
      </h3>
      <p className="mt-2.5 text-[13px] leading-relaxed text-[#717171] sm:text-sm">
        Centralize customer data, track engagement across every touchpoint, and turn insights
        into lasting relationships.
      </p>
      <ServiceFeatureList items={CUSTOMER_FEATURES} />
      <CustomerEngagementWidgets />
    </article>
  );
}
