import { useState } from 'react';
import ReportTabsNav from '../../components/customer-engagement/reports/ReportTabsNav';
import ReportTabPanels from '../../components/customer-engagement/reports/ReportTabPanels';

export default function CustomerEngagementReportsPage() {
  const [activeTab, setActiveTab] = useState('customer');

  return (
    <>
      <ReportTabsNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <ReportTabPanels activeTab={activeTab} />
      </main>
    </>
  );
}
