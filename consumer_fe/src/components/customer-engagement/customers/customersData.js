export const CUSTOMERS_PAGE_METRICS = [
  {
    id: 'categories',
    label: 'Total Customer Category',
    value: '12',
    change: 0.5,
    icon: 'folderTree',
    accent: 'bg-[#EDE8F8] text-primary',
    bar: 'from-primary to-[#6B4FE0]',
  },
  {
    id: 'files',
    label: 'Total Collection Files',
    value: '20',
    change: 0.5,
    icon: 'files',
    accent: 'bg-[#E8F4FC] text-[#2E7DAD]',
    bar: 'from-[#2E7DAD] to-[#5B9FD4]',
  },
  {
    id: 'growth',
    label: 'Customer Growth Rate',
    value: '12%',
    change: 0.5,
    icon: 'trending',
    accent: 'bg-[#E8F8EF] text-[#1F9D55]',
    bar: 'from-[#1F9D55] to-[#34D399]',
  },
  {
    id: 'total',
    label: 'Total Customers',
    value: '52k',
    change: 0.5,
    icon: 'users',
    accent: 'bg-[#FFF4E8] text-[#E67E22]',
    bar: 'from-[#E67E22] to-[#F5A623]',
  },
];

export const CUSTOMER_COLLECTIONS = [
  {
    id: 'dealboxx-promotion',
    name: 'DealBoxx Promotion',
    category: 'Promotions',
    fileCount: 12,
    customerCount: '12k',
    dateCreated: '12-06-26',
    accent: 'from-primary to-[#6B4FE0]',
    iconBg: 'bg-[#EDE8F8] text-primary',
  },
  {
    id: 'vip-members',
    name: 'VIP Members',
    category: 'VIP',
    fileCount: 8,
    customerCount: '9.4k',
    dateCreated: '08-04-26',
    accent: 'from-[#2E7DAD] to-[#5B9FD4]',
    iconBg: 'bg-[#E8F4FC] text-[#2E7DAD]',
  },
  {
    id: 'new-leads-q2',
    name: 'New Leads Q2',
    category: 'New Leads',
    fileCount: 15,
    customerCount: '18k',
    dateCreated: '01-06-26',
    accent: 'from-[#1F9D55] to-[#34D399]',
    iconBg: 'bg-[#E8F8EF] text-[#1F9D55]',
  },
  {
    id: 'retail-outreach',
    name: 'Retail Outreach',
    category: 'Retail',
    fileCount: 6,
    customerCount: '4.2k',
    dateCreated: '22-05-26',
    accent: 'from-[#E67E22] to-[#F5A623]',
    iconBg: 'bg-[#FFF4E8] text-[#E67E22]',
  },
  {
    id: 'loyalty-program',
    name: 'Loyalty Program',
    category: 'Loyalty',
    fileCount: 10,
    customerCount: '7.8k',
    dateCreated: '15-05-26',
    accent: 'from-[#8B2942] to-[#C0396B]',
    iconBg: 'bg-[#FCE8EF] text-[#8B2942]',
  },
];

export const COLLECTION_ACCENT_STYLES = [
  { accent: 'from-primary to-[#6B4FE0]', iconBg: 'bg-[#EDE8F8] text-primary' },
  { accent: 'from-[#2E7DAD] to-[#5B9FD4]', iconBg: 'bg-[#E8F4FC] text-[#2E7DAD]' },
  { accent: 'from-[#1F9D55] to-[#34D399]', iconBg: 'bg-[#E8F8EF] text-[#1F9D55]' },
  { accent: 'from-[#E67E22] to-[#F5A623]', iconBg: 'bg-[#FFF4E8] text-[#E67E22]' },
  { accent: 'from-[#8B2942] to-[#C0396B]', iconBg: 'bg-[#FCE8EF] text-[#8B2942]' },
];

export function createCollectionEntry({ name, category, styleIndex = 0 }) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const style = COLLECTION_ACCENT_STYLES[styleIndex % COLLECTION_ACCENT_STYLES.length];
  const now = new Date();
  const dateCreated = [
    String(now.getDate()).padStart(2, '0'),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getFullYear()).slice(-2),
  ].join('-');

  return {
    id: `${slug || 'collection'}-${Date.now()}`,
    name,
    category,
    fileCount: 0,
    customerCount: '0',
    dateCreated,
    ...style,
  };
}

export const CATEGORY_FILTER_OPTIONS = [
  'All Categories',
  'Promotions',
  'VIP',
  'New Leads',
  'Retail',
  'Loyalty',
];

export const DATE_FILTER_OPTIONS = [
  'All Time',
  'Last 7 days',
  'Last 30 days',
  'Last 90 days',
  'This Year',
];
