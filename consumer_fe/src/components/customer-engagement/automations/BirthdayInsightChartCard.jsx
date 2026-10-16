import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const tooltipStyle = {
  backgroundColor: '#0B1354',
  padding: 12,
  titleFont: { size: 12, weight: '600' },
  bodyFont: { size: 12 },
  cornerRadius: 4,
};

function buildOptions({ showLegend = false } = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: showLegend
        ? {
            position: 'bottom',
            labels: {
              color: '#717171',
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 18,
              font: { size: 12 },
            },
          }
        : { display: false },
      tooltip: tooltipStyle,
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#717171', font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        max: 250,
        ticks: { color: '#717171', font: { size: 11 }, stepSize: 50 },
        grid: {
          color: 'rgba(11,19,84,0.08)',
          borderDash: [4, 4],
        },
      },
    },
  };
}

export default function BirthdayInsightChartCard({
  title,
  subtitle,
  labels,
  datasets,
  color,
  data,
  grouped = false,
}) {
  const chartData = grouped
    ? {
        labels,
        datasets: datasets.map((dataset) => ({
          label: dataset.label,
          data: dataset.data,
          backgroundColor: dataset.color,
          borderRadius: 2,
          barPercentage: 0.85,
          categoryPercentage: 0.7,
        })),
      }
    : {
        labels,
        datasets: [
          {
            data,
            backgroundColor: color,
            borderRadius: 2,
            barPercentage: 0.9,
            categoryPercentage: 0.85,
          },
        ],
      };

  return (
    <article className="rounded-sm border border-[#EEF0F4] bg-white p-5 shadow-[0_4px_20px_rgba(11,19,84,0.04)] sm:p-6">
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#0B1354] sm:text-lg">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-[#717171]">{subtitle}</p> : null}
      </div>
      <div className="h-64 sm:h-72">
        <Bar data={chartData} options={buildOptions({ showLegend: grouped })} />
      </div>
    </article>
  );
}
