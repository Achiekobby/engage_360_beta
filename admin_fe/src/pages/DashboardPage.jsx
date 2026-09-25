import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Filter,
  Globe,
  Home,
  Info,
  Landmark,
  Layers,
  MapPin,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Waves,
} from 'lucide-react';
import { clsx } from 'clsx';
import { StaggerItem, StaggerReveal } from '../components/motion';
import {
  DATE_RANGES,
  FILTER_COUNTRIES,
  FILTER_TYPES,
  buildDashboard,
} from '../components/dashboard/dashboardData';
import GhanaBusinessMap from '../components/dashboard/GhanaBusinessMap';
import { ChartTooltip, tooltipStyle, useChartFocus } from '../components/charts/chartInteraction';

const METRIC_TONES = {
  total: { icon: Users, color: '#2563EB', soft: '#EFF6FF' },
  newer: { icon: UserPlus, color: '#16A34A', soft: '#F0FDF4' },
  active: { icon: TrendingUp, color: '#7C3AED', soft: '#F5F3FF' },
  inactive: { icon: RefreshCw, color: '#F97316', soft: '#FFF7ED' },
};

function smoothLine(coords) {
  const [first] = coords;
  let path = `M${first[0]},${first[1]}`;
  for (let index = 0; index < coords.length - 1; index += 1) {
    const previous = coords[index - 1] ?? coords[index];
    const current = coords[index];
    const next = coords[index + 1];
    const after = coords[index + 2] ?? next;
    const controlStart = [current[0] + (next[0] - previous[0]) / 6, current[1] + (next[1] - previous[1]) / 6];
    const controlEnd = [next[0] - (after[0] - current[0]) / 6, next[1] - (after[1] - current[1]) / 6];
    path += ` C${controlStart[0]},${controlStart[1]} ${controlEnd[0]},${controlEnd[1]} ${next[0]},${next[1]}`;
  }
  return path;
}

function AreaSpark({ points, color }) {
  const gradientId = useId();
  const width = 160;
  const height = 52;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const coords = points.map((point, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - ((point - min) / (max - min || 1)) * (height - 10) - 4;
    return [x, y];
  });
  const line = smoothLine(coords);
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 h-12 w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function MetricCard({ metric, rangeLabel, formatCount }) {
  const tone = METRIC_TONES[metric.id];
  const Icon = tone.icon;
  const up = metric.delta >= 0;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#EEF0F4] bg-white px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <p className="flex items-center gap-1.5 text-sm font-medium text-[#717171]">
          {metric.label}
          <span className="text-[#C4C4CC]" title={metric.hint}>
            <Info className="h-3.5 w-3.5" aria-label={metric.hint} />
          </span>
        </p>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: tone.soft, color: tone.color }}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 text-[1.75rem] font-extrabold leading-none tracking-tight text-[#0B1354]">
        {formatCount(metric.value).replace('k', 'K')}
      </p>
      <p className={clsx('mt-2 inline-flex items-center gap-1 text-xs font-semibold', up ? 'text-emerald-600' : 'text-rose-500')}>
        {up ? <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" /> : <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />}
        {up ? '+' : ''}
        {metric.delta}%
        <span className="font-medium text-[#A1A1AA]">vs. {rangeLabel.toLowerCase()}</span>
      </p>
      <AreaSpark points={metric.spark} color={tone.color} />
    </article>
  );
}

const CITY_ICONS = {
  Accra: Landmark,
  Dormaa: Building2,
  Madina: MapPin,
  'Cape Coast': Waves,
  Abelemkpe: Building2,
  'North Legon': Home,
};

function useSortedRows(rows) {
  const [sort, setSort] = useState('volume');
  const sorted = [...rows].sort((a, b) => (sort === 'name' ? a.label.localeCompare(b.label) : b.value - a.value));
  return { sort, setSort, sorted };
}

