export const ANALYTICS_TABS = [
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

export function getAnalyticsTabs(kindId = 'birthday') {
  return ANALYTICS_TABS.map((tab) =>
    tab.id === 'overview'
      ? { ...tab, label: OVERVIEW_TAB_LABELS[kindId] || 'Overview' }
      : tab,
  );
}

const BIRTHDAY_METRIC_SECTIONS = [
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

const WELCOME_METRIC_SECTIONS = [
  {
    id: 'delivery',
    title: 'Delivery & Message',
    metrics: [
      { id: 'sms-launch', label: 'Welcome Launch', value: '1.2K', tone: 'rocket' },
      { id: 'audience-celebrated', label: 'New Members Welcomed', value: '1.1k', tone: 'ticket' },
      { id: 'sms-pending', label: 'Welcome Pending', value: '0.4k', tone: 'rocket' },
      { id: 'sms-delivered', label: 'Welcome Delivered', value: '12k', tone: 'ticket' },
      { id: 'sms-failed', label: 'Welcome Failed', value: '0.8k', tone: 'ticket' },
    ],
  },
  {
    id: 'engagement',
    title: 'Engagement & Conversion',
    metrics: [
      { id: 'clicks', label: 'Clicks', value: '86%', tone: 'rocket' },
      { id: 'ctr', label: 'Click-Through-Rate', value: '52%', tone: 'ticket' },
      { id: 'engagement-rate', label: 'Engagement Rate', value: '88%', tone: 'rocket' },
      { id: 'open-rate', label: 'Open Rate', value: '64%', tone: 'rocket' },
      { id: 'conversions-rate', label: 'Conversions Rate', value: '21%', tone: 'rocket' },
    ],
  },
];

const BIRTHDAY_CHARTS = {
  deliveryStatus: {
    title: 'Delivery outcome mix',
    subtitle: 'Share of delivered, pending, and failed birthday messages',
    labels: ['Delivered', 'Pending', 'Failed'],
    values: [14000, 500, 1000],
    colors: ['#1F9D55', '#E67E22', '#EF4444'],
  },
  channelMix: {
    title: 'Channel distribution',
    subtitle: 'Where birthday automations are launched',
    labels: ['SMS', 'Email', 'WhatsApp'],
    values: [62, 23, 15],
    colors: ['#2563EB', '#2E7DAD', '#1F9D55'],
  },
  dailyVolume: {
    title: 'Daily send volume',
    subtitle: 'Today vs yesterday birthday message volume',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
      { label: 'Today', color: '#2563EB', data: [120, 95, 140, 110, 165, 130, 175] },
      { label: 'Yesterday', color: '#93C5FD', data: [80, 70, 100, 85, 120, 95, 130] },
    ],
  },
  engagementRates: {
    title: 'Engagement rate breakdown',
    subtitle: 'Key performance rates across birthday automations',
    labels: ['Clicks', 'CTR', 'Engagement', 'Open rate', 'Conversions'],
    values: [90, 50, 90, 10, 90],
    color: '#2563EB',
  },
  funnel: {
    title: 'Birthday conversion funnel',
    subtitle: 'From launch through conversion',
    steps: [
      { label: 'Launched', value: 15500, color: '#0B1354' },
      { label: 'Delivered', value: 14000, color: '#2563EB' },
      { label: 'Opened', value: 1400, color: '#38BDF8' },
      { label: 'Clicked', value: 1260, color: '#22C55E' },
      { label: 'Converted', value: 1134, color: '#16A34A' },
    ],
  },
  monthlyTrend: {
    title: 'Celebrated birthdays over time',
    subtitle: 'Monthly audience celebrated volume',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    series: [
      { label: 'Celebrated', color: '#2563EB', data: [820, 940, 1010, 880, 1120, 1280, 1190, 1340, 1410, 1500] },
      { label: 'Failed', color: '#F87171', data: [60, 72, 55, 90, 70, 65, 80, 58, 62, 70] },
    ],
  },
};

const WELCOME_CHARTS = {
  deliveryStatus: {
    title: 'Delivery outcome mix',
    subtitle: 'Share of delivered, pending, and failed welcome messages',
    labels: ['Delivered', 'Pending', 'Failed'],
    values: [12000, 700, 850],
    colors: ['#0D9488', '#F59E0B', '#EF4444'],
  },
  channelMix: {
    title: 'Channel distribution',
    subtitle: 'Where welcome automations are launched',
    labels: ['SMS', 'Email', 'WhatsApp'],
    values: [48, 35, 17],
    colors: ['#0891B2', '#0E7490', '#14B8A6'],
  },
  dailyVolume: {
    title: 'Daily welcome volume',
    subtitle: 'Today vs yesterday welcome message volume',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
      { label: 'Today', color: '#0E7490', data: [110, 98, 132, 118, 150, 125, 160] },
      { label: 'Yesterday', color: '#67E8F9', data: [75, 68, 95, 82, 110, 90, 120] },
    ],
  },
  engagementRates: {
    title: 'Engagement rate breakdown',
    subtitle: 'Key performance rates across welcome automations',
    labels: ['Clicks', 'CTR', 'Engagement', 'Open rate', 'Conversions'],
    values: [86, 52, 88, 64, 21],
    color: '#0891B2',
  },
  funnel: {
    title: 'Welcome conversion funnel',
    subtitle: 'From queue through conversion',
    steps: [
      { label: 'Queued', value: 14000, color: '#155E75' },
      { label: 'Delivered', value: 12000, color: '#0891B2' },
      { label: 'Opened', value: 2100, color: '#22D3EE' },
      { label: 'Clicked', value: 1500, color: '#14B8A6' },
      { label: 'Converted', value: 980, color: '#0D9488' },
    ],
  },
  monthlyTrend: {
    title: 'Welcomed members over time',
    subtitle: 'Monthly delivered welcome volume',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    series: [
      { label: 'Delivered', color: '#0891B2', data: [720, 840, 910, 800, 1020, 1180, 1090, 1240, 1310, 1400] },
      { label: 'Failed', color: '#F87171', data: [50, 62, 48, 70, 58, 55, 68, 52, 60, 64] },
    ],
  },
};

