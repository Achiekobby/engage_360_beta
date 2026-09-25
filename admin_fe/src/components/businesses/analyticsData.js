export const ANALYTICS_RANGES = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: 'ytd', label: 'This year' },
];

export const CATEGORIES = [
  { id: 'all', label: 'All categories' },
  { id: 'retail', label: 'Retail' },
  { id: 'hospitality', label: 'Hospitality' },
  { id: 'events', label: 'Events' },
  { id: 'technology', label: 'Technology' },
];

export const COLLECTIONS = [
  { id: 'all', label: 'All collections' },
  { id: 'loyalty', label: 'Loyalty' },
  { id: 'walkin', label: 'Walk-in' },
  { id: 'campaign', label: 'Campaign' },
  { id: 'referral', label: 'Referral' },
];

export const GENDERS = [
  { id: 'all', label: 'All genders' },
  { id: 'Male', label: 'Male' },
  { id: 'Female', label: 'Female' },
];

export const PROFILE_STATES = [
  { id: 'all', label: 'All profiles' },
  { id: 'complete', label: 'Complete only' },
  { id: 'incomplete', label: 'Incomplete only' },
];

const RANGE_FACTOR = { '7d': 0.22, '30d': 1, '90d': 2.15, ytd: 7.4 };
const CATEGORY_FACTOR = { all: 1, retail: 0.58, hospitality: 0.41, events: 0.33, technology: 0.47 };
const COLLECTION_FACTOR = { all: 1, loyalty: 0.64, walkin: 0.46, campaign: 0.52, referral: 0.28 };

const REGIONS = [
  { label: 'Greater Accra', value: 30000 },
  { label: 'Central Region', value: 15000 },
  { label: 'Western Region', value: 12000 },
  { label: 'Northern Region', value: 25000 },
  { label: 'Ashanti Region', value: 10000 },
  { label: 'Bono-Ahafo Region', value: 5000 },
];

export const ANALYTICS_TABS = [
  { id: 'customer', label: 'Customer' },
  { id: 'demographic', label: 'Demographic' },
  { id: 'category', label: 'Category & Segment' },
  { id: 'contact', label: 'Contactability & Reachability' },
  { id: 'quality', label: 'Data Quality' },
  { id: 'distribution', label: 'Customer Distribution' },
  { id: 'churn', label: 'Churn & Retention' },
];

const AGES = [
  { label: '18–24', value: 30000 },
  { label: '25–34', value: 18000 },
  { label: '35–44', value: 14000 },
  { label: '45–54', value: 12000 },
  { label: '55–64', value: 9000 },
  { label: '65+', value: 5000 },
];

const TRENDS = [
  { label: 'Jan', value: 225 },
  { label: 'Feb', value: 130 },
  { label: 'Mar', value: 95 },
  { label: 'Apr', value: 80 },
  { label: 'May', value: 100 },
  { label: 'June', value: 150 },
  { label: 'July', value: 82 },
  { label: 'Aug', value: 178 },
  { label: 'Sep', value: 148 },
  { label: 'Oct', value: 228 },
];

const LOCATIONS = [
  { label: 'Accra', value: 30000 },
  { label: 'Kumasi', value: 18000 },
  { label: 'Cape Coast', value: 12000 },
  { label: 'Tamale', value: 15000 },
  { label: 'Takoradi', value: 10000 },
  { label: 'Madina', value: 8000 },
];

const GENDER_ROWS = [
  { label: 'Male', value: 36400, color: '#2563EB' },
  { label: 'Female', value: 15600, color: '#0B1354' },
];

const INTEREST_CATEGORIES = [
  { label: 'Electronics', value: 28000 },
  { label: 'Insurance', value: 9000 },
  { label: 'Food', value: 7000 },
  { label: 'Banking', value: 6000 },
  { label: 'Legal', value: 4000 },
  { label: 'Automobile', value: 3500 },
  { label: 'Others', value: 2500 },
];

const SUBCATEGORIES = [
  { label: 'Mobile Phone', value: 18000 },
  { label: 'Life Insurance', value: 12000 },
  { label: 'Marriage', value: 8000 },
  { label: 'Toyota', value: 7000 },
  { label: 'Laptop', value: 5000 },
];

