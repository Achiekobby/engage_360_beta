import { useLocation, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import GuestNavbar from './components/layout/GuestNavbar';
import ScrollToTop from './components/layout/ScrollToTop';
import GlobalModals from './components/GlobalModals';
import { PageTransition } from './components/motion';
import CampaignLandingPage from './pages/CampaignLandingPage';
import ProductPage from './pages/ProductPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ContactPage from './pages/ContactPage';
import HelpCenterPage from './pages/HelpCenterPage';
import AboutPage from './pages/AboutPage';
import AcademyPage from './pages/AcademyPage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import SuccessStoriesPage from './pages/SuccessStoriesPage';
import SuccessStoryDetailPage from './pages/SuccessStoryDetailPage';
import WebinarsPage from './pages/WebinarsPage';
import CampaignsPage from './pages/CampaignsPage';
import DashboardPage from './pages/DashboardPage';
import CustomerEngagementLayout from './layouts/CustomerEngagementLayout';
import CustomerEngagementDashboardPage from './pages/customer-engagement/CustomerEngagementDashboardPage';
import CustomerEngagementCustomersPage from './pages/customer-engagement/CustomerEngagementCustomersPage';
import CollectionCustomersPage from './pages/customer-engagement/CollectionCustomersPage';
import CustomerEngagementReportsPage from './pages/customer-engagement/CustomerEngagementReportsPage';
import CampaignsLayout from './layouts/CampaignsLayout';
import CampaignsHomePage from './pages/campaigns/CampaignsHomePage';
import CampaignManagementPage from './pages/campaigns/CampaignManagementPage';
import CampaignTemplatesPage from './pages/campaigns/CampaignTemplatesPage';
import CreateCampaignStartPage from './pages/campaigns/CreateCampaignStartPage';
import CreateCampaignMethodPage from './pages/campaigns/CreateCampaignMethodPage';
import ChooseCampaignTemplatePage from './pages/campaigns/ChooseCampaignTemplatePage';
import CreateCampaignPage from './pages/campaigns/CreateCampaignPage';
import CampaignDetailPage from './pages/campaigns/CampaignDetailPage';
import CampaignsReportsRedirect from './pages/campaigns/CampaignsReportsRedirect';
import CampaignsPlaceholderPage from './pages/campaigns/CampaignsPlaceholderPage';
import SmsTemplateDetailPage from './pages/campaigns/SmsTemplateDetailPage';
import Untitled from './pages/Untitled';
import ProtectedRoute from './components/auth/ProtectedRoute';

const AUTH_PATHS = ['/signup', '/signin', '/verify-otp', '/forgot-password'];

function shouldHideGuestNavbar(pathname) {
  return (
    AUTH_PATHS.includes(pathname) ||
    pathname === '/dashboard' ||
    pathname.startsWith('/customer-engagement') ||
    pathname.startsWith('/campaigns')
  );
}

function AppShell() {
  const location = useLocation();
  const hideNavbar = shouldHideGuestNavbar(location.pathname);

  return (
    <>
      <ScrollToTop />
      {!hideNavbar && <GuestNavbar />}
      <GlobalModals />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<CampaignLandingPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/product/campaigns" element={<CampaignsPage />} />
            <Route path="/product/:slug" element={<Untitled />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/verify-otp" element={<OtpVerificationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns"
              element={
                <ProtectedRoute>
                  <CampaignsLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<CampaignsHomePage />} />
              <Route path="management" element={<CampaignManagementPage />} />
              <Route
                path="sender-id"
                element={
                  <CampaignsPlaceholderPage
                    title="Sender ID"
                    description="Register and manage approved sender IDs for your SMS campaigns. This section will connect to your messaging providers next."
                  />
                }
              />
              <Route
                path="buy-credit"
                element={
                  <CampaignsPlaceholderPage
                    title="Buy Credit"
                    description="Purchase SMS credits and top up your campaign wallet. Billing integration will be wired here."
                  />
                }
              />
              <Route path="templates" element={<CampaignTemplatesPage />} />
              <Route path="library/:templateId" element={<SmsTemplateDetailPage />} />
              <Route path="create" element={<CreateCampaignStartPage />} />
              <Route path="create/method" element={<CreateCampaignMethodPage />} />
              <Route path="create/templates" element={<ChooseCampaignTemplatePage />} />
              <Route path="create/wizard" element={<CreateCampaignPage />} />
              <Route path="reports" element={<CampaignsReportsRedirect />} />
              <Route path=":campaignId" element={<CampaignDetailPage />} />
            </Route>
            <Route
              path="/customer-engagement"
              element={
                <ProtectedRoute>
                  <CustomerEngagementLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CustomerEngagementDashboardPage />} />
              <Route path="customers" element={<CustomerEngagementCustomersPage />} />
              <Route path="customers/:collectionId" element={<CollectionCustomersPage />} />
              <Route path="reports" element={<CustomerEngagementReportsPage />} />
            </Route>
            <Route path="/resources" element={<HelpCenterPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:slug" element={<BlogDetailPage />} />
            <Route path="/success-stories" element={<SuccessStoriesPage />} />
            <Route path="/success-stories/:slug" element={<SuccessStoryDetailPage />} />
            <Route path="/academy" element={<AcademyPage />} />
            <Route path="/webinars" element={<WebinarsPage />} />
            <Route path="/ads-hub" element={<Untitled />} />
            <Route path="/jobs" element={<Untitled />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
