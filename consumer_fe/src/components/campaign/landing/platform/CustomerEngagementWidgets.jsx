const EARNING_BARS = [58, 72, 48, 82, 62, 76, 92, 68, 84, 52, 88, 70, 78, 64];

const LEADS_LEGEND = [
  { color: '#4F7FD4', label: 'Gender (Male & Female)' },
  { color: '#F5A623', label: 'Location (Accra, Kumasi)' },
  { color: '#1C2B1C', label: 'Age Range (25-30)' },
];

const RING_CONFIG = [
  { radius: 44, progress: 0.75, color: '#4F7FD4' },
  { radius: 34, progress: 0.6, color: '#F5A623' },
  { radius: 24, progress: 0.4, color: '#1C2B1C' },
];

function EarningBarChart() {
  return (
    <div className="mt-3 flex h-[4.75rem] items-stretch justify-between gap-[3px] sm:h-[5.25rem] sm:gap-1">
      {EARNING_BARS.map((fill, index) => (
        <div
          key={index}
          className="flex h-full min-w-0 flex-1 max-w-[10px] flex-col justify-end overflow-hidden rounded-full bg-[#E8EAEF]"
        >
          <div
            className="w-full rounded-full bg-gradient-to-t from-[#3A10CD] to-[#6B4FE0]"
            style={{ height: `${fill}%`, minHeight: '4px' }}
          />
        </div>
      ))}
    </div>
  );
}

function LeadsRingChart() {
  const center = 50;
  const strokeWidth = 5.5;

  return (
    <div className="relative h-[5.5rem] w-[5.5rem] shrink-0 sm:h-[6.25rem] sm:w-[6.25rem]">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        {RING_CONFIG.map(({ radius, progress, color }) => {
          const circumference = 2 * Math.PI * radius;
          const dash = circumference * progress;

          return (
            <g key={radius}>
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#E8EAEF"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
              />
            </g>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="rotate-0 text-[11px] font-medium text-[#717171] sm:text-xs">690</span>
      </div>
    </div>
  );
}

export default function CustomerEngagementWidgets() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      <div className="rounded-xl bg-white p-3.5 shadow-[0_6px_20px_rgba(11,19,84,0.07)] ring-1 ring-black/[0.03] transition-transform duration-300 hover:-translate-y-0.5 sm:p-4">
        <p className="text-[11px] font-normal text-[#717171] sm:text-xs">Total Earning</p>
        <p className="mt-0.5 text-[1.35rem] font-bold leading-none tracking-tight text-[#0B1354] sm:text-2xl">
          ₵13,690
        </p>
        <EarningBarChart />
      </div>

      <div className="rounded-xl bg-white p-3.5 shadow-[0_6px_20px_rgba(11,19,84,0.07)] ring-1 ring-black/[0.03] transition-transform duration-300 hover:-translate-y-0.5 sm:p-4">
        <p className="text-[11px] font-normal text-[#717171] sm:text-xs">Leads Management</p>
        <p className="mt-0.5 text-[1.35rem] font-bold leading-none tracking-tight text-[#0B1354] sm:text-2xl">
          690
        </p>
        <div className="mt-3 flex items-center gap-3 sm:gap-4">
          <LeadsRingChart />
          <ul className="min-w-0 space-y-2">
            {LEADS_LEGEND.map(({ color, label }) => (
              <li key={label} className="flex items-start gap-2">
                <span
                  className="mt-1 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[10px] leading-snug text-[#717171] sm:text-[11px]">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
