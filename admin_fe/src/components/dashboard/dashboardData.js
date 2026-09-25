export const DATE_RANGES = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: 'ytd', label: 'This year' },
];

const RANGE_FACTOR = { '7d': 0.22, '30d': 1, '90d': 2.15, ytd: 7.4 };

const REGIONS = [
  { label: 'Greater Accra', value: 30000 },
  { label: 'Northern Region', value: 25000 },
  { label: 'Central Region', value: 15000 },
  { label: 'Western Region', value: 12000 },
  { label: 'Ashanti Region', value: 10000 },
  { label: 'Bono-Ahafo Region', value: 5000 },
];

const CITIES = [
  { label: 'Accra', value: 30000 },
  { label: 'Dormaa', value: 25000 },
  { label: 'Madina', value: 15000 },
  { label: 'Cape Coast', value: 12000 },
  { label: 'Abelemkpe', value: 10000 },
  { label: 'North Legon', value: 5000 },
];

const COUNTRIES = [
  { label: 'Ghana', value: 30000 },
  { label: 'Rwanda', value: 25000 },
  { label: 'Nigeria', value: 15000 },
  { label: 'Kenya', value: 12000 },
  { label: 'Ivory Coast', value: 10000 },
  { label: 'Uganda', value: 5000 },
];

const TYPES = [
  { label: 'Technology', value: 30000 },
  { label: 'Transportation', value: 25000 },
  { label: 'Ecommerce', value: 15000 },
  { label: 'Insurtech', value: 12000 },
  { label: 'Agriculture', value: 10000 },
  { label: 'Adtech', value: 5000 },
];

const SIGNUPS = [
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

const SPARK = {
  total: [12, 14, 16, 15, 18, 17, 21, 20, 24, 23, 27, 26, 30, 34],
  newer: [6, 7, 8, 8, 10, 9, 12, 13, 12, 16, 15, 18, 20, 22],
  active: [14, 15, 16, 18, 17, 20, 19, 22, 21, 24, 26, 25, 28, 31],
  inactive: [18, 17, 16, 18, 15, 14, 16, 13, 12, 14, 11, 12, 10, 11],
};

function scaleRows(rows, factor, focus) {
  return rows
    .map((row) => {
      const weight = !focus || row.label === focus ? 1 : 0.22;
      return { ...row, value: Math.max(1, Math.round(row.value * factor * weight)) };
    })
    .sort((a, b) => b.value - a.value);
}

function formatCount(value) {
  if (value >= 1000) {
    const scaled = value / 1000;
    const digits = scaled >= 10 ? 0 : 1;
    return `${scaled.toFixed(digits).replace(/\.0$/, '')}k`;
  }
  return String(value);
}

export function buildDashboard({ range, country, type }) {
  const factor = RANGE_FACTOR[range] ?? 1;
  const countryFocus = country === 'all' ? null : country;
  const typeFocus = type === 'all' ? null : type;
  const focusFactor = (countryFocus ? 0.46 : 1) * (typeFocus ? 0.38 : 1);

  const total = Math.round(52000 * factor * focusFactor);
  const newer = Math.round(total * 0.158);
  const active = Math.round(total * 0.8);
  const inactive = total - active;

  return {
    rangeLabel: DATE_RANGES.find((item) => item.id === range)?.label ?? 'Last 30 days',
    metrics: [
      { id: 'total', label: 'Total Business', hint: 'Every business on the platform in this period.', value: total, delta: 12.5, spark: SPARK.total },
      { id: 'newer', label: 'New Business', hint: 'Businesses onboarded during this period.', value: newer, delta: 18.4, spark: SPARK.newer },
      { id: 'active', label: 'Active Business', hint: 'Businesses that signed in or sent a campaign.', value: active, delta: 9.7, spark: SPARK.active },
      { id: 'inactive', label: 'Inactive Business', hint: 'Businesses with no activity in this period.', value: inactive, delta: -4.1, spark: SPARK.inactive },
    ],
    regions: scaleRows(REGIONS, factor * focusFactor, null),
    cities: scaleRows(CITIES, factor * focusFactor, null),
    countries: scaleRows(COUNTRIES, factor * focusFactor, countryFocus),
    types: scaleRows(TYPES, factor * focusFactor, typeFocus),
    growth: {
      labels: SIGNUPS.map((row) => row.label),
      values: SIGNUPS.map((row) => Math.max(1, Math.round(row.value * factor * focusFactor))),
    },
    formatCount,
  };
}

export const FILTER_COUNTRIES = COUNTRIES.map((row) => row.label);
export const FILTER_TYPES = TYPES.map((row) => row.label);
