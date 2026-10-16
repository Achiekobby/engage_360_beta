export const REPORT_TABS = [
  {
    id: 'customer',
    label: 'Customer',
    title: 'Overall Data Health',
    subtitle: 'High-level view of customer volume, activity, and growth trends',
  },
  {
    id: 'demographics',
    label: 'Demographics',
    title: 'Demographic Overview',
    subtitle: 'Breakdown of customers by region, location, gender, and age',
  },
  {
    id: 'category-segment',
    label: 'Category & Segment',
    title: 'Category & Segment',
    subtitle: 'How customers are grouped by category, sub-category, and segment',
  },
  {
    id: 'contactability',
    label: 'Contactability & Reachability',
    title: 'Contactability & Reachability',
    subtitle: 'Phone and email validity plus campaign readiness over time',
  },
  {
    id: 'data-quality',
    label: 'Data Quality',
    title: 'Data Quality',
    subtitle: 'Profile completeness, duplicates, and invalid contact details',
  },
  {
    id: 'distribution',
    label: 'Customer Distribution',
    title: 'Customer Distribution',
    subtitle: 'Analysis of how customers are spread and growing across key dimensions',
  },
  {
    id: 'churn-retention',
    label: 'Churn & Retention',
    title: 'Churn & Retention',
    subtitle: 'Active, at-risk, and churned customers with retention metrics',
  },
  {
    id: 'automations',
    label: 'Automations',
    title: 'Automation Reports',
    subtitle: 'Birthday automation overview and engagement performance',
  },
];

export const REPORT_FILTER_OPTIONS = {
  date: ['All Time', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'This Year'],
  category: ['All Categories', 'Promotions', 'VIP', 'New Leads', 'Retail', 'Loyalty'],
  collection: ['All Collections', 'DealBoxx Promotion', 'VIP Members', 'New Leads Q2', 'Retail Outreach'],
};

export const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

export const TREND_BARS = [230, 130, 95, 80, 100, 150, 82, 180, 148, 230];

export const CUSTOMER_HEALTH_METRICS = [
  {
    id: 'total',
    label: 'Total Customers',
    value: '52k',
    change: 0.5,
    icon: 'users',
    accent: 'bg-[#EDE8F8] text-primary',
    bar: 'from-primary to-[#6B4FE0]',
  },
  {
    id: 'new',
    label: 'New Customers',
    value: '52k',
    change: 0.5,
    icon: 'userPlus',
    accent: 'bg-[#E8F8EF] text-[#1F9D55]',
    bar: 'from-[#1F9D55] to-[#34D399]',
  },
  {
    id: 'active',
    label: 'Active Customers',
    value: '52k',
    change: 0.5,
    icon: 'userCheck',
    accent: 'bg-[#E8F4FC] text-[#2E7DAD]',
    bar: 'from-[#2E7DAD] to-[#5B9FD4]',
  },
  {
    id: 'inactive',
    label: 'Inactive Customers',
    value: '52k',
    change: 0.5,
    icon: 'userMinus',
    accent: 'bg-[#FFF4E8] text-[#E67E22]',
    bar: 'from-[#E67E22] to-[#F5A623]',
  },
  {
    id: 'growth',
    label: 'Customer Growth Rate',
    value: '15%',
    change: 0.5,
    icon: 'trending',
    accent: 'bg-[#EDE8F8] text-primary',
    bar: 'from-primary to-[#6B4FE0]',
  },
];

export const GENDER_SEMI_DONUT = [
  { label: 'Male', value: 70, color: '#F5A623' },
  { label: 'Female', value: 30, color: '#0B1354' },
];

export const AVERAGE_AGE_DONUT = [
  { label: '18-24', value: 35, color: '#F5A623' },
  { label: '25-34', value: 28, color: '#0B1354' },
  { label: '35-44', value: 20, color: '#2E7DAD' },
  { label: '45+', value: 17, color: '#E67E22' },
];

export const DEMOGRAPHICS_BY_REGION = [
  { label: 'GP', value: 28, color: '#0B1354' },
  { label: 'WEE', value: 22, color: '#2E7DAD' },
  { label: 'DT', value: 18, color: '#F5A623' },
  { label: 'BV', value: 14, color: '#E67E22' },
  { label: 'SN', value: 10, color: '#8B2942' },
  { label: 'Others', value: 8, color: '#717171' },
];

export const DEMOGRAPHICS_BY_LOCATION = [
  { label: 'Los Angeles', value: 26, color: '#0B1354' },
  { label: 'New York', value: 24, color: '#2E7DAD' },
  { label: 'Portland', value: 20, color: '#F5A623' },
  { label: 'Perth', value: 18, color: '#E67E22' },
  { label: 'Others', value: 12, color: '#717171' },
];

