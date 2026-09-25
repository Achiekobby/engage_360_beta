import { formatCedi, formatNumber, labelFor, CAMPAIGN_CATEGORIES, CAMPAIGN_CHANNELS } from '../campaigns/campaignData';

export const SETTINGS_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'credits', label: 'Credits' },
];

export const SETTINGS_RANGES = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
];

const RANGE_FACTOR = { '7d': 0.28, '30d': 1, '90d': 2.4 };

function hash(value) {
  return [...String(value)].reduce((total, char) => (total * 31 + char.charCodeAt(0)) >>> 0, 0);
}

function scale(values, factor) {
  return values.map((value) => Math.max(1, Math.round(value * factor)));
}

export function creditBalanceFor(business) {
  if (business.creditBalance != null) return business.creditBalance;
  return 120 + (hash(business.id) % 880);
}

const CATEGORY_TONE = {
  advertisement: '#2563EB',
  sales: '#EAB308',
  'lead-generation': '#7C3AED',
  'events-activations': '#EA580C',
  promotions: '#16A34A',
  'service-alerts': '#DC2626',
};

const CATEGORY_FALLBACK = {
  advertisement: 80,
  sales: 62,
  'lead-generation': 76,
  'events-activations': 65,
  promotions: 60,
  'service-alerts': 60,
};

const CATEGORY_ORDER = ['advertisement', 'sales', 'lead-generation', 'events-activations', 'promotions', 'service-alerts'];

function categoryEngagement(campaigns) {
  return CATEGORY_ORDER.map((id) => {
    const meta = CAMPAIGN_CATEGORIES.find((item) => item.id === id);
    const rows = campaigns.filter((item) => item.category === id);
    const sent = rows.reduce((sum, item) => sum + (Number(item.sent) || 0), 0);
    const engaged = rows.reduce((sum, item) => sum + (Number(item.opened) || 0) + (Number(item.clicked) || 0), 0);
    const computed = sent ? Math.min(92, Math.max(48, Math.round((engaged / sent) * 100))) : CATEGORY_FALLBACK[id];
    const value = Math.round(CATEGORY_FALLBACK[id] * 0.75 + computed * 0.25);
    return {
      id,
      label: meta?.label ?? id,
      value,
      color: CATEGORY_TONE[id],
    };
  });
}

