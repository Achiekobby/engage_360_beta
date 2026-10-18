export const CAMPAIGN_DETAIL_TABS = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'overview', label: 'Campaign Overview' },
  { id: 'purchase-logs', label: 'Purchase Logs' },
];

export const DELIVERY_METRICS = [
  { id: 'sms-launch', label: 'SMS Launch', value: '12.5k', tone: 'green' },
  { id: 'customer-reached', label: 'Customer Reached', value: '1.5k', tone: 'red' },
  { id: 'pending', label: 'Pending', value: '0.5k', tone: 'green' },
  { id: 'delivered', label: 'Delivered', value: '14k', tone: 'red' },
  { id: 'failed', label: 'Failed', value: '1k', tone: 'red' },
];

export const ENGAGEMENT_METRICS = [
  { id: 'clicks', label: 'Clicks', value: '90%', tone: 'green' },
  { id: 'ctr', label: 'Click-Through-Rate', value: '50%', tone: 'red' },
  { id: 'engagement', label: 'Engagement Rate', value: '90%', tone: 'green' },
  { id: 'open-rate', label: 'Open Rate', value: '10%', tone: 'green' },
  { id: 'conversions', label: 'Conversions', value: '90%', tone: 'green' },
];

export const PAYMENT_STATUS_STYLES = {
  Pending: 'text-[#E67E22]',
  Paid: 'text-[#1F9D55]',
  Failed: 'text-[#E5484D]',
};

const PURCHASE_LOG_SEED = [
  {
    customerName: 'George Arthur',
    phone: '233546477448',
    email: 'info@dealboxx.com',
    productTitle: 'Exclusive summer flash sale',
    quantity: 5,
    amount: '150',
    paymentStatus: 'Pending',
  },
  {
    customerName: 'Ama Mensah',
    phone: '233241112233',
    email: 'ama@dealboxx.com',
    productTitle: 'Clear Offer Bundle',
    quantity: 2,
    amount: '299',
    paymentStatus: 'Paid',
  },
  {
    customerName: 'Kwame Owusu',
    phone: '233501234567',
    email: 'kwame@dealboxx.com',
    productTitle: 'Exclusive summer flash sale',
    quantity: 1,
    amount: '75',
    paymentStatus: 'Failed',
  },
  {
    customerName: 'Efua Boateng',
    phone: '233277889900',
    email: 'efua@dealboxx.com',
    productTitle: 'Weekend Flash Deal',
    quantity: 3,
    amount: '450',
    paymentStatus: 'Paid',
  },
  {
    customerName: 'Kojo Asante',
    phone: '233209998877',
    email: 'kojo@dealboxx.com',
    productTitle: 'Flash Friday Bundle',
    quantity: 4,
    amount: '320',
    paymentStatus: 'Pending',
  },
  {
    customerName: 'Akosua Darko',
    phone: '233554433221',
    email: 'akosua@dealboxx.com',
    productTitle: 'Clear Offer Bundle',
    quantity: 1,
    amount: '99',
    paymentStatus: 'Paid',
  },
];

export const MOCK_PURCHASE_LOGS = Array.from({ length: 18 }, (_, index) => {
  const seed = PURCHASE_LOG_SEED[index % PURCHASE_LOG_SEED.length];
  const day = String(12 - Math.floor(index / 3)).padStart(2, '0');
  const hour = 7 + (index % 8);
  const statusCycle = ['Pending', 'Paid', 'Failed'];

  return {
    id: `log-${index + 1}`,
    ...seed,
    paymentStatus: statusCycle[index % statusCycle.length],
    dateTime: `${day}/08/2026, ${hour}:00${hour < 12 ? 'AM' : 'PM'}`,
  };
});

export const PURCHASE_LOGS_PAGE_SIZE = 5;

export const PURCHASE_LOG_FILTER_DEFAULTS = {
  paymentStatuses: [],
  dateRange: 'all',
};

export const PURCHASE_LOG_STATUS_OPTIONS = [
  { id: 'Pending', label: 'Pending' },
  { id: 'Paid', label: 'Paid' },
  { id: 'Failed', label: 'Failed' },
];

