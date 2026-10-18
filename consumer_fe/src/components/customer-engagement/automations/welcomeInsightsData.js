export const WELCOME_INSIGHT_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'engagement', label: 'Engagement & Conversions' },
];

export const WELCOME_DATE_FILTERS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'ytd', label: 'Year to date' },
];

export const WELCOME_SUMMARY_STATS = [
  {
    id: 'queued',
    label: 'Welcome queued',
    value: '38k',
    change: '↑ 1.2% yesterday',
  },
  {
    id: 'sent-today',
    label: 'Welcome sent today',
    value: '1.4k',
    change: '↑ 0.8% yesterday',
  },
  {
    id: 'delivered',
    label: 'Welcome delivered',
    value: '34k',
    change: '↑ 2.1% Last 30 days',
  },
];

export const WELCOME_DAY_LABELS = [
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

export const WELCOME_MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sep',
  'Oct',
];

export const WELCOME_OVERVIEW_CHARTS = [
  {
    id: 'queued-trend',
    title: 'Welcome queued Trend',
    subtitle: 'Day-over-day welcome messages waiting to send',
    type: 'grouped',
    labels: WELCOME_DAY_LABELS,
    datasets: [
      {
        label: 'Today',
        color: '#3A10CD',
        data: [95, 110, 125, 100, 140, 120, 155, 135, 170, 150],
      },
      {
        label: 'Yesterday',
        color: '#C4B5FD',
        data: [70, 85, 95, 75, 105, 90, 115, 100, 125, 110],
      },
    ],
  },
  {
    id: 'sent-trend',
    title: 'Welcome Sent Trend',
    subtitle: 'Day-over-day welcome message send volume',
    type: 'grouped',
    labels: WELCOME_DAY_LABELS,
    datasets: [
      {
        label: 'Today',
        color: '#0B1354',
        data: [88, 102, 118, 96, 132, 114, 148, 128, 162, 142],
      },
      {
        label: 'Yesterday',
        color: '#93C5FD',
        data: [62, 78, 90, 70, 98, 84, 108, 94, 118, 102],
      },
    ],
  },
  {
    id: 'delivered-growth',
    title: 'Welcome Delivered Growth Over Time',
    subtitle: 'Monthly delivered welcome message volume',
    type: 'single',
    labels: WELCOME_MONTH_LABELS,
    color: '#A78BFA',
    data: [75, 100, 130, 115, 155, 145, 175, 160, 190, 180],
  },
];

export const WELCOME_ENGAGEMENT_CHARTS = [
  {
    id: 'clicks',
    title: 'Clicks Growth Trends',
    subtitle: 'Welcome message click volume over time',
    color: '#3B82F6',
    data: [70, 95, 125, 105, 145, 125, 165, 140, 185, 160],
  },
  {
    id: 'engagement',
    title: 'Engagement Growth Trends',
    subtitle: 'Welcome engagement distribution over time',
    color: '#EAB308',
    data: [60, 88, 118, 98, 138, 118, 158, 132, 175, 152],
  },
  {
    id: 'conversions',
    title: 'Conversions Growth Trends',
    subtitle: 'Welcome offer conversions over time',
    color: '#16A34A',
    data: [45, 70, 95, 80, 120, 100, 140, 115, 160, 135],
  },
  {
    id: 'ctr',
    title: 'Click-Through-Rate Growth Trends',
    subtitle: 'Welcome CTR distribution over time',
    color: '#38BDF8',
    data: [68, 92, 122, 100, 142, 122, 162, 138, 180, 155],
  },
  {
    id: 'open-rate',
    title: 'Open Rate Growth Trends',
    subtitle: 'Welcome open rate expansion over time',
    color: '#3A10CD',
    data: [82, 108, 135, 115, 155, 135, 172, 148, 190, 168],
  },
];
