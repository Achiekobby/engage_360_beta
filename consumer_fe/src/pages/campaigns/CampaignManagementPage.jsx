import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Reveal } from '../../components/motion';
import CampaignsPageHeader from '../../components/campaigns-module/CampaignsPageHeader';
import CampaignsToolbar from '../../components/campaigns-module/CampaignsToolbar';
import CampaignsView from '../../components/campaigns-module/CampaignsView';
import CampaignsFilterDrawer from '../../components/campaigns-module/CampaignsFilterDrawer';
import {
  CAMPAIGN_FILTER_DEFAULTS,
  countActiveCampaignFilters,
} from '../../components/campaigns-module/campaignDetailData';
import {
  CAMPAIGNS_BASE,
  MOCK_CAMPAIGNS,
} from '../../components/campaigns-module/campaignsData';

function parseCampaignDate(dateCreated) {
  if (!dateCreated) return null;
  // Supports DD-MM-YY and DD-MM-YYYY
  const parts = String(dateCreated).split('-');
  if (parts.length !== 3) return null;
  const [day, month, yearRaw] = parts;
  const year = yearRaw.length === 2 ? `20${yearRaw}` : yearRaw;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? null : date;
}

function matchesDateRange(dateCreated, dateRange) {
  if (!dateRange || dateRange === 'all') return true;
  const created = parseCampaignDate(dateCreated);
  if (!created) return true;

  const now = new Date();
  const start = new Date(now);

  if (dateRange === '7d') start.setDate(now.getDate() - 7);
  else if (dateRange === '30d') start.setDate(now.getDate() - 30);
  else if (dateRange === 'year') start.setMonth(0, 1);
  else return true;

  return created >= start && created <= now;
}

export default function CampaignManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards');
  const [filters, setFilters] = useState(CAMPAIGN_FILTER_DEFAULTS);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    if (location.state?.newCampaign) {
      setCampaigns((prev) => [location.state.newCampaign, ...prev]);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const activeFilterCount = countActiveCampaignFilters(filters);

  const filteredCampaigns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return campaigns.filter((campaign) => {
      if (filters.categories.length && !filters.categories.includes(campaign.categoryId)) {
        return false;
      }
      if (filters.channels.length && !filters.channels.includes(campaign.channel)) {
        return false;
      }
      if (filters.statuses.length && !filters.statuses.includes(campaign.status)) {
        return false;
      }
      if (!matchesDateRange(campaign.dateCreated, filters.dateRange)) {
        return false;
      }

      if (!query) return true;

      return (
        campaign.name.toLowerCase().includes(query) ||
        campaign.channel.toLowerCase().includes(query) ||
        campaign.status.toLowerCase().includes(query) ||
        (campaign.categoryId || '').toLowerCase().includes(query)
      );
    });
  }, [campaigns, searchQuery, filters]);

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
          onOpenFilters={() => setFilterDrawerOpen(true)}
          activeFilterCount={activeFilterCount}
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

      <CampaignsFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApply={setFilters}
      />
    </main>
  );
}
