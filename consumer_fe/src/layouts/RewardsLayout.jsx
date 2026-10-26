import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import RewardsNavbar from '../components/rewards/RewardsNavbar';
import RecipientOfferFooter from '../components/recipient-offer/RecipientOfferFooter';
import { touchSession } from '../services/recipient/store';

/** Shell for every /rewards page: purple navbar, page content, shared footer. */
export default function RewardsLayout() {
  const { pathname } = useLocation();

  // Navigating counts as activity, so an engaged recipient is never logged out mid-browse.
  useEffect(() => {
    touchSession();
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F7FB] text-[#0B1354]">
      <RewardsNavbar />
      <main className="mx-auto w-full max-w-8xl flex-1 px-4 pb-14 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <Outlet />
      </main>
      <RecipientOfferFooter />
    </div>
  );
}