export const DEMOGRAPHICS_BY_GENDER = [
  { label: 'Male', value: 58, color: '#0B1354' },
  { label: 'Female', value: 42, color: '#F5A623' },
];

export const DEMOGRAPHICS_BY_AGE = [
  { label: '18-25', value: 30, color: '#F5A623' },
  { label: '26-35', value: 28, color: '#0B1354' },
  { label: '>35', value: 22, color: '#2E7DAD' },
  { label: '<18', value: 20, color: '#E67E22' },
];

export const BY_CATEGORY = [
  { label: 'Electronics', value: 24, color: '#0B1354' },
  { label: 'Insurance', value: 20, color: '#2E7DAD' },
  { label: 'Food', value: 18, color: '#F5A623' },
  { label: 'Banking', value: 16, color: '#E67E22' },
  { label: 'Legal', value: 12, color: '#8B2942' },
  { label: 'Others', value: 10, color: '#717171' },
];

export const BY_SUB_CATEGORY = [
  { label: 'Mobile Phone', value: 22, color: '#0B1354' },
  { label: 'Life Insurance', value: 20, color: '#2E7DAD' },
  { label: 'Mortgage', value: 18, color: '#F5A623' },
  { label: 'Toyota', value: 16, color: '#E67E22' },
  { label: 'Laptop', value: 14, color: '#8B2942' },
  { label: 'Others', value: 10, color: '#717171' },
];

export const BY_SEGMENT = [
  { label: 'New Customers', value: 24, color: '#0B1354' },
  { label: 'Active Customers', value: 22, color: '#2E7DAD' },
  { label: 'Loyal Customers', value: 18, color: '#1F9D55' },
  { label: 'Potential Customers', value: 16, color: '#F5A623' },
  { label: 'Churned Customers', value: 12, color: '#E53935' },
  { label: 'Others', value: 8, color: '#717171' },
];

export const SEGMENT_GROWTH_YEARS = ['2021', '2022', '2023', '2024', '2025'];

export const SEGMENT_GROWTH_DATASETS = [
  {
    label: 'New Customers',
    color: '#0B1354',
    data: [120, 140, 160, 180, 200],
  },
  {
    label: 'Active Customers',
    color: '#2E7DAD',
    data: [180, 200, 220, 240, 260],
  },
  {
    label: 'Inactive Customers',
    color: '#34D399',
    data: [80, 90, 100, 110, 120],
  },
];

export const VALID_INVALID_PHONE = [
  { label: 'Valid Phone numbers', value: 4580, color: '#2E7DAD' },
  { label: 'Invalid Phone numbers', value: 1145, color: '#F5A623' },
];

export const VALID_INVALID_EMAIL = [
  { label: 'Valid Email address', value: 4580, color: '#2E7DAD' },
  { label: 'Invalid Email address', value: 1145, color: '#F5A623' },
];

export const DATA_QUALITY_MISSING = [
  { label: 'Complete Profiles', value: 4200, color: '#2E7DAD' },
  { label: 'Missing Fields', value: 1515, color: '#F5A623' },
];

export const DATA_QUALITY_DUPLICATES = [
  { label: 'Unique Customers', value: 3500, color: '#2E7DAD' },
  { label: 'Duplicates', value: 725, color: '#F5A623' },
];

export const DATA_QUALITY_INVALID_PHONE = [
  { label: 'Valid Phone', value: 4580, color: '#2E7DAD' },
  { label: 'Invalid Phone', value: 1145, color: '#F5A623' },
];

export const DATA_QUALITY_INVALID_EMAIL = [
  { label: 'Valid Email', value: 4200, color: '#2E7DAD' },
  { label: 'Invalid Email', value: 1025, color: '#F5A623' },
];

export const CHURN_STATUS = [
  { label: 'Active', value: 45, color: '#F5A623' },
  { label: 'At-risk', value: 35, color: '#0B1354' },
  { label: 'Churn', value: 20, color: '#111111' },
];

export const RETENTION_RATE = [
  { label: 'Retained', value: 20, color: '#F5A623' },
  { label: 'Other', value: 80, color: '#F0F2F7' },
];

export const CHURN_RATE = [
  { label: 'Churned', value: 28, color: '#F5A623' },
  { label: 'Retained', value: 72, color: '#F0F2F7' },
];

export const INACTIVE_CUSTOMERS_TOTAL = 2748;

export const CONTACTABILITY_TOTAL = 5725;

export function scaleTrendData(multiplier = 1) {
  return TREND_BARS.map((value) => Math.round(value * multiplier));
}
