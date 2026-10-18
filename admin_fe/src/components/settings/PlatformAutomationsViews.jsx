import { Building2, CalendarRange, ChevronDown, Sparkles, TriangleAlert } from 'lucide-react';
import { clsx } from 'clsx';
import BirthdayInsightChartCard from '../automations/BirthdayInsightChartCard';
import {
  APPROVAL_MODES,
  PLATFORM_BUSINESS_FILTERS,
  PLATFORM_DATE_FILTERS,
} from './platformAutomationsData';

export function FilterSelect({ icon: Icon, value, onChange, options, ariaLabel }) {
  return (
    <div className="relative inline-flex min-w-[10.5rem]">
      <Icon
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
        strokeWidth={2}
      />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        className="w-full cursor-pointer appearance-none rounded-full border border-[#E4E4E7] bg-white py-2.5 pl-10 pr-10 text-sm font-semibold text-[#0B1354] outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717171]"
        strokeWidth={2.25}
      />
    </div>
  );
}

export function PlatformAutomationsFilters({ dateFilter, businessId, onDateChange, onBusinessChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <FilterSelect
        icon={CalendarRange}
        value={dateFilter}
        onChange={onDateChange}
        options={PLATFORM_DATE_FILTERS}
        ariaLabel="Date filter"
      />
      <FilterSelect
        icon={Building2}
        value={businessId}
        onChange={onBusinessChange}
        options={PLATFORM_BUSINESS_FILTERS}
        ariaLabel="Select business"
      />
    </div>
  );
}

function toneClasses(tone) {
  if (tone === 'good') return 'bg-[#E8F8EF] text-[#166534]';
  if (tone === 'warn') return 'bg-[#FFF8E8] text-[#A16207]';
  if (tone === 'bad') return 'bg-[#FEF2F2] text-[#B91C1C]';
  return 'bg-[#EDE8F8] text-primary';
}

export function MetricCard({ stat }) {
  return (
    <article className="admin-card rounded-xl border border-[#E4E4E7] bg-white px-4 py-4 sm:px-5 sm:py-5">
      <p className="text-sm font-medium text-[#717171]">{stat.label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-[#0B1354] sm:text-3xl">{stat.value}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={clsx(
            'inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold',
            toneClasses(stat.tone),
          )}
        >
          {stat.change}
        </span>
        {stat.share ? (
          <span className="text-[11px] font-semibold text-[#717171]">{stat.share} of total</span>
        ) : null}
      </div>
    </article>
  );
}

