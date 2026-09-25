import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from 'chart.js';
import { Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function ChartLegend({ items, total }) {
  return (
    <ul className="space-y-4">
      {items.map(({ label, value, color }) => {
        const pct = total ? Math.round((value / total) * 100) : value;

        return (
          <li key={label} className="flex items-center gap-3">
            <span
              className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white"
              style={{ backgroundColor: color }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 text-base">
                <span className="truncate font-medium text-[#717171]">{label}</span>
                <span className="shrink-0 text-base font-bold text-[#0B1354]">{pct}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F0F2F7]">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ChartCard({
  title,
  children,
  legend,
  className = '',
  bodyClassName = '',
  legendClassName = '',
}) {
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E4E4E7] hover:shadow-[0_10px_28px_rgba(11,19,84,0.08)] ${className}`}
    >
      <div className="border-b border-[#F0F2F7] px-5 py-4 sm:px-6">
        <h3 className="text-lg font-bold text-[#0B1354]">{title}</h3>
      </div>
      <div
        className={`flex flex-1 flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6 ${bodyClassName}`}
      >
        {children}
        <div className={`w-full sm:max-w-[12.5rem] sm:shrink-0 ${legendClassName}`}>
          {legend}
        </div>
      </div>
    </article>
  );
}

function DonutCenter({ value, label }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-2xl font-bold tracking-tight text-[#0B1354] sm:text-[1.75rem] lg:text-[2rem]">
        {value}
      </span>
      <span className="mt-1 text-sm font-semibold text-[#717171] sm:text-base">{label}</span>
    </div>
  );
}

const baseArcStyle = {
  borderWidth: 3,
  borderColor: '#FFFFFF',
  hoverBorderColor: '#FFFFFF',
  borderRadius: 6,
  spacing: 2,
  hoverOffset: 4,
};

const pieArcStyle = {
  borderWidth: 4,
  borderColor: '#FFFFFF',
  hoverBorderColor: '#FFFFFF',
  borderRadius: 10,
  spacing: 6,
  hoverOffset: 10,
};

const tooltipStyle = {
  backgroundColor: '#0B1354',
  padding: 12,
  cornerRadius: 4,
  titleFont: { size: 13, weight: '600' },
  bodyFont: { size: 12 },
  displayColors: true,
  boxPadding: 4,
};

export function GenderDonutChart({ title, items }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const dominant = [...items].sort((a, b) => b.value - a.value)[0];
  const dominantPct = Math.round((dominant.value / total) * 100);

  const data = {
    labels: items.map((item) => item.label),
    datasets: [
      {
        data: items.map((item) => item.value),
        backgroundColor: items.map((item) => item.color),
        ...baseArcStyle,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '64%',
    radius: '92%',
    layout: {
      padding: 0,
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 900,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipStyle,
        callbacks: {
          label: (ctx) => {
            const pct = Math.round((ctx.parsed / total) * 100);
            return ` ${ctx.label}: ${pct}%`;
          },
        },
      },
    },
  };

  return (
    <ChartCard
      title={title}
      legend={<ChartLegend items={items} total={total} />}
      bodyClassName="sm:items-center sm:gap-4"
      legendClassName="sm:w-[36%] sm:max-w-[12rem] sm:shrink-0"
    >
      <div className="relative w-full flex-1 sm:w-[58%] sm:max-w-none">
        <div className="relative aspect-square w-full">
          <div
            className="pointer-events-none absolute inset-[2%] rounded-full bg-[#FAFBFC] ring-1 ring-[#F0F2F7]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 [&>div]:!h-full [&>div]:!w-full">
            <Doughnut data={data} options={options} />
          </div>
          <DonutCenter value={`${dominantPct}%`} label={dominant.label} />
        </div>
      </div>
    </ChartCard>
  );
}

function PieCenter({ value, label }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="flex h-[38%] min-h-[5.5rem] w-[38%] min-w-[5.5rem] flex-col items-center justify-center rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.85)] ring-1 ring-[#F0F2F7]">
        <span className="text-2xl font-bold tracking-tight text-[#0B1354] sm:text-[1.75rem] lg:text-[2rem]">
          {value}
        </span>
        <span className="mt-1 text-sm font-semibold text-[#717171] sm:text-base">{label}</span>
      </div>
    </div>
  );
}

export function AgeGroupPieChart({ title, items }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const dominant = [...items].sort((a, b) => b.value - a.value)[0];
  const dominantPct = Math.round((dominant.value / total) * 100);

  const data = {
    labels: items.map((item) => item.label),
    datasets: [
      {
        data: items.map((item) => item.value),
        backgroundColor: items.map((item) => item.color),
        ...pieArcStyle,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    radius: '90%',
    layout: {
      padding: 4,
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 900,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipStyle,
        callbacks: {
          label: (ctx) => {
            const pct = Math.round((ctx.parsed / total) * 100);
            return ` ${ctx.label}: ${pct}%`;
          },
        },
      },
    },
  };

  return (
    <ChartCard
      title={title}
      legend={<ChartLegend items={items} total={total} />}
      bodyClassName="sm:items-center sm:gap-4"
      legendClassName="sm:w-[36%] sm:max-w-[12rem] sm:shrink-0"
    >
      <div className="relative w-full flex-1 sm:w-[58%] sm:max-w-none">
        <div className="relative aspect-square w-full">
          <div
            className="pointer-events-none absolute inset-[4%] rounded-full bg-[#FAFBFC] ring-1 ring-[#F0F2F7]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 [&>div]:!h-full [&>div]:!w-full">
            <Pie data={data} options={options} />
          </div>
          <PieCenter value={`${dominantPct}%`} label={dominant.label} />
        </div>
      </div>
    </ChartCard>
  );
}