export function buildSettingsAnalytics({ businesses, campaigns, rangeId }) {
  const factor = RANGE_FACTOR[rangeId] ?? 1;
  const delivered = campaigns.reduce((sum, item) => sum + (Number(item.delivered) || 0), 0);
  const revenue = Math.round(delivered * 0.42);
  const categories = categoryEngagement(campaigns);
  const dau = Math.max(12, Math.round(248 * factor));
  const mau = Math.max(dau, Math.round(8420 * (rangeId === '7d' ? 0.72 : rangeId === '90d' ? 1.15 : 1)));
  const signupsToday = Math.max(4, Math.round((businesses.length || 12) * (rangeId === '7d' ? 0.7 : rangeId === '90d' ? 1.2 : 1)));
  const revenueToday = Math.round(12400 * (rangeId === '7d' ? 0.85 : rangeId === '90d' ? 1.1 : 1));
  const revenueAllTime = 2_000_000 + Math.round(revenue * factor);

  return {
    health: {
      cards: [
        { id: 'dau', label: 'Daily active users', value: formatNumber(dau), detail: 'Last 24 hours', accent: '#2563EB' },
        { id: 'mau', label: 'Monthly active users', value: formatNumber(mau), detail: 'Last 30 days', accent: '#16A34A' },
        { id: 'session', label: 'Average session duration', value: '3 days', detail: 'Last 30 days', accent: '#0B1354' },
        { id: 'signups', label: 'New sign-ups today', value: formatNumber(signupsToday), detail: 'Last 24 hours', accent: '#D97706' },
        { id: 'revenue-today', label: 'Revenue today', value: formatCedi(revenueToday), detail: 'Yesterday GH₵11,200', accent: '#2563EB' },
        { id: 'revenue-all', label: 'Total revenue (all time)', value: formatCedi(revenueAllTime), detail: 'Last 30 days included', accent: '#0B1354' },
      ],
      charts: [
        {
          id: 'daily-active',
          title: 'Daily active users',
          subtitle: 'People who opened the workspace or a campaign in each day',
          unit: 'users',
          color: '#2563EB',
          labels: ['19 Sep', '20 Sep', '21 Sep', '22 Sep', '23 Sep', '24 Sep', '25 Sep'],
          values: scale([118, 86, 74, 182, 246, 238, 250], factor),
        },
        {
          id: 'monthly-active',
          title: 'Monthly active users',
          subtitle: 'Unique users who returned in each of the last seven months',
          unit: 'users',
          color: '#16A34A',
          labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          values: scale([4200, 3180, 3640, 7900, 8640, 8280, 8420], factor),
        },
        {
          id: 'revenue-trend',
          title: 'Revenue trend',
          subtitle: 'Platform take versus the typical business contribution',
          unit: 'GH₵',
          labels: ['14 Sep', '15 Sep', '16 Sep', '17 Sep', '18 Sep', '19 Sep', '20 Sep', '21 Sep', '22 Sep', '23 Sep', '24 Sep', '25 Sep'],
          series: [
            { id: 'total', label: 'Total revenue', color: '#1D4ED8', values: scale([8200, 9100, 7600, 12400, 11800, 9800, 7200, 14100, 13600, 15200, 14800, 12400], factor) },
            { id: 'per-business', label: 'Revenue per business', color: '#93C5FD', values: scale([2100, 2400, 1900, 3100, 2800, 2300, 1600, 3400, 3200, 3600, 3500, 2800], factor) },
          ],
        },
      ],
      categories,
    },
    engagement: {
      cards: [
        { id: 'dau', label: 'Daily active users', value: formatNumber(dau), detail: 'Last 30 days', accent: '#2563EB' },
        { id: 'mau', label: 'Monthly active users', value: formatNumber(mau), detail: 'Last 30 days', accent: '#16A34A' },
        { id: 'session', label: 'Average session duration', value: '3 days', detail: 'Last 30 days', accent: '#0B1354' },
      ],
      charts: [
        {
          id: 'daily-sessions',
          title: 'Daily active users & sessions',
          subtitle: 'Daily users against total session counts',
          unit: 'people',
          labels: ['16 Sep', '17 Sep', '18 Sep', '19 Sep', '20 Sep', '21 Sep', '22 Sep', '23 Sep', '24 Sep', '25 Sep'],
          series: [
            { id: 'daily', label: 'Daily', color: '#1D4ED8', values: scale([218, 154, 92, 220, 214, 208, 202, 210, 196, 188], factor) },
            { id: 'sessions', label: 'Total sessions', color: '#93C5FD', values: scale([162, 148, 88, 96, 152, 146, 154, 158, 152, 156], factor) },
          ],
        },
        {
          id: 'mau-growth',
          title: 'Monthly active users growth',
          subtitle: 'Seven-month trend in the returning user base',
          unit: 'users',
          color: '#1E3A8A',
          labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          values: scale([4200, 3180, 3640, 7900, 8640, 8280, 8420], factor),
        },
        {
          id: 'category-rate',
          title: 'Campaign category engagement rate',
          subtitle: 'Usage versus clicks, and the resulting engagement rate',
          unit: 'activity',
          labels: categories.map((item) => item.label),
          series: [
            { id: 'usage', label: 'Usage', color: '#1D4ED8', values: scale([220, 118, 164, 142, 188, 96], factor) },
            { id: 'clicks', label: 'Clicks', color: '#93C5FD', values: scale([84, 176, 102, 190, 72, 58], factor) },
            {
              id: 'rate',
              label: 'Engagement rate',
              color: '#22C55E',
              values: scale(categories.map((item) => Math.round((item.value / 100) * 250)), factor),
              display: categories.map((item) => `${item.value}%`),
            },
          ],
        },
      ],
    },
    revenue: {
      cards: [
        { id: 'total', label: 'Total revenue (all time)', value: formatCedi(revenueAllTime), detail: 'Last 30 days included', accent: '#0B1354' },
        {
          id: 'per-business',
          label: 'Revenue per business',
          value: formatCedi(Math.round(revenueAllTime / Math.max(businesses.length, 1))),
          detail: 'Last 30 days',
          accent: '#2563EB',
        },
        {
          id: 'average',
          label: 'Average revenue per business',
          value: formatCedi(Math.round((revenue * factor) / Math.max(businesses.length, 1))),
          detail: 'Last 30 days',
          accent: '#16A34A',
        },
        { id: 'growth', label: 'Revenue growth rate', value: '+14%', detail: 'Last 30 days', accent: '#22C55E' },
      ],
      charts: [
        {
          id: 'revenue-trend',
          title: 'Revenue trend analysis',
          subtitle: 'Current period against the previous period, with the difference',
          unit: 'GH₵',
          labels: ['16 Sep', '17 Sep', '18 Sep', '19 Sep', '20 Sep', '21 Sep', '22 Sep', '23 Sep', '24 Sep', '25 Sep'],
          series: [
            { id: 'current', label: 'Current', color: '#1D4ED8', values: scale([18200, 8400, 7200, 11800, 14100, 9800, 5400, 16800, 22400, 19600], factor) },
            { id: 'past', label: 'Past', color: '#93C5FD', values: scale([9100, 15200, 7400, 19600, 8800, 16400, 9200, 7800, 8600, 14800], factor) },
            {
              id: 'diff',
              label: '% Difference',
              color: '#22C55E',
              values: scale([10000, 7200, 13600, 14400, 17600, 8400, 5600, 10800, 7600, 15200], factor),
              display: ['+100%', '-45%', '-3%', '-40%', '+60%', '-40%', '-41%', '+115%', '+160%', '+32%'],
            },
          ],
        },
        {
          id: 'average-trend',
          title: 'Average revenue metrics trend',
          subtitle: 'Per-business credit and top-up revenue over time',
          unit: 'GH₵',
          labels: ['16 Sep', '17 Sep', '18 Sep', '19 Sep', '20 Sep', '21 Sep', '22 Sep', '23 Sep', '24 Sep', '25 Sep'],
          series: [
            { id: 'current', label: 'Current', color: '#1D4ED8', values: scale([4200, 1800, 3900, 4100, 4300, 3100, 4000, 2900, 3000, 4100], factor) },
            { id: 'past', label: 'Past', color: '#93C5FD', values: scale([1600, 1400, 1500, 1600, 3200, 3000, 1500, 3300, 3100, 3200], factor) },
          ],
        },
        {
          id: 'month-compare',
          title: 'Month-over-month comparison',
          subtitle: 'Revenue growth across the last ten months',
          unit: 'GH₵',
          labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          series: [
            { id: 'current', label: 'Current', color: '#1D4ED8', values: scale([22400, 11800, 8200, 9100, 22800, 21600, 22000, 20800, 19600, 23000], factor) },
            { id: 'past', label: 'Past', color: '#93C5FD', values: scale([16800, 17600, 15400, 9600, 7800, 17200, 16600, 16000, 8200, 17000], factor) },
          ],
        },
      ],
    },
  };
}

