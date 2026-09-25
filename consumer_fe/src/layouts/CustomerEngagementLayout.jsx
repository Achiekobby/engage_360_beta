import { Outlet } from 'react-router-dom';
import CustomerEngagementNavbar from '../components/customer-engagement/CustomerEngagementNavbar';
import CustomerEngagementFooter from '../components/customer-engagement/CustomerEngagementFooter';

export default function CustomerEngagementLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC] font-sans text-foreground">
      <CustomerEngagementNavbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <CustomerEngagementFooter />
    </div>
  );
}
