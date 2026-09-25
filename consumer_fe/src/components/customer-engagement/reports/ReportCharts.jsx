import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const tooltipStyle = {
  backgroundColor: '#0B1354',
  padding: 12,
  cornerRadius: 4,
  titleFont: { size: 13, weight: '600' },
  bodyFont: { size: 12 },
  displayColors: true,
  boxPadding: 4,
};

const arcStyle = {
  borderWidth: 3,
  borderColor: '#FFFFFF',
  hoverBorderColor: '#FFFFFF',
  borderRadius: 6,
  spacing: 2,
  hoverOffset: 4,
};

const pieStyle = {
  borderWidth: 4,
  borderColor: '#FFFFFF',
  hoverBorderColor: '#FFFFFF',
  borderRadius: 8,
  spacing: 4,
  hoverOffset: 8,
};

function ChartLegend({ items, total, showCount = false }) {
  return (
    <ul className="space-y-3">
      {items.map(({ label, value, color }) => {
        const pct = total ? Math.round((value / total) * 100) : value;

        return (
          <li key={label} className="flex items-center gap-3">
            <span
              className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white"
              style={{ backgroundColor: color }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-medium text-[#717171]">{label}</span>
                <span className="shrink-0 font-bold text-[#0B1354]">
                  {showCount ? value.toLocaleString() : `${pct}%`}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F0F2F7]">
                <div
                  className="h-full rounded-full transition-all duration-700"
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

function ReportCard({ title, children, headerExtra, className = '' }) {
  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E4E4E7] hover:shadow-[0_10px_28px_rgba(11,19,84,0.08)] ${className}`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-[#F0F2F7] px-5 py-4 sm:px-6">
        <h3 className="text-base font-bold text-[#0B1354] sm:text-lg">{title}</h3>
        {headerExtra}
      </div>
      {children}
    </article>
  );
}

function DonutCenter({ value, label }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-xl font-bold tracking-tight text-[#0B1354] sm:text-2xl">{value}</span>
      {label ? (
        <span className="mt-1 text-xs font-semibold text-[#717171] sm:text-sm">{label}</span>
      ) : null}
    </div>
  );
}

export function ReportDonutChart({
  title,
  items,
  centerValue,
  centerLabel,
  headerExtra,
  semi = false,
  showCountLegend = false,
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  const data = {
    labels: items.map((item) => item.label),
    datasets: [
      {
        data: items.map((item) => item.value),
        backgroundColor: items.map((item) => item.color),
        ...arcStyle,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    radius: '92%',
    circumference: semi ? 180 : 360,
    rotation: semi ? 270 : 0,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...tooltipStyle,
        callbacks: {
          label: (ctx) => {
            const pct = Math.round((ctx.parsed / total) * 100);
            return ` ${ctx.label}: ${showCountLegend ? ctx.parsed.toLocaleString() : `${pct}%`}`;
          },
        },
      },
    },
  };

  return (
    <ReportCard title={title} headerExtra={headerExtra}>
      <div className="flex flex-1 flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className={`relative w-full flex-1 ${semi ? 'max-h-[9rem] sm:max-h-[10rem]' : ''}`}>
          <div className={`relative w-full ${semi ? 'aspect-[2/1]' : 'aspect-square max-w-[14rem] mx-auto'}`}>
            <div className="absolute inset-0 [&>div]:!h-full [&>div]:!w-full">
              <Doughnut data={data} options={options} />
            </div>
            {centerValue ? <DonutCenter value={centerValue} label={centerLabel} /> : null}
          </div>
        </div>
        <div className="w-full sm:max-w-[11rem] sm:shrink-0">
          <ChartLegend items={items} total={total} showCount={showCountLegend} />
        </div>
      </div>
    </ReportCard>
  );
}

export function ReportPieChart({ title, items }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  const data = {
    labels: items.map((item) => item.label),
    datasets: [
      {
        data: items.map((item) => item.value),
        backgroundColor: items.map((item) => item.color),
        ...pieStyle,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    radius: '88%',
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
    <ReportCard title={title}>
      <div className="flex flex-1 flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="relative mx-auto aspect-square w-full max-w-[13rem] flex-1">
          <div className="absolute inset-0 [&>div]:!h-full [&>div]:!w-full">
            <Pie data={data} options={options} />
          </div>
        </div>
        <div className="w-full sm:max-w-[11rem] sm:shrink-0">
          <ChartLegend items={items} total={total} />
        </div>
      </div>
    </ReportCard>
  );
}

export function ReportBarChart({ title, labels, data, total, description }) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: '#2E7DAD',
        borderRadius: 2,
        barPercentage: 0.72,
        categoryPercentage: 0.82,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { ...tooltipStyle },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#717171', font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#717171', font: { size: 11 }, stepSize: 50 },
        grid: { color: 'rgba(11,19,84,0.06)' },
      },
    },
  };

  return (
    <ReportCard
      title={title}
      headerExtra={
        total ? (
          <span className="rounded-sm bg-[#F7F8FF] px-2.5 py-1 text-sm font-bold text-primary ring-1 ring-primary/10">
            Total {total.toLocaleString()}
          </span>
        ) : null
      }
    >
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {description ? (
          <p className="mb-4 text-sm text-[#717171]">{description}</p>
        ) : null}
        <div className="h-56 sm:h-64">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </ReportCard>
  );
}

export function ReportGroupedBarChart({ title, labels, datasets }) {
  const chartData = {
    labels,
    datasets: datasets.map(({ label, data, color }) => ({
      label,
      data,
      backgroundColor: color,
      borderRadius: 2,
      barPercentage: 0.85,
      categoryPercentage: 0.7,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#717171',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: { size: 12 },
        },
      },
      tooltip: { ...tooltipStyle },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#717171', font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#717171', font: { size: 11 } },
        grid: { color: 'rgba(11,19,84,0.06)' },
      },
    },
  };

  return (
    <ReportCard title={title}>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="h-64 sm:h-72">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </ReportCard>
  );
}

export function ReportStatCard({ title, value, label = 'Total' }) {
  return (
    <ReportCard title={title}>
      <div className="flex flex-1 flex-col items-center justify-center p-8 sm:p-10">
        <p className="text-sm font-medium text-[#717171]">{label}</p>
        <p className="mt-2 text-4xl font-bold tracking-tight text-[#0B1354] sm:text-5xl">
          {value.toLocaleString()}
        </p>
      </div>
    </ReportCard>
  );
}

export function ReportRateDonut({ title, rate, color = '#F5A623' }) {
  const items = [
    { label: 'Rate', value: rate, color },
    { label: 'Remaining', value: 100 - rate, color: '#F0F2F7' },
  ];

  return (
    <ReportDonutChart
      title={title}
      items={items}
      centerValue={`${rate}%`}
      centerLabel="Rate"
    />
  );
}