function VolumeMenu({ sort, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#E4E4E7] bg-white px-2.5 py-1.5 text-xs font-medium text-[#52525B] hover:border-[#D4D4D8]"
      >
        {sort === 'volume' ? 'By volume' : 'By name'}
        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      {open ? (
        <ul className="absolute right-0 z-20 mt-1 w-32 rounded-xl border border-[#EEF0F4] bg-white p-1 shadow-lg">
          {['volume', 'name'].map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={clsx(
                  'w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium',
                  sort === option ? 'bg-[#EFF6FF] text-primary' : 'text-[#3F3F46] hover:bg-[#F4F4F5]',
                )}
              >
                {option === 'volume' ? 'By volume' : 'By name'}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function BarRow({ marker, label, value, share, width, formatCount }) {
  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5">
      {marker}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-[#3F3F46]">{label}</p>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#EEF2FF]">
          <div className="h-full rounded-full bg-primary" style={{ width }} />
        </div>
      </div>
      <p className="w-16 shrink-0 text-right text-sm">
        <span className="font-bold text-[#0B1354]">{formatCount(value).replace('k', 'K')}</span>
        <span className="ml-1.5 text-xs font-medium text-[#A1A1AA]">{share}%</span>
      </p>
    </li>
  );
}

function RegionChart({ rows, formatCount }) {
  const { sort, setSort, sorted } = useSortedRows(rows);
  const ranked = [...rows].sort((a, b) => b.value - a.value);
  const max = ranked[0]?.value || 1;
  const total = rows.reduce((sum, row) => sum + row.value, 0);

  return (
    <article className="h-full rounded-2xl border border-[#EEF0F4] bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-primary">
            <Globe className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-bold text-[#0B1354]">Business by Region</h3>
            <p className="text-xs text-[#717171]">Geographic spread of customers across regions</p>
          </div>
        </div>
        <VolumeMenu sort={sort} onChange={setSort} />
      </div>
      <div className="grid items-center gap-4 sm:grid-cols-[220px_minmax(0,1fr)]">
        <div>
          <GhanaBusinessMap rows={rows} formatCount={formatCount} />
          <div className="mt-1 flex items-center gap-2 px-1 text-[10px] font-medium text-[#A1A1AA]">
            <span>{formatCount(Math.min(...rows.map((row) => row.value))).replace('k', 'K')}</span>
            <span className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-[#DBEAFE] to-primary" />
            <span>{formatCount(max).replace('k', 'K')}</span>
          </div>
        </div>
        <ol className="space-y-3">
          {sorted.map((row) => {
            const rank = ranked.findIndex((item) => item.label === row.label) + 1;
            const share = Math.round((row.value / total) * 100);
            return (
              <BarRow
                key={row.label}
                label={row.label}
                value={row.value}
                share={share}
                width={`${Math.max(8, (row.value / max) * 100)}%`}
                formatCount={formatCount}
                marker={
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EFF6FF] text-[11px] font-bold text-primary">
                    {rank}
                  </span>
                }
              />
            );
          })}
        </ol>
      </div>
    </article>
  );
}

function CityChart({ rows, formatCount }) {
  const { sort, setSort, sorted } = useSortedRows(rows);
  const max = Math.max(...rows.map((row) => row.value));
  const total = rows.reduce((sum, row) => sum + row.value, 0);

  return (
    <article className="h-full rounded-2xl border border-[#EEF0F4] bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-primary">
            <Building2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-bold text-[#0B1354]">Business by City/Town</h3>
            <p className="text-xs text-[#717171]">Customer concentration by city and town</p>
          </div>
        </div>
        <VolumeMenu sort={sort} onChange={setSort} />
      </div>
      <ul className="space-y-3.5">
        {sorted.map((row) => {
          const Icon = CITY_ICONS[row.label] ?? MapPin;
          const share = Math.round((row.value / total) * 100);
          return (
            <BarRow
              key={row.label}
              label={row.label}
              value={row.value}
              share={share}
              width={`${Math.max(8, (row.value / max) * 100)}%`}
              formatCount={formatCount}
              marker={
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F7FB] text-[#717171]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              }
            />
          );
        })}
      </ul>
    </article>
  );
}

const SLICE_COLORS = ['#2563EB', '#1D4ED8', '#60A5FA', '#38BDF8', '#93C5FD', '#BFDBFE'];

function CountryDonut({ rows, formatCount }) {
  const focus = useChartFocus();
  const wrapRef = useRef(null);
  const [pos, setPos] = useState({ x: 72, y: 16 });
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  let cursor = 0;
  const slices = rows.map((row, index) => {
    const length = total ? (row.value / total) * circumference : 0;
    const share = total ? Math.round((row.value / total) * 100) : 0;
    const slice = { ...row, color: SLICE_COLORS[index % SLICE_COLORS.length], dash: `${length} ${circumference - length}`, offset: -cursor, share };
    cursor += length;
    return slice;
  });
  const active = slices.find((slice) => slice.label === focus.active);

  const track = (event) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <article className={clsx('h-full rounded-2xl border border-[#EEF0F4] bg-white p-4 sm:p-5', focus.active && 'relative z-20')}>
      <h3 className="text-base font-bold text-[#0B1354]">Business by Country</h3>
      <p className="text-xs text-[#717171]">Who uses the service the most</p>
      <div className="mt-4 flex items-center gap-4">
        <div ref={wrapRef} className="relative h-36 w-36 shrink-0" onMouseMove={track} onMouseLeave={focus.leave}>
          <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90" role="img" aria-label="Businesses by country">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#F4F4F5" strokeWidth="14" />
            {slices.map((slice) => (
              <circle
                key={slice.label}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={focus.active === slice.label ? 16 : 14}
                strokeDasharray={slice.dash}
                strokeDashoffset={slice.offset}
                className="cursor-pointer transition-[stroke-width,opacity] duration-150"
                style={{ opacity: focus.dim(slice.label) ? 0.22 : 1 }}
                tabIndex={0}
                role="button"
                aria-pressed={focus.pinned === slice.label}
                aria-label={`${slice.label}: ${formatCount(slice.value)} (${slice.share}%)`}
                onMouseEnter={() => focus.enter(slice.label)}
                onFocus={() => focus.enter(slice.label)}
                onBlur={focus.leave}
                onClick={() => focus.toggle(slice.label)}
              />
            ))}
          </svg>
          {active ? (
            <div className="pointer-events-none absolute z-20" style={tooltipStyle(pos.x, pos.y)}>
              <ChartTooltip
                title={active.label}
                items={[
                  { label: 'Businesses', value: formatCount(active.value).replace('k', 'K') },
                  { label: 'Share', value: `${active.share}%` },
                ]}
              />
            </div>
          ) : null}
        </div>
        <ul className="min-w-0 flex-1 space-y-1">
          {slices.map((slice) => (
            <li key={slice.label}>
              <button
                type="button"
                className={clsx(
                  'flex w-full items-center justify-between gap-2 rounded-md px-1.5 py-1 text-sm transition-colors',
                  focus.active === slice.label ? 'bg-[#F4F7FB]' : 'hover:bg-[#F4F4F5]',
                )}
                aria-pressed={focus.pinned === slice.label}
                onMouseEnter={() => focus.enter(slice.label)}
                onMouseLeave={focus.leave}
                onClick={() => focus.toggle(slice.label)}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
                  <span className="truncate text-[#3F3F46]">{slice.label}</span>
                </span>
                <span className="shrink-0 font-semibold text-[#0B1354]">{formatCount(slice.value).replace('k', 'K')}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function TypeColumns({ rows, formatCount }) {
  const focus = useChartFocus();
  const max = Math.max(...rows.map((row) => row.value), 1);
  const sum = rows.reduce((acc, row) => acc + row.value, 0);

  return (
    <article className={clsx('h-full rounded-2xl border border-[#EEF0F4] bg-white p-4 sm:p-5', focus.active && 'relative z-20')}>
      <h3 className="text-base font-bold text-[#0B1354]">Business by Type</h3>
      <p className="text-xs text-[#717171]">Who uses the service the most</p>
      <div className="mt-4 flex h-52 items-end gap-2">
        {rows.map((row) => {
          const share = sum ? Math.round((row.value / sum) * 100) : 0;
          const selected = focus.active === row.label;
          return (
            <button
              key={row.label}
              type="button"
              className="relative flex h-full min-w-0 flex-1 flex-col justify-end"
              aria-pressed={focus.pinned === row.label}
              aria-label={`${row.label}: ${formatCount(row.value)} (${share}%)`}
              onMouseEnter={() => focus.enter(row.label)}
              onMouseLeave={focus.leave}
              onFocus={() => focus.enter(row.label)}
              onBlur={focus.leave}
              onClick={() => focus.toggle(row.label)}
            >
              <p className="mb-1 text-center text-[11px] font-semibold text-[#0B1354]">{formatCount(row.value).replace('k', 'K')}</p>
              <div className="flex min-h-0 flex-1 items-end">
                <div
                  className="w-full rounded-t-md bg-primary transition-opacity duration-150"
                  style={{ height: `${Math.max(8, (row.value / max) * 100)}%`, opacity: focus.dim(row.label) ? 0.28 : 1 }}
                />
              </div>
              <p className={clsx('mt-2 line-clamp-2 h-8 text-center text-[11px] font-medium leading-tight', selected ? 'text-[#0B1354]' : 'text-[#717171]')}>
                {row.label}
              </p>
              {selected ? (
                <span className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2">
                  <ChartTooltip
                    title={row.label}
                    items={[
                      { label: 'Businesses', value: formatCount(row.value).replace('k', 'K'), color: '#2563EB' },
                      { label: 'Share', value: `${share}%` },
                    ]}
                  />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </article>
  );
}

function chartScale(maxValue) {
  const headroom = Math.max(maxValue, 1) * 1.08;
  const step =
    headroom <= 50 ? 10 : headroom <= 120 ? 20 : headroom <= 260 ? 50 : headroom <= 600 ? 100 : headroom <= 1200 ? 200 : 500;
  const top = Math.ceil(headroom / step) * step;
  const ticks = [];
  for (let value = 0; value <= top; value += step) ticks.push(value);
  return { top, ticks };
}

function SignupChart({ growth }) {
  const focus = useChartFocus();
  const { top, ticks } = chartScale(Math.max(...growth.values));
  const sum = growth.values.reduce((acc, value) => acc + value, 0);
  const activeIndex = focus.active == null ? null : Number(focus.active);

  return (
    <article className={clsx('rounded-2xl border border-[#EEF0F4] bg-white p-4 sm:p-5', focus.active && 'relative z-20')}>
      <h3 className="text-base font-bold text-[#0B1354]">Business Signup Growth Over Time</h3>
      <p className="mt-0.5 text-xs text-[#717171]">Patterns in customer growth and distribution over time</p>

      <div className="mt-8 flex gap-2">
        <div className="relative h-56 w-8 shrink-0">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute right-0 -translate-y-1/2 text-[11px] tabular-nums text-[#A1A1AA]"
              style={{ bottom: `${(tick / top) * 100}%` }}
            >
              {tick}
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="relative h-56 overflow-visible border-b border-[#D4D4D8]">
            {ticks
              .filter((tick) => tick > 0)
              .map((tick) => (
                <span
                  key={tick}
                  className="pointer-events-none absolute inset-x-0 border-t border-dotted border-[#E4E4E7]"
                  style={{ bottom: `${(tick / top) * 100}%` }}
                />
              ))}
            <div className="absolute inset-x-1 bottom-0 top-0 flex items-end gap-2 sm:inset-x-2 sm:gap-4">
              {growth.values.map((value, index) => {
                const label = growth.labels[index];
                const selected = activeIndex === index;
                const share = sum ? Math.round((value / sum) * 100) : 0;
                return (
                  <button
                    key={label}
                    type="button"
                    className={clsx('relative flex h-full min-w-0 flex-1 items-end rounded-sm', selected && 'bg-[#F4F7FB]')}
                    aria-label={`${label}: ${value} signups`}
                    aria-pressed={focus.pinned === String(index)}
                    onMouseEnter={() => focus.enter(String(index))}
                    onMouseLeave={focus.leave}
                    onFocus={() => focus.enter(String(index))}
                    onBlur={focus.leave}
                    onClick={() => focus.toggle(String(index))}
                  >
                    {selected ? (
                      <span
                        className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2"
                        style={{ bottom: `calc(${(value / top) * 100}% + 8px)` }}
                      >
                        <ChartTooltip
                          title={label}
                          items={[
                            { label: 'Signups', value: String(value), color: '#2563EB' },
                            { label: 'Share of period', value: `${share}%` },
                          ]}
                        />
                      </span>
                    ) : null}
                    <span
                      className="block w-full bg-primary transition-opacity duration-150"
                      style={{ height: `${(value / top) * 100}%`, opacity: focus.dim(String(index)) ? 0.28 : 1 }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-2 flex gap-2 px-1 sm:gap-4 sm:px-2">
            {growth.labels.map((label, index) => (
              <span
                key={label}
                className={clsx(
                  'min-w-0 flex-1 text-center text-[11px] sm:text-xs',
                  activeIndex === index ? 'font-semibold text-[#0B1354]' : 'text-[#717171]',
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function Menu({ label, icon: Icon, open, onToggle, children, active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!ref.current?.contains(event.target)) onToggle(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') onToggle(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onToggle]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => onToggle(!open)}
        className={clsx(
          'inline-flex cursor-pointer items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-medium text-[#3F3F46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          active || open ? 'border-primary/40 text-primary' : 'border-[#E4E4E7] hover:border-[#D4D4D8]',
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
        <ChevronDown className={clsx('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-2xl border border-[#EEF0F4] bg-white p-3 shadow-[0_16px_40px_rgba(11,19,84,0.12)]">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFF6FF] text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-base font-bold text-[#0B1354]">{title}</h2>
        <p className="text-xs text-[#717171]">{subtitle}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const filterId = useId();
  const [range, setRange] = useState('30d');
  const [country, setCountry] = useState('all');
  const [type, setType] = useState('all');
  const [dateOpen, setDateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const data = useMemo(() => buildDashboard({ range, country, type }), [range, country, type]);
  const filtersActive = country !== 'all' || type !== 'all';
  const scopeLabel = [country, type].filter((item) => item !== 'all').join(' · ') || 'All businesses';
  const leader = data.regions[0];

  return (
    <div className="w-full px-3 py-3 sm:px-4 sm:py-4">
      <section className="rounded-3xl border border-white bg-white p-4 shadow-[0_10px_40px_rgba(11,19,84,0.06)] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionTitle
          icon={BarChart3}
          title="Business Overview"
          subtitle="Track your growth and performance at a glance"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Menu
            label={data.rangeLabel}
            icon={Calendar}
            open={dateOpen}
            onToggle={(next) => {
              setDateOpen(next);
              if (next) setFilterOpen(false);
            }}
          >
            <ul className="space-y-1">
              {DATE_RANGES.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setRange(item.id);
                      setDateOpen(false);
                    }}
                    className={clsx(
                      'w-full rounded-lg px-3 py-2 text-left text-sm font-medium',
                      range === item.id ? 'bg-[#EFF6FF] text-primary' : 'text-[#3F3F46] hover:bg-[#F4F4F5]',
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </Menu>
          <Menu
            label={scopeLabel}
            icon={Filter}
            open={filterOpen}
            active={filtersActive}
            onToggle={(next) => {
              setFilterOpen(next);
              if (next) setDateOpen(false);
            }}
          >
            <label className="mb-1 block text-xs font-semibold text-[#717171]" htmlFor={`${filterId}-country`}>
              Country
            </label>
            <select
              id={`${filterId}-country`}
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="mb-3 w-full rounded-lg border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#0B1354] outline-none focus:border-primary"
            >
              <option value="all">All countries</option>
              {FILTER_COUNTRIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <label className="mb-1 block text-xs font-semibold text-[#717171]" htmlFor={`${filterId}-type`}>
              Business type
            </label>
            <select
              id={`${filterId}-type`}
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="w-full rounded-lg border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#0B1354] outline-none focus:border-primary"
            >
              <option value="all">All types</option>
              {FILTER_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {filtersActive ? (
              <button
                type="button"
                onClick={() => {
                  setCountry('all');
                  setType('all');
                }}
                className="mt-3 text-xs font-semibold text-primary hover:underline"
              >
                Clear filters
              </button>
            ) : null}
          </Menu>
        </div>
      </div>

      <StaggerReveal className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06} when="load">
        {data.metrics.map((metric) => (
          <StaggerItem key={metric.id}>
            <MetricCard metric={metric} rangeLabel={data.rangeLabel} formatCount={data.formatCount} />
          </StaggerItem>
        ))}
      </StaggerReveal>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <SectionTitle
          icon={MapPin}
          title="Business Demographic Overview"
          subtitle="Insights into business composition across region and city or town"
        />
        <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#0B1354] shadow-sm ring-1 ring-[#EEF0F4]">
          <TrendingUp className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {leader.label} leads with {data.formatCount(leader.value).replace('k', 'K')} businesses
          <ChevronRight className="h-3.5 w-3.5 text-[#A1A1AA]" aria-hidden="true" />
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-5">
        <div className="h-full lg:col-span-3">
          <RegionChart rows={data.regions} formatCount={data.formatCount} />
        </div>
        <div className="h-full lg:col-span-2">
          <CityChart rows={data.cities} formatCount={data.formatCount} />
        </div>
      </div>

      <div className="mt-6">
        <SectionTitle
          icon={Layers}
          title="Business mix"
          subtitle="Who uses the service the most, by country and type"
        />
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <CountryDonut rows={data.countries} formatCount={data.formatCount} />
          <TypeColumns rows={data.types} formatCount={data.formatCount} />
        </div>
      </div>

      <div className="mt-6">
        <SignupChart growth={data.growth} />
      </div>
    </div>
  );
}
