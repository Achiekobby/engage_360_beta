export const BIRTHDAY_INSIGHT_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'engagement', label: 'Engagement & Conversions' },
];

export const BIRTHDAY_DATE_FILTERS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'ytd', label: 'Year to date' },
];

export const BIRTHDAY_SUMMARY_STATS = [
  {
    id: 'upcoming',
    label: 'Upcoming birthday',
    value: '52k',
    change: '↑ 0.5% yesterday',
  },
  {
    id: 'today',
    label: 'Birthday Today',
    value: '52k',
    change: '↑ 0.5% yesterday',
  },
  {
    id: 'celebrated',
    label: 'Birthday Celebrated',
    value: '52k',
    change: '↑ 0.5% Last 30 days',
  },
];

export const BIRTHDAY_DAY_LABELS = [
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

export const BIRTHDAY_MONTH_LABELS = [
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

export const BIRTHDAY_OVERVIEW_CHARTS = [
  {
    id: 'upcoming-trend',
    title: 'Upcoming birthday Trend',
    subtitle: 'Day-over-day upcoming birthday volume',
    type: 'grouped',
    labels: BIRTHDAY_DAY_LABELS,
    datasets: [
      {
        label: 'Today',
        color: '#0B1354',
        data: [120, 95, 140, 110, 165, 130, 175, 145, 190, 160],
      },
      {
        label: 'Yesterday',
        color: '#93C5FD',
        data: [80, 70, 100, 85, 120, 95, 130, 105, 140, 115],
      },
    ],
  },
  {
    id: 'birthday-trend',
    title: 'Birthday Trend',
    subtitle: 'Day-over-day birthday activity comparison',
    type: 'grouped',
    labels: BIRTHDAY_DAY_LABELS,
    datasets: [
      {
        label: 'Today',
        color: '#22C55E',
        data: [100, 85, 130, 115, 150, 125, 165, 140, 180, 155],
      },
      {
        label: 'Yesterday',
        color: '#F59E0B',
        data: [70, 60, 95, 80, 110, 90, 120, 100, 135, 110],
      },
    ],
  },
  {
    id: 'celebrated-growth',
    title: 'Birthday Celebrated Growth Over Time',
    subtitle: 'Monthly celebrated birthday volume',
    type: 'single',
    labels: BIRTHDAY_MONTH_LABELS,
    color: '#F4A7A7',
    data: [90, 120, 150, 110, 170, 140, 190, 160, 200, 175],
  },
];

export const BIRTHDAY_ENGAGEMENT_CHARTS = [
  {
    id: 'clicks',
    title: 'Clicks Growth Trends',
    subtitle: 'Changes in clicks over time',
    color: '#3B82F6',
    data: [80, 110, 140, 100, 160, 130, 180, 150, 200, 170],
  },
  {
    id: 'engagement',
    title: 'Engagement Growth Trends',
    subtitle: 'Changes in engagement distribution over time',
    color: '#EAB308',
    data: [70, 100, 130, 95, 150, 120, 170, 140, 190, 160],
  },
  {
    id: 'conversions',
    title: 'Conversions Growth Trends',
    subtitle: 'Expansion trends on conversions',
    color: '#16A34A',
    data: [60, 90, 120, 85, 140, 110, 160, 130, 180, 150],
  },
  {
    id: 'ctr',
    title: 'Click-Through-Rate Growth Trends',
    subtitle: 'Changes in click-through-rate distribution over time',
    color: '#38BDF8',
    data: [75, 105, 135, 90, 155, 125, 175, 145, 195, 165],
  },
  {
    id: 'open-rate',
    title: 'Open Rate Growth Trends',
    subtitle: 'Open rate expansion trends over time',
    color: '#0B1354',
    data: [65, 95, 125, 80, 145, 115, 165, 135, 185, 155],
  },
];