const SEGMENTS = [
  { label: 'New customers', value: 22000 },
  { label: 'Active customers', value: 18000 },
  { label: 'Loyal customers', value: 8000 },
  { label: 'Returning customers', value: 5000 },
  { label: 'Churned customers', value: 3000 },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

const DISTRIBUTION_GROWTH = {
  region: [
    { id: 'accra', label: 'Greater Accra', color: '#0F766E', values: [220, 130, 95, 80, 110, 160, 85, 190, 150, 230] },
    { id: 'northern', label: 'Northern', color: '#1E3A5F', values: [160, 90, 70, 60, 85, 120, 70, 140, 110, 170] },
    { id: 'central', label: 'Central', color: '#D97706', values: [90, 70, 55, 45, 60, 80, 50, 95, 75, 100] },
  ],
  location: [
    { id: 'accra', label: 'Accra', color: '#EA580C', values: [210, 125, 90, 75, 100, 150, 80, 180, 145, 220] },
    { id: 'kumasi', label: 'Kumasi', color: '#111827', values: [140, 95, 70, 60, 80, 115, 65, 130, 100, 155] },
    { id: 'tamale', label: 'Tamale', color: '#9F1239', values: [85, 70, 50, 45, 60, 80, 48, 90, 72, 98] },
  ],
  age: [
    { id: '18', label: '18–24', color: '#2563EB', values: [200, 120, 85, 70, 95, 140, 75, 165, 130, 210] },
    { id: '25', label: '25–34', color: '#111827', values: [150, 100, 75, 60, 85, 120, 68, 145, 110, 165] },
    { id: '35', label: '35–44', color: '#F59E0B', values: [95, 70, 55, 48, 62, 85, 50, 100, 80, 110] },
  ],
};

const SEGMENT_GROWTH = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  series: [
    { id: 'new', label: 'New customers', color: '#0B1354', values: [210, 90, 150, 100, 220, 70, 155, 150, 215, 155] },
    { id: 'active', label: 'Active customers', color: '#2563EB', values: [155, 130, 90, 145, 80, 195, 75, 220, 80, 250] },
    { id: 'inactive', label: 'Inactive customers', color: '#14B8A6', values: [80, 160, 80, 80, 145, 50, 195, 155, 150, 90] },
  ],
};

function scaleRows(rows, factor, focus) {
  return rows
    .map((row) => {
      const weight = !focus || row.label === focus ? 1 : 0.18;
      return { ...row, value: Math.max(1, Math.round(row.value * factor * weight)) };
    })
    .sort((a, b) => b.value - a.value);
}

export function formatCount(value) {
  if (value >= 1000) {
    const scaled = value / 1000;
    const digits = scaled >= 10 ? 0 : 1;
    return `${scaled.toFixed(digits).replace(/\.0$/, '')}K`;
  }
  return String(value);
}

