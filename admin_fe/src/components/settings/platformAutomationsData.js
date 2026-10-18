import {
  DAY_LABELS,
  MONTH_LABELS,
  REPORT_BUSINESS_FILTERS,
  REPORT_DATE_FILTERS,
  formatChange,
  formatCompact,
  getBusinessLabel,
  getReportFactor,
  scaleSeries,
} from '../automations/reportsShared';

export const PLATFORM_AUTOMATION_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'adoption', label: 'Adoption' },
  { id: 'channels', label: 'Channel Analytics' },
  { id: 'approval', label: 'Approval Analytics' },
  { id: 'revenue', label: 'Revenue Analytics' },
];

export { REPORT_DATE_FILTERS as PLATFORM_DATE_FILTERS, REPORT_BUSINESS_FILTERS as PLATFORM_BUSINESS_FILTERS };

export const APPROVAL_MODES = [
  { id: 'business', label: 'Business Approval' },
  { id: 'auto', label: 'Auto-Approval' },
];

/** Shared semantic colors for approval statuses across all kind charts */
export const APPROVAL_STATUS_COLORS = {
  awaiting: '#F59E0B',
  approved: '#16A34A',
  rejected: '#EF4444',
  expired: '#717171',
  failed: '#DC2626',
  successful: '#2563EB',
};

const AUTOMATION_TYPES = [
  {
    id: 'birthday',
    label: 'Birthday',
    short: 'Birthday',
    color: '#2563EB',
  },
  {
    id: 'welcome',
    label: 'Welcome Message',
    short: 'Welcome',
    color: '#0E7490',
  },
  {
    id: 'anniversary',
    label: 'Customer Anniversary',
    short: 'Anniversary',
    color: '#BE185D',
  },
  {
    id: 'holidays',
    label: 'Holiday & Festive Season',
    short: 'Holiday',
    color: '#C2410C',
  },
];

const SHORT_DAYS = DAY_LABELS.slice(0, 7);
const ADOPTION_DAYS = DAY_LABELS;

function changeLabel(dateFilter) {
  if (dateFilter === '7d') return 'vs prior 7 days';
  if (dateFilter === '90d') return 'vs prior 90 days';
  if (dateFilter === 'ytd') return 'vs prior year';
  return 'vs last 30 days';
}

function money(value) {
  if (value >= 1000) return `GH₵${formatCompact(value)}`;
  return `GH₵${value}`;
}

function pct(part, whole) {
  if (!whole) return 0;
  return Math.min(99, Math.round((part / whole) * 100));
}

