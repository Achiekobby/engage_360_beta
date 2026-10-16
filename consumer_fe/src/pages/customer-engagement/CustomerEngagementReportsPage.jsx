import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReportTabsNav from '../../components/customer-engagement/reports/ReportTabsNav';
import ReportTabPanels from '../../components/customer-engagement/reports/ReportTabPanels';
import { REPORT_TABS } from '../../components/customer-engagement/reports/reportsAnalyticsData';

const VALID_TAB_IDS = new Set(REPORT_TABS.map((tab) => tab.id));

export default function CustomerEngagementReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    VALID_TAB_IDS.has(tabFromUrl) ? tabFromUrl : 'customer',
  );

  useEffect(() => {
    if (VALID_TAB_IDS.has(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl, activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams(tabId === 'customer' ? {} : { tab: tabId }, { replace: true });
  };

  return (
    <>
      <ReportTabsNav activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <ReportTabPanels activeTab={activeTab} />
      </main>
    </>
  );
}
