import { BarChart3 } from 'lucide-react';
import { Reveal, StaggerItem, StaggerReveal } from '../../motion';
import SectionHeader from './SectionHeader';
import HorizontalRankChart from './HorizontalRankChart';
import { GenderDonutChart, AgeGroupPieChart } from './DemographicCharts';
import {
  CUSTOMERS_BY_AGE,
  CUSTOMERS_BY_GENDER,
  CUSTOMERS_BY_LOCATION,
  CUSTOMERS_BY_REGION,
} from './customerDashboardData';

export default function DemographicOverviewSection() {
  return (
    <section className="border-t border-[#EEF0F4] pt-6 sm:pt-7">
      <Reveal variant="fadeUp" amount={0.15}>
        <SectionHeader
          icon={BarChart3}
          title="Business Demographic Overview"
          subtitle="Insights into customer composition across location, age, and gender"
        />
      </Reveal>

      <StaggerReveal
        className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-4"
        stagger={0.08}
      >
        <StaggerItem>
          <HorizontalRankChart title="Customers by Region" items={CUSTOMERS_BY_REGION} />
        </StaggerItem>
        <StaggerItem>
          <GenderDonutChart title="Customers by Gender" items={CUSTOMERS_BY_GENDER} />
        </StaggerItem>
        <StaggerItem>
          <AgeGroupPieChart title="Customers by Age Group" items={CUSTOMERS_BY_AGE} />
        </StaggerItem>
        <StaggerItem>
          <HorizontalRankChart title="Customers by Location" items={CUSTOMERS_BY_LOCATION} />
        </StaggerItem>
      </StaggerReveal>
    </section>
  );
}
