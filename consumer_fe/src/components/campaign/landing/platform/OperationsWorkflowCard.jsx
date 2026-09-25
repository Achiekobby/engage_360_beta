import { Zap } from 'lucide-react';
import ServiceIconBadge from './ServiceIconBadge';
import ServiceFeatureList from './ServiceFeatureList';
import { OPERATIONS_FEATURES } from './platformServicesData';

export default function OperationsWorkflowCard() {
  return (
    <article className="group relative w-full overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-[#131C5E] via-[#0B1354] to-[#0A103F] p-6 shadow-[0_20px_50px_rgba(11,19,84,0.25)] ring-1 ring-white/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_60px_rgba(11,19,84,0.35)] sm:p-7 lg:p-8">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/25 blur-2xl transition-opacity duration-300 group-hover:opacity-80"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#4F7FD4]/[0.08] blur-xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative">
        <ServiceIconBadge icon={Zap} variant="purple" />
        <h3 className="mt-4 text-lg font-bold tracking-tight text-white sm:text-xl">
          Operations & Workflow Management
        </h3>
        <p className="mt-2.5 text-[13px] leading-relaxed text-white/75 sm:text-sm">
          Streamline front-desk operations, visitor management, and task management with
          intelligent automation.
        </p>
        <ServiceFeatureList items={OPERATIONS_FEATURES} variant="dark" />
      </div>
    </article>
  );
}
