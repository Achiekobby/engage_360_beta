const CHART_BARS = [42, 58, 48, 72, 62, 80, 68, 88, 76, 92];

export default function HeroChartCard() {
  return (
    <div className="w-[204px] rounded-xl bg-white p-4 shadow-[0_10px_32px_rgba(11,19,84,0.1)] sm:w-[224px] sm:p-[1.125rem]">
      <p className="text-xs font-semibold leading-snug text-[#0B1354] sm:text-[13px]">
        Swift Increase in Conversion
      </p>
      <div className="mt-3 flex h-[74px] items-end justify-between gap-1.5 sm:h-[80px]">
        {CHART_BARS.map((height, index) => (
          <span
            key={index}
            className="w-full max-w-[13px] rounded-[3px] bg-primary"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}
