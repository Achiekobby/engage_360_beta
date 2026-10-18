import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar,
  ChevronDown,
  Filter,
  Info,
  Layers,
  MapPin,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { PageHeading } from '../../components/layout/PageBackLink';
import { clsx } from 'clsx';
import { useAppSelector } from '../../store/hooks';
import {
  ANALYTICS_RANGES,
  CATEGORIES,
  COLLECTIONS,
  GENDERS,
  PROFILE_STATES,
  buildAnalytics,
  formatCount,
} from '../../components/businesses/analyticsData';
import { ChartTooltip, tooltipStyle, useChartFocus } from '../../components/charts/chartInteraction';

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
        <div className="absolute right-0 z-20 mt-2 w-64 admin-card rounded-2xl border border-[#EEF0F4] bg-white p-3 shadow-[0_16px_40px_rgba(11,19,84,0.12)]">
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

function MetricCard({ metric, rangeLabel }) {
  const up = metric.delta >= 0;

  return (
    <article className="admin-card rounded-2xl border border-[#EEF0F4] bg-white px-4 py-4">
      <p className="flex items-center gap-1.5 text-sm font-medium text-[#717171]">
        {metric.label}
        <span className="text-[#C4C4CC]" title={metric.hint}>
          <Info className="h-3.5 w-3.5" aria-label={metric.hint} />
        </span>
      </p>
      <p className="mt-2 text-[1.75rem] font-extrabold leading-none tracking-tight text-[#0B1354]">
        {formatCount(metric.value)}
      </p>
      <p className={clsx('mt-2 inline-flex items-center gap-1 text-xs font-semibold', up ? 'text-emerald-600' : 'text-rose-500')}>
        {up ? <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" /> : <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />}
        {up ? '+' : ''}
        {metric.delta}%
        <span className="font-medium text-[#A1A1AA]">vs. {rangeLabel.toLowerCase()}</span>
      </p>
    </article>
  );
}

function BarList({ title, subtitle, rows }) {
  const focus = useChartFocus();
  const max = Math.max(...rows.map((row) => row.value), 1);
  const sum = rows.reduce((acc, row) => acc + row.value, 0);

  return (
    <article className={clsx('admin-card h-full rounded-2xl border border-[#EEF0F4] bg-white p-4 sm:p-5', focus.active && 'relative z-20')}>
      <h3 className="text-base font-bold text-[#0B1354]">{title}</h3>
      <p className="text-xs text-[#717171]">{subtitle}</p>
      <ul className="mt-4 space-y-2">
        {rows.map((row) => {
          const share = sum ? Math.round((row.value / sum) * 100) : 0;
          const selected = focus.active === row.label;
          return (
            <li key={row.label}>
              <button
                type="button"
                className={clsx(
                  'relative grid w-full grid-cols-[8.5rem_minmax(0,1fr)_3.25rem] items-center gap-3 rounded-md px-1.5 py-1.5 text-left transition-colors',
                  selected ? 'bg-[#F4F7FB]' : 'hover:bg-[#F4F4F5]',
                )}
                aria-pressed={focus.pinned === row.label}
                onMouseEnter={() => focus.enter(row.label)}
                onMouseLeave={focus.leave}
                onFocus={() => focus.enter(row.label)}
                onBlur={focus.leave}
                onClick={() => focus.toggle(row.label)}
              >
                <span className="truncate text-sm text-[#3F3F46]">{row.label}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-[#F4F4F5]">
                  <span
                    className="block h-full rounded-full bg-primary transition-opacity duration-150"
                    style={{ width: `${Math.max(6, (row.value / max) * 100)}%`, opacity: focus.dim(row.label) ? 0.28 : 1 }}
                  />
                </span>
                <span className="text-right text-sm font-semibold text-[#0B1354]">{formatCount(row.value)}</span>
                {selected ? (
                  <span className="pointer-events-none absolute right-2 top-0 z-20 -translate-y-full">
                    <ChartTooltip
                      title={row.label}
                      items={[
                        { label: 'Customers', value: formatCount(row.value), color: '#2563EB' },
                        { label: 'Share', value: `${share}%` },
                      ]}
                    />
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function GenderDonut({ rows }) {
  const focus = useChartFocus();
  const wrapRef = useRef(null);
  const [pos, setPos] = useState({ x: 80, y: 20 });
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let cursor = 0;
  const slices = rows.map((row) => {
    const length = total ? (row.value / total) * circumference : 0;
    const share = total ? Math.round((row.value / total) * 100) : 0;
    const slice = { ...row, dash: `${length} ${circumference - length}`, offset: -cursor, share };
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
    <article className={clsx('admin-card h-full rounded-2xl border border-[#EEF0F4] bg-white p-4 sm:p-5', focus.active && 'relative z-20')}>
      <h3 className="text-base font-bold text-[#0B1354]">Customers by Gender</h3>
      <p className="text-xs text-[#717171]">Gender composition of the customer base</p>
      <div className="mt-5 flex items-center justify-center gap-8">
        <div ref={wrapRef} className="relative h-40 w-40" onMouseMove={track} onMouseLeave={focus.leave}>
          <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90" role="img" aria-label="Customers by gender">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="#F4F4F5" strokeWidth="18" />
            {slices.map((slice) => (
              <circle
                key={slice.label}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={focus.active === slice.label ? 20 : 18}
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
                  { label: 'Customers', value: formatCount(active.value) },
                  { label: 'Share', value: `${active.share}%` },
                ]}
              />
            </div>
          ) : null}
        </div>
        <ul className="space-y-1">
          {slices.map((slice) => (
            <li key={slice.label}>
              <button
                type="button"
                className={clsx(
                  'rounded-md px-1.5 py-1.5 text-left transition-colors',
                  focus.active === slice.label ? 'bg-[#F4F7FB]' : 'hover:bg-[#F4F4F5]',
                )}
                aria-pressed={focus.pinned === slice.label}
                onMouseEnter={() => focus.enter(slice.label)}
                onMouseLeave={focus.leave}
                onClick={() => focus.toggle(slice.label)}
              >
                <p className="flex items-center gap-2 text-sm text-[#3F3F46]">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                  {slice.label}
                </p>
                <p className="pl-[18px] text-sm font-semibold text-[#0B1354]">
                  {formatCount(slice.value)}
                  <span className="ml-1 font-medium text-[#A1A1AA]">{slice.share}%</span>
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function BusinessAnalyticsPage() {
  const { businessId } = useParams();
  const businesses = useAppSelector((state) => state.businesses.items);
  const scopedBusiness = businesses.find((item) => item.id === businessId) ?? null;
  const [range, setRange] = useState('30d');
  const [category, setCategory] = useState('all');
  const [collection, setCollection] = useState('all');
  const [gender, setGender] = useState('all');
  const [profile, setProfile] = useState('all');
  const [openMenu, setOpenMenu] = useState(null);

  const data = useMemo(
    () =>
      buildAnalytics({
        range,
        category,
        collection,
        gender,
        profile,
        businessCount: scopedBusiness ? 1 : businesses.length,
      }),
    [range, category, collection, gender, profile, businesses.length, scopedBusiness],
  );

  const categoryLabel = CATEGORIES.find((item) => item.id === category)?.label ?? 'All categories';
  const collectionLabel = COLLECTIONS.find((item) => item.id === collection)?.label ?? 'All collections';
  const advancedActive = gender !== 'all' || profile !== 'all';
  const advancedLabel = [GENDERS.find((item) => item.id === gender)?.label, PROFILE_STATES.find((item) => item.id === profile)?.label]
    .filter((label, index) => (index === 0 ? gender !== 'all' : profile !== 'all'))
    .join(' · ') || 'Advanced filter';

  const toggleMenu = (id) => (next) => setOpenMenu(next ? id : null);

  return (
    <div className="w-full px-3 py-3 sm:px-4 sm:py-4">
      <PageHeading
        title={scopedBusiness ? `${scopedBusiness.companyName} analytics` : 'Data Overview'}
        description={
          scopedBusiness
            ? `Customer records for ${scopedBusiness.companyName}`
            : 'Customer records across all businesses'
        }
        backTo="/businesses"
        backLabel="Business management"
        actions={
          <>
          <Menu
            label={categoryLabel}
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
                setOpenMenu(null);
              }}
            />
          </Menu>
          <Menu
            label={collectionLabel}
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
                setOpenMenu(null);
              }}
            />
          </Menu>
          <Menu
            label={advancedLabel}
            icon={Filter}
            open={openMenu === 'advanced'}
            onToggle={toggleMenu('advanced')}
            active={advancedActive}
          >
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-[#A1A1AA]">Gender</p>
            <OptionList items={GENDERS} value={gender} onChange={setGender} />
            <p className="mb-2 mt-3 px-1 text-[11px] font-semibold uppercase tracking-wide text-[#A1A1AA]">Profile</p>
            <OptionList items={PROFILE_STATES} value={profile} onChange={setProfile} />
          </Menu>
          <Menu
            label={data.rangeLabel}
            icon={Calendar}
            open={openMenu === 'date'}
            onToggle={toggleMenu('date')}
          >
            <OptionList
              items={ANALYTICS_RANGES}
              value={range}
              onChange={(id) => {
                setRange(id);
                setOpenMenu(null);
              }}
            />
          </Menu>
          </>
        }
      />

      <div className="mt-6">
        <SectionTitle icon={Users} title="Customer Overview" subtitle="Understanding your customers at a glance" />
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {data.metrics.filter((metric) => metric.id !== 'growth').map((metric) => (
            <MetricCard key={metric.id} metric={metric} rangeLabel={data.rangeLabel} />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <SectionTitle
          icon={MapPin}
          title="Customer Demographic Overview"
          subtitle="Insights into customer composition across location, age, and gender"
        />
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <BarList title="Customers by Region" subtitle="Geographic spread of customers across regions" rows={data.regions} />
          <GenderDonut rows={data.genders} />
          <BarList title="Customers by Age" subtitle="Distribution of customers across age segments" rows={data.ages} />
          <BarList title="Customers by Location" subtitle="Customer concentration by city and town" rows={data.locations} />
        </div>
      </div>

      <div className="mt-8">
        <SectionTitle
          icon={ShieldCheck}
          title="Data Quality Overview"
          subtitle="Assessment of data accuracy, consistency, and completeness"
        />
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {data.quality.map((item) => (
            <article key={item.id} className="admin-card rounded-2xl border border-[#EEF0F4] bg-white px-4 py-4">
              <p className="flex items-center gap-1.5 text-sm font-medium text-[#717171]">
                {item.label}
                <span className="text-[#C4C4CC]" title={item.hint}>
                  <Info className="h-3.5 w-3.5" aria-label={item.hint} />
                </span>
              </p>
              <p className="mt-2 text-[1.75rem] font-extrabold leading-none tracking-tight text-[#0B1354]">
                {formatCount(item.value)}
              </p>
              <p className="mt-2 text-xs font-medium text-[#A1A1AA]">{data.rangeLabel}</p>
              <span className="mt-3 block h-1 overflow-hidden rounded-full bg-[#F4F4F5]" aria-hidden="true">
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${Math.max(6, Math.round((item.value / data.metrics[0].value) * 100))}%`,
                    backgroundColor: item.tone,
                  }}
                />
              </span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