const ANNIVERSARY_METRIC_SECTIONS = [
  {
    id: 'delivery',
    title: 'Delivery & Message',
    metrics: [
      { id: 'sms-launch', label: 'Anniversary Launch', value: '1.3K', tone: 'rocket' },
      { id: 'audience-celebrated', label: 'Anniversaries Celebrated', value: '1.2k', tone: 'ticket' },
      { id: 'sms-pending', label: 'Anniversary Pending', value: '0.6k', tone: 'rocket' },
      { id: 'sms-delivered', label: 'Anniversary Delivered', value: '13k', tone: 'ticket' },
      { id: 'sms-failed', label: 'Anniversary Failed', value: '0.9k', tone: 'ticket' },
    ],
  },
  {
    id: 'engagement',
    title: 'Engagement & Conversion',
    metrics: [
      { id: 'clicks', label: 'Clicks', value: '88%', tone: 'rocket' },
      { id: 'ctr', label: 'Click-Through-Rate', value: '48%', tone: 'ticket' },
      { id: 'engagement-rate', label: 'Engagement Rate', value: '84%', tone: 'rocket' },
      { id: 'open-rate', label: 'Open Rate', value: '58%', tone: 'rocket' },
      { id: 'conversions-rate', label: 'Conversions Rate', value: '18%', tone: 'rocket' },
    ],
  },
];

const ANNIVERSARY_CHARTS = {
  deliveryStatus: {
    title: 'Delivery outcome mix',
    subtitle: 'Share of delivered, pending, and failed anniversary messages',
    labels: ['Delivered', 'Pending', 'Failed'],
    values: [13000, 600, 900],
    colors: ['#3A10CD', '#E67E22', '#EF4444'],
  },
  channelMix: {
    title: 'Channel distribution',
    subtitle: 'Where anniversary automations are launched',
    labels: ['SMS', 'Email', 'WhatsApp'],
    values: [50, 32, 18],
    colors: ['#3A10CD', '#2563EB', '#1F9D55'],
  },
  dailyVolume: {
    title: 'Daily anniversary volume',
    subtitle: 'Today vs yesterday anniversary message volume',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
      { label: 'Today', color: '#3A10CD', data: [105, 92, 128, 112, 148, 122, 158] },
      { label: 'Yesterday', color: '#BFDBFE', data: [72, 64, 90, 78, 108, 88, 118] },
    ],
  },
  engagementRates: {
    title: 'Engagement rate breakdown',
    subtitle: 'Key performance rates across anniversary automations',
    labels: ['Clicks', 'CTR', 'Engagement', 'Open rate', 'Conversions'],
    values: [88, 48, 84, 58, 18],
    color: '#3A10CD',
  },
  funnel: {
    title: 'Anniversary conversion funnel',
    subtitle: 'From launch through conversion',
    steps: [
      { label: 'Launched', value: 14800, color: '#0B1354' },
      { label: 'Delivered', value: 13000, color: '#0B1354' },
      { label: 'Opened', value: 1600, color: '#3A10CD' },
      { label: 'Clicked', value: 1200, color: '#5B21B6' },
      { label: 'Converted', value: 900, color: '#93C5FD' },
    ],
  },
  monthlyTrend: {
    title: 'Celebrated anniversaries over time',
    subtitle: 'Monthly audience celebrated volume',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    series: [
      { label: 'Celebrated', color: '#3A10CD', data: [780, 900, 980, 860, 1100, 1240, 1160, 1300, 1380, 1450] },
      { label: 'Failed', color: '#F87171', data: [55, 68, 50, 80, 62, 58, 74, 54, 60, 66] },
    ],
  },
};

