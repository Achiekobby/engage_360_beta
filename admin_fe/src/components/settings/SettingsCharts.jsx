import { clsx } from 'clsx';
import { ChartTooltip, useChartFocus } from '../charts/chartInteraction';

function chartScale(maxValue) {
  const headroom = Math.max(maxValue, 1) * 1.08;
  const step =
    headroom <= 20
      ? 5
      : headroom <= 50
        ? 10
        : headroom <= 120
          ? 20
          : headroom <= 260
            ? 50
            : headroom <= 600
              ? 100
              : headroom <= 2000
                ? 250
                : headroom <= 8000
                  ? 1000
                  : headroom <= 20000
                    ? 2500
                    : 5000;
  const top = Math.ceil(headroom / step) * step;
  const ticks = [];
  for (let value = 0; value <= top; value += step) ticks.push(value);
  return { top, ticks };
}

function formatTick(value) {
  if (value >= 1000) return `${Math.round(value / 100) / 10}k`;
  return String(value);
}

export function SettingsBarChart({ chart }) {
  const focus = useChartFocus();
  const series = chart.series ?? [{ id: 'main', label: chart.unit, color: chart.color, values: chart.values }];
  const max = Math.max(...series.flatMap((item) => item.values), 1);
  const { top, ticks } = chartScale(max);
  const activeIndex = focus.active == null ? null : Number(focus.active);

  return (
    <article className={clsx('admin-card rounded-xl border border-[#EEF0F4] bg-white p-4 sm:p-5', focus.active && 'relative z-20')}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-[#0B1354]">{chart.title}</h2>
          <p className="mt-0.5 text-xs text-[#717171]">{chart.subtitle}</p>
        </div>
        {series.length > 1 ? (
          <ul className="flex flex-wrap justify-end gap-3 text-[11px] text-[#717171]">
            {series.map((item) => (
              <li key={item.id} className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="mt-6 flex gap-2">
        <div className="relative h-52 w-8 shrink-0">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute right-0 -translate-y-1/2 text-[11px] tabular-nums text-[#A1A1AA]"
              style={{ bottom: `${(tick / top) * 100}%` }}
            >
              {formatTick(tick)}
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="relative h-52 overflow-visible border-b border-[#D4D4D8]">
            {ticks
              .filter((tick) => tick > 0)
              .map((tick) => (
                <span
                  key={tick}
                  className="pointer-events-none absolute inset-x-0 border-t border-dotted border-[#E4E4E7]"
                  style={{ bottom: `${(tick / top) * 100}%` }}
                />
              ))}
            <div className="absolute inset-x-1 bottom-0 top-0 flex items-end gap-1.5 sm:inset-x-2 sm:gap-2.5">
              {chart.labels.map((label, index) => {
                const selected = activeIndex === index;
                return (
                  <button
                    key={label}
                    type="button"
                    className={clsx('relative flex h-full min-w-0 flex-1 items-end justify-center gap-0.5 rounded-sm px-0.5', selected && 'bg-[#F4F7FB]')}
                    aria-label={`${label}`}
                    onMouseEnter={() => focus.enter(String(index))}
                    onMouseLeave={focus.leave}
                    onFocus={() => focus.enter(String(index))}
                    onBlur={focus.leave}
                    onClick={() => focus.toggle(String(index))}
                  >
                    {selected ? (
                      <span className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2" style={{ bottom: 'calc(100% + 8px)' }}>
                        <ChartTooltip
                          title={label}
                          items={series.map((item) => ({
                            label: item.label,
                            value:
                              item.display?.[index] ??
                              (chart.unit === '%'
                                ? `${item.values[index]}%`
                                : chart.unit === 'GH₵'
                                  ? `GH₵${new Intl.NumberFormat('en-GH').format(item.values[index])}`
                                  : String(item.values[index])),
                            color: item.color,
                          }))}
                        />
                      </span>
                    ) : null}
                    {series.map((item) => (
                      <span
                        key={item.id}
                        className="block min-w-[6px] flex-1 transition-opacity duration-150"
                        style={{
                          height: `${(item.values[index] / top) * 100}%`,
                          backgroundColor: item.color,
                          opacity: focus.dim(String(index)) ? 0.28 : 1,
                        }}
                      />
                    ))}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-2 flex gap-1.5 px-1 sm:gap-2.5 sm:px-2">
            {chart.labels.map((label, index) => (
              <span
                key={label}
                className={clsx(
                  'min-w-0 flex-1 text-center text-[11px]',
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

export function HealthStatGrid({ items }) {
  return (
    <div className={clsx('grid grid-cols-1 gap-3 sm:grid-cols-2', items.length === 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3')}>
      {items.map((stat) => (
        <article key={stat.id} className="admin-card rounded-xl border border-[#EEF0F4] bg-white px-4 py-4">
          <p className="text-sm text-[#717171]">{stat.label}</p>
          <p className="mt-2 text-[1.75rem] font-semibold tabular-nums leading-none tracking-tight text-[#0B1354]">{stat.value}</p>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[#A1A1AA]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: stat.accent }} aria-hidden="true" />
            {stat.detail}
          </p>
        </article>
      ))}
    </div>
  );
}

export function CategoryEngagement({ rows }) {
  const focus = useChartFocus();

  return (
    <article className={clsx('admin-card rounded-xl border border-[#EEF0F4] bg-white p-4 sm:p-5', focus.active && 'relative z-20')}>
      <h2 className="text-sm font-semibold tracking-tight text-[#0B1354]">Campaign category engagement</h2>
      <p className="mt-0.5 text-xs text-[#717171]">Opens and clicks as a share of messages sent in each campaign type</p>
      <ul className="mt-5 space-y-4">
        {rows.map((row) => {
          const selected = focus.active === row.id;
          return (
            <li key={row.id} className={clsx('relative', focus.dim(row.id) && 'opacity-45')}>
              <button
                type="button"
                className="flex w-full items-center gap-3 text-left"
                aria-label={`${row.label} ${row.value}%`}
                onMouseEnter={() => focus.enter(row.id)}
                onMouseLeave={focus.leave}
                onFocus={() => focus.enter(row.id)}
                onBlur={focus.leave}
                onClick={() => focus.toggle(row.id)}
              >
                <span className="w-40 shrink-0 text-sm text-[#3F3F46] sm:w-48">{row.label}</span>
                <span className="relative min-w-0 flex-1">
                  {selected ? (
                    <span className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2" style={{ bottom: 'calc(100% + 8px)' }}>
                      <ChartTooltip title={row.label} items={[{ label: 'Engaged', value: `${row.value}%`, color: row.color }]} />
                    </span>
                  ) : null}
                  <span className="block h-3 overflow-hidden rounded-full bg-[#F4F4F5]">
                    <span className="block h-full rounded-full" style={{ width: `${row.value}%`, backgroundColor: row.color }} />
                  </span>
                </span>
                <span className="w-10 shrink-0 text-right text-sm font-semibold tabular-nums text-[#0B1354]">{row.value}%</span>
              </button>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export function LanguageMix({ rows }) {
  const focus = useChartFocus();

  return (
    <article className="admin-card rounded-xl border border-[#EEF0F4] bg-white p-4 sm:p-5">
      <h2 className="text-sm font-semibold tracking-tight text-[#0B1354]">Language engagement</h2>
      <p className="mt-0.5 text-xs text-[#717171]">Share of delivered messages by language</p>
      <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-[#F4F4F5]">
        {rows.map((row) => (
          <button
            key={row.id}
            type="button"
            aria-label={`${row.label} ${row.value}%`}
            className="h-full transition-opacity"
            style={{ width: `${row.value}%`, backgroundColor: row.color, opacity: focus.dim(row.id) ? 0.35 : 1 }}
            onMouseEnter={() => focus.enter(row.id)}
            onMouseLeave={focus.leave}
            onFocus={() => focus.enter(row.id)}
            onBlur={focus.leave}
            onClick={() => focus.toggle(row.id)}
          />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {rows.map((row) => (
          <li key={row.id} className={clsx('text-xs', focus.dim(row.id) && 'opacity-40')}>
            <span className="inline-flex items-center gap-1.5 text-[#717171]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: row.color }} />
              {row.label}
            </span>
            <p className="mt-0.5 font-semibold tabular-nums text-[#0B1354]">{row.value}%</p>
          </li>
        ))}
      </ul>
    </article>
  );
}
