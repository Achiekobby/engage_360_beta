import { Reveal } from '../../components/motion';
import DashboardPageHeader from '../../components/customer-engagement/dashboard/DashboardPageHeader';
import CustomerOverviewSection from '../../components/customer-engagement/dashboard/CustomerOverviewSection';
import DemographicOverviewSection from '../../components/customer-engagement/dashboard/DemographicOverviewSection';
import DataQualitySection from '../../components/customer-engagement/dashboard/DataQualitySection';

export default function CustomerEngagementDashboardPage() {
  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Reveal variant="fadeUp" amount={0.15}>
        <DashboardPageHeader />
      </Reveal>

      <div className="mt-6 space-y-6 sm:mt-7 sm:space-y-7">
        <CustomerOverviewSection />
        <DemographicOverviewSection />
        <DataQualitySection />
      </div>
    </main>
  );
}
