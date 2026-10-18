import { AUTOMATION_BUSINESS_OPTIONS } from './automationsData';

export const WELCOME_REPORT_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'engagement', label: 'Engagement & Conversions' },
];

export const WELCOME_DATE_FILTERS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'ytd', label: 'Year to date' },
];

export const WELCOME_BUSINESS_FILTERS = [
  { value: 'all', label: 'All businesses' },
  ...AUTOMATION_BUSINESS_OPTIONS.map((option) => ({
    value: option.id,
    label: option.label,
  })),
];

export const WELCOME_ENGAGEMENT_MODES = [
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
    WELCOME_BUSINESS_FILTERS.find((option) => option.value === businessId)?.label || 'business'
  );
}

export function buildWelcomeReport({ businessId = 'all', dateFilter = '30d' } = {}) {
  const factor = getFactor(businessId, dateFilter);
  const scope = businessLabel(businessId);
  const changeWindow = dateFilter === '7d' ? 'yesterday' : 'Last 30 days';

  const queued = Math.round(38000 * factor * 0.85);
  const sentToday = Math.round(1400 * factor);
  const delivered = Math.round(34000 * factor * 0.85);
  const failed = Math.round(900 * factor);
  const pending = Math.round(1100 * factor);
  const businessesLive = businessId === 'all' ? 4 : 1;

  const summaryStats = [
    {
      id: 'queued',
      label: 'Welcome queued',
      value: formatCompact(queued),
      change: formatChange(1.2 * (businessId === 'all' ? 1 : 1.1), 'yesterday'),
    },
    {
      id: 'sent-today',
      label: 'Welcome sent today',
      value: formatCompact(sentToday),
      change: formatChange(0.8, 'yesterday'),
    },
    {
      id: 'delivered',
      label: 'Welcome delivered',
      value: formatCompact(delivered),
      change: formatChange(2.1, 'Last 30 days'),
    },
    {
      id: 'failed',
      label: 'Failed sends',
      value: formatCompact(failed),
      change: formatChange(-0.4, changeWindow),
      tone: 'warn',
    },
    {
      id: 'pending',
      label: 'Pending review',
      value: formatCompact(pending),
      change: formatChange(0.3, changeWindow),
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
      id: 'queued-trend',
      title: 'Welcome queued Trend',
      subtitle: `Day-over-day welcome messages waiting to send across ${scope}`,
      type: 'grouped',
      labels: DAY_LABELS,
      datasets: [
        {
          label: 'Today',
          color: '#0E7490',
          data: scaleSeries([95, 110, 125, 100, 140, 120, 155, 135, 170, 150], factor * 0.9),
        },
        {
          label: 'Yesterday',
          color: '#67E8F9',
          data: scaleSeries([70, 85, 95, 75, 105, 90, 115, 100, 125, 110], factor * 0.9),
        },
      ],
    },
    {
      id: 'sent-trend',
      title: 'Welcome Sent Trend',
      subtitle: `Day-over-day welcome send volume for ${scope}`,
      type: 'grouped',
      labels: DAY_LABELS,
      datasets: [
        {
          label: 'Today',
          color: '#155E75',
          data: scaleSeries([88, 102, 118, 96, 132, 114, 148, 128, 162, 142], factor * 0.9),
        },
        {
          label: 'Yesterday',
          color: '#5EEAD4',
          data: scaleSeries([62, 78, 90, 70, 98, 84, 108, 94, 118, 102], factor * 0.9),
        },
      ],
    },
    {
      id: 'delivered-growth',
      title: 'Welcome Delivered Growth Over Time',
      subtitle: `Monthly delivered welcome volume for ${scope}`,
      type: 'single',
      labels: MONTH_LABELS,
      color: '#2DD4BF',
      data: scaleSeries([75, 100, 130, 115, 155, 145, 175, 160, 190, 180], factor * 0.85),
    },
  ];

  const adminOverviewExtras = {
    deliveryMix: {
      title: 'Delivery outcome mix',
      subtitle: `Delivered vs pending vs failed welcome messages for ${scope}`,
      labels: ['Delivered', 'Pending', 'Failed'],
      values: [
        Math.round(12000 * factor),
        Math.round(700 * factor),
        Math.round(850 * factor),
      ],
      colors: ['#0D9488', '#F59E0B', '#EF4444'],
    },
    channelMix: {
      title: 'Channel distribution',
      subtitle: `Where welcome automations launch for ${scope}`,
      labels: ['SMS', 'Email', 'WhatsApp'],
      values:
        businessId === 'all'
          ? [48, 35, 17]
          : businessId === 'txtconnect'
            ? [30, 50, 20]
            : [55, 28, 17],
      colors: ['#0891B2', '#0E7490', '#14B8A6'],
    },
    volumeByBusiness: {
      title: 'Volume by business',
      subtitle: 'Welcome automation volume across onboarded businesses',
      labels: ['DealBoxx', 'TxtConnect', 'Venus Retail', 'Northstar'],
      values:
        businessId === 'all'
          ? scaleSeries([3600, 2900, 2400, 1700], DATE_WEIGHT[dateFilter] ?? 1)
          : AUTOMATION_BUSINESS_OPTIONS.map((option) =>
              option.id === businessId
                ? Math.round(3600 * factor)
                : Math.round(3600 * factor * 0.08),
            ),
      color: '#0E7490',
    },
    approvalMix: {
      title: 'Approval workflow mix',
      subtitle: `Auto vs business approval for ${scope}`,
      labels: ['Auto-approval', 'Business-approval'],
      values: businessId === 'all' ? [74, 26] : businessId === 'venus-retail' ? [40, 60] : [78, 22],
      colors: ['#134E4A', '#0891B2'],
    },
    pipelineTrend: {
      title: 'Welcome send pipeline',
      subtitle: `Next 10 days queued vs needs review (${scope})`,
      labels: ['D+1', 'D+2', 'D+3', 'D+4', 'D+5', 'D+6', 'D+7', 'D+8', 'D+9', 'D+10'],
      series: [
        {
          label: 'Queued',
          color: '#0891B2',
          data: scaleSeries([180, 160, 210, 150, 200, 175, 230, 155, 190, 205], factor * 0.7),
        },
        {
          label: 'Needs review',
          color: '#F59E0B',
          data: scaleSeries([35, 30, 48, 25, 42, 38, 55, 28, 40, 45], factor * 0.7),
        },
      ],
    },
  };

  const engagementRate = Math.min(96, Math.round(27 * (0.9 + factor * 0.08)));
  const engagementSummary = {
    label: 'Engagement Rate',
    value: `${engagementRate}% this month`,
  };

  const engagementCharts = [
    {
      id: 'clicks',
      title: 'Clicks Growth Trends',
      subtitle: `Welcome message click volume for ${scope}`,
      color: '#0891B2',
      data: scaleSeries([70, 95, 125, 105, 145, 125, 165, 140, 185, 160], factor * 0.8),
    },
    {
      id: 'engagement',
      title: 'Engagement Growth Trends',
      subtitle: `Welcome engagement distribution for ${scope}`,
      color: '#14B8A6',
      data: scaleSeries([60, 88, 118, 98, 138, 118, 158, 132, 175, 152], factor * 0.8),
    },
    {
      id: 'conversions',
      title: 'Conversions Growth Trends',
      subtitle: `Welcome offer conversions for ${scope}`,
      color: '#0F766E',
      data: scaleSeries([45, 70, 95, 80, 120, 100, 140, 115, 160, 135], factor * 0.8),
    },
    {
      id: 'ctr',
      title: 'Click-Through-Rate Growth Trends',
      subtitle: `Welcome CTR for ${scope}`,
      color: '#22D3EE',
      data: scaleSeries([68, 92, 122, 100, 142, 122, 162, 138, 180, 155], factor * 0.8),
    },
    {
      id: 'open-rate',
      title: 'Open Rate Growth Trends',
      subtitle: `Welcome open rate for ${scope}`,
      color: '#155E75',
      data: scaleSeries([82, 108, 135, 115, 155, 135, 172, 148, 190, 168], factor * 0.8),
    },
  ];

  const nativeBreakdownCharts = [
    {
      id: 'business-clicks',
      title: 'Clicks by business',
      subtitle: 'Native breakdown of welcome click volume across businesses',
      type: 'grouped',
      labels: MONTH_LABELS.slice(0, 6),
      datasets: [
        {
          label: 'DealBoxx',
          color: '#0891B2',
          data: scaleSeries([110, 130, 100, 150, 140, 170], factor * 0.5),
        },
        {
          label: 'TxtConnect',
          color: '#14B8A6',
          data: scaleSeries([85, 95, 80, 115, 105, 125], factor * 0.5),
        },
        {
          label: 'Venus Retail',
          color: '#F59E0B',
          data: scaleSeries([65, 75, 60, 90, 82, 95], factor * 0.5),
        },
        {
          label: 'Northstar',
          color: '#EF4444',
          data: scaleSeries([45, 50, 42, 65, 58, 70], factor * 0.5),
        },
      ],
    },
    {
      id: 'channel-engagement',
      title: 'Engagement by channel',
      subtitle: 'SMS, Email, and WhatsApp welcome engagement over the period',
      type: 'grouped',
      labels: MONTH_LABELS.slice(0, 6),
      datasets: [
        {
          label: 'SMS',
          color: '#0891B2',
          data: scaleSeries([130, 140, 120, 160, 150, 175], factor * 0.55),
        },
        {
          label: 'Email',
          color: '#22D3EE',
          data: scaleSeries([95, 105, 90, 120, 112, 130], factor * 0.55),
        },
        {
          label: 'WhatsApp',
          color: '#0D9488',
          data: scaleSeries([55, 65, 50, 80, 72, 88], factor * 0.55),
        },
      ],
    },
  ];

  const adminEngagementExtras = {
    rateCards: [
      { id: 'ctr', label: 'CTR', value: `${Math.min(72, Math.round(52 * (0.85 + factor * 0.1)))}%` },
      {
        id: 'open',
        label: 'Open rate',
        value: `${Math.min(92, Math.round(68 * (0.85 + factor * 0.1)))}%`,
      },
      {
        id: 'conversion',
        label: 'Conversion rate',
        value: `${Math.min(55, Math.round(21 * (0.85 + factor * 0.12)))}%`,
      },
      {
        id: 'engagement',
        label: 'Engagement rate',
        value: `${engagementRate}%`,
      },
    ],
    ratesChart: {
      title: 'Engagement rate breakdown',
      subtitle: `Key welcome performance rates for ${scope}`,
      labels: ['Clicks', 'CTR', 'Engagement', 'Open rate', 'Conversions'],
      values: [
        Math.min(95, Math.round(88 * (0.85 + factor * 0.08))),
        Math.min(72, Math.round(52 * (0.85 + factor * 0.1))),
        engagementRate,
        Math.min(92, Math.round(68 * (0.85 + factor * 0.1))),
        Math.min(55, Math.round(21 * (0.85 + factor * 0.12))),
      ],
      color: '#0891B2',
    },
    funnel: {
      title: 'Welcome conversion funnel',
      subtitle: `Launch through conversion for ${scope}`,
      steps: [
        { label: 'Queued', value: Math.round(14000 * factor), color: '#155E75' },
        { label: 'Delivered', value: Math.round(12000 * factor), color: '#0891B2' },
        { label: 'Opened', value: Math.round(2100 * factor), color: '#22D3EE' },
        { label: 'Clicked', value: Math.round(1500 * factor), color: '#14B8A6' },
        { label: 'Converted', value: Math.round(980 * factor), color: '#0D9488' },
      ],
    },
    conversionTrend: {
      title: 'Conversion vs clicks over time',
      subtitle: `Comparative welcome performance for ${scope}`,
      labels: MONTH_LABELS,
      series: [
        {
          label: 'Clicks',
          color: '#0891B2',
          data: scaleSeries([720, 840, 910, 800, 1020, 1180, 1090, 1240, 1310, 1400], factor * 0.6),
        },
        {
          label: 'Conversions',
          color: '#0D9488',
          data: scaleSeries([180, 230, 260, 210, 290, 330, 310, 360, 380, 420], factor * 0.6),
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