export function buildAnalytics({ range, category, collection, gender, profile, businessCount }) {
  const rangeFactor = RANGE_FACTOR[range] ?? 1;
  const catalogFactor = (CATEGORY_FACTOR[category] ?? 1) * (COLLECTION_FACTOR[collection] ?? 1);
  const businessFactor = Math.max(0.45, (businessCount || 12) / 12);
  const genderWeight = gender === 'all' ? 1 : 0.54;
  const profileWeight = profile === 'all' ? 1 : profile === 'complete' ? 0.68 : 0.32;
  const factor = rangeFactor * catalogFactor * businessFactor * genderWeight * profileWeight;

  const total = Math.round(52000 * factor);
  const newer = Math.round(total * 0.158);
  const active = Math.round(total * 0.8);
  const inactive = total - active;
  const complete = Math.round(total * (profile === 'incomplete' ? 0.22 : 0.71));
  const incomplete = total - complete;
  const duplicates = Math.max(12, Math.round(total * 0.018));
  const invalidPhones = Math.max(8, Math.round(total * 0.027));

  return {
    rangeLabel: ANALYTICS_RANGES.find((item) => item.id === range)?.label ?? 'Last 30 days',
    metrics: [
      { id: 'total', label: 'Total customers', hint: 'Unique customers across every business in this view.', value: total, delta: 10.5 },
      { id: 'newer', label: 'New customers', hint: 'Customers added during this period.', value: newer, delta: 13.8 },
      { id: 'active', label: 'Active customers', hint: 'Customers who engaged at least once in this period.', value: active, delta: 8.2 },
      { id: 'inactive', label: 'Inactive customers', hint: 'Customers with no recorded activity in this period.', value: inactive, delta: -3.6 },
      { id: 'growth', label: 'Customer growth rate', hint: 'Net new customers versus the previous period.', value: 15, delta: 2.1, unit: '%' },
    ],
    regions: scaleRows(REGIONS, factor, null),
    ages: scaleRows(AGES, factor, null),
    locations: scaleRows(LOCATIONS, factor, null),
    genders: scaleRows(GENDER_ROWS, factor, gender === 'all' ? null : gender),
    trends: {
      labels: TRENDS.map((row) => row.label),
      values: TRENDS.map((row) => Math.max(1, Math.round(row.value * rangeFactor * catalogFactor))),
    },
    interestCategories: scaleRows(INTEREST_CATEGORIES, factor, null),
    subcategories: scaleRows(SUBCATEGORIES, factor, null),
    segments: scaleRows(SEGMENTS, factor, null),
    segmentGrowth: {
      labels: SEGMENT_GROWTH.labels,
      series: SEGMENT_GROWTH.series.map((series) => ({
        ...series,
        values: series.values.map((value) => Math.max(1, Math.round(value * rangeFactor * catalogFactor))),
      })),
    },
    contact: {
      phone: {
        total,
        valid: Math.round(total * 0.8),
        invalid: total - Math.round(total * 0.8),
        validShare: 80,
      },
      email: {
        total,
        valid: Math.round(total * 0.63),
        invalid: total - Math.round(total * 0.63),
        validShare: 63,
      },
      campaignReady: {
        total: Math.round(total * 0.8 * 0.63),
        trends: {
          labels: TRENDS.map((row) => row.label),
          values: TRENDS.map((row) => Math.max(1, Math.round(row.value * rangeFactor * catalogFactor))),
        },
      },
    },
    distributionGrowth: Object.fromEntries(
      Object.entries(DISTRIBUTION_GROWTH).map(([key, series]) => [
        key,
        {
          labels: MONTHS,
          series: series.map((item) => ({
            ...item,
            values: item.values.map((value) => Math.max(1, Math.round(value * rangeFactor * catalogFactor))),
          })),
        },
      ]),
    ),
    qualityOverview: {
      missing: { count: incomplete, share: total ? Math.round((incomplete / total) * 100) : 0 },
      duplicates: { count: duplicates, share: total ? Math.round((duplicates / total) * 100) : 0 },
      phones: { count: total - Math.round(total * 0.8), share: 20 },
      emails: { count: total - Math.round(total * 0.63), share: 37 },
      completion: {
        labels: TRENDS.map((row) => row.label),
        values: TRENDS.map((row) => Math.max(1, Math.round(row.value * 0.71 * rangeFactor * catalogFactor))),
      },
    },
    quality: [
      { id: 'complete', label: 'Complete profiles', value: complete, hint: 'Name, phone, and gender are all filled.', tone: '#16A34A' },
      { id: 'incomplete', label: 'Incomplete profiles', value: incomplete, hint: 'Missing at least one required field.', tone: '#D97706' },
      { id: 'duplicates', label: 'Duplicate customers', value: duplicates, hint: 'Same phone or email on more than one record.', tone: '#DC2626' },
      { id: 'invalid', label: 'Invalid phone numbers', value: invalidPhones, hint: 'Numbers that fail Ghana phone validation.', tone: '#7C3AED' },
    ],
    churn: {
      lifecycle: [
        { label: 'Active', value: Math.round(total * 0.68), color: '#0F766E' },
        { label: 'At-risk', value: Math.round(total * 0.2), color: '#E11D48' },
        { label: 'Churned', value: Math.max(1, total - Math.round(total * 0.68) - Math.round(total * 0.2)), color: '#111827' },
      ],
      retentionRate: Math.min(92, Math.max(62, Math.round(80 + (catalogFactor - 1) * 8 - (rangeFactor - 1) * 1.6))),
      churnRate: Math.min(28, Math.max(6, Math.round(12 - (catalogFactor - 1) * 5 + (rangeFactor - 1) * 1.4))),
      inactive,
      inactiveShare: total ? Math.round((inactive / total) * 100) : 0,
    },
  };
}
