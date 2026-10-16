import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import AnalyticsQuickLinks from './AnalyticsQuickLinks';
import { CUSTOMER_ENGAGEMENT_BASE } from '../customerEngagementNavData';

export default function AutomationInsightNav({
  kindId = 'birthday',
  activeTab = 'analytics',
  backPath = `${CUSTOMER_ENGAGEMENT_BASE}/automations`,
}) {
  const navigate = useNavigate();

  const handleTabChange = (tabId) => {
    if (tabId === 'overview') {
      navigate(`${CUSTOMER_ENGAGEMENT_BASE}/automations/${kindId}/settings`);
      return;
    }

    if (tabId === 'audience') {
      navigate(`${CUSTOMER_ENGAGEMENT_BASE}/automations/${kindId}/analytics?tab=audience`);
      return;
    }

    navigate(`${CUSTOMER_ENGAGEMENT_BASE}/automations/${kindId}/analytics`);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <AnalyticsQuickLinks activeTab={activeTab} onTabChange={handleTabChange} />

      <button
        type="button"
        onClick={() => navigate(backPath)}
        className="inline-flex cursor-pointer items-center gap-2 self-start text-sm font-semibold text-primary transition-colors hover:text-primary/80 sm:self-auto"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
        </span>
        Back
      </button>
    </div>
  );
}
