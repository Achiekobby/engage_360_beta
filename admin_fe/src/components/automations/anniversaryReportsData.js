import { AUTOMATION_BUSINESS_OPTIONS } from './automationsData';
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

export function buildAnniversaryReport({ businessId = 'all', dateFilter = '30d' } = {}) {
  const factor = getReportFactor(businessId, dateFilter);
  const scope = getBusinessLabel(businessId);
  const changeWindow = dateFilter === '7d' ? 'yesterday' : 'Last 30 days';

  const upcoming = Math.round(52000 * factor * 0.2);
  const today = Math.round(52000 * factor * 0.07);
  const celebrated = Math.round(52000 * factor * 0.65);
  const failed = Math.round(1100 * factor);
  const pending = Math.round(950 * factor);
  const businessesLive = businessId === 'all' ? 4 : 1;

  return {
    scope,
    summaryStats: [
      {
        id: 'upcoming',
        label: 'Upcoming Customer Anniversary',
        value: formatCompact(upcoming),
        change: formatChange(0.5, changeWindow),
      },
      {
        id: 'today',
        label: 'Customer Anniversary Today',
        value: formatCompact(today),
        change: formatChange(0.5, 'yesterday'),
      },
      {
        id: 'celebrated',
        label: 'Customer Anniversary Celebrated',
        value: formatCompact(celebrated),
        change: formatChange(0.5, 'Last 30 days'),
      },
      {
        id: 'failed',
        label: 'Failed sends',
        value: formatCompact(failed),
        change: formatChange(-0.2, changeWindow),
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
    ],
    overviewCharts: [
      {
        id: 'upcoming-trend',
        title: 'Upcoming Customer Anniversary Trend',
        subtitle: `Day-over-day upcoming anniversary volume across ${scope}`,
        type: 'grouped',
        labels: DAY_LABELS,
        datasets: [
          {
            label: 'Today',
            color: '#9F1239',
            data: scaleSeries([115, 90, 135, 105, 160, 125, 170, 140, 185, 155], factor * 0.9),
          },
          {
            label: 'Yesterday',
            color: '#F9A8D4',
            data: scaleSeries([75, 65, 95, 80, 115, 90, 125, 100, 135, 110], factor * 0.9),
          },
        ],
      },
      {
        id: 'anniversary-trend',
        title: 'Customer Anniversary Trend',
        subtitle: `Day-over-day anniversary activity for ${scope}`,
        type: 'grouped',
        labels: DAY_LABELS,
        datasets: [
          {
            label: 'Today',
            color: '#BE185D',
            data: scaleSeries([95, 80, 125, 110, 145, 120, 160, 135, 175, 150], factor * 0.9),
          },
          {
            label: 'Yesterday',
            color: '#FB7185',
            data: scaleSeries([65, 55, 90, 75, 105, 85, 115, 95, 130, 105], factor * 0.9),
          },
        ],
      },
      {
        id: 'celebrated-growth',
        title: 'Customer Anniversary Celebrated Growth Over Time',
        subtitle: `Monthly celebrated anniversary volume for ${scope}`,
        type: 'single',
        labels: MONTH_LABELS,
        color: '#F472B6',
        data: scaleSeries([210, 95, 70, 55, 120, 100, 165, 140, 185, 155], factor * 0.85),
      },
    ],
    adminOverviewExtras: {
      deliveryMix: {
        title: 'Delivery outcome mix',
        subtitle: `Delivered vs pending vs failed anniversary messages for ${scope}`,
        labels: ['Delivered', 'Pending', 'Failed'],
        values: [
          Math.round(13000 * factor),
          Math.round(600 * factor),
          Math.round(900 * factor),
        ],
        colors: ['#BE185D', '#F59E0B', '#EF4444'],
      },
      channelMix: {
        title: 'Channel distribution',
        subtitle: `Where anniversary automations launch for ${scope}`,
        labels: ['SMS', 'Email', 'WhatsApp'],
        values:
          businessId === 'all'
            ? [50, 32, 18]
            : businessId === 'txtconnect'
              ? [35, 48, 17]
              : [58, 25, 17],
        colors: ['#BE185D', '#DB2777', '#F472B6'],
      },
      volumeByBusiness: {
        title: 'Volume by business',
        subtitle: 'Anniversary automation volume across onboarded businesses',
        labels: ['DealBoxx', 'TxtConnect', 'Venus Retail', 'Northstar'],
        values: volumeByBusinessValues(businessId, factor, dateFilter, 3800),
        color: '#9F1239',
      },
      approvalMix: {
        title: 'Approval workflow mix',
        subtitle: `Auto vs business approval for ${scope}`,
        labels: ['Auto-approval', 'Business-approval'],
        values: businessId === 'all' ? [60, 40] : businessId === 'venus-retail' ? [30, 70] : [65, 35],
        colors: ['#831843', '#DB2777'],
      },
      pipelineTrend: {
        title: 'Anniversary send pipeline',
        subtitle: `Next 10 days scheduled vs needs review (${scope})`,
        labels: ['D+1', 'D+2', 'D+3', 'D+4', 'D+5', 'D+6', 'D+7', 'D+8', 'D+9', 'D+10'],
        series: [
          {
            label: 'Scheduled',
            color: '#BE185D',
            data: scaleSeries([190, 170, 220, 150, 205, 180, 240, 160, 195, 215], factor * 0.7),
          },
          {
            label: 'Needs review',
            color: '#F59E0B',
            data: scaleSeries([38, 32, 50, 26, 44, 40, 58, 30, 42, 48], factor * 0.7),
          },
        ],
      },
    },
    engagementSummary: {
      label: 'Engagement Rate',
      value: `${Math.min(96, Math.round(24 * (0.9 + factor * 0.08)))}% this month`,
    },
    engagementCharts: [
      {
        id: 'clicks',
        title: 'Clicks Growth Trends',
        subtitle: `Anniversary click volume for ${scope}`,
        color: '#DB2777',
        data: scaleSeries([210, 95, 70, 55, 120, 100, 165, 140, 185, 155], factor * 0.8),
      },
      {
        id: 'engagement',
        title: 'Engagement Growth Trends',
        subtitle: `Anniversary engagement for ${scope}`,
        color: '#F472B6',
        data: scaleSeries([200, 90, 65, 50, 115, 95, 160, 135, 180, 150], factor * 0.8),
      },
      {
        id: 'conversions',
        title: 'Conversions Growth Trends',
        subtitle: `Anniversary conversions for ${scope}`,
        color: '#BE185D',
        data: scaleSeries([190, 85, 60, 45, 110, 90, 155, 130, 175, 145], factor * 0.8),
      },
      {
        id: 'ctr',
        title: 'Click-Through-Rate Growth Trends',
        subtitle: `Anniversary CTR for ${scope}`,
        color: '#FB7185',
        data: scaleSeries([205, 92, 68, 52, 118, 98, 162, 138, 182, 152], factor * 0.8),
      },
      {
        id: 'open-rate',
        title: 'Open-Rate Growth Trends',
        subtitle: `Anniversary open rate for ${scope}`,
        color: '#9F1239',
        data: scaleSeries([195, 88, 62, 48, 112, 92, 158, 132, 178, 148], factor * 0.8),
      },
    ],
    nativeBreakdownCharts: [
      {
        id: 'business-clicks',
        title: 'Clicks by business',
        subtitle: 'Native breakdown of anniversary clicks across businesses',
        type: 'grouped',
        labels: MONTH_LABELS.slice(0, 6),
        datasets: [
          {
            label: 'DealBoxx',
            color: '#BE185D',
            data: scaleSeries([115, 135, 105, 155, 145, 170], factor * 0.5),
          },
          {
            label: 'TxtConnect',
            color: '#DB2777',
            data: scaleSeries([88, 98, 82, 118, 108, 128], factor * 0.5),
          },
          {
            label: 'Venus Retail',
            color: '#F472B6',
            data: scaleSeries([68, 78, 62, 92, 85, 98], factor * 0.5),
          },
          {
            label: 'Northstar',
            color: '#FB7185',
            data: scaleSeries([48, 54, 44, 68, 60, 72], factor * 0.5),
          },
        ],
      },
      {
        id: 'channel-engagement',
        title: 'Engagement by channel',
        subtitle: 'SMS, Email, and WhatsApp anniversary engagement',
        type: 'grouped',
        labels: MONTH_LABELS.slice(0, 6),
        datasets: [
          {
            label: 'SMS',
            color: '#BE185D',
            data: scaleSeries([135, 145, 125, 165, 155, 180], factor * 0.55),
          },
          {
            label: 'Email',
            color: '#DB2777',
            data: scaleSeries([90, 100, 85, 115, 108, 125], factor * 0.55),
          },
          {
            label: 'WhatsApp',
            color: '#F472B6',
            data: scaleSeries([58, 68, 52, 82, 74, 90], factor * 0.55),
          },
        ],
      },
    ],
    adminEngagementExtras: {
      rateCards: [
        { id: 'ctr', label: 'CTR', value: `${Math.min(72, Math.round(50 * (0.85 + factor * 0.1)))}%` },
        {
          id: 'open',
          label: 'Open rate',
          value: `${Math.min(90, Math.round(60 * (0.85 + factor * 0.1)))}%`,
        },
        {
          id: 'conversion',
          label: 'Conversion rate',
          value: `${Math.min(55, Math.round(19 * (0.85 + factor * 0.12)))}%`,
        },
        {
          id: 'engagement',
          label: 'Engagement rate',
          value: `${Math.min(96, Math.round(24 * (0.9 + factor * 0.08)))}%`,
        },
      ],
      ratesChart: {
        title: 'Engagement rate breakdown',
        subtitle: `Key anniversary performance rates for ${scope}`,
        labels: ['Clicks', 'CTR', 'Engagement', 'Open rate', 'Conversions'],
        values: [
          Math.min(95, Math.round(88 * (0.85 + factor * 0.08))),
          Math.min(72, Math.round(50 * (0.85 + factor * 0.1))),
          Math.min(96, Math.round(24 * (0.9 + factor * 0.08))),
          Math.min(90, Math.round(60 * (0.85 + factor * 0.1))),
          Math.min(55, Math.round(19 * (0.85 + factor * 0.12))),
        ],
        color: '#BE185D',
      },
      funnel: {
        title: 'Anniversary conversion funnel',
        subtitle: `Launch through conversion for ${scope}`,
        steps: [
          { label: 'Launched', value: Math.round(14800 * factor), color: '#831843' },
          { label: 'Delivered', value: Math.round(13000 * factor), color: '#9F1239' },
          { label: 'Opened', value: Math.round(1600 * factor), color: '#BE185D' },
          { label: 'Clicked', value: Math.round(1200 * factor), color: '#DB2777' },
          { label: 'Converted', value: Math.round(900 * factor), color: '#F472B6' },
        ],
      },
      conversionTrend: {
        title: 'Conversion vs clicks over time',
        subtitle: `Comparative anniversary performance for ${scope}`,
        labels: MONTH_LABELS,
        series: [
          {
            label: 'Clicks',
            color: '#DB2777',
            data: scaleSeries([780, 900, 960, 840, 1080, 1220, 1140, 1280, 1350, 1420], factor * 0.6),
          },
          {
            label: 'Conversions',
            color: '#BE185D',
            data: scaleSeries([200, 245, 270, 225, 305, 345, 325, 370, 390, 420], factor * 0.6),
          },
        ],
      },
    },
    monthLabels: MONTH_LABELS,
    businessOptions: AUTOMATION_BUSINESS_OPTIONS,
  };
}