const HOLIDAY_METRIC_SECTIONS = [
  {
    id: 'delivery',
    title: 'Delivery & Message',
    metrics: [
      { id: 'sms-launch', label: 'Holiday Launch', value: '1.8K', tone: 'rocket' },
      { id: 'audience-celebrated', label: 'Festive Audience Reached', value: '1.6k', tone: 'ticket' },
      { id: 'sms-pending', label: 'Holiday Pending', value: '0.7k', tone: 'rocket' },
      { id: 'sms-delivered', label: 'Holiday Delivered', value: '16k', tone: 'ticket' },
      { id: 'sms-failed', label: 'Holiday Failed', value: '1.1k', tone: 'ticket' },
    ],
  },
  {
    id: 'engagement',
    title: 'Engagement & Conversion',
    metrics: [
      { id: 'clicks', label: 'Clicks', value: '91%', tone: 'rocket' },
      { id: 'ctr', label: 'Click-Through-Rate', value: '55%', tone: 'ticket' },
      { id: 'engagement-rate', label: 'Engagement Rate', value: '87%', tone: 'rocket' },
      { id: 'open-rate', label: 'Open Rate', value: '62%', tone: 'rocket' },
      { id: 'conversions-rate', label: 'Conversions Rate', value: '24%', tone: 'rocket' },
    ],
  },
];

const HOLIDAY_CHARTS = {
  deliveryStatus: {
    title: 'Delivery outcome mix',
    subtitle: 'Share of delivered, pending, and failed holiday messages',
    labels: ['Delivered', 'Pending', 'Failed'],
    values: [16000, 700, 1100],
    colors: ['#3A10CD', '#E67E22', '#EF4444'],
  },
  channelMix: {
    title: 'Channel distribution',
    subtitle: 'Where holiday automations are launched',
    labels: ['SMS', 'Email', 'WhatsApp'],
    values: [44, 38, 18],
    colors: ['#2563EB', '#2E7DAD', '#1F9D55'],
  },
  dailyVolume: {
    title: 'Daily festive volume',
    subtitle: 'Today vs yesterday holiday message volume',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [
      { label: 'Today', color: '#2563EB', data: [130, 115, 155, 140, 180, 150, 190] },
      { label: 'Yesterday', color: '#93C5FD', data: [90, 80, 110, 98, 135, 105, 145] },
    ],
  },
  engagementRates: {
    title: 'Engagement rate breakdown',
    subtitle: 'Key performance rates across holiday automations',
    labels: ['Clicks', 'CTR', 'Engagement', 'Open rate', 'Conversions'],
    values: [91, 55, 87, 62, 24],
    color: '#2563EB',
  },
  funnel: {
    title: 'Holiday conversion funnel',
    subtitle: 'From launch through conversion',
    steps: [
      { label: 'Launched', value: 18500, color: '#0B1354' },
      { label: 'Delivered', value: 16000, color: '#2563EB' },
      { label: 'Opened', value: 2400, color: '#3A10CD' },
      { label: 'Clicked', value: 1800, color: '#60A5FA' },
      { label: 'Converted', value: 1200, color: '#93C5FD' },
    ],
  },
  monthlyTrend: {
    title: 'Festive campaigns over time',
    subtitle: 'Monthly holiday send volume',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    series: [
      { label: 'Delivered', color: '#2563EB', data: [210, 130, 95, 55, 100, 155, 85, 185, 150, 215] },
      { label: 'Failed', color: '#F87171', data: [70, 55, 48, 40, 52, 60, 45, 68, 58, 72] },
    ],
  },
};

