import { AUTOMATION_BUSINESS_OPTIONS } from './automationsData';

export const REPORT_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'engagement', label: 'Engagement & Conversions' },
];

export const REPORT_DATE_FILTERS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'ytd', label: 'Year to date' },
];

export const REPORT_BUSINESS_FILTERS = [
  { value: 'all', label: 'All businesses' },
  ...AUTOMATION_BUSINESS_OPTIONS.map((option) => ({
    value: option.id,
    label: option.label,
  })),
];

export const REPORT_ENGAGEMENT_MODES = [
  { id: 'static', label: 'Static Plot' },
  { id: 'native', label: 'Native Breakdown' },
];

export const BUSINESS_WEIGHT = {
  all: 1,
  dealboxx: 0.42,
  txtconnect: 0.28,
  'venus-retail': 0.18,
  northstar: 0.12,
};

export const DATE_WEIGHT = {
  '7d': 0.35,
  '30d': 1,
  '90d': 2.4,
  ytd: 3.6,
};

export const DAY_LABELS = [
  'Jan 1',
  'Jan 2',
  'Jan 3',
  'Jan 4',
  'Jan 5',
  'Jan 6',
  'Jan 7',
  'Jan 8',
  'Jan 9',
  'Jan 10',
];

export const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

export function scaleSeries(values, factor) {
  return values.map((value) => Math.max(1, Math.round(value * factor)));
}

export function formatCompact(value) {
  if (value >= 1000) {
    const compact = value / 1000;
    return `${compact % 1 === 0 ? compact.toFixed(0) : compact.toFixed(1)}k`;
  }
  return String(value);
}

export function formatChange(base, deltaLabel) {
  const signed = base >= 0 ? `↑ ${base.toFixed(1)}%` : `↓ ${Math.abs(base).toFixed(1)}%`;
  return `${signed} ${deltaLabel}`;
}

export function getReportFactor(businessId = 'all', dateFilter = '30d') {
  return (BUSINESS_WEIGHT[businessId] ?? 1) * (DATE_WEIGHT[dateFilter] ?? 1);
}

export function getBusinessLabel(businessId) {
  if (businessId === 'all') return 'all businesses';
  return (
    REPORT_BUSINESS_FILTERS.find((option) => option.value === businessId)?.label || 'business'
  );
}

export function volumeByBusinessValues(businessId, factor, dateFilter, base = 4200) {
  if (businessId === 'all') {
    return scaleSeries([base, base * 0.74, base * 0.67, base * 0.45], DATE_WEIGHT[dateFilter] ?? 1);
  }
  return AUTOMATION_BUSINESS_OPTIONS.map((option) =>
    option.id === businessId ? Math.round(base * factor) : Math.round(base * factor * 0.08),
  );
}
