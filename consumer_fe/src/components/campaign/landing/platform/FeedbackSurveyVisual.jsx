import { Check } from 'lucide-react';
import Images from '../../../../utils/Images';

const ANALYTICS_BARS = [42, 68, 52, 82, 58, 74, 48, 78, 62, 88];

export default function FeedbackSurveyVisual() {
  return (
    <div className="relative mx-auto mt-6 h-[300px] w-full max-w-[460px] min-h-[280px] sm:mt-8 sm:h-[340px] lg:h-[360px]">
      {/* Soft ambient glow behind the composition */}
      <div
        className="absolute bottom-[4%] left-1/2 z-0 h-[74%] w-[64%] -translate-x-1/2 rounded-full bg-[#F5A623]/25 blur-2xl"
        aria-hidden="true"
      />

      {/* Decorative dotted ring — echoes brand orbit motif */}
      <svg
        className="pointer-events-none absolute left-1/2 top-0 z-0 h-[86%] w-[86%] -translate-x-1/2 text-[#0B1354]/[0.07]"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="94" stroke="currentColor" strokeWidth="1" strokeDasharray="3 7" />
      </svg>

      {/* Orange backdrop */}
      <div
        className="absolute bottom-[4%] left-1/2 z-0 h-[68%] w-[58%] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#F8B84E] via-[#F5A623] to-[#E8901A] shadow-[inset_0_-14px_28px_rgba(0,0,0,0.12),inset_0_10px_20px_rgba(255,255,255,0.25)]"
        aria-hidden="true"
      />

      {/* Portrait */}
      <img
        src={Images.services.service_one}
        alt="Customer feedback specialist reviewing survey insights"
        className="absolute bottom-0 left-1/2 z-10 h-[94%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom drop-shadow-[0_18px_30px_rgba(11,19,84,0.18)]"
      />

      {/* Green check — upper right on circle */}
      <div className="absolute right-[20%] top-[24%] z-20 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#34D671] to-[#1FA857] shadow-[0_10px_22px_rgba(34,197,94,0.4),inset_0_-3px_6px_rgba(0,0,0,0.12)] ring-4 ring-white sm:h-12 sm:w-12">
        <Check className="h-5 w-5 text-white sm:h-6 sm:w-6" strokeWidth={3} />
      </div>

      {/* JAN card — simple square with coral top strip */}
      <div className="absolute right-[6%] top-[38%] z-20 w-[72px] overflow-hidden rounded-lg bg-white shadow-[0_10px_26px_rgba(11,19,84,0.14)] ring-1 ring-black/[0.03] transition-transform duration-300 hover:-translate-y-0.5 sm:w-[80px]">
        <div className="h-[5px] bg-gradient-to-r from-[#F4847A] to-[#F2A08F]" aria-hidden="true" />
        <div className="flex items-center justify-center py-4 sm:py-[1.125rem]">
          <span className="text-sm font-bold tracking-wide text-[#0B1354] sm:text-[15px]">JAN</span>
        </div>
      </div>

      {/* Survey Responses — top left */}
      <div className="absolute left-[2%] top-[32%] z-20 w-[min(48%,188px)] rounded-xl bg-white px-3.5 py-3 shadow-[0_12px_30px_rgba(11,19,84,0.14)] ring-1 ring-black/[0.03] transition-transform duration-300 hover:-translate-y-0.5 sm:w-[196px] sm:px-4 sm:py-3.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium text-[#0B1354] sm:text-xs">Survey Responses</p>
          <span className="text-[11px] font-semibold text-[#0B1354] sm:text-xs">100</span>
        </div>
        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#E8EAEF]">
          <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-primary/80 to-primary" />
        </div>
      </div>

      {/* Analytics — bottom left */}
      <div className="absolute bottom-[10%] left-[2%] z-20 w-[min(44%,168px)] rounded-xl bg-white px-3.5 py-3 shadow-[0_12px_30px_rgba(11,19,84,0.14)] ring-1 ring-black/[0.03] transition-transform duration-300 hover:-translate-y-0.5 sm:w-[176px] sm:px-4 sm:py-3.5">
        <div className="flex h-[4.5rem] items-end justify-between gap-[3px] sm:h-[5rem]">
          {ANALYTICS_BARS.map((fill, index) => (
            <div
              key={index}
              className="relative h-full w-full max-w-[9px] rounded-full bg-[#E8EAEF]"
            >
              <div
                className="absolute bottom-0 left-0 right-0 rounded-full bg-gradient-to-t from-[#1FA857] to-[#4ADE80]"
                style={{ height: `${fill}%` }}
              />
            </div>
          ))}
        </div>
        <p className="mt-2.5 text-center text-[11px] font-medium text-[#0B1354] sm:text-xs">
          Analytics
        </p>
      </div>
    </div>
  );
}
