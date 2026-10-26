import { useMemo } from 'react';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChevronDown } from 'lucide-react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Year-over-year bar chart: the selected year against the one before it.
 * `current`/`previous` are 12-value arrays; `colors` is [currentColor, previousColor].
 */
export default function TrendChart({
  id,
  title,
  subtitle,
  year,
  years,
  onYearChange,
  current,
  previous,
  colors,
}) {
  const data = useMemo(
    () => ({
      labels: MONTHS,
      datasets: [
        { label: String(year), data: current, backgroundColor: colors[0], borderRadius: 5, maxBarThickness: 14 },
        { label: String(year - 1), data: previous, backgroundColor: colors[1], borderRadius: 5, maxBarThickness: 14 },
      ],
    }),
    [year, current, previous, colors],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0B1354',
          padding: 10,
          cornerRadius: 8,
          callbacks: { label: (item) => ` ${item.dataset.label}: ${item.parsed.y.toLocaleString()} pts` },
        },
      },
      scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { color: '#8A90A6', font: { size: 11 } } },
        y: {
          beginAtZero: true,
          border: { display: false },
          grid: { color: '#EEF0F4' },
          ticks: { color: '#8A90A6', font: { size: 11 }, maxTicksLimit: 5 },
        },
      },
    }),
    [],
  );

  const total = current.reduce((sum, value) => sum + value, 0);
  const previousTotal = previous.reduce((sum, value) => sum + value, 0);

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="flex flex-col rounded-2xl border border-[#E6E8F0] bg-white p-5 shadow-[0_6px_20px_rgba(11,19,84,0.05)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id={`${id}-title`} className="text-lg font-bold text-[#0B1354]">
            {title}
          </h2>
          <p className="mt-0.5 text-sm text-[#6B7191]">{subtitle}</p>
        </div>
        <div className="relative">
          <label htmlFor={`${id}-year`} className="sr-only">
            Year
          </label>
          <select
            id={`${id}-year`}
            value={year}
            onChange={(event) => onYearChange(Number(event.target.value))}
            className="h-9 cursor-pointer appearance-none rounded-lg border border-[#DDE0EA] bg-white pl-3 pr-9 text-sm font-semibold text-[#3A3F66] outline-none transition-colors hover:border-[#0B1354]/40 focus:border-primary focus:shadow-[0_0_0_3px_rgba(58,16,205,0.12)]"
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7191]"
            strokeWidth={2.25}
          />
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold text-[#5B6180]">
        {[
          { label: `${year}`, color: colors[0], total },
          { label: `${year - 1}`, color: colors[1], total: previousTotal },
        ].map((item) => (
          <li key={item.label} className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label} · <span className="tabular-nums text-[#0B1354]">{item.total.toLocaleString()} pts</span>
          </li>
        ))}
      </ul>

      <div
        className="mt-4 h-64"
        role="img"
        aria-label={`${title}: ${total.toLocaleString()} points in ${year} compared with ${previousTotal.toLocaleString()} in ${year - 1}.`}
      >
        <Bar data={data} options={options} />
      </div>
    </section>
  );
}
