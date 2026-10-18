export const ANNIVERSARY_INSIGHT_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'engagement', label: 'Engagement & Conversions' },
];

export const ANNIVERSARY_DATE_FILTERS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'ytd', label: 'Year to date' },
];

export const ANNIVERSARY_SUMMARY_STATS = [
  {
    id: 'upcoming',
    label: 'Upcoming Customer Anniversary',
    value: '52k',
    change: '↑ 0.5% yesterday',
  },
  {
    id: 'today',
    label: 'Customer Anniversary Today',
    value: '52k',
    change: '↑ 0.5% yesterday',
  },
  {
    id: 'celebrated',
    label: 'Customer Anniversary Celebrated',
    value: '52k',
    change: '↑ 0.5% Last 30 days',
  },
];

export const ANNIVERSARY_DAY_LABELS = [
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

export const ANNIVERSARY_MONTH_LABELS = [
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
];

export const ANNIVERSARY_OVERVIEW_CHARTS = [
  {
    id: 'upcoming-trend',
    title: 'Upcoming Customer Anniversary Trend',
    subtitle: 'Day-over-day upcoming anniversary volume',
    type: 'grouped',
    labels: ANNIVERSARY_DAY_LABELS,
    datasets: [
      {
        label: 'Today',
        color: '#0B1354',
        data: [115, 90, 135, 105, 160, 125, 170, 140, 185, 155],
      },
      {
        label: 'Yesterday',
        color: '#93C5FD',
        data: [75, 65, 95, 80, 115, 90, 125, 100, 135, 110],
      },
    ],
  },
  {
    id: 'anniversary-trend',
    title: 'Customer Anniversary Trend',
    subtitle: 'Day-over-day anniversary activity comparison',
    type: 'grouped',
    labels: ANNIVERSARY_DAY_LABELS,
    datasets: [
      {
        label: 'Today',
        color: '#22C55E',
        data: [95, 80, 125, 110, 145, 120, 160, 135, 175, 150],
      },
      {
        label: 'Yesterday',
        color: '#F59E0B',
        data: [65, 55, 90, 75, 105, 85, 115, 95, 130, 105],
      },
    ],
  },
  {
    id: 'celebrated-growth',
    title: 'Customer Anniversary Celebrated Growth Over Time',
    subtitle: 'Monthly celebrated anniversary volume',
    type: 'single',
    labels: ANNIVERSARY_MONTH_LABELS,
    color: '#F4A7A7',
    data: [210, 95, 70, 55, 120, 100, 165, 140, 185, 155],
  },
];

export const ANNIVERSARY_ENGAGEMENT_CHARTS = [
  {
    id: 'clicks',
    title: 'Clicks Growth Trends',
    subtitle: 'Changes in clicks count over time',
    color: '#3B82F6',
    data: [210, 95, 70, 55, 120, 100, 165, 140, 185, 155],
  },
  {
    id: 'engagement',
    title: 'Engagement Growth Trends',
    subtitle: 'Changes in engagement rate over time',
    color: '#EAB308',
    data: [200, 90, 65, 50, 115, 95, 160, 135, 180, 150],
  },
  {
    id: 'conversions',
    title: 'Conversions Growth Trends',
    subtitle: 'Changes in conversion rate over time',
    color: '#16A34A',
    data: [190, 85, 60, 45, 110, 90, 155, 130, 175, 145],
  },
  {
    id: 'ctr',
    title: 'Click-Through-Rate Growth Trends',
    subtitle: 'Changes in click-through-rate over time',
    color: '#38BDF8',
    data: [205, 92, 68, 52, 118, 98, 162, 138, 182, 152],
  },
  {
    id: 'open-rate',
    title: 'Open-Rate Growth Trends',
    subtitle: 'Changes in open rate over time',
    color: '#0B1354',
    data: [195, 88, 62, 48, 112, 92, 158, 132, 178, 148],
  },
];
