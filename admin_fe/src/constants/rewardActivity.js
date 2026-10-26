import { REDEMPTION_STATUSES } from './rewards';

export const ACTIVITY_PAGE_SIZE = 8;

export const ACTIVITY_FILTER_DEFAULTS = {
  statuses: [],
  networks: [],
};

export const DATE_FILTER_DEFAULT = {
  preset: 'all',
  from: '',
  to: '',
};

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

export function resolveDateRange(filter, now = new Date()) {
  if (!filter || filter.preset === 'all') return null;
  const end = endOfDay(now);
  if (filter.preset === 'today') return { start: startOfDay(now), end };
  if (filter.preset === '7' || filter.preset === '30') {
    const days = filter.preset === '7' ? 6 : 29;
    const start = startOfDay(now);
    start.setDate(start.getDate() - days);
    return { start, end };
  }
  if (filter.preset === 'month') {
    return { start: new Date(now.getFullYear(), now.getMonth(), 1), end };
  }
  if (filter.preset === 'custom') {
    if (!filter.from || !filter.to) return { incomplete: true };
    const start = startOfDay(new Date(`${filter.from}T00:00:00`));
    const customEnd = endOfDay(new Date(`${filter.to}T00:00:00`));
    if (Number.isNaN(start.getTime()) || Number.isNaN(customEnd.getTime()) || start > customEnd) {
      return { invalid: true };
    }
    return { start, end: customEnd };
  }
  return null;
}

export function previousWindow(range) {
  const length = range.end.getTime() - range.start.getTime();
  return {
    start: new Date(range.start.getTime() - length - 1),
    end: new Date(range.start.getTime() - 1),
  };
}

export function last30Window(now = new Date()) {
  const end = endOfDay(now);
  const start = startOfDay(now);
  start.setDate(start.getDate() - 29);
  return { start, end };
}

export function inWindow(iso, range) {
  if (!range?.start) return true;
  const time = new Date(iso).getTime();
  return time >= range.start.getTime() && time <= range.end.getTime();
}

export function percentChange(current, previous) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

export function formatRangeLabel(range) {
  if (!range?.start) return 'All time';
  const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
  return `${fmt.format(range.start)} – ${fmt.format(range.end)}`;
}

export function trendCaption(filter) {
  if (!filter || filter.preset === 'all') return 'Last 30 days';
  if (filter.preset === 'today') return 'vs yesterday';
  if (filter.preset === '7') return 'vs prior 7 days';
  if (filter.preset === '30') return 'vs prior 30 days';
  if (filter.preset === 'month') return 'vs prior period';
  return 'vs prior period';
}

export function countMatching(rows, predicate) {
  return rows.reduce((total, row) => total + (predicate(row) ? 1 : 0), 0);
}

export const STATUS_OPTIONS = REDEMPTION_STATUSES;