export const PURCHASE_LOG_DATE_OPTIONS = [
  { id: 'all', label: 'All time' },
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
];

export const CAMPAIGN_FILTER_DEFAULTS = {
  categories: [],
  channels: [],
  statuses: [],
  dateRange: 'all',
};

export const CAMPAIGN_FILTER_CHANNEL_OPTIONS = [
  { id: 'SMS', label: 'SMS' },
  { id: 'Email', label: 'Email' },
  { id: 'WhatsApp', label: 'WhatsApp' },
  { id: 'Push Notification', label: 'Push Notification' },
];

export const CAMPAIGN_FILTER_STATUS_OPTIONS = [
  { id: 'Active', label: 'Active' },
  { id: 'Scheduled', label: 'Scheduled' },
  { id: 'Draft', label: 'Draft' },
  { id: 'Completed', label: 'Completed' },
];

export const CAMPAIGN_FILTER_DATE_OPTIONS = [
  { id: 'all', label: 'All time' },
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: 'year', label: 'This year' },
];

export function countActiveCampaignFilters(filters = CAMPAIGN_FILTER_DEFAULTS) {
  let count = 0;
  if (filters.categories?.length) count += 1;
  if (filters.channels?.length) count += 1;
  if (filters.statuses?.length) count += 1;
  if (filters.dateRange && filters.dateRange !== 'all') count += 1;
  return count;
}

export function countActivePurchaseLogFilters(filters = PURCHASE_LOG_FILTER_DEFAULTS) {
  let count = 0;
  if (filters.paymentStatuses?.length) count += 1;
  if (filters.dateRange && filters.dateRange !== 'all') count += 1;
  return count;
}

export function getCampaignDetailFallback(campaign) {
  if (!campaign) return null;

  const isSales = campaign.categoryId === 'sales-conversion';

  return {
    ...campaign,
    channel: campaign.channel || 'SMS',
    channelId:
      campaign.channelId ||
      (campaign.channel === 'Email'
        ? 'email'
        : campaign.channel === 'WhatsApp'
          ? 'whatsapp'
          : campaign.channel === 'Push' || campaign.channel === 'Push Notification'
            ? 'push'
            : 'sms'),
    headline: campaign.headline || 'Clear Offer',
    body:
      campaign.body ||
      'Trust is built over time. Choose brands that are transparent, reliable, and committed to serving you better.',
    description:
      campaign.description ||
      campaign.body ||
      'Trust is built over time. Choose brands that are transparent, reliable, and committed to serving you better.',
    cta: campaign.cta || 'Buy Now',
    banner: campaign.banner || null,
    attachments: campaign.attachments || [
      {
        id: 'attachment-1',
        promoVisual: 'image',
        fileName: '',
        previewUrl: '',
        fileMimeType: '',
        price: isSales ? 'GHS 5.99' : campaign.price || '',
        discountedPrice: isSales ? 'GHS 5.99' : '',
        promoExpiryDate: '2026-06-12',
        voucherCode: '',
      },
    ],
    customerSource: campaign.targeting?.customerSource || campaign.customerSource || 'internal',
    customerCategoryLabel:
      campaign.targeting?.customerCategoryLabel ||
      campaign.customerCategoryLabel ||
      'Deal Box Promotion',
    collectionLabel:
      campaign.targeting?.collectionLabel || campaign.collectionLabel || 'New Customers',
    segmentFilters: campaign.targeting?.segmentFilters ||
      campaign.segmentFilters || [
        { id: 'gender-1', type: 'gender', value: 'Male' },
        { id: 'region-1', type: 'region', value: 'Greater Accra' },
        { id: 'location-1', type: 'location', value: 'Accra' },
        { id: 'age-1', type: 'age', value: '18-20' },
      ],
    estimatedReach: campaign.targeting?.scanStats?.estimatedReach || 1800,
    preferredReach: campaign.targeting?.preferredReach || 500,
  };
}
