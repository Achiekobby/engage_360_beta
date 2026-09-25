import {
  Activity,
  BadgePercent,
  BarChart3,
  BellRing,
  CalendarDays,
  Coins,
  ContactRound,
  HeartHandshake,
  Home,
  Inbox,
  Megaphone,
  MonitorPlay,
  Settings,
  ShoppingBag,
  Building2,
  Ticket,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';
import { CAMPAIGN_CATEGORIES } from '../campaigns/campaignData';
import { SETTINGS_TABS } from '../settings/settingsData';

const SETTINGS_ICONS = {
  overview: Activity,
  engagement: HeartHandshake,
  revenue: Wallet,
  credits: Coins,
};

const CAMPAIGN_ICONS = {
  promotions: BadgePercent,
  'lead-generation': UserPlus,
  advertisement: MonitorPlay,
  'service-alerts': BellRing,
  sales: ShoppingBag,
  'events-activations': CalendarDays,
};

export const ADMIN_NAV = [
  { label: 'Dashboard', to: '/dashboard', icon: Home, end: true },
  { label: 'Business Management', to: '/businesses', icon: Building2 },
  
  { label: 'Account Management', to: '/accounts', icon: ContactRound, end: true },
  { label: 'Customer Management', to: '/customers', icon: Users, end: true },
  {
    label: 'Campaign Management',
    to: '/campaigns',
    icon: Megaphone,
    children: CAMPAIGN_CATEGORIES.map((item) => ({
      label: item.label,
      to: `/campaigns?category=${item.id}`,
      category: item.id,
      icon: CAMPAIGN_ICONS[item.id] ?? Megaphone,
      comingSoon: Boolean(item.comingSoon),
    })),
  },
  {
    label: 'Platform Settings',
    to: '/settings',
    icon: Settings,
    dropdown: true,
    children: SETTINGS_TABS.map((item) => ({
      label: item.label,
      to: item.id === 'overview' ? '/settings' : `/settings?tab=${item.id}`,
      tab: item.id,
      icon: SETTINGS_ICONS[item.id] ?? Settings,
    })),
  },
  {
    label: 'Tickets',
    to: '/tickets',
    icon: Ticket,
    dropdown: true,
    children: [
      { label: 'Inbox', to: '/tickets', icon: Inbox, end: true },
      { label: 'Analytics', to: '/tickets/analytics', icon: BarChart3, end: true },
    ],
  },
];
