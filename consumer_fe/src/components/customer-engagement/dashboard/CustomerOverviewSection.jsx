import { ArrowRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal, StaggerItem, StaggerReveal } from '../../motion';
import { CUSTOMER_ENGAGEMENT_BASE } from '../customerEngagementNavData';
import SectionHeader from './SectionHeader';
import MetricCard from './MetricCard';
import { CUSTOMER_OVERVIEW_METRICS } from './customerDashboardData';

export default function CustomerOverviewSection() {
  return (
    <section>
      <Reveal variant="fadeUp" amount={0.15}>
        <SectionHeader
          icon={Users}
          title="Customer Overview"
          subtitle="Understanding your customers at a glance"
          action={
            <Link
              to={`${CUSTOMER_ENGAGEMENT_BASE}/customers`}
              className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(58,16,205,0.34)] transition-all hover:bg-[#320EB8] hover:shadow-[0_12px_28px_rgba(58,16,205,0.42)] sm:w-auto"
            >
              Manage customers
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={2.25}
              />
            </Link>
          }
        />
      </Reveal>

      <StaggerReveal
        className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        stagger={0.06}
      >
        {CUSTOMER_OVERVIEW_METRICS.map((metric) => (
          <StaggerItem key={metric.id}>
            <MetricCard {...metric} />
          </StaggerItem>
        ))}
      </StaggerReveal>
    </section>
  );
}
