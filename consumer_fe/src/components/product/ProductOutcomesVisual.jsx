import Images from '../../utils/Images';

const CUSTOMER_BARS = [52, 68, 78, 48, 72, 58, 82, 65];
const QUALITY_BARS = [62, 48, 74, 55, 85, 52, 68, 44];
const INSIGHT_BARS = [
  { height: 38, top: 28 },
  { height: 52, top: 18 },
  { height: 44, top: 32 },
  { height: 58, top: 12 },
  { height: 36, top: 38 },
  { height: 48, top: 22 },
  { height: 54, top: 16 },
  { height: 40, top: 30 },
  { height: 46, top: 24 },
];

function FloatingCard({ className, children }) {
  return (
    <div
      className={`rounded-lg bg-white p-3 shadow-[0_10px_32px_rgba(11,19,84,0.12)] sm:p-4 ${className}`}
    >
      {children}
    </div>
  );
}

function CustomerGrowthCard({ className }) {
  return (
    <FloatingCard className={className}>
      <p className="text-[10px] text-[#717171] sm:text-xs">Customer data growth</p>
      <p className="mt-0.5 text-xl font-bold text-[#0B1354] sm:text-2xl">2,000</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold text-[#0B1354] sm:text-xs">Overview</span>
        <span className="rounded-full border border-[#E4E4E7] px-2 py-0.5 text-[9px] text-[#717171] sm:text-[10px]">
          Month
        </span>
      </div>
      <div className="mt-3">
        <div className="flex h-[72px] items-end gap-[3px] sm:h-[84px] sm:gap-1">
          {CUSTOMER_BARS.map((height, index) => (
            <div key={index} className="relative h-full flex-1">
              <div
                className="absolute bottom-0 w-full bg-[#254EDB]"
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[7px] text-[#717171] sm:text-[8px]">
          <span>0k</span>
          <span>80k</span>
        </div>
        <div className="mt-1 flex justify-between text-[7px] text-[#717171] sm:text-[8px]">
          {CUSTOMER_BARS.map((_, index) => (
            <span key={index}>Jan{index + 1}</span>
          ))}
        </div>
      </div>
    </FloatingCard>
  );
}

function DataQualityCard({ className }) {
  return (
    <FloatingCard className={className}>
      <p className="text-[10px] font-semibold text-[#0B1354] sm:text-xs">Data quality growth</p>
      <div className="mt-3 flex h-[72px] items-end gap-1.5 sm:h-[80px] sm:gap-2">
        {QUALITY_BARS.map((height, index) => (
          <div
            key={index}
            className="relative h-full w-2.5 overflow-hidden rounded-full bg-[#10C952]/20 sm:w-3"
          >
            <div
              className="absolute bottom-0 w-full rounded-full bg-[#10C952]"
              style={{ height: `${height}%` }}
            />
          </div>
        ))}
      </div>
    </FloatingCard>
  );
}

function RealTimeInsightsCard({ className }) {
  return (
    <FloatingCard className={className}>
      <p className="text-[10px] font-semibold text-[#0B1354] sm:text-xs">Real-time insights</p>
      <div className="mt-3 flex h-[56px] items-end gap-1 sm:h-[64px] sm:gap-1.5">
        {INSIGHT_BARS.map(({ height, top }, index) => (
          <div
            key={index}
            className="relative h-full w-2 overflow-hidden rounded-full bg-[#10C952]/20 sm:w-2.5"
          >
            <div
              className="absolute w-full rounded-full bg-[#10C952]"
              style={{ height: `${height}%`, top: `${top}%` }}
            />
          </div>
        ))}
      </div>
    </FloatingCard>
  );
}

export default function ProductOutcomesVisual() {
  return (
    <div className="relative mx-auto aspect-[490/560] w-full max-w-[520px] lg:max-w-none">
      <div className="absolute inset-x-[8%] bottom-0 top-[8%] overflow-hidden rounded-b-[999px]">
        <img
          src={Images.products.outcome}
          alt="Professional reviewing customer data insights"
          className="absolute bottom-0 left-1/2 z-10 h-[94%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
        />
      </div>

      <CustomerGrowthCard className="absolute -left-[6%] top-[10%] z-20 w-[58%] max-w-[240px] sm:-left-[4%] sm:top-[12%]" />
      <RealTimeInsightsCard className="absolute bottom-[10%] left-[2%] z-20 w-[50%] max-w-[210px]" />
      <DataQualityCard className="absolute right-0 top-[34%] z-30 w-[46%] max-w-[200px]" />
    </div>
  );
}