export function buildLedger(businesses, campaigns) {
  const types = [
    { id: 'topup', label: 'Credit top-up' },
    { id: 'send', label: 'Message send' },
    { id: 'fee', label: 'Platform fee' },
  ];
  const rows = campaigns.slice(0, 18).map((campaign, index) => {
    const business = businesses.find((item) => item.id === campaign.businessId);
    const type = types[index % types.length];
    const amount = type.id === 'topup' ? 200 + (index % 5) * 50 : type.id === 'fee' ? 45 + index * 3 : Math.max(12, Math.round((campaign.sent || 80) * 0.04));
    return {
      id: `led-${campaign.id}`,
      at: campaign.scheduledAt || campaign.createdAt,
      business: business?.companyName ?? 'Unknown business',
      businessId: campaign.businessId,
      type: type.label,
      channel: labelFor(CAMPAIGN_CHANNELS, campaign.channel),
      amount,
      status: index % 7 === 0 ? 'Pending' : 'Settled',
    };
  });
  return rows.sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
}

export const CREDIT_CADENCES = [
  { id: 'daily', label: 'Track businesses that top up daily', detail: 'A credit purchase in the last 24 hours' },
  { id: 'weekly', label: 'Track businesses that top up weekly', detail: 'A credit purchase in the last seven days' },
  { id: 'monthly', label: 'Track businesses that top up monthly', detail: 'A credit purchase in the last 30 days' },
  { id: 'uneven', label: 'Track businesses with an uneven top-up pattern', detail: 'Irregular or missed top-ups' },
];

const CREDIT_ACTIVITY = ['Active 2 mins ago', 'Active 3 mins ago', 'Active 8 mins ago', 'Active 1 hour ago'];

function lastTopupAt(business) {
  const date = new Date(business.onboardedAt || Date.now());
  date.setDate(date.getDate() + (hash(business.id) % 20));
  date.setHours(8 + (hash(business.id) % 10), hash(business.id) % 50, 0, 0);
  return date;
}

export function lastTopupLabel(business) {
  return formatLedgerWhen(lastTopupAt(business).toISOString());
}

export function creditActivityFor(business) {
  return CREDIT_ACTIVITY[hash(business.id) % CREDIT_ACTIVITY.length];
}

export function creditCadenceFor(business) {
  return CREDIT_CADENCES[hash(business.id) % CREDIT_CADENCES.length].id;
}

export function buildCreditGroups(businesses) {
  return CREDIT_CADENCES.map((cadence) => ({
    ...cadence,
    rows: businesses.filter((item) => creditCadenceFor(item) === cadence.id),
  }));
}

const CREDIT_TYPES = ['SMS', 'Email', 'WhatsApp'];
const CREDIT_AMOUNTS = [30000, 50000, 200, 3000, 60000, 12000, 8500];
const CREDIT_UNITS = [1_000_000, 500_000, 800_000, 30_000, 34_000_000, 120_000, 45_000];

export function formatCreditUnits(value) {
  const amount = Number(value) || 0;
  if (amount >= 1_000_000) {
    const text = (amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1);
    return `${text}M`;
  }
  if (amount >= 1000) return `${Math.round(amount / 1000)}K`;
  return String(amount);
}

export function buildCreditHistory(business) {
  if (!business) return [];
  const seed = hash(business.id);
  return Array.from({ length: 7 }, (_, index) => {
    const at = lastTopupAt(business);
    at.setDate(at.getDate() - index * 3);
    at.setHours(9, 14, 22, 0);
    return {
      id: `${business.id}-top-${index}`,
      at: at.toISOString(),
      type: CREDIT_TYPES[(seed + index) % CREDIT_TYPES.length],
      amount: CREDIT_AMOUNTS[index],
      units: CREDIT_UNITS[index],
      status: (seed + index) % 5 === 0 ? 'Failed' : 'Success',
    };
  });
}

export function formatLedgerWhen(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
