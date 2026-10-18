import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Building2, Calendar, ChevronDown } from 'lucide-react';
import { PageHeading } from '../../components/layout/PageBackLink';
import { clsx } from 'clsx';
import { useAppSelector } from '../../store/hooks';
import { ChartTooltip, useChartFocus } from '../../components/charts/chartInteraction';
import { CAMPAIGN_CATEGORIES, getCampaigns } from '../../components/campaigns/campaignData';
import { PROMO_RANGES, buildCategoryAnalytics } from '../../components/campaigns/promotionAnalytics';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'engagement', label: 'Engagement & Conversions' },
];

function chartScale(maxValue) {
  const headroom = Math.max(maxValue, 1) * 1.08;
  const step =
    headroom <= 50 ? 10 : headroom <= 120 ? 20 : headroom <= 260 ? 50 : headroom <= 600 ? 100 : 200;
  const top = Math.ceil(headroom / step) * step;
  const ticks = [];
  for (let value = 0; value <= top; value += step) ticks.push(value);
  return { top, ticks };
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
          'inline-flex cursor-pointer items-center gap-2 rounded-full border bg-white px-3 py-2 text-sm font-medium text-[#3F3F46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          active || open ? 'border-primary/40 text-primary' : 'border-[#E4E4E7] hover:border-[#D4D4D8]',
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
        <ChevronDown className={clsx('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute left-0 z-20 mt-2 w-60 admin-card rounded-xl border border-[#EEF0F4] bg-white p-2 shadow-[0_16px_40px_rgba(11,19,84,0.12)]">
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

function TrendChart({ chart }) {
  const focus = useChartFocus();
  const { top, ticks } = chartScale(Math.max(...chart.values, 1));
  const sum = chart.values.reduce((total, value) => total + value, 0);
  const activeIndex = focus.active == null ? null : Number(focus.active);

  return (
    <article className={clsx('admin-card rounded-xl border border-[#EEF0F4] bg-white p-4 sm:p-5', focus.active && 'relative z-20')}>
      <h2 className="text-base font-bold text-[#0B1354]">{chart.title}</h2>
      <p className="mt-0.5 text-xs text-[#717171]">{chart.subtitle}</p>
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
            <div className="absolute inset-x-1 bottom-0 top-0 flex items-end gap-2 sm:inset-x-2 sm:gap-3">
              {chart.values.map((value, index) => {
                const label = chart.labels[index];
                const selected = activeIndex === index;
                const share = sum ? Math.round((value / sum) * 100) : 0;
                return (
                  <button
                    key={label}
                    type="button"
                    className={clsx('relative flex h-full min-w-0 flex-1 items-end rounded-sm', selected && 'bg-[#F4F7FB]')}
                    aria-label={`${label}: ${value} ${chart.unit}`}
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
                            { label: chart.unit, value: chart.unit === '%' ? `${value}%` : String(value), color: chart.color },
                            { label: 'Share of period', value: `${share}%` },
                          ]}
                        />
                      </span>
                    ) : null}
                    <span
                      className="block w-full transition-opacity duration-150"
                      style={{
                        height: `${(value / top) * 100}%`,
                        backgroundColor: chart.color,
                        opacity: focus.dim(String(index)) ? 0.28 : 1,
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-2 flex gap-2 px-1 sm:gap-3 sm:px-2">
            {chart.labels.map((label, index) => (
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

export default function PromotionAnalyticsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const businesses = useAppSelector((state) => state.businesses.items);
  const campaigns = useMemo(() => getCampaigns(), []);
  const [dateOpen, setDateOpen] = useState(false);
  const [businessOpen, setBusinessOpen] = useState(false);

  const categoryId = CAMPAIGN_CATEGORIES.some((item) => item.id === searchParams.get('category'))
    ? searchParams.get('category')
    : 'promotions';
  const category = CAMPAIGN_CATEGORIES.find((item) => item.id === categoryId);
  const rangeId = PROMO_RANGES.some((item) => item.id === searchParams.get('range'))
    ? searchParams.get('range')
    : '30d';
  const businessId = searchParams.get('business') || 'all';
  const tab = searchParams.get('tab') === 'engagement' ? 'engagement' : 'overview';

  const scopedBusinessIds = useMemo(
    () => new Set(campaigns.filter((item) => item.category === categoryId).map((item) => item.businessId)),
    [campaigns, categoryId],
  );
  const businessOptions = useMemo(
    () => [
      { id: 'all', label: 'All businesses' },
      ...businesses
        .filter((item) => scopedBusinessIds.has(item.id))
        .map((item) => ({ id: item.id, label: item.companyName })),
    ],
    [businesses, scopedBusinessIds],
  );

  const data = useMemo(
    () => buildCategoryAnalytics({ campaigns, categoryId, businessId, rangeId }),
    [businessId, campaigns, categoryId, rangeId],
  );

  const setParam = (key, value, fallback) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === fallback) next.delete(key);
    else next.set(key, value);
    next.set('category', categoryId);
    setSearchParams(next, { replace: true });
  };

  if (category?.comingSoon) {
    return <Navigate to={`/campaigns?category=${categoryId}`} replace />;
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageHeading
        title={`${category?.label ?? 'Campaign'} analytics`}
        description={`Lifetime and period performance across ${(category?.label ?? 'campaign').toLowerCase()} campaigns.`}
        backTo={`/campaigns?category=${categoryId}`}
        backLabel={category?.label ?? 'Campaigns'}
      />

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Menu
            label={PROMO_RANGES.find((item) => item.id === rangeId)?.label ?? 'Date filter'}
            icon={Calendar}
            open={dateOpen}
            onToggle={setDateOpen}
            active={rangeId !== '30d'}
          >
            <OptionList
              items={PROMO_RANGES}
              value={rangeId}
              onChange={(id) => {
                setParam('range', id, '30d');
                setDateOpen(false);
              }}
            />
          </Menu>
          <Menu
            label={businessOptions.find((item) => item.id === businessId)?.label ?? 'Select business'}
            icon={Building2}
            open={businessOpen}
            onToggle={setBusinessOpen}
            active={businessId !== 'all'}
          >
            <OptionList
              items={businessOptions}
              value={businessId}
              onChange={(id) => {
                setParam('business', id, 'all');
                setBusinessOpen(false);
              }}
            />
          </Menu>
        </div>
        <div role="tablist" className="flex items-center gap-4">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setParam('tab', item.id, 'overview')}
              className={clsx(
                'border-b-2 pb-1 text-sm',
                tab === item.id
                  ? 'border-primary font-semibold text-[#0B1354]'
                  : 'border-transparent font-medium text-[#717171] hover:text-[#0B1354]',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'overview' ? (
        <>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {data.cards.map((card) => (
              <article key={card.id} className="admin-card rounded-xl border border-[#EEF0F4] bg-white px-4 py-4">
                <p className="text-sm font-medium text-[#717171]">{card.label}</p>
                <p className="mt-3 text-[1.75rem] font-semibold tabular-nums leading-none text-[#0B1354]">{card.value}</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-[#8B8B93]">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: card.accent }} />
                  {data.rangeLabel}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-4 space-y-4">
            {data.overview.map((chart) => (
              <TrendChart key={chart.id} chart={chart} />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-5 space-y-4">
          {data.engagement.map((chart) => (
            <TrendChart key={chart.id} chart={chart} />
          ))}
        </div>
      )}
    </div>
  );
}
