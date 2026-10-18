export const HOLIDAY_INSIGHT_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'engagement', label: 'Engagement & Conversions' },
];

export const HOLIDAY_DATE_FILTERS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'ytd', label: 'Year to date' },
];

export const HOLIDAY_SUMMARY_STATS = [
  {
    id: 'upcoming',
    label: 'Upcoming holidays',
    value: '52k',
    change: '↑ 0.5% yesterday',
  },
  {
    id: 'today',
    label: 'Holiday campaigns today',
    value: '52k',
    change: '↑ 0.5% yesterday',
  },
  {
    id: 'celebrated',
    label: 'Festive messages sent',
    value: '52k',
    change: '↑ 0.5% Last 30 days',
  },
];

export const HOLIDAY_DAY_LABELS = [
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

export const HOLIDAY_MONTH_LABELS = [
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

/** Pattern matching the festive engagement mock: high → April low → June rise → July dip → Aug peak → Sep dip → Oct high */
const HOLIDAY_ENGAGEMENT_SERIES = [210, 130, 95, 55, 100, 155, 85, 185, 150, 215];

export const HOLIDAY_OVERVIEW_CHARTS = [
  {
    id: 'upcoming-trend',
    title: 'Upcoming Holiday Trend',
    subtitle: 'Day-over-day upcoming holiday & festive season volume',
    type: 'grouped',
    labels: HOLIDAY_DAY_LABELS,
    datasets: [
      {
        label: 'Today',
        color: '#3A10CD',
        data: [120, 95, 140, 110, 165, 130, 175, 145, 190, 160],
      },
      {
        label: 'Yesterday',
        color: '#C4B5FD',
        data: [80, 70, 100, 85, 120, 95, 130, 105, 140, 115],
      },
    ],
  },
  {
    id: 'holiday-trend',
    title: 'Holiday & Festive Season Trend',
    subtitle: 'Day-over-day festive campaign activity comparison',
    type: 'grouped',
    labels: HOLIDAY_DAY_LABELS,
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
    id: 'sent-growth',
    title: 'Festive Messages Sent Growth Over Time',
    subtitle: 'Monthly holiday & festive season send volume',
    type: 'single',
    labels: HOLIDAY_MONTH_LABELS,
    color: '#F4A7A7',
    data: HOLIDAY_ENGAGEMENT_SERIES,
  },
];

export const HOLIDAY_ENGAGEMENT_CHARTS = [
  {
    id: 'clicks',
    title: 'Clicks Growth Trends',
    subtitle: 'Changes in total clicks over time',
    color: '#3B82F6',
    data: HOLIDAY_ENGAGEMENT_SERIES,
  },
  {
    id: 'engagement',
    title: 'Engagement Growth Trends',
    subtitle: 'Changes in engagement rate (out of 100) over time',
    color: '#EAB308',
    data: [200, 125, 90, 50, 95, 148, 80, 178, 142, 205],
  },
  {
    id: 'conversions',
    title: 'Conversions Growth Trends',
    subtitle: 'Total conversion per month',
    color: '#16A34A',
    data: [195, 120, 88, 48, 92, 145, 78, 172, 138, 200],
  },
  {
    id: 'ctr',
    title: 'Click-Through-Rate Growth Trends',
    subtitle: 'Changes in click-through rate (out of 100) over time',
    color: '#38BDF8',
    data: [205, 128, 92, 52, 98, 150, 82, 180, 145, 210],
  },
  {
    id: 'open-rate',
    title: 'Open Rate Growth Trends',
    subtitle: 'Percent total updates opened over time',
    color: '#0B1354',
    data: [190, 118, 85, 45, 90, 140, 75, 168, 135, 198],
  },
];
