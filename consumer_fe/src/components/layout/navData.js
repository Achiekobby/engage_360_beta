import {
  CalendarClock,
  ClipboardList,
  FileText,
  GraduationCap,
  HelpCircle,
  Inbox,
  LayoutGrid,
  Mail,
  Megaphone,
  MessageSquare,
  Monitor,
  Radio,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';

export const PRODUCT_MEGA_GROUPS = [
  {
    id: 'engage',
    label: 'Engage',
    tagline: 'Reach customers where they are',
    items: [
      {
        label: 'Customer Management',
        path: '/product',
        end: true,
        icon: Users,
        iconBg: 'bg-[#EDE8F8] text-primary',
        description: 'Unified profiles, segments, and CRM workflows.',
      },
      {
        label: 'Campaigns',
        path: '/product/campaigns',
        icon: Megaphone,
        iconBg: 'bg-[#FFF4E8] text-[#E67E22]',
        description: 'SMS, email, and WhatsApp campaigns in one flow.',
        featured: true,
      },
      {
        label: 'Survey',
        path: '/product/survey',
        icon: ClipboardList,
        iconBg: 'bg-[#E8F4FC] text-[#2E7DAD]',
        description: 'Collect feedback with branded forms and analytics.',
      },
      {
        label: 'Communication',
        path: '/product/communication',
        icon: MessageSquare,
        iconBg: 'bg-[#E8F8EF] text-[#1F9D55]',
        description: 'Two-way messaging across channels your team already uses.',
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    tagline: 'Run the front office without friction',
    items: [
      {
        label: 'Front Desk Management',
        path: '/product/front-desk-management',
        icon: LayoutGrid,
        iconBg: 'bg-[#F0F2F7] text-[#0B1354]',
        description: 'Visitor logs, queues, and desk coordination.',
      },
      {
        label: 'Appointment & Schedule',
        path: '/product/appointment-schedule',
        icon: CalendarClock,
        iconBg: 'bg-[#EDE8F8] text-primary',
        description: 'Bookings, reminders, and calendar sync.',
      },
      {
        label: 'Mail & Courier Management',
        path: '/product/mail-courier-management',
        icon: Inbox,
        iconBg: 'bg-[#E8F4FC] text-[#2E7DAD]',
        description: 'Track inbound packages and delivery handoffs.',
      },
      {
        label: 'Task Management',
        path: '/product/task-management',
        icon: Monitor,
        iconBg: 'bg-[#FFF4E8] text-[#E67E22]',
        description: 'Assign, prioritize, and close operational work.',
      },
    ],
  },
  {
    id: 'growth',
    label: 'Growth',
    tagline: 'Convert interest into revenue',
    items: [
      {
        label: 'Sales Management',
        path: '/product/sales-management',
        icon: TrendingUp,
        iconBg: 'bg-[#E8F8EF] text-[#1F9D55]',
        description: 'Pipeline visibility from first touch to close.',
      },
      {
        label: 'Leads Management',
        path: '/product/leads-management',
        icon: Target,
        iconBg: 'bg-[#EDE8F8] text-primary',
        description: 'Capture, score, and route leads automatically.',
      },
      {
        label: 'Advertising',
        path: '/product/advertising',
        icon: Radio,
        iconBg: 'bg-[#FFF4E8] text-[#E67E22]',
        description: 'Plan placements and measure campaign ROI.',
      },
      {
        label: 'Document Management',
        path: '/product/document-management',
        icon: FileText,
        iconBg: 'bg-[#F0F2F7] text-[#0B1354]',
        description: 'Store, share, and audit business documents.',
      },
    ],
  },
];

export const PRODUCT_ITEMS = PRODUCT_MEGA_GROUPS.flatMap((group) => group.items);

export const PRODUCT_FEATURED =
  PRODUCT_ITEMS.find((item) => item.featured) || PRODUCT_ITEMS.find((item) => item.path === '/product/campaigns');

export const RESOURCE_ITEMS = [
  { label: 'FAQs', path: '/resources', icon: HelpCircle },
  { label: 'Help Center', path: '/resources', icon: Monitor },
  { label: 'About us', path: '/about', icon: FileText },
  { label: 'Blogs', path: '/blogs', icon: Mail },
  { label: 'Success Stories', path: '/success-stories', icon: Users },
  { label: 'Academy', path: '/academy', icon: GraduationCap },
  { label: 'Webinars', path: '/webinars', icon: CalendarClock },
];

export const NAV_LINK_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Ads Hub', path: '/ads-hub' },
  { label: 'Job Board', path: '/jobs' },
  { label: 'Contact us', path: '/contact' },
];

/** Public entry to the recipient offer and rewards shop. */
export const REWARDS_NAV = {
  label: 'Rewards',
  path: '/offer',
  shopPath: '/rewards',
};

export const PRODUCT_PATHS = PRODUCT_ITEMS.map((item) => item.path);

export function isProductPathActive(pathname) {
  return pathname === '/product' || pathname.startsWith('/product/');
}

export const RESOURCE_PATHS = RESOURCE_ITEMS.map((item) => item.path);

export function isResourcePathActive(pathname) {
  return RESOURCE_PATHS.some(
    (path) => pathname === path || (path !== '/' && pathname.startsWith(`${path}/`)),
  );
}
