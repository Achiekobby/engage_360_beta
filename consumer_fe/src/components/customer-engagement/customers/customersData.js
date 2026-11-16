export const CUSTOMERS_PAGE_METRICS = [
  {
    id: 'categories',
    label: 'Total Customer Category',
    value: '0',
    change: 0.0,
    icon: 'folderTree',
    accent: 'bg-[#EDE8F8] text-primary',
    bar: 'from-primary to-[#6B4FE0]',
  },
  {
    id: 'files',
    label: 'Total Collection Files',
    value: '0',
    change: 0.0,
    icon: 'files',
    accent: 'bg-[#E6F7F4] text-[#0F766E]',
    bar: 'from-[#0F766E] to-[#2DD4BF]',
  },
  {
    id: 'growth',
    label: 'Customer Growth Rate',
    value: '0%',
    change: 0.0,
    icon: 'trending',
    accent: 'bg-[#E8F8EF] text-[#1F9D55]',
    bar: 'from-[#1F9D55] to-[#34D399]',
  },
  {
    id: 'total',
    label: 'Total Customers',
    value: '0',
    change: 0.0,
    icon: 'users',
    accent: 'bg-[#FFF4E8] text-[#E67E22]',
    bar: 'from-[#E67E22] to-[#F5A623]',
  },
];

export const CATEGORY_ACCENT_STYLES = [
  {
    accent: 'from-primary to-[#6B4FE0]',
    iconBg: 'bg-[#EDE8F8] text-primary',
    chip: 'bg-[#F7F8FF] text-primary ring-primary/10',
    wash: 'bg-[radial-gradient(circle,rgba(58,16,205,0.10)_0%,transparent_70%)]',
  },
  {
    accent: 'from-[#0F766E] to-[#2DD4BF]',
    iconBg: 'bg-[#E6F7F4] text-[#0F766E]',
    chip: 'bg-[#E6F7F4] text-[#0F766E] ring-[#0F766E]/15',
    wash: 'bg-[radial-gradient(circle,rgba(15,118,110,0.12)_0%,transparent_70%)]',
  },
  {
    accent: 'from-[#1F9D55] to-[#34D399]',
    iconBg: 'bg-[#E8F8EF] text-[#1F9D55]',
    chip: 'bg-[#E8F8EF] text-[#1F9D55] ring-[#1F9D55]/15',
    wash: 'bg-[radial-gradient(circle,rgba(31,157,85,0.12)_0%,transparent_70%)]',
  },
  {
    accent: 'from-[#E67E22] to-[#F5A623]',
    iconBg: 'bg-[#FFF4E8] text-[#C56A12]',
    chip: 'bg-[#FFF4E8] text-[#C56A12] ring-[#E67E22]/15',
    wash: 'bg-[radial-gradient(circle,rgba(230,126,34,0.14)_0%,transparent_70%)]',
  },
  {
    accent: 'from-[#8B2942] to-[#C0396B]',
    iconBg: 'bg-[#FCE8EF] text-[#8B2942]',
    chip: 'bg-[#FCE8EF] text-[#8B2942] ring-[#8B2942]/15',
    wash: 'bg-[radial-gradient(circle,rgba(139,41,66,0.12)_0%,transparent_70%)]',
  },
];

export const CUSTOMER_CATEGORIES = [
  { id: 'promotions', name: 'Promotions', dateCreated: '02-03-26', ...CATEGORY_ACCENT_STYLES[0] },
  { id: 'vip', name: 'VIP', dateCreated: '18-02-26', ...CATEGORY_ACCENT_STYLES[1] },
  { id: 'new-leads', name: 'New Leads', dateCreated: '11-04-26', ...CATEGORY_ACCENT_STYLES[2] },
  { id: 'retail', name: 'Retail', dateCreated: '04-05-26', ...CATEGORY_ACCENT_STYLES[3] },
  { id: 'loyalty', name: 'Loyalty', dateCreated: '28-04-26', ...CATEGORY_ACCENT_STYLES[4] },
];

function formatCreatedDate(date = new Date()) {
  const value = date instanceof Date ? date : new Date(date);
  const safe = Number.isNaN(value.getTime()) ? new Date() : value;

  return [
    String(safe.getDate()).padStart(2, '0'),
    String(safe.getMonth() + 1).padStart(2, '0'),
    String(safe.getFullYear()).slice(-2),
  ].join('-');
}

export function createCategoryEntry({ name, description = '', id, styleIndex = 0 } = {}) {
  const slug = String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const style = CATEGORY_ACCENT_STYLES[styleIndex % CATEGORY_ACCENT_STYLES.length];

  return {
    id: id ?? `${slug || 'category'}-${Date.now()}`,
    name,
    description: description || '',
    collectionsCount: 0,
    dateCreated: formatCreatedDate(),
    ...style,
  };
}

