import { useLocation, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ScrollToTop from './components/layout/ScrollToTop';
import { PageTransition } from './components/motion';
import AdminLayout from './layouts/AdminLayout';
import BusinessesPage from './pages/businesses/BusinessesPage';
import BusinessAnalyticsPage from './pages/businesses/BusinessAnalyticsPage';
import BusinessDataAnalyticsPage from './pages/businesses/BusinessDataAnalyticsPage';
import OnboardBusinessPage from './pages/businesses/OnboardBusinessPage';
import BusinessDetailPage from './pages/businesses/BusinessDetailPage';
import CampaignsPage from './pages/campaigns/CampaignsPage';
import CampaignDetailPage from './pages/campaigns/CampaignDetailPage';
import PromotionAnalyticsPage from './pages/campaigns/PromotionAnalyticsPage';
import SectionPendingPage from './pages/SectionPendingPage';
import PlatformSettingsPage from './pages/settings/PlatformSettingsPage';
import PlatformAutomationsPage from './pages/settings/PlatformAutomationsPage';
import TicketsPage from './pages/tickets/TicketsPage';
import TicketDetailPage from './pages/tickets/TicketDetailPage';
import TicketAnalyticsPage from './pages/tickets/TicketAnalyticsPage';
import DashboardPage from './pages/DashboardPage';
import AutomationsPage from './pages/automations/AutomationsPage';
import AutomationsAnalyticsPage from './pages/automations/AutomationsAnalyticsPage';
import RewardsPage from './pages/rewards/RewardsPage';
import CreateRewardPage from './pages/rewards/CreateRewardPage';
import RewardActivityPage from './pages/rewards/RewardActivityPage';

function AppShell() {
  const location = useLocation();

  return (
    <AdminLayout>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Navigate to="/businesses" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/businesses" element={<BusinessesPage />} />
            <Route path="/businesses/analytics" element={<BusinessAnalyticsPage />} />
            <Route path="/accounts" element={<SectionPendingPage title="Account Management" />} />
            <Route path="/customers" element={<SectionPendingPage title="Customer Management" />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/campaigns/new" element={<Navigate to="/campaigns" replace />} />
            <Route path="/campaigns/templates" element={<Navigate to="/campaigns" replace />} />
            <Route path="/campaigns/sender-ids" element={<Navigate to="/campaigns" replace />} />
            <Route path="/campaigns/analytics" element={<PromotionAnalyticsPage />} />
            <Route path="/campaigns/:campaignId" element={<CampaignDetailPage />} />
            <Route
              path="/automations"
              element={<Navigate to="/automations/birthday" replace />}
            />
            <Route path="/automations/:kindId" element={<AutomationsPage />} />
            <Route
              path="/automations/:kindId/analytics"
              element={<AutomationsAnalyticsPage />}
            />
            <Route path="/rewards/activity" element={<RewardActivityPage />} />
            <Route path="/rewards/new" element={<CreateRewardPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/settings" element={<PlatformSettingsPage />} />
            <Route path="/settings/automations" element={<PlatformAutomationsPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/tickets/new" element={<Navigate to="/tickets" replace />} />
            <Route path="/tickets/analytics" element={<TicketAnalyticsPage />} />
            <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
            <Route path="/businesses/new" element={<OnboardBusinessPage />} />
            <Route path="/businesses/:businessId/analytics" element={<BusinessDataAnalyticsPage />} />
            <Route path="/businesses/:businessId" element={<BusinessDetailPage />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
    </AdminLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
