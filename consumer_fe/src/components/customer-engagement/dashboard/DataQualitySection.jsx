import { Database } from 'lucide-react';
import { Reveal, StaggerItem, StaggerReveal } from '../../motion';
import SectionHeader from './SectionHeader';
import MetricCard from './MetricCard';
import { DATA_QUALITY_METRICS } from './customerDashboardData';

export default function DataQualitySection() {
  return (
    <section className="border-t border-[#EEF0F4] pt-6 sm:pt-7">
      <Reveal variant="fadeUp" amount={0.15}>
        <SectionHeader
          icon={Database}
          title="Data Quality Overview"
          subtitle="Assessment of data accuracy, consistency, and completeness"
        />
      </Reveal>

      <StaggerReveal
        className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        stagger={0.06}
      >
        {DATA_QUALITY_METRICS.map((metric) => (
          <StaggerItem key={metric.id}>
            <MetricCard {...metric} />
          </StaggerItem>
        ))}
      </StaggerReveal>
    </section>
  );
}
