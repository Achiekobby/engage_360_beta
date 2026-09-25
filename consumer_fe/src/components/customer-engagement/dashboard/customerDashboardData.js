export const DASHBOARD_FILTERS = ['Category', 'Collection', 'Advanced Filter', 'Date'];

export const CUSTOMER_OVERVIEW_METRICS = [
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
];

export const DATA_QUALITY_METRICS = [
  {
    id: 'complete',
    label: 'Complete Profile',
    value: '52k',
    change: 0.5,
    icon: 'checkCircle',
    accent: 'bg-[#E8F8EF] text-[#1F9D55]',
    bar: 'from-[#1F9D55] to-[#34D399]',
  },
  {
    id: 'incomplete',
    label: 'Incomplete Profile',
    value: '52k',
    change: 0.5,
    icon: 'alertCircle',
    accent: 'bg-[#FFF4E8] text-[#E67E22]',
    bar: 'from-[#E67E22] to-[#F5A623]',
  },
  {
    id: 'duplicate',
    label: 'Duplicate Customers',
    value: '52k',
    change: 0.5,
    icon: 'copy',
    accent: 'bg-[#FEECEC] text-[#E53935]',
    bar: 'from-[#E53935] to-[#EF5350]',
  },
  {
    id: 'invalid-phone',
    label: 'Invalid Phone numbers',
    value: '52k',
    change: 0.5,
    icon: 'phoneOff',
    accent: 'bg-[#EDE8F8] text-primary',
    bar: 'from-primary to-[#6B4FE0]',
  },
];

export const CUSTOMERS_BY_REGION = [
  { label: 'Greater Accra', value: 70, display: '70k' },
  { label: 'Central Region', value: 15, display: '15k' },
  { label: 'Western Region', value: 12, display: '12k' },
  { label: 'Ashanti Region', value: 10, display: '10k' },
  { label: 'Volta Region', value: 8, display: '8k' },
];

export const CUSTOMERS_BY_LOCATION = [
  { label: 'Accra', value: 30, display: '30k' },
  { label: 'Madina', value: 15, display: '15k' },
  { label: 'Abelenkpe', value: 12, display: '12k' },
  { label: 'East Legon', value: 10, display: '10k' },
  { label: 'Lapaz', value: 8, display: '8k' },
];

export const CUSTOMERS_BY_GENDER = [
  { label: 'Male', value: 58, color: '#0B1354' },
  { label: 'Female', value: 42, color: '#F5A623' },
];

export const CUSTOMERS_BY_AGE = [
  { label: '18-25', value: 28, color: '#F5A623' },
  { label: '26-30', value: 24, color: '#0B1354' },
  { label: '<18', value: 18, color: '#E53935' },
  { label: '31-35', value: 16, color: '#F4B183' },
  { label: '35-40', value: 14, color: '#8B2942' },
];
