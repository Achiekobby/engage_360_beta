import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Reveal } from '../../components/motion';
import CampaignsPageHeader from '../../components/campaigns-module/CampaignsPageHeader';
import CampaignsToolbar from '../../components/campaigns-module/CampaignsToolbar';
import CampaignsView from '../../components/campaigns-module/CampaignsView';
import {
  CAMPAIGNS_BASE,
  MOCK_CAMPAIGNS,
} from '../../components/campaigns-module/campaignsData';

export default function CampaignManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards');

  useEffect(() => {
    if (location.state?.newCampaign) {
      setCampaigns((prev) => [location.state.newCampaign, ...prev]);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const filteredCampaigns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return campaigns;

    return campaigns.filter(
      (campaign) =>
        campaign.name.toLowerCase().includes(query) ||
        campaign.channel.toLowerCase().includes(query) ||
        campaign.status.toLowerCase().includes(query),
    );
  }, [campaigns, searchQuery]);

  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Reveal variant="fadeUp" amount={0.15}>
        <CampaignsPageHeader
          onCreateCampaign={() => navigate(`${CAMPAIGNS_BASE}/create`)}
          campaignCount={campaigns.length}
        />
      </Reveal>

      <Reveal variant="fadeUp" amount={0.15} delay={0.08} className="mt-6">
        <CampaignsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={filteredCampaigns.length}
        />
      </Reveal>

      <Reveal variant="fadeUp" amount={0.15} delay={0.12} className="mt-4">
        <CampaignsView
          campaigns={filteredCampaigns}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onView={(campaign) => navigate(`${CAMPAIGNS_BASE}/${campaign.id}`)}
        />
      </Reveal>
    </main>
  );
}