export function buildPlatformAutomationsBundle({
  businessId = 'all',
  dateFilter = '30d',
  approvalMode = 'business',
} = {}) {
  const factor = getReportFactor(businessId, dateFilter);
  const scope = getBusinessLabel(businessId);
  const delta = changeLabel(dateFilter);

  const providers = Math.max(1, Math.round(128 * (businessId === 'all' ? 1 : 0.35) * (dateFilter === '7d' ? 0.9 : 1)));
  const active = Math.round(providers * 0.78);
  const disabled = Math.max(0, providers - active);
  const sent = Math.round(52000 * factor);
  const delivered = Math.round(sent * 0.92);
  const read = Math.round(delivered * 0.64);
  const engagements = Math.round(delivered * 0.41);
  const revenue = Math.round(sent * 0.38);
  const insufficient = Math.max(1, Math.round(providers * 0.11));
  const failed = Math.round(sent * 0.06);
  const deliveryRate = pct(delivered, sent);
  const openRate = pct(read, delivered);
  const healthScore = Math.min(98, Math.round(72 + deliveryRate * 0.18 - insufficient * 0.4));

  const overview = {
    title: 'Automation Health Overview',
    subtitle: `Identify platform health and performance across ${scope}.`,
    health: {
      score: healthScore,
      label: healthScore >= 85 ? 'Healthy' : healthScore >= 70 ? 'Watch' : 'At risk',
      tone: healthScore >= 85 ? 'good' : healthScore >= 70 ? 'warn' : 'bad',
      highlights: [
        { id: 'delivery', label: 'Delivery rate', value: `${deliveryRate}%` },
        { id: 'credit', label: 'Credit risk', value: `${insufficient} providers` },
        { id: 'disabled', label: 'Disabled', value: String(disabled) },
      ],
    },
    cards: [
      { id: 'providers', label: 'Total Providers', value: formatCompact(providers), change: formatChange(0.2, delta), tone: 'neutral' },
      { id: 'active', label: 'Active', value: formatCompact(active), change: formatChange(1.4, delta), tone: 'good' },
      { id: 'disabled', label: 'Disabled', value: formatCompact(disabled), change: formatChange(-0.6, delta), tone: 'warn' },
      { id: 'sent', label: 'Total Messages Sent', value: formatCompact(sent), change: formatChange(2.1, delta), tone: 'neutral' },
      { id: 'delivered', label: 'Total Delivered', value: formatCompact(delivered), change: formatChange(1.8, delta), tone: 'good' },
      { id: 'read', label: 'Total Read', value: formatCompact(read), change: formatChange(0.9, delta), tone: 'neutral' },
      { id: 'engagements', label: 'Total Engagements', value: formatCompact(engagements), change: formatChange(1.2, delta), tone: 'good' },
      { id: 'revenue', label: 'Total Revenue', value: money(revenue), change: formatChange(3.4, delta), tone: 'good' },
      { id: 'credit', label: 'Insufficient Credit', value: formatCompact(insufficient), change: formatChange(0.8, delta), tone: 'bad' },
      { id: 'failed', label: 'Total Failed', value: formatCompact(failed), change: formatChange(-0.4, delta), tone: 'bad' },
      { id: 'delivery-rate', label: 'Delivery Rate', value: `${deliveryRate}%`, change: formatChange(0.5, delta), tone: 'good' },
      { id: 'open-rate', label: 'Open Rate', value: `${openRate}%`, change: formatChange(0.7, delta), tone: 'neutral' },
    ],
    charts: [
      {
        id: 'providers-growth',
        title: 'Providers Using Automations Growth over time',
        subtitle: 'Growth in onboarded providers actively using engagement automations.',
        color: '#2563EB',
        labels: SHORT_DAYS,
        data: scaleSeries([120, 95, 150, 110, 180, 140, 210], factor * 0.9),
      },
      {
        id: 'active-growth',
        title: 'Active Automation Growth Over Time',
        subtitle: 'Active automation volume running across the platform.',
        color: '#16A34A',
        labels: SHORT_DAYS,
        data: scaleSeries([100, 130, 160, 120, 190, 155, 220], factor * 0.9),
      },
      {
        id: 'disabled-growth',
        title: 'Disabled Automation Growth Over Time',
        subtitle: 'Automations turned off by providers — watch for sudden spikes.',
        color: '#EAB308',
        labels: SHORT_DAYS,
        data: scaleSeries([40, 55, 35, 70, 50, 65, 45], factor * 0.85),
      },
      {
        id: 'credit-growth',
        title: 'Providers with Insufficient Credit Over Time',
        subtitle: 'Providers blocked from sending due to low account credit.',
        color: '#EF4444',
        labels: SHORT_DAYS,
        data: scaleSeries([25, 40, 55, 35, 70, 48, 62], factor * 0.8),
      },
    ],
  };

  const adoptionSummaries = AUTOMATION_TYPES.map((type, index) => {
    const base = [0.92, 0.78, 0.64, 0.71][index];
    const activeProviders = Math.max(1, Math.round(providers * base * 0.85));
    const automations = Math.round(activeProviders * (2.4 + index * 0.2));
    const covered = Math.round(activeProviders * (180 + index * 40) * factor * 0.15);
    return {
      id: type.id,
      label: type.short,
      color: type.color,
      activeProviders,
      automations,
      covered,
    };
  });

  const adoption = {
    title: 'Adoption Overview',
    subtitle: `Monitor automation adoption and coverage across ${scope}.`,
    summaries: adoptionSummaries,
    charts: AUTOMATION_TYPES.map((type, index) => {
      const palette = [
        ['#1E3A8A', '#60A5FA', '#0B1354'],
        ['#CA8A04', '#22C55E', '#EA580C'],
        ['#7C3AED', '#BE185D', '#166534'],
        ['#0891B2', '#717171', '#65A30D'],
      ][index];
      return {
        id: `adoption-${type.id}`,
        title: `${type.label} Automations Adoption over time`,
        subtitle: `Adoption and usage growth for ${type.label.toLowerCase()} automations among providers.`,
        labels: ADOPTION_DAYS,
        datasets: [
          {
            label: 'Active providers',
            color: palette[0],
            data: scaleSeries([90, 70, 110, 85, 130, 100, 150, 120, 165, 140], factor * (0.85 - index * 0.05)),
          },
          {
            label: 'Automations',
            color: palette[1],
            data: scaleSeries([110, 95, 140, 115, 160, 130, 175, 145, 190, 160], factor * (0.9 - index * 0.04)),
          },
          {
            label: 'Customers covered',
            color: palette[2],
            data: scaleSeries([140, 120, 170, 145, 195, 160, 210, 180, 230, 200], factor * (0.95 - index * 0.03)),
          },
        ],
      };
    }),
  };

  const channelDefs = [
    {
      id: 'sms',
      label: 'SMS',
      colors: { sent: '#3F3F46', delivered: '#0B1354', failed: '#EAB308' },
      sentShare: 0.48,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      colors: { sent: '#166534', delivered: '#0B1354', failed: '#64748B' },
      sentShare: 0.22,
    },
    {
      id: 'email',
      label: 'Email',
      colors: { sent: '#2563EB', delivered: '#0B1354', failed: '#7C3AED' },
      sentShare: 0.3,
    },
  ];

  const channels = {
    title: 'Channel Analytics',
    subtitle: `Monitor automation channel performance for ${scope}.`,
    cards: channelDefs.map((channel) => {
      const channelSent = Math.round(sent * channel.sentShare);
      const channelDelivered = Math.round(channelSent * (channel.id === 'email' ? 0.96 : 0.9));
      const channelFailed = Math.max(1, channelSent - channelDelivered);
      return {
        id: channel.id,
        label: channel.label,
        sent: formatCompact(channelSent),
        delivered: formatCompact(channelDelivered),
        failed: formatCompact(channelFailed),
        deliveryRate: `${pct(channelDelivered, channelSent)}%`,
        failRate: `${pct(channelFailed, channelSent)}%`,
        color: channel.colors.sent,
      };
    }),
    charts: channelDefs.map((channel) => ({
      id: `channel-${channel.id}`,
      title: `Automation ${channel.label} channel health over time`,
      subtitle: `Sent, delivered, and failed ${channel.label} automation volume.`,
      labels: ADOPTION_DAYS,
      datasets: [
        {
          label: 'Sent',
          color: channel.colors.sent,
          data: scaleSeries([160, 130, 190, 150, 210, 170, 230, 185, 245, 200], factor * channel.sentShare * 2.2),
        },
        {
          label: 'Delivered',
          color: channel.colors.delivered,
          data: scaleSeries([145, 120, 175, 135, 195, 155, 215, 170, 230, 185], factor * channel.sentShare * 2),
        },
        {
          label: 'Failed',
          color: channel.colors.failed,
          data: scaleSeries([18, 22, 15, 28, 20, 26, 16, 24, 19, 27], factor * 0.7),
        },
      ],
    })),
  };

  const awaiting = Math.round(4200 * factor * 0.35);
  const approved = Math.round(4200 * factor * 0.42);
  const rejected = Math.round(4200 * factor * 0.1);
  const expired = Math.round(4200 * factor * 0.07);
  const approvalFailed = Math.round(4200 * factor * 0.06);
  const totalRequests = awaiting + approved + rejected + expired + approvalFailed;
  const avgMinutes = Math.max(18, Math.round(134 / (factor > 1 ? 1.15 : 1)));

  const businessApprovalCharts = AUTOMATION_TYPES.map((type, index) => ({
    id: `biz-approval-${type.id}`,
    title: `Business Approval over time (${type.short})`,
    subtitle: `Volume and status of ${type.label.toLowerCase()} automations requiring business approval.`,
    labels: MONTH_LABELS.slice(0, 6).map((m, i) => `${m} ${i + 1}`),
    datasets: [
      {
        label: 'Awaiting',
        color: APPROVAL_STATUS_COLORS.awaiting,
        data: scaleSeries([80, 95, 70, 110, 90, 120], factor * (0.9 - index * 0.05)),
      },
      {
        label: 'Approved',
        color: APPROVAL_STATUS_COLORS.approved,
        data: scaleSeries([120, 140, 110, 155, 135, 170], factor * (0.95 - index * 0.04)),
      },
      {
        label: 'Rejected',
        color: APPROVAL_STATUS_COLORS.rejected,
        data: scaleSeries([35, 28, 42, 30, 38, 25], factor * 0.7),
      },
      {
        label: 'Expired',
        color: APPROVAL_STATUS_COLORS.expired,
        data: scaleSeries([22, 18, 26, 20, 24, 16], factor * 0.65),
      },
      {
        label: 'Failed',
        color: APPROVAL_STATUS_COLORS.failed,
        data: scaleSeries([14, 18, 12, 20, 16, 22], factor * 0.6),
      },
    ],
  }));

  const autoActive = Math.max(8, Math.round(42 * factor * (businessId === 'all' ? 1 : 0.4)));
  const autoSuccess = Math.max(6, Math.round(autoActive * 0.86));
  const autoFail = Math.max(1, autoActive - autoSuccess);

  const autoApprovalCharts = [
    {
      id: 'auto-providers',
      title: 'Auto-Approval Active Providers Over Time',
      subtitle: 'Providers with auto-approval enabled for automations.',
      color: '#2563EB',
      labels: SHORT_DAYS,
      data: scaleSeries([110, 95, 140, 120, 165, 145, 190], factor * 0.85),
      grouped: false,
    },
    ...AUTOMATION_TYPES.map((type, index) => ({
      id: `auto-${type.id}`,
      title: `Auto-Approval over time (${type.short})`,
      subtitle: `Successful vs failed auto-approved ${type.label.toLowerCase()} sends.`,
      labels: ADOPTION_DAYS,
      grouped: true,
      datasets: [
        {
          label: 'Successful',
          color: APPROVAL_STATUS_COLORS.successful,
          data: scaleSeries([140, 120, 165, 135, 180, 150, 195, 160, 210, 175], factor * (0.9 - index * 0.05)),
        },
        {
          label: 'Failed',
          color: APPROVAL_STATUS_COLORS.failed,
          data: scaleSeries([28, 35, 22, 40, 30, 38, 24, 36, 28, 42], factor * 0.65),
        },
      ],
    })),
  ];

  const approval = {
    title:
      approvalMode === 'auto' ? 'Auto-Approval Analytics' : 'Business Approval Analytics',
    subtitle:
      approvalMode === 'auto'
        ? `Monitor auto-approval performance for ${scope}.`
        : `Monitor business approval volume and turnaround for ${scope}.`,
    mode: approvalMode,
    businessCards: [
      { id: 'requests', label: 'Total Requests', value: formatCompact(totalRequests), change: formatChange(10.2, delta) },
      { id: 'awaiting', label: 'Awaiting Approval', value: formatCompact(awaiting), change: formatChange(4.1, delta), tone: 'warn' },
      { id: 'approved', label: 'Approved', value: formatCompact(approved), change: formatChange(8.4, delta), tone: 'good' },
      { id: 'rejected', label: 'Rejected', value: formatCompact(rejected), change: formatChange(-1.2, delta), tone: 'bad' },
      { id: 'expired', label: 'Expired', value: formatCompact(expired), change: formatChange(0.6, delta), tone: 'warn' },
      { id: 'failed', label: 'Failed', value: formatCompact(approvalFailed), change: formatChange(-0.8, delta), tone: 'bad' },
      {
        id: 'avg-time',
        label: 'Average Approval Time',
        value: `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}m`,
        change: formatChange(-2.3, delta),
        tone: 'good',
      },
      {
        id: 'approval-rate',
        label: 'Approval Rate',
        value: `${pct(approved, approved + rejected + expired)}%`,
        change: formatChange(1.5, delta),
        tone: 'good',
      },
    ],
    autoCards: [
      { id: 'active', label: 'Active Messages', value: String(autoActive), change: formatChange(10, delta) },
      { id: 'successful', label: 'Successful', value: String(autoSuccess), change: formatChange(10, delta), tone: 'good' },
      { id: 'failed', label: 'Failed', value: String(autoFail), change: formatChange(2, delta), tone: 'bad' },
      {
        id: 'success-rate',
        label: 'Success Rate',
        value: `${pct(autoSuccess, autoActive)}%`,
        change: formatChange(1.1, delta),
        tone: 'good',
      },
    ],
    businessCharts: businessApprovalCharts,
    autoCharts: autoApprovalCharts,
  };

  const smsRevenue = Math.round(revenue * 0.46);
  const emailRevenue = Math.round(revenue * 0.32);
  const whatsappRevenue = Math.round(revenue * 0.22);

  const revenueView = {
    title: 'Revenue Analytics',
    subtitle: `Monitor automated revenue performance for ${scope}.`,
    cards: [
      {
        id: 'total',
        label: 'Total Automation Revenue',
        value: money(revenue),
        change: formatChange(10, delta),
        share: '100%',
      },
      {
        id: 'sms',
        label: 'SMS Revenue',
        value: money(smsRevenue),
        change: formatChange(8.2, delta),
        share: `${pct(smsRevenue, revenue)}%`,
      },
      {
        id: 'email',
        label: 'Email Revenue',
        value: money(emailRevenue),
        change: formatChange(6.4, delta),
        share: `${pct(emailRevenue, revenue)}%`,
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp Revenue',
        value: money(whatsappRevenue),
        change: formatChange(12.1, delta),
        share: `${pct(whatsappRevenue, revenue)}%`,
      },
    ],
    byType: {
      id: 'revenue-by-type',
      title: 'Revenue by Automation Type',
      subtitle: 'Compare birthday, welcome, anniversary, and holiday automation revenue over time.',
      labels: SHORT_DAYS.slice(0, 6),
      datasets: AUTOMATION_TYPES.map((type, index) => ({
        label: type.short,
        color: ['#717171', '#EAB308', '#1E3A8A', '#7C3AED'][index],
        data: scaleSeries(
          [
            [120, 90, 140, 110, 160, 130],
            [100, 115, 95, 135, 120, 150],
            [80, 70, 100, 85, 115, 95],
            [95, 110, 85, 125, 105, 140],
          ][index],
          factor * 0.85,
        ),
      })),
    },
    channelCharts: [
      {
        id: 'sms-revenue',
        title: 'SMS Revenue Over Time',
        subtitle: 'Revenue generated from SMS automation sends.',
        color: '#EA580C',
        labels: SHORT_DAYS,
        data: scaleSeries([130, 100, 160, 120, 180, 145, 200], factor * 0.9),
      },
      {
        id: 'email-revenue',
        title: 'Email Revenue Over Time',
        subtitle: 'Revenue generated from email automation sends.',
        color: '#FDBA74',
        labels: SHORT_DAYS,
        data: scaleSeries([90, 110, 85, 130, 100, 145, 120], factor * 0.85),
      },
      {
        id: 'whatsapp-revenue',
        title: 'WhatsApp Revenue Over Time',
        subtitle: 'Revenue generated from WhatsApp automation sends.',
        color: '#9F1239',
        labels: SHORT_DAYS,
        data: scaleSeries([70, 85, 65, 95, 80, 110, 90], factor * 0.8),
      },
    ],
  };

  return {
    scope,
    overview,
    adoption,
    channels,
    approval,
    revenue: revenueView,
  };
}
