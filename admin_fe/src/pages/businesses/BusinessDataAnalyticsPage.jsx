import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { Calendar, ChevronDown, Info, Layers, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { PageHeading } from '../../components/layout/PageBackLink';
import { clsx } from 'clsx';
import { useAppSelector } from '../../store/hooks';
import {
  ANALYTICS_RANGES,
  ANALYTICS_TABS,
  CATEGORIES,
  COLLECTIONS,
  buildAnalytics,
  formatCount,
} from '../../components/businesses/analyticsData';
import { ChartTooltip, tooltipStyle, useChartFocus, useSeriesVisibility } from '../../components/charts/chartInteraction';

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
          'inline-flex cursor-pointer items-center gap-2 rounded-full border bg-white px-3 py-2 text-sm font-medium text-[#3F3F46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          active || open ? 'border-primary/40 text-primary' : 'border-[#E4E4E7] hover:border-[#D4D4D8]',
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
        <ChevronDown className={clsx('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-56 admin-card rounded-2xl border border-[#EEF0F4] bg-white p-3 shadow-[0_16px_40px_rgba(11,19,84,0.12)]">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function OptionList({ items, value, onChange }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onChange(item.id)}
            className={clsx(
              'w-full rounded-lg px-3 py-2 text-left text-sm font-medium',
              value === item.id ? 'bg-[#EFF6FF] text-primary' : 'text-[#3F3F46] hover:bg-[#F4F4F5]',
            )}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

function MetricCard({ metric, rangeLabel }) {
  const up = metric.delta >= 0;
  const display = metric.unit === '%' ? `${metric.value}%` : formatCount(metric.value);

  return (
    <article className="admin-card rounded-2xl border border-[#EEF0F4] bg-white px-4 py-4">
      <p className="flex items-center gap-1.5 text-sm font-medium text-[#717171]">
        {metric.label}
        <span className="text-[#C4C4CC]" title={metric.hint}>
          <Info className="h-3.5 w-3.5" aria-label={metric.hint} />
        </span>
      </p>
      <p className="mt-2 text-[1.75rem] font-extrabold leading-none tracking-tight text-[#0B1354]">{display}</p>
      <p className={clsx('mt-2 inline-flex items-center gap-1 text-xs font-semibold', up ? 'text-emerald-600' : 'text-rose-500')}>
        {up ? <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" /> : <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />}
        {up ? '+' : ''}
        {metric.delta}%
        <span className="font-medium text-[#A1A1AA]">vs. {rangeLabel.toLowerCase()}</span>
      </p>
    </article>
  );
}

function GenderGauge({ rows }) {
  const focus = useChartFocus();
  const wrapRef = useRef(null);
  const [pos, setPos] = useState({ x: 100, y: 24 });
  const male = rows.find((row) => row.label === 'Male')?.value ?? 0;
  const female = rows.find((row) => row.label === 'Female')?.value ?? 0;
  const total = male + female;
  const maleShare = total ? male / total : 0;
  const femaleShare = total ? 1 - maleShare : 0;
  const radius = 72;
  const arc = Math.PI * radius;
  const maleArc = maleShare * arc;
  const segments = [
    { id: 'Male', label: 'Male', value: male, share: Math.round(maleShare * 100), color: '#2563EB', dash: `${maleArc} ${arc}`, offset: 0 },
    {
      id: 'Female',
      label: 'Female',
      value: female,
      share: Math.round(femaleShare * 100),
      color: '#0B1354',
      dash: `${femaleShare * arc} ${arc}`,
      offset: -maleArc,
    },
  ];
  const active = segments.find((item) => item.id === focus.active);

  const track = (event) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <article className="admin-card h-full rounded-2xl border border-[#EEF0F4] bg-white p-4 sm:p-5">
      <h3 className="text-base font-bold text-[#0B1354]">Gender Distribution</h3>
      <p className="text-xs text-[#717171]">Breakdown of customers by gender</p>
      <div className="mt-4 flex flex-col items-center">
        <div ref={wrapRef} className="relative w-full max-w-xs" onMouseMove={track} onMouseLeave={focus.leave}>
          <svg viewBox="0 0 200 118" className="h-36 w-full" role="img" aria-label="Gender distribution">
            <path d="M28 110 A 72 72 0 0 1 172 110" fill="none" stroke="#EEF0F4" strokeWidth="16" strokeLinecap="round" />
            {segments.map((item) => (
              <path
                key={item.id}
                d="M28 110 A 72 72 0 0 1 172 110"
                fill="none"
                stroke={item.color}
                strokeWidth={focus.active === item.id ? 18 : 16}
                strokeLinecap="butt"
                strokeDasharray={item.dash}
                strokeDashoffset={item.offset}
                className="cursor-pointer transition-[stroke-width,opacity] duration-150"
                style={{ opacity: focus.dim(item.id) ? 0.28 : 1 }}
                tabIndex={0}
                role="button"
                aria-pressed={focus.pinned === item.id}
                aria-label={`${item.label}: ${formatCount(item.value)} (${item.share}%)`}
                onMouseEnter={() => focus.enter(item.id)}
                onFocus={() => focus.enter(item.id)}
                onBlur={focus.leave}
                onClick={() => focus.toggle(item.id)}
              />
            ))}
          </svg>
          {active ? (
            <div className="pointer-events-none absolute z-20" style={tooltipStyle(pos.x, pos.y)}>
              <ChartTooltip
                title={active.label}
                items={[
                  { label: 'Customers', value: formatCount(active.value) },
                  { label: 'Share', value: `${active.share}%` },
                ]}
              />
            </div>
          ) : null}
        </div>
        <div className="mt-1 flex w-full max-w-xs justify-between px-4 text-sm font-semibold text-[#0B1354]">
          <span>{Math.round(maleShare * 100)}%</span>
          <span>{Math.round(femaleShare * 100)}%</span>
        </div>
        <ul className="mt-3 flex gap-5 text-sm">
          {segments.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={clsx(
                  'inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-[#717171] transition-colors',
                  focus.active === item.id ? 'bg-[#F4F7FB] text-[#0B1354]' : 'hover:bg-[#F4F4F5]',
                )}
                aria-pressed={focus.pinned === item.id}
                onMouseEnter={() => focus.enter(item.id)}
                onMouseLeave={focus.leave}
                onClick={() => focus.toggle(item.id)}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function AgeDonut({ rows }) {
  const focus = useChartFocus();
  const wrapRef = useRef(null);
  const [pos, setPos] = useState({ x: 80, y: 20 });
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const leader = rows[0];
  const colors = ['#2563EB', '#1D4ED8', '#60A5FA', '#38BDF8', '#93C5FD', '#BFDBFE'];
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  let cursor = 0;
  const slices = rows.map((row, index) => {
    const length = total ? (row.value / total) * circumference : 0;
    const share = total ? Math.round((row.value / total) * 100) : 0;
    const slice = { ...row, color: colors[index % colors.length], dash: `${length} ${circumference - length}`, offset: -cursor, share };
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
    <article className="admin-card h-full rounded-2xl border border-[#EEF0F4] bg-white p-4 sm:p-5">
      <h3 className="text-base font-bold text-[#0B1354]">Average Age</h3>
      <p className="text-xs text-[#717171]">Largest age group in this customer base</p>
      <div className="mt-4 flex items-center justify-center gap-6">
        <div ref={wrapRef} className="relative h-40 w-40" onMouseMove={track} onMouseLeave={focus.leave}>
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label="Age distribution">
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
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-lg font-bold text-[#0B1354]">
            {active?.label ?? leader?.label}
          </p>
          {active ? (
            <div className="pointer-events-none absolute z-20" style={tooltipStyle(pos.x, pos.y)}>
              <ChartTooltip
                title={active.label}
                items={[
                  { label: 'Customers', value: formatCount(active.value) },
                  { label: 'Share', value: `${active.share}%` },
                ]}
              />
            </div>
          ) : null}
        </div>
        <ul className="space-y-1 text-sm">
          {slices.slice(0, 4).map((slice) => (
            <li key={slice.label}>
              <button
                type="button"
                className={clsx(
                  'flex w-full items-center justify-between gap-4 rounded-md px-1.5 py-1 transition-colors',
                  focus.active === slice.label ? 'bg-[#F4F7FB]' : 'hover:bg-[#F4F4F5]',
                )}
                aria-pressed={focus.pinned === slice.label}
                onMouseEnter={() => {
                  setPos({ x: 80, y: 72 });
                  focus.enter(slice.label);
                }}
                onMouseLeave={focus.leave}
                onClick={() => focus.toggle(slice.label)}
              >
                <span className="flex items-center gap-2 text-[#3F3F46]">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: slice.color }} />
                  {slice.label}
                </span>
                <span className="font-semibold text-[#0B1354]">{slice.share}%</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function TrendChart({
  trends,
  title = 'Customers Distribution Trends',
  subtitle = 'Patterns in customer growth and distribution over time',
  color = '#2563EB',
  total,
}) {
  const focus = useChartFocus();
  const max = Math.max(...trends.values, 1);
  const sum = trends.values.reduce((acc, value) => acc + value, 0);
  const headroom = max * 1.08;
  const step = headroom <= 260 ? 50 : 100;
  const top = Math.ceil(headroom / step) * step;
  const ticks = [];
  for (let value = 0; value <= top; value += step) ticks.push(value);
  const activeIndex = focus.active == null ? null : Number(focus.active);

  return (
    <article className={clsx('admin-card rounded-2xl border border-[#EEF0F4] bg-white p-4 sm:p-5', focus.active && 'relative z-20')}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#0B1354]">{title}</h3>
          <p className="text-xs text-[#717171]">{subtitle}</p>
        </div>
        {total != null ? (
          <p className="text-right">
            <span className="block text-[11px] font-medium text-[#A1A1AA]">Total</span>
            <span className="text-sm font-bold text-[#0B1354]">{formatCount(total)}</span>
          </p>
        ) : null}
      </div>
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
              {trends.values.map((value, index) => {
                const label = trends.labels[index];
                const selected = activeIndex === index;
                const dimmed = focus.dim(String(index));
                const share = sum ? Math.round((value / sum) * 100) : 0;
                return (
                  <button
                    key={label}
                    type="button"
                    className={clsx('relative flex h-full min-w-0 flex-1 items-end rounded-sm', selected && 'bg-[#F4F7FB]')}
                    aria-label={`${label}: ${value} customers`}
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
                            { label: 'Customers', value: String(value), color },
                            { label: 'Share of period', value: `${share}%` },
                          ]}
                        />
                      </span>
                    ) : null}
                    <span
                      className="block w-full transition-opacity duration-150"
                      style={{ height: `${(value / top) * 100}%`, backgroundColor: color, opacity: dimmed ? 0.28 : 1 }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-2 flex gap-2 px-1 sm:gap-4 sm:px-2">
            {trends.labels.map((label, index) => (
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

function polar(cx, cy, radius, angle) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)];
}

function slicePath(cx, cy, radius, start, end) {
  if (end - start >= 359.9) {
    return `M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy + radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy - radius}`;
  }
  const [x1, y1] = polar(cx, cy, radius, start);
  const [x2, y2] = polar(cx, cy, radius, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
}

function PieCard({ title, subtitle, rows, colors }) {
  const focus = useChartFocus();
  const wrapRef = useRef(null);
  const [pos, setPos] = useState({ x: 80, y: 72 });
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  let cursor = 0;
  const slices = rows.map((row, index) => {
    const sweep = total ? (row.value / total) * 360 : 0;
    const slice = {
      ...row,
      color: row.color ?? colors[index % colors.length],
      start: cursor,
      end: cursor + sweep,
      share: total ? Math.round((row.value / total) * 100) : 0,
    };
    cursor += sweep;
    return slice;
  });
  const active = slices.find((slice) => slice.label === focus.active);

  const track = (event) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <article className={clsx('admin-card h-full rounded-2xl border border-[#EEF0F4] bg-white p-4 sm:p-5', focus.active && 'relative z-20')}>
      <h3 className="text-base font-bold text-[#0B1354]">{title}</h3>
      <p className="text-xs text-[#717171]">{subtitle}</p>
      <div className="mt-5 flex items-center gap-5">
        <div ref={wrapRef} className="relative h-40 w-40 shrink-0" onMouseMove={track} onMouseLeave={focus.leave}>
          <svg viewBox="0 0 160 160" className="h-40 w-40" role="img" aria-label={title}>
            {slices.map((slice) => (
              <path
                key={slice.label}
                d={slicePath(80, 80, 72, slice.start, slice.end)}
                fill={slice.color}
                className="cursor-pointer transition-opacity duration-150"
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
                  { label: 'Customers', value: formatCount(active.value), color: active.color },
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
                  'flex w-full items-center justify-between gap-3 rounded-md px-1.5 py-1 text-sm transition-colors',
                  focus.active === slice.label ? 'bg-[#F4F7FB]' : 'hover:bg-[#F4F4F5]',
                )}
                aria-pressed={focus.pinned === slice.label}
                onMouseEnter={() => {
                  setPos({ x: 80, y: 72 });
                  focus.enter(slice.label);
                }}
                onMouseLeave={focus.leave}
                onClick={() => focus.toggle(slice.label)}
              >
                <span className="flex min-w-0 items-center gap-2 text-[#3F3F46]">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
                  <span className="truncate">{slice.label}</span>
                </span>
                <span className="shrink-0 font-semibold text-[#0B1354]">{slice.share}%</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

const REGION_COLORS = ['#0F766E', '#1E3A5F', '#D97706', '#BE123C', '#CA8A04', '#78716C'];
const LOCATION_COLORS = ['#EA580C', '#111827', '#9F1239', '#EAB308', '#0D9488', '#7C2D12'];
const GENDER_COLORS = ['#0B1354', '#F59E0B'];
const AGE_COLORS = ['#2563EB', '#111827', '#F59E0B', '#E11D48', '#0F766E', '#A8A29E'];

function FilterBar({ title, subtitle, data, range, setRange, category, setCategory, collection, setCollection, openMenu, toggleMenu }) {
  return (
    <section className="admin-card mt-4 rounded-2xl border border-[#EEF0F4] bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0B1354]">{title}</h2>
          <p className="mt-0.5 text-sm text-[#717171]">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Menu label={data.rangeLabel} icon={Calendar} open={openMenu === 'date'} onToggle={toggleMenu('date')}>
            <OptionList
              items={ANALYTICS_RANGES}
              value={range}
              onChange={(id) => {
                setRange(id);
                toggleMenu(null)(false);
              }}
            />
          </Menu>
          <Menu
            label={CATEGORIES.find((item) => item.id === category)?.label ?? 'All categories'}
            icon={Layers}
            open={openMenu === 'category'}
            onToggle={toggleMenu('category')}
            active={category !== 'all'}
          >
            <OptionList
              items={CATEGORIES}
              value={category}
              onChange={(id) => {
                setCategory(id);
                toggleMenu(null)(false);
              }}
            />
          </Menu>
          <Menu
            label={COLLECTIONS.find((item) => item.id === collection)?.label ?? 'All collections'}
            icon={Users}
            open={openMenu === 'collection'}
            onToggle={toggleMenu('collection')}
            active={collection !== 'all'}
          >
            <OptionList
              items={COLLECTIONS}
              value={collection}
              onChange={(id) => {
                setCollection(id);
                toggleMenu(null)(false);
              }}
            />
          </Menu>
        </div>
      </div>
    </section>
  );
}

function GroupedTrendChart({ title, subtitle, growth }) {
  const focus = useChartFocus();
  const visibility = useSeriesVisibility(growth.series.map((series) => series.id));
  const visibleSeries = growth.series.filter((series) => !visibility.isHidden(series.id));
  const max = Math.max(...visibleSeries.flatMap((series) => series.values), 1);
  const headroom = max * 1.08;
  const step = headroom <= 260 ? 50 : 100;
  const top = Math.ceil(headroom / step) * step;
  const ticks = [];
  for (let value = 0; value <= top; value += step) ticks.push(value);
  const activeMonth = focus.active == null ? null : Number(String(focus.active).split(':')[0]);
  const activeSeries = focus.active == null ? null : String(focus.active).split(':')[1] ?? null;

  return (
    <article className={clsx('admin-card rounded-2xl border border-[#EEF0F4] bg-white p-4 sm:p-5', focus.active && 'relative z-20')}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#0B1354]">{title}</h3>
          <p className="text-xs text-[#717171]">{subtitle}</p>
        </div>
        <ul className="flex flex-wrap gap-2 text-xs font-medium text-[#52525B]">
          {growth.series.map((series) => {
            const hidden = visibility.isHidden(series.id);
            return (
              <li key={series.id}>
                <button
                  type="button"
                  className={clsx(
                    'inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors',
                    hidden ? 'opacity-40' : 'hover:bg-[#F4F4F5]',
                    focus.active?.endsWith(`:${series.id}`) && 'bg-[#F4F7FB] text-[#0B1354]',
                  )}
                  aria-pressed={!hidden}
                  onClick={() => visibility.toggle(series.id)}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: series.color }} />
                  {series.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
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
            <div className="absolute inset-x-1 bottom-0 top-0 flex items-end gap-1 sm:inset-x-2 sm:gap-2">
              {growth.labels.map((label, index) => {
                const selected = activeMonth === index;
                const peak = Math.max(...visibleSeries.map((series) => series.values[index]), 0);
                return (
                  <div
                    key={label}
                    className={clsx(
                      'relative flex h-full min-w-0 flex-1 items-end justify-center gap-0.5 rounded-sm',
                      selected && 'bg-[#F4F7FB]',
                    )}
                    onMouseEnter={() => focus.enter(`${index}:`)}
                    onMouseLeave={focus.leave}
                  >
                    {selected ? (
                      <span
                        className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2"
                        style={{ bottom: `calc(${(peak / top) * 100}% + 8px)` }}
                      >
                        <ChartTooltip
                          title={label}
                          items={visibleSeries.map((series) => ({
                            label: series.label,
                            color: series.color,
                            value: String(series.values[index]),
                            muted: activeSeries && activeSeries !== series.id,
                          }))}
                        />
                      </span>
                    ) : null}
                    {visibleSeries.map((series) => (
                      <button
                        key={series.id}
                        type="button"
                        className="w-full max-w-3 self-end transition-opacity duration-150"
                        style={{
                          height: `${(series.values[index] / top) * 100}%`,
                          backgroundColor: series.color,
                          opacity: activeSeries && activeSeries !== series.id ? 0.28 : 1,
                        }}
                        aria-label={`${label} ${series.label}: ${series.values[index]}`}
                        onMouseEnter={() => focus.enter(`${index}:${series.id}`)}
                        onFocus={() => focus.enter(`${index}:${series.id}`)}
                        onBlur={focus.leave}
                        onClick={() => focus.toggle(`${index}:${series.id}`)}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-2 flex gap-1 px-1 sm:gap-2 sm:px-2">
            {growth.labels.map((label, index) => (
              <span
                key={label}
                className={clsx(
                  'min-w-0 flex-1 text-center text-[11px] sm:text-xs',
                  activeMonth === index ? 'font-semibold text-[#0B1354]' : 'text-[#717171]',
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

const CHURN_COLORS = ['#0F766E', '#E11D48', '#111827'];
const CATEGORY_COLORS = ['#EA580C', '#111827', '#F43F5E', '#F59E0B', '#FDE68A', '#7C2D12', '#57534E'];
const SUBCATEGORY_COLORS = ['#F59E0B', '#0F172A', '#9F1239', '#FB7185', '#FDE68A'];
const SEGMENT_COLORS = ['#EA580C', '#0B1354', '#FB7185', '#FDE68A', '#7C2D12'];

function ValidityRing({ title, subtitle, total, validLabel, invalidLabel, validShare, validColor, invalidColor }) {
  const focus = useChartFocus();
  const wrapRef = useRef(null);
  const [pos, setPos] = useState({ x: 80, y: 20 });
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const validLength = (validShare / 100) * circumference;
  const invalidShare = 100 - validShare;
  const validCount = Math.round(total * (validShare / 100));
  const invalidCount = total - validCount;
  const items = [
    { id: 'valid', label: validLabel, value: validCount, share: validShare, color: validColor },
    { id: 'invalid', label: invalidLabel, value: invalidCount, share: invalidShare, color: invalidColor },
  ];
  const active = items.find((item) => item.id === focus.active);

  const track = (event) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <article className="admin-card h-full rounded-2xl border border-[#EEF0F4] bg-white p-4 sm:p-5">
      <h3 className="text-base font-bold text-[#0B1354]">{title}</h3>
      <p className="text-xs text-[#717171]">{subtitle}</p>
      <div className="mt-5 flex items-center gap-6">
        <div ref={wrapRef} className="relative h-40 w-40 shrink-0" onMouseMove={track} onMouseLeave={focus.leave}>
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={title}>
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={invalidColor}
              strokeWidth={focus.active === 'invalid' ? 16 : 14}
              className="cursor-pointer transition-[stroke-width,opacity] duration-150"
              style={{ opacity: focus.dim('invalid') ? 0.28 : 1 }}
              tabIndex={0}
              role="button"
              aria-pressed={focus.pinned === 'invalid'}
              aria-label={`${invalidLabel}: ${formatCount(invalidCount)} (${invalidShare}%)`}
              onMouseEnter={() => focus.enter('invalid')}
              onFocus={() => focus.enter('invalid')}
              onBlur={focus.leave}
              onClick={() => focus.toggle('invalid')}
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={validColor}
              strokeWidth={focus.active === 'valid' ? 16 : 14}
              strokeDasharray={`${validLength} ${circumference}`}
              strokeLinecap="butt"
              className="cursor-pointer transition-[stroke-width,opacity] duration-150"
              style={{ opacity: focus.dim('valid') ? 0.28 : 1 }}
              tabIndex={0}
              role="button"
              aria-pressed={focus.pinned === 'valid'}
              aria-label={`${validLabel}: ${formatCount(validCount)} (${validShare}%)`}
              onMouseEnter={() => focus.enter('valid')}
              onFocus={() => focus.enter('valid')}
              onBlur={focus.leave}
              onClick={() => focus.toggle('valid')}
            />
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[11px] font-medium text-[#A1A1AA]">Total</p>
            <p className="text-lg font-bold text-[#0B1354]">{formatCount(total)}</p>
          </div>
          {active ? (
            <div className="pointer-events-none absolute z-20" style={tooltipStyle(pos.x, pos.y)}>
              <ChartTooltip
                title={active.label}
                items={[
                  { label: 'Customers', value: formatCount(active.value) },
                  { label: 'Share', value: `${active.share}%` },
                ]}
              />
            </div>
          ) : null}
        </div>
        <ul className="space-y-1 text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={clsx(
                  'w-full rounded-md px-1.5 py-1.5 text-left transition-colors',
                  focus.active === item.id ? 'bg-[#F4F7FB]' : 'hover:bg-[#F4F4F5]',
                )}
                aria-pressed={focus.pinned === item.id}
                onMouseEnter={() => focus.enter(item.id)}
                onMouseLeave={focus.leave}
                onClick={() => focus.toggle(item.id)}
              >
                <p className="flex items-center gap-2 text-[#3F3F46]">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label}
                </p>
                <p className="pl-[18px] font-semibold text-[#0B1354]">{item.share}%</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function QualityRing({ title, subtitle, total, count, share, color, track }) {
  const focus = useChartFocus();
  const wrapRef = useRef(null);
  const [pos, setPos] = useState({ x: 72, y: 16 });
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const length = (Math.min(share, 100) / 100) * circumference;
  const remaining = Math.max(0, total - count);
  const open = focus.active === 'ring';

  const trackPointer = (event) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <article className="admin-card h-full rounded-2xl border border-[#EEF0F4] bg-white p-4 sm:p-5">
      <h3 className="text-base font-bold text-[#0B1354]">{title}</h3>
      <p className="text-xs text-[#717171]">{subtitle}</p>
      <div className="mt-5 flex items-center gap-5">
        <div
          ref={wrapRef}
          className="relative h-36 w-36 shrink-0 cursor-pointer"
          onMouseMove={trackPointer}
          onMouseEnter={() => focus.enter('ring')}
          onMouseLeave={focus.leave}
          onClick={() => focus.toggle('ring')}
        >
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={title}>
            <circle cx="60" cy="60" r={radius} fill="none" stroke={track} strokeWidth="14" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={open ? 16 : 14}
              strokeDasharray={`${length} ${circumference}`}
              className="transition-[stroke-width] duration-150"
            />
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[11px] font-medium text-[#A1A1AA]">Flagged</p>
            <p className="text-lg font-bold text-[#0B1354]">{formatCount(count)}</p>
          </div>
          {open ? (
            <div className="pointer-events-none absolute z-20" style={tooltipStyle(pos.x, pos.y)}>
              <ChartTooltip
                title={title}
                items={[
                  { label: 'Flagged', value: formatCount(count), color },
                  { label: 'Share', value: `${share}%` },
                  { label: 'Remaining', value: formatCount(remaining) },
                ]}
              />
            </div>
          ) : null}
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight text-[#0B1354]">{share}%</p>
          <p className="mt-1 text-xs text-[#717171]">of {formatCount(total)} records</p>
        </div>
      </div>
    </article>
  );
}

function RateRing({ title, subtitle, caption, display, share, color, track, items }) {
  const focus = useChartFocus();
  const wrapRef = useRef(null);
  const [pos, setPos] = useState({ x: 80, y: 16 });
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const length = (Math.min(share, 100) / 100) * circumference;
  const open = focus.active === 'ring';
  const tipItems = items ?? [
    { label: caption, value: display, color },
    { label: 'Remainder', value: `${Math.max(0, 100 - share)}%` },
  ];

  const trackPointer = (event) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  return (
    <article className="admin-card h-full rounded-2xl border border-[#EEF0F4] bg-white p-4 sm:p-5">
      <h3 className="text-base font-bold text-[#0B1354]">{title}</h3>
      <p className="text-xs text-[#717171]">{subtitle}</p>
      <div className="mt-6 flex justify-center">
        <div
          ref={wrapRef}
          className="relative h-40 w-40 cursor-pointer"
          onMouseMove={trackPointer}
          onMouseEnter={() => focus.enter('ring')}
          onMouseLeave={focus.leave}
          onClick={() => focus.toggle('ring')}
        >
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={title}>
            <circle cx="60" cy="60" r={radius} fill="none" stroke={track} strokeWidth="14" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={open ? 16 : 14}
              strokeDasharray={`${length} ${circumference}`}
              className="transition-[stroke-width] duration-150"
            />
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[11px] font-medium text-[#A1A1AA]">{caption}</p>
            <p className="text-xl font-bold tracking-tight text-[#0B1354]">{display}</p>
          </div>
          {open ? (
            <div className="pointer-events-none absolute z-20" style={tooltipStyle(pos.x, pos.y)}>
              <ChartTooltip title={title} items={tipItems} />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function BusinessDataAnalyticsPage() {
  const { businessId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const businesses = useAppSelector((state) => state.businesses.items);
  const business = businesses.find((item) => item.id === businessId) ?? null;
  const tab = ANALYTICS_TABS.some((item) => item.id === searchParams.get('tab')) ? searchParams.get('tab') : 'customer';

  const [range, setRange] = useState('30d');
  const [category, setCategory] = useState('all');
  const [collection, setCollection] = useState('all');
  const [openMenu, setOpenMenu] = useState(null);

  const data = useMemo(
    () => buildAnalytics({ range, category, collection, gender: 'all', profile: 'all', businessCount: 1 }),
    [range, category, collection],
  );

  if (!business) return <Navigate to="/businesses" replace />;

  const toggleMenu = (id) => (next) => setOpenMenu(next ? id : null);
  const setTab = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id === 'customer') next.delete('tab');
    else next.set('tab', id);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="w-full px-3 py-3 sm:px-4 sm:py-4">
      <PageHeading
        title={`${business.companyName} analytics`}
        description="Customer, demographic, and category performance for this business."
        backTo="/businesses"
        backLabel="Business management"
      />

      <div className="mt-3 overflow-x-auto admin-card rounded-2xl border border-[#EEF0F4] bg-white p-1.5">
        <div role="tablist" aria-label="Analytics sections" className="flex min-w-max gap-1">
          {ANALYTICS_TABS.map((item) => {
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(item.id)}
                className={clsx(
                  'rounded-xl px-3.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                  selected
                    ? 'bg-primary font-semibold text-white shadow-[0_6px_16px_rgba(37,99,235,0.22)]'
                    : 'font-medium text-[#52525B] hover:bg-[#F4F7FB] hover:text-[#0B1354]',
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {tab === 'customer' ? (
        <>
          <FilterBar
            title="Overall Data Health"
            subtitle={`High-level view of ${business.companyName} customer data`}
            data={data}
            range={range}
            setRange={setRange}
            category={category}
            setCategory={setCategory}
            collection={collection}
            setCollection={setCollection}
            openMenu={openMenu}
            toggleMenu={toggleMenu}
          />
          <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-5">
            {data.metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} rangeLabel={data.rangeLabel} />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <GenderGauge rows={data.genders} />
            <AgeDonut rows={data.ages} />
          </div>
          <div className="mt-3">
            <TrendChart trends={data.trends} />
          </div>
        </>
      ) : tab === 'demographic' ? (
        <>
          <FilterBar
            title="Demographic Overview"
            subtitle="Insights into customer composition across location, age, and gender"
            data={data}
            range={range}
            setRange={setRange}
            category={category}
            setCategory={setCategory}
            collection={collection}
            setCollection={setCollection}
            openMenu={openMenu}
            toggleMenu={toggleMenu}
          />
          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <PieCard
              title="Customers by Region"
              subtitle="Geographic spread of customers across regions"
              rows={data.regions}
              colors={REGION_COLORS}
            />
            <PieCard
              title="Customers by Location"
              subtitle="Customer concentration by city and town"
              rows={data.locations}
              colors={LOCATION_COLORS}
            />
            <PieCard
              title="Customers by Gender"
              subtitle="Gender composition of your customer base"
              rows={data.genders}
              colors={GENDER_COLORS}
            />
            <PieCard
              title="Customers by Age Group"
              subtitle="Distribution of customers across age segments"
              rows={data.ages}
              colors={AGE_COLORS}
            />
          </div>
        </>
      ) : tab === 'category' ? (
        <>
          <FilterBar
            title="Category & Segment"
            subtitle="Understanding customer interests and segmentation patterns"
            data={data}
            range={range}
            setRange={setRange}
            category={category}
            setCategory={setCategory}
            collection={collection}
            setCollection={setCollection}
            openMenu={openMenu}
            toggleMenu={toggleMenu}
          />
          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <PieCard
              title="Customers by Category"
              subtitle="Customer distribution across interest categories"
              rows={data.interestCategories}
              colors={CATEGORY_COLORS}
            />
            <PieCard
              title="Customers by Sub-category"
              subtitle="Detailed view of customer preferences within categories"
              rows={data.subcategories}
              colors={SUBCATEGORY_COLORS}
            />
            <PieCard
              title="Customers by Customer Segment"
              subtitle="Segmentation of customers based on profile and behavior"
              rows={data.segments}
              colors={SEGMENT_COLORS}
            />
          </div>
          <div className="mt-3">
            <GroupedTrendChart
              title="Segment Growth Over Time"
              subtitle="Tracking new, active, and inactive customers by month"
              growth={data.segmentGrowth}
            />
          </div>
        </>
      ) : tab === 'contact' ? (
        <>
          <FilterBar
            title="Contactability & Reachability"
            subtitle="Evaluation of how effectively customers can be reached across channels"
            data={data}
            range={range}
            setRange={setRange}
            category={category}
            setCategory={setCategory}
            collection={collection}
            setCollection={setCollection}
            openMenu={openMenu}
            toggleMenu={toggleMenu}
          />
          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <ValidityRing
              title="Customers with valid & invalid number"
              subtitle="Assessment of phone number validity for outreach"
              total={data.contact.phone.total}
              validLabel="Valid phone numbers"
              invalidLabel="Invalid phone numbers"
              validShare={data.contact.phone.validShare}
              validColor="#0D9488"
              invalidColor="#FDE68A"
            />
            <ValidityRing
              title="Customers with valid & invalid email"
              subtitle="Email data accuracy and deliverability overview"
              total={data.contact.email.total}
              validLabel="Valid email addresses"
              invalidLabel="Invalid email addresses"
              validShare={data.contact.email.validShare}
              validColor="#EA580C"
              invalidColor="#FFE4D6"
            />
          </div>
          <div className="mt-3">
            <TrendChart
              title="Customers Ready for Campaign"
              subtitle="Customers eligible and reachable for campaigns"
              trends={data.contact.campaignReady.trends}
              total={data.contact.campaignReady.total}
              color="#2563EB"
            />
          </div>
        </>
      ) : tab === 'quality' ? (
        <>
          <FilterBar
            title="Data Quality"
            subtitle="Assessment of data accuracy, consistency, and completeness"
            data={data}
            range={range}
            setRange={setRange}
            category={category}
            setCategory={setCategory}
            collection={collection}
            setCollection={setCollection}
            openMenu={openMenu}
            toggleMenu={toggleMenu}
          />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <QualityRing
              title="Profiles with missing fields"
              subtitle="Identification of incomplete customer records"
              total={data.contact.phone.total}
              count={data.qualityOverview.missing.count}
              share={data.qualityOverview.missing.share}
              color="#D97706"
              track="#FEF3C7"
            />
            <QualityRing
              title="Duplicate customers detected"
              subtitle="Detection of repeated or duplicate profiles"
              total={data.contact.phone.total}
              count={data.qualityOverview.duplicates.count}
              share={data.qualityOverview.duplicates.share}
              color="#BE123C"
              track="#FCE7F3"
            />
            <QualityRing
              title="Invalid phone numbers"
              subtitle="Customers with incorrect or unusable phone numbers"
              total={data.contact.phone.total}
              count={data.qualityOverview.phones.count}
              share={data.qualityOverview.phones.share}
              color="#0D9488"
              track="#CCFBF1"
            />
            <QualityRing
              title="Invalid email addresses"
              subtitle="Customers with invalid or undeliverable emails"
              total={data.contact.phone.total}
              count={data.qualityOverview.emails.count}
              share={data.qualityOverview.emails.share}
              color="#EA580C"
              track="#FFEDD5"
            />
          </div>
          <div className="mt-3">
            <TrendChart
              title="Profile Completion Rate"
              subtitle="Fully completed customer profiles over time"
              trends={data.qualityOverview.completion}
              color="#16A34A"
            />
          </div>
        </>
      ) : tab === 'distribution' ? (
        <>
          <FilterBar
            title="Customer Distribution"
            subtitle="Analysis of how customers are spread and growing across key dimensions"
            data={data}
            range={range}
            setRange={setRange}
            category={category}
            setCategory={setCategory}
            collection={collection}
            setCollection={setCollection}
            openMenu={openMenu}
            toggleMenu={toggleMenu}
          />
          <div className="mt-4 space-y-3">
            <GroupedTrendChart
              title="Region Growth Trends"
              subtitle="Customer growth patterns across regions over time"
              growth={data.distributionGrowth.region}
            />
            <GroupedTrendChart
              title="Location Growth Trends"
              subtitle="Expansion trends across cities and towns"
              growth={data.distributionGrowth.location}
            />
            <GroupedTrendChart
              title="Age Group Growth Trends"
              subtitle="Changes in customer age distribution over time"
              growth={data.distributionGrowth.age}
            />
          </div>
        </>
      ) : (
        <>
          <FilterBar
            title="Churn & Retention"
            subtitle="Insights into customer loyalty, engagement levels, and risk of attrition"
            data={data}
            range={range}
            setRange={setRange}
            category={category}
            setCategory={setCategory}
            collection={collection}
            setCollection={setCollection}
            openMenu={openMenu}
            toggleMenu={toggleMenu}
          />
          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <PieCard
              title="Active vs At-Risk vs Churn Customers"
              subtitle="Customer lifecycle status and engagement levels"
              rows={data.churn.lifecycle}
              colors={CHURN_COLORS}
            />
            <RateRing
              title="Retention Rate"
              subtitle="Percentage of customers retained over time"
              caption="Rate"
              display={`${data.churn.retentionRate}%`}
              share={data.churn.retentionRate}
              color="#16A34A"
              track="#DCFCE7"
            />
            <RateRing
              title="Churn Rate"
              subtitle="Rate at which customers stop engaging"
              caption="Rate"
              display={`${data.churn.churnRate}%`}
              share={data.churn.churnRate}
              color="#BE123C"
              track="#FCE7F3"
            />
            <RateRing
              title="Inactive Customers"
              subtitle="Customers with no recent activity or engagement"
              caption="Total"
              display={formatCount(data.churn.inactive)}
              share={data.churn.inactiveShare}
              color="#1E3A5F"
              track="#E2E8F0"
            />
          </div>
        </>
      )}
    </div>
  );
}
