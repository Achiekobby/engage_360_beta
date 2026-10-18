export const ANALYTICS_QUICK_LINKS = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'overview', label: 'Overview' },
  { id: 'audience', label: 'Audience' },
];

const OVERVIEW_TAB_LABELS = {
  birthday: 'Birthday Overview',
  welcome: 'Welcome Overview',
  anniversary: 'Anniversary Overview',
  holidays: 'Holiday Overview',
};

export function getAnalyticsQuickLinks(kindId = 'birthday') {
  return ANALYTICS_QUICK_LINKS.map((tab) =>
    tab.id === 'overview'
      ? { ...tab, label: OVERVIEW_TAB_LABELS[kindId] || 'Overview' }
      : tab,
  );
}

export const ANALYTICS_METRIC_SECTIONS = [
  {
    id: 'delivery',
    title: 'Delivery & Message',
    metrics: [
      { id: 'sms-launch', label: 'SMS Launch', value: '1.5K', tone: 'rocket' },
      { id: 'audience-celebrated', label: 'Audience Celebrated', value: '1.5k', tone: 'ticket' },
      { id: 'sms-pending', label: 'SMS Pending', value: '0.5k', tone: 'rocket' },
      { id: 'sms-delivered', label: 'SMS Delivered', value: '14k', tone: 'ticket' },
      { id: 'sms-failed', label: 'SMS Failed', value: '1k', tone: 'ticket' },
    ],
  },
  {
    id: 'engagement',
    title: 'Engagement & Conversion',
    metrics: [
      { id: 'clicks', label: 'Clicks', value: '90%', tone: 'rocket' },
      { id: 'ctr', label: 'Click-Through-Rate', value: '50%', tone: 'ticket' },
      { id: 'engagement-rate', label: 'Engagement Rate', value: '90%', tone: 'rocket' },
      { id: 'open-rate', label: 'Open Rate', value: '10%', tone: 'rocket' },
      { id: 'conversions-rate', label: 'Conversions Rate', value: '90%', tone: 'rocket' },
    ],
  },
];

export const ANALYTICS_AUDIENCE_COLUMNS = [
  'Full Name',
  'Gender',
  'Date of birth',
  'Product Number',
  'Email address',
  'Category',
  'Collection',
];

export const ANALYTICS_AUDIENCE_PAGE_SIZE = 8;

const AUDIENCE_SEEDS = [
  {
    fullName: 'George Arthur',
    gender: 'Male',
    dateOfBirth: '12-06-1986',
    productNumber: '233546477448',
    email: 'george.arthur@gmail.com',
    category: 'Dealboxx',
    collection: 'Active Campaign',
  },
  {
    fullName: 'Ama Mensah',
    gender: 'Female',
    dateOfBirth: '04-11-1992',
    productNumber: '233540112233',
    email: 'ama.mensah@gmail.com',
    category: 'txtconnect',
    collection: 'Repeated Base',
  },
  {
    fullName: 'Kwesi Boateng',
    gender: 'Male',
    dateOfBirth: '21-03-1989',
    productNumber: '233551998877',
    email: 'kwesi.boateng@gmail.com',
    category: 'Dealboxx',
    collection: 'Active Campaign',
  },
  {
    fullName: 'Efua Owusu',
    gender: 'Female',
    dateOfBirth: '15-08-1995',
    productNumber: '233557334455',
    email: 'efua.owusu@gmail.com',
    category: 'txtconnect',
    collection: 'Birthday Club',
  },
  {
    fullName: 'Kojo Asante',
    gender: 'Male',
    dateOfBirth: '09-01-1984',
    productNumber: '233244778899',
    email: 'kojo.asante@gmail.com',
    category: 'Dealboxx',
    collection: 'Anniversary Club',
  },
  {
    fullName: 'Abena Darko',
    gender: 'Female',
    dateOfBirth: '30-12-1990',
    productNumber: '233209445566',
    email: 'abena.darko@gmail.com',
    category: 'txtconnect',
    collection: 'Repeated Base',
  },
];

export const ANALYTICS_AUDIENCE_ROWS = Array.from({ length: 24 }, (_, index) => {
  const seed = AUDIENCE_SEEDS[index % AUDIENCE_SEEDS.length];
  return {
    id: `aud-${index + 1}`,
    ...seed,
  };
});

export const ANALYTICS_AUDIENCE_STATS = [
  {
    id: 'total',
    label: 'Total audience',
    value: String(ANALYTICS_AUDIENCE_ROWS.length),
    hint: 'Contacts in this automation',
    icon: 'users',
    accentClass: 'bg-primary',
    iconWrapClass: 'bg-[#EDE8F8]',
    iconClass: 'text-primary',
  },
  {
    id: 'male',
    label: 'Male',
    value: String(ANALYTICS_AUDIENCE_ROWS.filter((row) => row.gender === 'Male').length),
    hint: 'Share of male contacts',
    icon: 'male',
    accentClass: 'bg-[#2E7DAD]',
    iconWrapClass: 'bg-[#E8F4FC]',
    iconClass: 'text-[#2E7DAD]',
  },
  {
    id: 'female',
    label: 'Female',
    value: String(ANALYTICS_AUDIENCE_ROWS.filter((row) => row.gender === 'Female').length),
    hint: 'Share of female contacts',
    icon: 'female',
    accentClass: 'bg-[#C2410C]',
    iconWrapClass: 'bg-[#FFF4E8]',
    iconClass: 'text-[#C2410C]',
  },
  {
    id: 'collections',
    label: 'Collections',
    value: String(new Set(ANALYTICS_AUDIENCE_ROWS.map((row) => row.collection)).size),
    hint: 'Unique audience collections',
    icon: 'collections',
    accentClass: 'bg-[#1F9D55]',
    iconWrapClass: 'bg-[#E8F8EF]',
    iconClass: 'text-[#1F9D55]',
  },
];