export function getAnalyticsBundle(kindId = 'birthday') {
  if (kindId === 'welcome') {
    return {
      metricSections: WELCOME_METRIC_SECTIONS,
      charts: WELCOME_CHARTS,
      chartsTitle: 'Welcome performance charts',
      chartsSubtitle:
        'Visual breakdown of welcome delivery, channel mix, volume, engagement, and conversion.',
    };
  }

  if (kindId === 'anniversary') {
    return {
      metricSections: ANNIVERSARY_METRIC_SECTIONS,
      charts: ANNIVERSARY_CHARTS,
      chartsTitle: 'Anniversary performance charts',
      chartsSubtitle:
        'Visual breakdown of anniversary delivery, channel mix, volume, engagement, and conversion.',
    };
  }

  if (kindId === 'holidays') {
    return {
      metricSections: HOLIDAY_METRIC_SECTIONS,
      charts: HOLIDAY_CHARTS,
      chartsTitle: 'Holiday performance charts',
      chartsSubtitle:
        'Visual breakdown of holiday delivery, channel mix, volume, engagement, and conversion.',
    };
  }

  return {
    metricSections: BIRTHDAY_METRIC_SECTIONS,
    charts: BIRTHDAY_CHARTS,
    chartsTitle: 'Performance charts',
    chartsSubtitle:
      'Visual breakdown of delivery outcomes, channel mix, volume, engagement, and conversion.',
  };
}

/** @deprecated Prefer getAnalyticsBundle(kindId) */
export const ANALYTICS_METRIC_SECTIONS = BIRTHDAY_METRIC_SECTIONS;
export const DELIVERY_STATUS_CHART = BIRTHDAY_CHARTS.deliveryStatus;
export const CHANNEL_MIX_CHART = BIRTHDAY_CHARTS.channelMix;
export const DAILY_VOLUME_CHART = BIRTHDAY_CHARTS.dailyVolume;
export const ENGAGEMENT_RATES_CHART = BIRTHDAY_CHARTS.engagementRates;
export const FUNNEL_CHART = BIRTHDAY_CHARTS.funnel;
export const MONTHLY_TREND_CHART = BIRTHDAY_CHARTS.monthlyTrend;

export const APPROVAL_MIX_CHART = {
  title: 'Approval workflow mix',
  subtitle: 'Auto vs business approval share',
  labels: ['Auto-approval', 'Business-approval'],
  values: [68, 32],
  colors: ['#3F3F46', '#2563EB'],
};

export const BUSINESS_VOLUME_CHART = {
  title: 'Volume by business',
  subtitle: 'Birthday automations across onboarded businesses',
  labels: ['DealBoxx', 'TxtConnect', 'Venus Retail', 'Northstar'],
  values: [4200, 3100, 2800, 1900],
  color: '#0B1354',
};

export const UPCOMING_TREND_CHART = {
  title: 'Upcoming birthday pipeline',
  subtitle: 'Next 10 days of scheduled birthday sends',
  labels: ['D+1', 'D+2', 'D+3', 'D+4', 'D+5', 'D+6', 'D+7', 'D+8', 'D+9', 'D+10'],
  series: [
    { label: 'Scheduled', color: '#2563EB', data: [210, 180, 240, 160, 220, 190, 260, 170, 200, 230] },
    { label: 'Needs review', color: '#EAB308', data: [40, 35, 55, 28, 48, 42, 60, 30, 45, 50] },
  ],
};

export const ANALYTICS_AUDIENCE_PAGE_SIZE = 8;

export const ANALYTICS_AUDIENCE_COLUMNS = [
  'Full Name',
  'Gender',
  'Date of birth',
  'Product Number',
  'Email address',
  'Category',
  'Collection',
];

export const AUDIENCE_FILTER_DEFAULTS = {
  genders: [],
  categories: [],
  collections: [],
};

export const AUDIENCE_GENDER_OPTIONS = [
  { id: 'Male', label: 'Male' },
  { id: 'Female', label: 'Female' },
];

export const AUDIENCE_CATEGORY_OPTIONS = [
  { id: 'Dealboxx', label: 'Dealboxx' },
  { id: 'txtconnect', label: 'txtconnect' },
];

export const AUDIENCE_COLLECTION_OPTIONS = [
  { id: 'Active Campaign', label: 'Active Campaign' },
  { id: 'Repeated Base', label: 'Repeated Base' },
  { id: 'Birthday Club', label: 'Birthday Club' },
  { id: 'VIP Segment', label: 'VIP Segment' },
  { id: 'Anniversary Club', label: 'Anniversary Club' },
];

