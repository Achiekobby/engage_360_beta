import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { clsx } from 'clsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

const tooltipStyle = {
  backgroundColor: '#0B1354',
  padding: 12,
  titleFont: { size: 12, weight: '600' },
  bodyFont: { size: 12 },
  cornerRadius: 6,
};

function ChartCard({ title, subtitle, className, children }) {
  return (
    <article
      className={clsx(
        'admin-card rounded-xl border border-[#EEF0F4] bg-white p-4 sm:p-5',
        className,
      )}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight text-[#0B1354] sm:text-base">
          {title}
        </h3>
        {subtitle ? <p className="mt-0.5 text-xs text-[#717171] sm:text-sm">{subtitle}</p> : null}
      </div>
      {children}
    </article>
  );
}

export function DeliveryDoughnutChart({ chart }) {
  const data = {
    labels: chart.labels,
    datasets: [
      {
        data: chart.values,
        backgroundColor: chart.colors,
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  return (
    <ChartCard title={chart.title} subtitle={chart.subtitle}>
      <div className="mx-auto h-56 max-w-[16rem]">
        <Doughnut
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: '62%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 16,
                  color: '#717171',
                  font: { size: 11 },
                },
              },
              tooltip: tooltipStyle,
            },
          }}
        />
      </div>
    </ChartCard>
  );
}

export function ChannelDoughnutChart({ chart }) {
  return <DeliveryDoughnutChart chart={chart} />;
}

export function GroupedBarChart({ chart }) {
  const data = {
    labels: chart.labels,
    datasets: chart.series.map((series) => ({
      label: series.label,
      data: series.data,
      backgroundColor: series.color,
      borderRadius: 3,
      barPercentage: 0.75,
      categoryPercentage: 0.7,
    })),
  };

  return (
    <ChartCard title={chart.title} subtitle={chart.subtitle} className="lg:col-span-2">
      <div className="h-64">
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 16,
                  color: '#717171',
                  font: { size: 11 },
                },
              },
              tooltip: tooltipStyle,
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: '#717171', font: { size: 11 } },
              },
              y: {
                beginAtZero: true,
                ticks: { color: '#717171', font: { size: 11 } },
                grid: { color: 'rgba(11,19,84,0.08)', borderDash: [4, 4] },
              },
            },
          }}
        />
      </div>
    </ChartCard>
  );
}

export function HorizontalRatesChart({ chart }) {
  const data = {
    labels: chart.labels,
    datasets: [
      {
        data: chart.values,
        backgroundColor: chart.color,
        borderRadius: 4,
        barPercentage: 0.7,
      },
    ],
  };

  return (
    <ChartCard title={chart.title} subtitle={chart.subtitle} className="lg:col-span-2">
      <div className="h-64">
        <Bar
          data={data}
          options={{
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                ...tooltipStyle,
                callbacks: {
                  label: (ctx) => `${ctx.parsed.x}%`,
                },
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  color: '#717171',
                  font: { size: 11 },
                  callback: (value) => `${value}%`,
                },
                grid: { color: 'rgba(11,19,84,0.08)', borderDash: [4, 4] },
              },
              y: {
                grid: { display: false },
                ticks: { color: '#717171', font: { size: 11 } },
              },
            },
          }}
        />
      </div>
    </ChartCard>
  );
}

export function VerticalBarChart({ chart }) {
  const data = {
    labels: chart.labels,
    datasets: [
      {
        data: chart.values,
        backgroundColor: chart.color,
        borderRadius: 3,
        barPercentage: 0.75,
      },
    ],
  };

  return (
    <ChartCard title={chart.title} subtitle={chart.subtitle}>
      <div className="h-64">
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: tooltipStyle,
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: '#717171', font: { size: 11 } },
              },
              y: {
                beginAtZero: true,
                ticks: { color: '#717171', font: { size: 11 } },
                grid: { color: 'rgba(11,19,84,0.08)', borderDash: [4, 4] },
              },
            },
          }}
        />
      </div>
    </ChartCard>
  );
}

export function TrendLineChart({ chart }) {
  const data = {
    labels: chart.labels,
    datasets: chart.series.map((series) => ({
      label: series.label,
      data: series.data,
      borderColor: series.color,
      backgroundColor: `${series.color}22`,
      fill: true,
      tension: 0.35,
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2,
    })),
  };

  return (
    <ChartCard title={chart.title} subtitle={chart.subtitle} className="lg:col-span-2">
      <div className="h-64">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 16,
                  color: '#717171',
                  font: { size: 11 },
                },
              },
              tooltip: tooltipStyle,
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: '#717171', font: { size: 11 } },
              },
              y: {
                beginAtZero: true,
                ticks: { color: '#717171', font: { size: 11 } },
                grid: { color: 'rgba(11,19,84,0.08)', borderDash: [4, 4] },
              },
            },
          }}
        />
      </div>
    </ChartCard>
  );
}

export function FunnelChart({ chart }) {
  const max = Math.max(...chart.steps.map((step) => step.value), 1);

  return (
    <ChartCard title={chart.title} subtitle={chart.subtitle} className="lg:col-span-2">
      <div className="space-y-3">
        {chart.steps.map((step, index) => {
          const width = Math.max(18, Math.round((step.value / max) * 100));
          const prev = chart.steps[index - 1]?.value;
          const drop = prev ? Math.round(((prev - step.value) / prev) * 100) : null;

          return (
            <div key={step.label}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-[#0B1354]">{step.label}</span>
                <span className="tabular-nums text-[#717171]">
                  {step.value.toLocaleString()}
                  {drop != null ? ` · −${drop}%` : ''}
                </span>
              </div>
              <div className="h-8 rounded-md bg-[#F4F5F7]">
                <div
                  className="flex h-full items-center rounded-md px-3 text-[11px] font-semibold text-white transition-all"
                  style={{ width: `${width}%`, backgroundColor: step.color }}
                >
                  {width > 28 ? `${width}%` : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}
