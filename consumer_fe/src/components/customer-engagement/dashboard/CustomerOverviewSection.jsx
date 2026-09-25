import { Users } from 'lucide-react';
import { Reveal, StaggerItem, StaggerReveal } from '../../motion';
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
