import { Outlet, useLocation } from 'react-router-dom';
import CampaignsNavbar from '../components/campaigns-module/CampaignsNavbar';
import CustomerEngagementFooter from '../components/customer-engagement/CustomerEngagementFooter';

export default function CampaignsLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/campaigns' || pathname === '/campaigns/';
  const hideFooter = isHome || pathname.startsWith('/campaigns/create');

  return (
    <div
      className={`flex min-h-screen flex-col bg-[#FAFBFC] font-sans text-foreground ${
        isHome ? 'h-dvh overflow-hidden' : ''
      }`}
    >
      <CampaignsNavbar />
      <div
        className={`min-h-0 flex-1 ${
          isHome ? 'overflow-hidden bg-white lg:bg-[#FAFBFC]' : ''
        }`}
      >
        <Outlet />
      </div>
      {!hideFooter ? <CustomerEngagementFooter /> : null}
    </div>
  );
}
