import { CUSTOMER_ENGAGEMENT_BASE } from './customerEngagementNavData';

export const CE_FOOTER_BRAND = {
  title: 'ENGAGE 360',
  module: 'Customer Engagement',
  tagline: 'Centralize customer records, insights, and data quality in one place.',
};

export const CE_FOOTER_MODULE_LINKS = [
  { label: 'Dashboard', to: `${CUSTOMER_ENGAGEMENT_BASE}/dashboard` },
  { label: 'Customers', to: `${CUSTOMER_ENGAGEMENT_BASE}/customers` },
  { label: 'Reports', to: `${CUSTOMER_ENGAGEMENT_BASE}/reports` },
];

export const CE_FOOTER_SUPPORT_LINKS = [
  { label: 'Help Center', to: '/resources' },
  { label: 'Privacy & Policy', to: '#' },
  { label: 'Terms of Service', to: '#' },
];

export const CE_FOOTER_PLATFORM_LINKS = [
  { label: 'Platform Home', to: '/dashboard' },
  { label: 'All Services', to: '/dashboard' },
  { label: 'Contact Sales', to: '/contact' },
];
