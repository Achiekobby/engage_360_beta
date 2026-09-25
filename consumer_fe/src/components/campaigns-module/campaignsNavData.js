export const CAMPAIGNS_BASE = '/campaigns';

export const CAMPAIGNS_NAV = [
  { label: 'Dashboard', path: '/dashboard', end: false },
  { label: 'Campaign Management', path: `${CAMPAIGNS_BASE}/management`, end: false },
  { label: 'Sender ID', path: `${CAMPAIGNS_BASE}/sender-id`, end: false },
  { label: 'Buy Credit', path: `${CAMPAIGNS_BASE}/buy-credit`, end: false },
];

export const CAMPAIGN_CATEGORIES = [
  { id: 'promotions', label: 'Promotions' },
  { id: 'advertisement', label: 'Advertisement' },
  { id: 'lead-generation', label: 'Lead Generation' },
  { id: 'customer-engagement', label: 'Customer Engagement' },
  { id: 'customer-supports', label: 'Customer Supports' },
  { id: 'service-alerts', label: 'Service Alerts' },
  { id: 'events-activation', label: 'Events & Activation' },
  { id: 'sales-conversion', label: 'Sales Conversion' },
  { id: 'upsell-cross-sell', label: 'Upsell & Cross Sell' },
  { id: 'subscriptions', label: 'Subscriptions Sign-ups' },
  { id: 'customer-onboarding', label: 'Customer Onboarding' },
  { id: 'customer-retention', label: 'Customer Retention' },
  { id: 're-engagement', label: 'Re-Engagement' },
];

export const CREATE_CAMPAIGN_MENU = [
  { id: 'promotions', label: 'Promotions', icon: 'tag' },
  { id: 'advertisement', label: 'Advertisement', icon: 'megaphone' },
  { id: 'lead-generation', label: 'Lead Generation', icon: 'userPlus' },
  { id: 'service-alerts', label: 'Service Alerts', icon: 'bell' },
  { id: 'sales-conversion', label: 'Sales', icon: 'trending' },
  { id: 'events-activation', label: 'Events & Activation', icon: 'calendar' },
  { id: 'upsell-cross-sell', label: 'Upsell & Cross Sell', icon: 'layers' },
  { id: 'subscriptions', label: 'Subscription Sign-ups', icon: 'repeat' },
  { id: 'customer-onboarding', label: 'Customer Onboarding', icon: 'userCheck' },
  { id: 'customer-retention', label: 'Customer Retention', icon: 'heart' },
  { id: 're-engagement', label: 'Re-Engagement', icon: 'refresh' },
  { id: 'product-signups', label: 'Product Sign-ups', icon: 'package' },
];