export function HealthBanner({ health }) {
  return (
    <div
      className={clsx(
        'admin-card flex flex-col gap-4 rounded-2xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5',
        health.tone === 'good'
          ? 'border-[#BBF7D0] bg-gradient-to-r from-[#F0FDF4] to-white'
          : health.tone === 'warn'
            ? 'border-[#FDE68A] bg-gradient-to-r from-[#FFFBEB] to-white'
            : 'border-[#FECACA] bg-gradient-to-r from-[#FEF2F2] to-white',
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={clsx(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white',
            health.tone === 'good'
              ? 'bg-[#16A34A]'
              : health.tone === 'warn'
                ? 'bg-[#CA8A04]'
                : 'bg-[#DC2626]',
          )}
        >
          {health.tone === 'good' ? (
            <Sparkles className="h-5 w-5" strokeWidth={2} />
          ) : (
            <TriangleAlert className="h-5 w-5" strokeWidth={2} />
          )}
        </span>
        <div>
          <p className="text-sm font-semibold text-[#0B1354]">
            Platform health score · {health.score}
            <span className="ml-2 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-[#717171] ring-1 ring-[#E4E4E7]">
              {health.label}
            </span>
          </p>
          <p className="mt-1 text-sm text-[#717171]">
            Weighted from delivery rate, credit risk, and disabled automations.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {health.highlights.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-white/80 bg-white/90 px-3 py-2 shadow-sm"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#717171]">
              {item.label}
            </p>
            <p className="mt-0.5 text-sm font-bold text-[#0B1354]">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OverviewTab({ data }) {
  return (
    <div className="space-y-5">
      <HealthBanner health={data.health} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.cards.map((stat) => (
          <MetricCard key={stat.id} stat={stat} />
        ))}
      </div>
      <div className="space-y-4">
        {data.charts.map((chart) => (
          <BirthdayInsightChartCard
            key={chart.id}
            title={chart.title}
            subtitle={chart.subtitle}
            labels={chart.labels}
            color={chart.color}
            data={chart.data}
          />
        ))}
      </div>
    </div>
  );
}

export function AdoptionTab({ data }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.summaries.map((item) => (
          <article
            key={item.id}
            className="admin-card rounded-xl border border-[#E4E4E7] bg-white px-4 py-4"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <p className="text-sm font-semibold text-[#0B1354]">{item.label}</p>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#717171]">
                  Providers
                </dt>
                <dd className="mt-1 text-lg font-bold text-[#0B1354]">{item.activeProviders}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#717171]">
                  Automations
                </dt>
                <dd className="mt-1 text-lg font-bold text-[#0B1354]">{item.automations}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-[#717171]">
                  Covered
                </dt>
                <dd className="mt-1 text-lg font-bold text-[#0B1354]">{item.covered}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <div className="space-y-4">
        {data.charts.map((chart) => (
          <BirthdayInsightChartCard
            key={chart.id}
            title={chart.title}
            subtitle={chart.subtitle}
            labels={chart.labels}
            datasets={chart.datasets}
            grouped
          />
        ))}
      </div>
    </div>
  );
}

export function ChannelsTab({ data }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {data.cards.map((card) => (
          <article
            key={card.id}
            className="admin-card rounded-xl border border-[#E4E4E7] bg-white px-4 py-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-[#0B1354]">{card.label}</p>
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                style={{ backgroundColor: card.color }}
              >
                {card.deliveryRate} delivered
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: 'Sent', value: card.sent },
                { label: 'Delivered', value: card.delivered },
                { label: 'Failed', value: card.failed },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-[#F7F8FB] px-2 py-2 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[#717171]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-base font-bold text-[#0B1354]">{item.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-[#717171]">
              Fail rate <span className="font-semibold text-[#B91C1C]">{card.failRate}</span>
            </p>
          </article>
        ))}
      </div>
      <div className="space-y-4">
        {data.charts.map((chart) => (
          <BirthdayInsightChartCard
            key={chart.id}
            title={chart.title}
            subtitle={chart.subtitle}
            labels={chart.labels}
            datasets={chart.datasets}
            grouped
          />
        ))}
      </div>
    </div>
  );
}

export function ApprovalTab({ data, approvalMode, onModeChange }) {
  const cards = approvalMode === 'auto' ? data.autoCards : data.businessCards;
  const charts = approvalMode === 'auto' ? data.autoCharts : data.businessCharts;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex self-start rounded-full bg-[#F4F5F7] p-1">
          {APPROVAL_MODES.map((mode) => {
            const active = approvalMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onModeChange(mode.id)}
                className={clsx(
                  'cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-[#717171] hover:text-[#0B1354]',
                )}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[#717171]">
          Status colors stay consistent across automation types for faster scanning.
        </p>
      </div>

      <div
        className={clsx(
          'grid grid-cols-1 gap-3 sm:grid-cols-2',
          cards.length > 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-4',
        )}
      >
        {cards.map((stat) => (
          <MetricCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="space-y-4">
        {charts.map((chart) =>
          chart.grouped === false || !chart.datasets ? (
            <BirthdayInsightChartCard
              key={chart.id}
              title={chart.title}
              subtitle={chart.subtitle}
              labels={chart.labels}
              color={chart.color}
              data={chart.data}
            />
          ) : (
            <BirthdayInsightChartCard
              key={chart.id}
              title={chart.title}
              subtitle={chart.subtitle}
              labels={chart.labels}
              datasets={chart.datasets}
              grouped
            />
          ),
        )}
      </div>
    </div>
  );
}

export function RevenueTab({ data }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.cards.map((stat) => (
          <MetricCard key={stat.id} stat={stat} />
        ))}
      </div>

      <BirthdayInsightChartCard
        title={data.byType.title}
        subtitle={data.byType.subtitle}
        labels={data.byType.labels}
        datasets={data.byType.datasets}
        grouped
      />

      <div className="space-y-4">
        {data.channelCharts.map((chart) => (
          <BirthdayInsightChartCard
            key={chart.id}
            title={chart.title}
            subtitle={chart.subtitle}
            labels={chart.labels}
            color={chart.color}
            data={chart.data}
          />
        ))}
      </div>
    </div>
  );
}