const AUDIENCE_SEEDS = [
  {
    fullName: 'George Arthur',
    gender: 'Male',
    dateOfBirth: '12-08-1988',
    productNumber: '233545477448',
    email: 'george.arthur@gmail.com',
    category: 'Dealboxx',
    collection: 'Active Campaign',
  },
  {
    fullName: 'George Arthur',
    gender: 'Female',
    dateOfBirth: '12-08-1988',
    productNumber: '233545477448',
    email: 'george.arthur@gmail.com',
    category: 'txtconnect',
    collection: 'Repeated Base',
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
    collection: 'VIP Segment',
  },
  {
    fullName: 'Yaw Mensah',
    gender: 'Male',
    dateOfBirth: '18-05-1991',
    productNumber: '233200998877',
    email: 'yaw.mensah@gmail.com',
    category: 'Dealboxx',
    collection: 'Birthday Club',
  },
];

export const ANALYTICS_AUDIENCE_ROWS = Array.from({ length: 32 }, (_, index) => {
  const seed = AUDIENCE_SEEDS[index % AUDIENCE_SEEDS.length];
  return {
    id: `aud-${index + 1}`,
    ...seed,
    productNumber:
      index > 7
        ? String(Number(seed.productNumber) + index)
        : seed.productNumber,
  };
});

export function countActiveAudienceFilters(filters = AUDIENCE_FILTER_DEFAULTS) {
  let count = 0;
  if (filters.genders?.length) count += 1;
  if (filters.categories?.length) count += 1;
  if (filters.collections?.length) count += 1;
  return count;
}

export function filterAudienceRows({
  rows = ANALYTICS_AUDIENCE_ROWS,
  searchQuery = '',
  filters = AUDIENCE_FILTER_DEFAULTS,
}) {
  const query = searchQuery.trim().toLowerCase();

  return rows.filter((row) => {
    if (filters.genders?.length && !filters.genders.includes(row.gender)) return false;
    if (filters.categories?.length && !filters.categories.includes(row.category)) return false;
    if (filters.collections?.length && !filters.collections.includes(row.collection)) {
      return false;
    }

    if (!query) return true;

    return (
      row.fullName.toLowerCase().includes(query) ||
      row.gender.toLowerCase().includes(query) ||
      row.dateOfBirth.toLowerCase().includes(query) ||
      row.productNumber.toLowerCase().includes(query) ||
      row.email.toLowerCase().includes(query) ||
      row.category.toLowerCase().includes(query) ||
      row.collection.toLowerCase().includes(query)
    );
  });
}

export function buildAudienceStats(rows = ANALYTICS_AUDIENCE_ROWS) {
  const maleCount = rows.filter((row) => row.gender === 'Male').length;
  const femaleCount = rows.filter((row) => row.gender === 'Female').length;
  const categoryCount = new Set(rows.map((row) => row.category)).size;
  const collectionCount = new Set(rows.map((row) => row.collection)).size;
  const emailCoverage = rows.filter((row) => row.email).length;

  return [
    {
      id: 'total',
      label: 'Total audience',
      value: String(rows.length),
      hint: 'Contacts matching current filters',
      icon: 'users',
      accentClass: 'bg-primary',
      iconWrapClass: 'bg-[#EDE8F8]',
      iconClass: 'text-primary',
    },
    {
      id: 'male',
      label: 'Male',
      value: String(maleCount),
      hint: 'Gender split',
      icon: 'male',
      accentClass: 'bg-[#2E7DAD]',
      iconWrapClass: 'bg-[#E8F4FC]',
      iconClass: 'text-[#2E7DAD]',
    },
    {
      id: 'female',
      label: 'Female',
      value: String(femaleCount),
      hint: 'Gender split',
      icon: 'female',
      accentClass: 'bg-[#C2410C]',
      iconWrapClass: 'bg-[#FFF4E8]',
      iconClass: 'text-[#C2410C]',
    },
    {
      id: 'categories',
      label: 'Categories',
      value: String(categoryCount),
      hint: 'Distinct categories',
      icon: 'categories',
      accentClass: 'bg-[#3A10CD]',
      iconWrapClass: 'bg-[#EEF2FF]',
      iconClass: 'text-[#3A10CD]',
    },
    {
      id: 'collections',
      label: 'Collections',
      value: String(collectionCount),
      hint: 'Distinct collections',
      icon: 'collections',
      accentClass: 'bg-[#1F9D55]',
      iconWrapClass: 'bg-[#E8F8EF]',
      iconClass: 'text-[#1F9D55]',
    },
    {
      id: 'emails',
      label: 'With email',
      value: String(emailCoverage),
      hint: 'Contacts with email on file',
      icon: 'email',
      accentClass: 'bg-[#E67E22]',
      iconWrapClass: 'bg-[#FFF1E8]',
      iconClass: 'text-[#E67E22]',
    },
  ];
}

export const ANALYTICS_AUDIENCE_STATS = buildAudienceStats(ANALYTICS_AUDIENCE_ROWS);