export function mapCategoryFromApi(item, index = 0) {
  const style = CATEGORY_ACCENT_STYLES[index % CATEGORY_ACCENT_STYLES.length];
  const createdAt = item?.created_at || item?.createdAt || null;

  return {
    id: item?.id,
    name: item?.name || '',
    description: item?.description || '',
    collectionsCount: Number(item?.collections_count ?? item?.collectionsCount ?? 0),
    dateCreated: formatCreatedDate(createdAt || new Date()),
    createdAt,
    ...style,
  };
}

export function mapCategoriesFromApi(list) {
  if (!Array.isArray(list)) return [];
  return list.map((item, index) => mapCategoryFromApi(item, index));
}

export const CUSTOMER_COLLECTIONS = [
  {
    id: 'dealboxx-promotion',
    name: 'DealBoxx Promotion',
    categoryId: 'promotions',
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
    categoryId: 'vip',
    category: 'VIP',
    fileCount: 8,
    customerCount: '9.4k',
    dateCreated: '08-04-26',
    accent: 'from-[#0F766E] to-[#2DD4BF]',
    iconBg: 'bg-[#E6F7F4] text-[#0F766E]',
  },
  {
    id: 'new-leads-q2',
    name: 'New Leads Q2',
    categoryId: 'new-leads',
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
    categoryId: 'retail',
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
    categoryId: 'loyalty',
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
  { accent: 'from-[#0F766E] to-[#2DD4BF]', iconBg: 'bg-[#E6F7F4] text-[#0F766E]' },
  { accent: 'from-[#1F9D55] to-[#34D399]', iconBg: 'bg-[#E8F8EF] text-[#1F9D55]' },
  { accent: 'from-[#E67E22] to-[#F5A623]', iconBg: 'bg-[#FFF4E8] text-[#E67E22]' },
  { accent: 'from-[#8B2942] to-[#C0396B]', iconBg: 'bg-[#FCE8EF] text-[#8B2942]' },
];

function formatCountLabel(value) {
  const count = Number(value);
  if (!Number.isFinite(count) || count < 0) return '0';
  if (count >= 1000) {
    const compact = count / 1000;
    const label = Number.isInteger(compact) ? String(compact) : compact.toFixed(1).replace(/\.0$/, '');
    return `${label}k`;
  }
  return String(count);
}

const COLLECTION_ID_PREFIX = 'ENG-CLC-';

export function formatCollectionDisplayId(collectionId, { maxLength = 18 } = {}) {
  const raw = String(collectionId ?? '').trim();
  if (!raw) return `${COLLECTION_ID_PREFIX}—`;

  const full = `${COLLECTION_ID_PREFIX}${raw}`;
  if (full.length <= maxLength) return full;

  return `${full.slice(0, Math.max(0, maxLength - 1))}…`;
}

export function createCollectionEntry({ name, category, categoryId, styleIndex = 0 }) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const style = COLLECTION_ACCENT_STYLES[styleIndex % COLLECTION_ACCENT_STYLES.length];

  return {
    id: `${slug || 'collection'}-${Date.now()}`,
    name,
    categoryId,
    category,
    fileCount: 0,
    customerCount: '0',
    dateCreated: formatCreatedDate(),
    ...style,
  };
}

export function mapCollectionFromApi(item, index = 0, fallbackCategory = null) {
  const style = COLLECTION_ACCENT_STYLES[index % COLLECTION_ACCENT_STYLES.length];
  const createdAt = item?.created_at || item?.createdAt || null;
  const categoryId = item?.category_id ?? item?.categoryId ?? fallbackCategory?.id ?? null;
  const categoryName =
    item?.category_name ||
    item?.categoryName ||
    item?.category ||
    fallbackCategory?.name ||
    '';

  return {
    id: item?.id,
    name: item?.name || '',
    categoryId,
    category: categoryName,
    fileCount: Number(item?.files_count ?? item?.fileCount ?? item?.filesCount ?? 0),
    customerCount: formatCountLabel(
      item?.customers_count ?? item?.customerCount ?? item?.customersCount ?? 0,
    ),
    customersCountRaw: Number(
      item?.customers_count ?? item?.customerCount ?? item?.customersCount ?? 0,
    ),
    dateCreated: formatCreatedDate(createdAt || new Date()),
    createdAt,
    ...style,
  };
}

export function mapCollectionsFromApi(list, fallbackCategory = null) {
  if (!Array.isArray(list)) return [];
  return list.map((item, index) => mapCollectionFromApi(item, index, fallbackCategory));
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
