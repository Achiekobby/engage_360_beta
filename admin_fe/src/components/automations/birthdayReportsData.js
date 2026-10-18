import { AUTOMATION_BUSINESS_OPTIONS } from './automationsData';

export const BIRTHDAY_REPORT_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'engagement', label: 'Engagement & Conversions' },
];

export const BIRTHDAY_DATE_FILTERS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'ytd', label: 'Year to date' },
];

export const BIRTHDAY_BUSINESS_FILTERS = [
  { value: 'all', label: 'All businesses' },
  ...AUTOMATION_BUSINESS_OPTIONS.map((option) => ({
    value: option.id,
    label: option.label,
  })),
];

export const BIRTHDAY_ENGAGEMENT_MODES = [
  { id: 'static', label: 'Static Plot' },
  { id: 'native', label: 'Native Breakdown' },
];

const BUSINESS_WEIGHT = {
  all: 1,
  dealboxx: 0.42,
  txtconnect: 0.28,
  'venus-retail': 0.18,
  northstar: 0.12,
};

const DATE_WEIGHT = {
  '7d': 0.35,
  '30d': 1,
  '90d': 2.4,
  ytd: 3.6,
};

const DAY_LABELS = [
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

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

function scaleSeries(values, factor) {
  return values.map((value) => Math.max(1, Math.round(value * factor)));
}

function formatCompact(value) {
  if (value >= 1000) {
    const compact = value / 1000;
    return `${compact % 1 === 0 ? compact.toFixed(0) : compact.toFixed(1)}k`;
  }
  return String(value);
}

function formatChange(base, deltaLabel) {
  const signed = base >= 0 ? `↑ ${base.toFixed(1)}%` : `↓ ${Math.abs(base).toFixed(1)}%`;
  return `${signed} ${deltaLabel}`;
}

function getFactor(businessId = 'all', dateFilter = '30d') {
  return (BUSINESS_WEIGHT[businessId] ?? 1) * (DATE_WEIGHT[dateFilter] ?? 1);
}

function businessLabel(businessId) {
  if (businessId === 'all') return 'all businesses';
  return (
    BIRTHDAY_BUSINESS_FILTERS.find((option) => option.value === businessId)?.label || 'business'
  );
}

export function buildBirthdayReport({ businessId = 'all', dateFilter = '30d' } = {}) {
  const factor = getFactor(businessId, dateFilter);
  const scope = businessLabel(businessId);
  const changeWindow = dateFilter === '7d' ? 'yesterday' : 'Last 30 days';

  const upcoming = Math.round(52000 * factor * 0.22);
  const today = Math.round(52000 * factor * 0.08);
  const celebrated = Math.round(52000 * factor * 0.7);
  const failed = Math.round(1200 * factor);
  const pending = Math.round(800 * factor);
  const businessesLive = businessId === 'all' ? 4 : 1;

  const summaryStats = [
    {
      id: 'upcoming',
      label: 'Upcoming birthday',
      value: formatCompact(upcoming),
      change: formatChange(0.5 * (businessId === 'all' ? 1 : 1.2), changeWindow),
    },
    {
      id: 'today',
      label: 'Birthday Today',
      value: formatCompact(today),
      change: formatChange(0.5 * (businessId === 'all' ? 1 : 0.8), 'yesterday'),
    },
    {
      id: 'celebrated',
      label: 'Birthday Celebrated',
      value: formatCompact(celebrated),
      change: formatChange(0.5, 'Last 30 days'),
    },
    {
      id: 'failed',
      label: 'Failed sends',
      value: formatCompact(failed),
      change: formatChange(-0.3, changeWindow),
      tone: 'warn',
    },
    {
      id: 'pending',
      label: 'Pending review',
      value: formatCompact(pending),
      change: formatChange(0.2, changeWindow),
    },
    {
      id: 'businesses',
      label: 'Businesses live',
      value: String(businessesLive),
      change: businessId === 'all' ? 'Platform coverage' : `Focused on ${scope}`,
    },
  ];

  const overviewCharts = [
    {
      id: 'upcoming-trend',
      title: 'Upcoming birthday Trend',
      subtitle: `Day-over-day upcoming birthday growth across ${scope}`,
      type: 'grouped',
      labels: DAY_LABELS,
      datasets: [
        {
          label: 'Today',
          color: '#0B1354',
          data: scaleSeries([120, 95, 140, 110, 165, 130, 175, 145, 190, 160], factor * 0.9),
        },
        {
          label: 'Yesterday',
          color: '#93C5FD',
          data: scaleSeries([80, 70, 100, 85, 120, 95, 130, 105, 140, 115], factor * 0.9),
        },
      ],
    },
    {
      id: 'birthday-trend',
      title: 'Birthday Trend',
      subtitle: `Day-over-day birthday activity for ${scope}`,
      type: 'grouped',
      labels: DAY_LABELS,
      datasets: [
        {
          label: 'Today',
          color: '#22C55E',
          data: scaleSeries([100, 85, 130, 115, 150, 125, 165, 140, 180, 155], factor * 0.9),
        },
        {
          label: 'Yesterday',
          color: '#F59E0B',
          data: scaleSeries([70, 60, 95, 80, 110, 90, 120, 100, 135, 110], factor * 0.9),
        },
      ],
    },
    {
      id: 'celebrated-growth',
      title: 'Birthday Celebrated Growth Over Time',
      subtitle: `Celebrated birthday distribution for ${scope}`,
      type: 'single',
      labels: MONTH_LABELS,
      color: '#F4A7A7',
      data: scaleSeries([90, 120, 150, 110, 170, 140, 190, 160, 200, 175], factor * 0.85),
    },
  ];

  const adminOverviewExtras = {
    deliveryMix: {
      title: 'Delivery outcome mix',
      subtitle: `Delivered vs pending vs failed for ${scope}`,
      labels: ['Delivered', 'Pending', 'Failed'],
      values: [
        Math.round(14000 * factor),
        Math.round(500 * factor),
        Math.round(1000 * factor),
      ],
      colors: ['#1F9D55', '#E67E22', '#EF4444'],
    },
    channelMix: {
      title: 'Channel distribution',
      subtitle: `Where birthday automations launch for ${scope}`,
      labels: ['SMS', 'Email', 'WhatsApp'],
      values:
        businessId === 'all'
          ? [62, 23, 15]
          : businessId === 'txtconnect'
            ? [40, 45, 15]
            : businessId === 'venus-retail'
              ? [55, 20, 25]
              : [70, 18, 12],
      colors: ['#2563EB', '#2E7DAD', '#1F9D55'],
    },
    volumeByBusiness: {
      title: 'Volume by business',
      subtitle: 'Birthday automation volume across onboarded businesses',
      labels: ['DealBoxx', 'TxtConnect', 'Venus Retail', 'Northstar'],
      values:
        businessId === 'all'
          ? scaleSeries([4200, 3100, 2800, 1900], DATE_WEIGHT[dateFilter] ?? 1)
          : AUTOMATION_BUSINESS_OPTIONS.map((option) =>
              option.id === businessId
                ? Math.round(4200 * factor)
                : Math.round(4200 * factor * 0.08),
            ),
      color: '#0B1354',
    },
    approvalMix: {
      title: 'Approval workflow mix',
      subtitle: `Auto vs business approval for ${scope}`,
      labels: ['Auto-approval', 'Business-approval'],
      values: businessId === 'all' ? [68, 32] : businessId === 'venus-retail' ? [35, 65] : [72, 28],
      colors: ['#3F3F46', '#2563EB'],
    },
    pipelineTrend: {
      title: 'Upcoming send pipeline',
      subtitle: `Next 10 days scheduled vs needs review (${scope})`,
      labels: ['D+1', 'D+2', 'D+3', 'D+4', 'D+5', 'D+6', 'D+7', 'D+8', 'D+9', 'D+10'],
      series: [
        {
          label: 'Scheduled',
          color: '#2563EB',
          data: scaleSeries([210, 180, 240, 160, 220, 190, 260, 170, 200, 230], factor * 0.7),
        },
        {
          label: 'Needs review',
          color: '#EAB308',
          data: scaleSeries([40, 35, 55, 28, 48, 42, 60, 30, 45, 50], factor * 0.7),
        },
      ],
    },
  };

  const engagementRate = Math.min(96, Math.round(23 * (0.9 + factor * 0.08)));
  const engagementSummary = {
    label: 'Engagement Rate',
    value: `${engagementRate}% this month`,
  };

  const engagementCharts = [
    {
      id: 'clicks',
      title: 'Clicks Growth Trends',
      subtitle: `Customer clicks across ${scope}`,
      color: '#3B82F6',
      data: scaleSeries([80, 110, 140, 100, 160, 130, 180, 150, 200, 170], factor * 0.8),
    },
    {
      id: 'engagement',
      title: 'Engagement Growth Trends',
      subtitle: `Customer engagement activity for ${scope}`,
      color: '#EAB308',
      data: scaleSeries([70, 100, 130, 95, 150, 120, 170, 140, 190, 160], factor * 0.8),
    },
    {
      id: 'conversions',
      title: 'Conversions Growth Trends',
      subtitle: `Sales conversions from birthday automations (${scope})`,
      color: '#16A34A',
      data: scaleSeries([60, 90, 120, 85, 140, 110, 160, 130, 180, 150], factor * 0.8),
    },
    {
      id: 'ctr',
      title: 'Click-Through-Rate Growth Trends',
      subtitle: `CTR performance for ${scope}`,
      color: '#38BDF8',
      data: scaleSeries([75, 105, 135, 90, 155, 125, 175, 145, 195, 165], factor * 0.8),
    },
    {
      id: 'open-rate',
      title: 'Open Rate Growth Trends',
      subtitle: `Open rate expansion for ${scope}`,
      color: '#0B1354',
      data: scaleSeries([65, 95, 125, 80, 145, 115, 165, 135, 185, 155], factor * 0.8),
    },
  ];

  const nativeBreakdownCharts = [
    {
      id: 'business-clicks',
      title: 'Clicks by business',
      subtitle: 'Native breakdown of click volume across businesses',
      type: 'grouped',
      labels: MONTH_LABELS.slice(0, 6),
      datasets: [
        {
          label: 'DealBoxx',
          color: '#2563EB',
          data: scaleSeries([120, 140, 110, 160, 150, 180], factor * 0.5),
        },
        {
          label: 'TxtConnect',
          color: '#22C55E',
          data: scaleSeries([90, 100, 85, 120, 110, 130], factor * 0.5),
        },
        {
          label: 'Venus Retail',
          color: '#F59E0B',
          data: scaleSeries([70, 80, 65, 95, 88, 100], factor * 0.5),
        },
        {
          label: 'Northstar',
          color: '#EF4444',
          data: scaleSeries([50, 55, 48, 70, 62, 75], factor * 0.5),
        },
      ],
    },
    {
      id: 'channel-engagement',
      title: 'Engagement by channel',
      subtitle: 'SMS, Email, and WhatsApp engagement over the period',
      type: 'grouped',
      labels: MONTH_LABELS.slice(0, 6),
      datasets: [
        {
          label: 'SMS',
          color: '#2563EB',
          data: scaleSeries([140, 150, 130, 170, 160, 190], factor * 0.55),
        },
        {
          label: 'Email',
          color: '#38BDF8',
          data: scaleSeries([80, 90, 75, 100, 95, 115], factor * 0.55),
        },
        {
          label: 'WhatsApp',
          color: '#16A34A',
          data: scaleSeries([60, 70, 55, 85, 78, 95], factor * 0.55),
        },
      ],
    },
  ];

  const adminEngagementExtras = {
    rateCards: [
      { id: 'ctr', label: 'CTR', value: `${Math.min(72, Math.round(48 * (0.85 + factor * 0.1)))}%` },
      {
        id: 'open',
        label: 'Open rate',
        value: `${Math.min(88, Math.round(62 * (0.85 + factor * 0.1)))}%`,
      },
      {
        id: 'conversion',
        label: 'Conversion rate',
        value: `${Math.min(55, Math.round(18 * (0.85 + factor * 0.12)))}%`,
      },
      {
        id: 'engagement',
        label: 'Engagement rate',
        value: `${engagementRate}%`,
      },
    ],
    ratesChart: {
      title: 'Engagement rate breakdown',
      subtitle: `Key performance rates for ${scope}`,
      labels: ['Clicks', 'CTR', 'Engagement', 'Open rate', 'Conversions'],
      values: [
        Math.min(95, Math.round(90 * (0.85 + factor * 0.08))),
        Math.min(72, Math.round(50 * (0.85 + factor * 0.1))),
        engagementRate,
        Math.min(88, Math.round(62 * (0.85 + factor * 0.1))),
        Math.min(55, Math.round(18 * (0.85 + factor * 0.12))),
      ],
      color: '#2563EB',
    },
    funnel: {
      title: 'Birthday conversion funnel',
      subtitle: `Launch through conversion for ${scope}`,
      steps: [
        { label: 'Launched', value: Math.round(15500 * factor), color: '#0B1354' },
        { label: 'Delivered', value: Math.round(14000 * factor), color: '#2563EB' },
        { label: 'Opened', value: Math.round(1400 * factor), color: '#38BDF8' },
        { label: 'Clicked', value: Math.round(1260 * factor), color: '#22C55E' },
        { label: 'Converted', value: Math.round(1134 * factor), color: '#16A34A' },
      ],
    },
    conversionTrend: {
      title: 'Conversion vs clicks over time',
      subtitle: `Comparative performance for ${scope}`,
      labels: MONTH_LABELS,
      series: [
        {
          label: 'Clicks',
          color: '#2563EB',
          data: scaleSeries([820, 940, 1010, 880, 1120, 1280, 1190, 1340, 1410, 1500], factor * 0.6),
        },
        {
          label: 'Conversions',
          color: '#16A34A',
          data: scaleSeries([210, 260, 290, 240, 320, 360, 340, 390, 410, 450], factor * 0.6),
        },
      ],
    },
  };

  return {
    scope,
    summaryStats,
    overviewCharts,
    adminOverviewExtras,
    engagementCharts,
    nativeBreakdownCharts,
    engagementSummary,
    adminEngagementExtras,
    monthLabels: MONTH_LABELS,
  };
}
