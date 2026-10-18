import {
  DAY_LABELS,
  MONTH_LABELS,
  formatChange,
  formatCompact,
  getBusinessLabel,
  getReportFactor,
  scaleSeries,
  volumeByBusinessValues,
} from './reportsShared';

/** Festive engagement pattern from consumer mock */
const HOLIDAY_ENGAGEMENT_SERIES = [210, 130, 95, 55, 100, 155, 85, 185, 150, 215];

export function buildHolidayReport({ businessId = 'all', dateFilter = '30d' } = {}) {
  const factor = getReportFactor(businessId, dateFilter);
  const scope = getBusinessLabel(businessId);
  const changeWindow = dateFilter === '7d' ? 'yesterday' : 'Last 30 days';

  const upcoming = Math.round(52000 * factor * 0.18);
  const today = Math.round(52000 * factor * 0.09);
  const celebrated = Math.round(52000 * factor * 0.72);
  const failed = Math.round(1300 * factor);
  const pending = Math.round(1000 * factor);
  const businessesLive = businessId === 'all' ? 4 : 1;

  return {
    scope,
    summaryStats: [
      {
        id: 'upcoming',
        label: 'Upcoming holidays',
        value: formatCompact(upcoming),
        change: formatChange(0.5, changeWindow),
      },
      {
        id: 'today',
        label: 'Holiday campaigns today',
        value: formatCompact(today),
        change: formatChange(0.5, 'yesterday'),
      },
      {
        id: 'celebrated',
        label: 'Festive messages sent',
        value: formatCompact(celebrated),
        change: formatChange(0.5, 'Last 30 days'),
      },
      {
        id: 'failed',
        label: 'Failed sends',
        value: formatCompact(failed),
        change: formatChange(-0.35, changeWindow),
        tone: 'warn',
      },
      {
        id: 'pending',
        label: 'Pending review',
        value: formatCompact(pending),
        change: formatChange(0.25, changeWindow),
      },
      {
        id: 'businesses',
        label: 'Businesses live',
        value: String(businessesLive),
        change: businessId === 'all' ? 'Platform coverage' : `Focused on ${scope}`,
      },
    ],
    overviewCharts: [
      {
        id: 'upcoming-trend',
        title: 'Upcoming Holiday Trend',
        subtitle: `Day-over-day holiday & festive volume across ${scope}`,
        type: 'grouped',
        labels: DAY_LABELS,
        datasets: [
          {
            label: 'Today',
            color: '#2563EB',
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
        id: 'holiday-trend',
        title: 'Holiday & Festive Season Trend',
        subtitle: `Day-over-day festive campaign activity for ${scope}`,
        type: 'grouped',
        labels: DAY_LABELS,
        datasets: [
          {
            label: 'Today',
            color: '#3A10CD',
            data: scaleSeries([100, 85, 130, 115, 150, 125, 165, 140, 180, 155], factor * 0.9),
          },
          {
            label: 'Yesterday',
            color: '#60A5FA',
            data: scaleSeries([70, 60, 95, 80, 110, 90, 120, 100, 135, 110], factor * 0.9),
          },
        ],
      },
      {
        id: 'sent-growth',
        title: 'Festive Messages Sent Growth Over Time',
        subtitle: `Monthly holiday & festive send volume for ${scope}`,
        type: 'single',
        labels: MONTH_LABELS,
        color: '#60A5FA',
        data: scaleSeries(HOLIDAY_ENGAGEMENT_SERIES, factor * 0.85),
      },
    ],
    adminOverviewExtras: {
      deliveryMix: {
        title: 'Delivery outcome mix',
        subtitle: `Delivered vs pending vs failed festive messages for ${scope}`,
        labels: ['Delivered', 'Pending', 'Failed'],
        values: [
          Math.round(15000 * factor),
          Math.round(800 * factor),
          Math.round(1100 * factor),
        ],
        colors: ['#3A10CD', '#E67E22', '#EF4444'],
      },
      channelMix: {
        title: 'Channel distribution',
        subtitle: `Where holiday automations launch for ${scope}`,
        labels: ['SMS', 'Email', 'WhatsApp'],
        values:
          businessId === 'all'
            ? [58, 26, 16]
            : businessId === 'txtconnect'
              ? [40, 40, 20]
              : [65, 20, 15],
        colors: ['#2563EB', '#2E7DAD', '#1F9D55'],
      },
      volumeByBusiness: {
        title: 'Volume by business',
        subtitle: 'Holiday automation volume across onboarded businesses',
        labels: ['DealBoxx', 'TxtConnect', 'Venus Retail', 'Northstar'],
        values: volumeByBusinessValues(businessId, factor, dateFilter, 4500),
        color: '#0B1354',
      },
      approvalMix: {
        title: 'Approval workflow mix',
        subtitle: `Auto vs business approval for ${scope}`,
        labels: ['Auto-approval', 'Business-approval'],
        values: businessId === 'all' ? [70, 30] : businessId === 'venus-retail' ? [38, 62] : [75, 25],
        colors: ['#0B1354', '#3A10CD'],
      },
      pipelineTrend: {
        title: 'Holiday send pipeline',
        subtitle: `Next 10 days scheduled vs needs review (${scope})`,
        labels: ['D+1', 'D+2', 'D+3', 'D+4', 'D+5', 'D+6', 'D+7', 'D+8', 'D+9', 'D+10'],
        series: [
          {
            label: 'Scheduled',
            color: '#3A10CD',
            data: scaleSeries([230, 200, 260, 180, 240, 210, 280, 190, 220, 250], factor * 0.7),
          },
          {
            label: 'Needs review',
            color: '#60A5FA',
            data: scaleSeries([45, 38, 60, 32, 52, 46, 65, 35, 48, 55], factor * 0.7),
          },
        ],
      },
    },
    engagementSummary: {
      label: 'Engagement Rate',
      value: `${Math.min(96, Math.round(26 * (0.9 + factor * 0.08)))}% this month`,
    },
    engagementCharts: [
      {
        id: 'clicks',
        title: 'Clicks Growth Trends',
        subtitle: `Festive click volume for ${scope}`,
        color: '#3A10CD',
        data: scaleSeries(HOLIDAY_ENGAGEMENT_SERIES, factor * 0.8),
      },
      {
        id: 'engagement',
        title: 'Engagement Growth Trends',
        subtitle: `Festive engagement for ${scope}`,
        color: '#60A5FA',
        data: scaleSeries([200, 125, 90, 50, 95, 148, 80, 178, 142, 205], factor * 0.8),
      },
      {
        id: 'conversions',
        title: 'Conversions Growth Trends',
        subtitle: `Festive conversions for ${scope}`,
        color: '#2563EB',
        data: scaleSeries([195, 120, 88, 48, 92, 145, 78, 172, 138, 200], factor * 0.8),
      },
      {
        id: 'ctr',
        title: 'Click-Through-Rate Growth Trends',
        subtitle: `Festive CTR for ${scope}`,
        color: '#60A5FA',
        data: scaleSeries([205, 128, 92, 52, 98, 150, 82, 180, 145, 210], factor * 0.8),
      },
      {
        id: 'open-rate',
        title: 'Open Rate Growth Trends',
        subtitle: `Festive open rate for ${scope}`,
        color: '#0B1354',
        data: scaleSeries([190, 118, 85, 45, 90, 140, 75, 168, 135, 198], factor * 0.8),
      },
    ],
    nativeBreakdownCharts: [
      {
        id: 'business-clicks',
        title: 'Clicks by business',
        subtitle: 'Native breakdown of festive clicks across businesses',
        type: 'grouped',
        labels: MONTH_LABELS.slice(0, 6),
        datasets: [
          {
            label: 'DealBoxx',
            color: '#2563EB',
            data: scaleSeries([125, 145, 115, 165, 155, 185], factor * 0.5),
          },
          {
            label: 'TxtConnect',
            color: '#3A10CD',
            data: scaleSeries([95, 105, 88, 125, 115, 135], factor * 0.5),
          },
          {
            label: 'Venus Retail',
            color: '#60A5FA',
            data: scaleSeries([72, 82, 68, 98, 90, 105], factor * 0.5),
          },
          {
            label: 'Northstar',
            color: '#60A5FA',
            data: scaleSeries([52, 58, 48, 72, 65, 78], factor * 0.5),
          },
        ],
      },
      {
        id: 'channel-engagement',
        title: 'Engagement by channel',
        subtitle: 'SMS, Email, and WhatsApp festive engagement',
        type: 'grouped',
        labels: MONTH_LABELS.slice(0, 6),
        datasets: [
          {
            label: 'SMS',
            color: '#2563EB',
            data: scaleSeries([150, 160, 140, 180, 170, 195], factor * 0.55),
          },
          {
            label: 'Email',
            color: '#3A10CD',
            data: scaleSeries([95, 105, 88, 120, 112, 130], factor * 0.55),
          },
          {
            label: 'WhatsApp',
            color: '#60A5FA',
            data: scaleSeries([62, 72, 55, 88, 80, 95], factor * 0.55),
          },
        ],
      },
    ],
    adminEngagementExtras: {
      rateCards: [
        { id: 'ctr', label: 'CTR', value: `${Math.min(72, Math.round(47 * (0.85 + factor * 0.1)))}%` },
        {
          id: 'open',
          label: 'Open rate',
          value: `${Math.min(90, Math.round(58 * (0.85 + factor * 0.1)))}%`,
        },
        {
          id: 'conversion',
          label: 'Conversion rate',
          value: `${Math.min(55, Math.round(22 * (0.85 + factor * 0.12)))}%`,
        },
        {
          id: 'engagement',
          label: 'Engagement rate',
          value: `${Math.min(96, Math.round(26 * (0.9 + factor * 0.08)))}%`,
        },
      ],
      ratesChart: {
        title: 'Engagement rate breakdown',
        subtitle: `Key festive performance rates for ${scope}`,
        labels: ['Clicks', 'CTR', 'Engagement', 'Open rate', 'Conversions'],
        values: [
          Math.min(95, Math.round(90 * (0.85 + factor * 0.08))),
          Math.min(72, Math.round(47 * (0.85 + factor * 0.1))),
          Math.min(96, Math.round(26 * (0.9 + factor * 0.08))),
          Math.min(90, Math.round(58 * (0.85 + factor * 0.1))),
          Math.min(55, Math.round(22 * (0.85 + factor * 0.12))),
        ],
        color: '#3A10CD',
      },
      funnel: {
        title: 'Holiday conversion funnel',
        subtitle: `Launch through conversion for ${scope}`,
        steps: [
          { label: 'Launched', value: Math.round(17000 * factor), color: '#0B1354' },
          { label: 'Delivered', value: Math.round(15000 * factor), color: '#0B1354' },
          { label: 'Opened', value: Math.round(2200 * factor), color: '#2563EB' },
          { label: 'Clicked', value: Math.round(1700 * factor), color: '#3A10CD' },
          { label: 'Converted', value: Math.round(1200 * factor), color: '#60A5FA' },
        ],
      },
      conversionTrend: {
        title: 'Conversion vs clicks over time',
        subtitle: `Comparative festive performance for ${scope}`,
        labels: MONTH_LABELS,
        series: [
          {
            label: 'Clicks',
            color: '#3A10CD',
            data: scaleSeries([900, 1020, 1100, 960, 1240, 1380, 1290, 1460, 1520, 1600], factor * 0.6),
          },
          {
            label: 'Conversions',
            color: '#2563EB',
            data: scaleSeries([240, 280, 310, 260, 350, 390, 370, 420, 440, 480], factor * 0.6),
          },
        ],
      },
    },
    monthLabels: MONTH_LABELS,
  };
}
