import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import CampaignDetailTabs from '../../components/campaigns-module/CampaignDetailTabs';
import CampaignAnalyticsPanel from '../../components/campaigns-module/CampaignAnalyticsPanel';
import CampaignOverviewPanel from '../../components/campaigns-module/CampaignOverviewPanel';
import CampaignPurchaseLogsPanel from '../../components/campaigns-module/CampaignPurchaseLogsPanel';
import {
  CAMPAIGN_DETAIL_TABS,
  getCampaignDetailFallback,
} from '../../components/campaigns-module/campaignDetailData';
import {
  CAMPAIGNS_BASE,
  MOCK_CAMPAIGNS,
} from '../../components/campaigns-module/campaignsData';

export default function CampaignDetailPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('analytics');

  const found = useMemo(
    () =>
      MOCK_CAMPAIGNS.find((item) => item.id === campaignId) ||
      (location.state?.newCampaign?.id === campaignId ? location.state.newCampaign : null),
    [campaignId, location.state],
  );

  const campaign = useMemo(() => getCampaignDetailFallback(found), [found]);

  if (!campaign) {
    return (
      <main className="mx-auto max-w-8xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1354]">Campaign not found</h1>
        <button
          type="button"
          onClick={() => navigate(`${CAMPAIGNS_BASE}/management`)}
          className="mt-4 cursor-pointer text-sm font-semibold text-primary"
        >
          Back to campaigns
        </button>
      </main>
    );
  }

  const handleLaunchAgain = () => {
    const category = campaign.categoryId || 'sales-conversion';
    navigate(`${CAMPAIGNS_BASE}/create/wizard?category=${category}&from=detail`);
  };

  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <CampaignDetailTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={() => navigate(`${CAMPAIGNS_BASE}/management`)}
        tabs={CAMPAIGN_DETAIL_TABS}
      />

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            {activeTab === 'analytics' ? <CampaignAnalyticsPanel /> : null}
            {activeTab === 'overview' ? (
              <CampaignOverviewPanel campaign={campaign} onLaunchAgain={handleLaunchAgain} />
            ) : null}
            {activeTab === 'purchase-logs' ? <CampaignPurchaseLogsPanel /> : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
