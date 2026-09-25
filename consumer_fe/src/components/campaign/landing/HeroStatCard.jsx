import { ArrowUpRight } from 'lucide-react';

export default function HeroStatCard() {
  return (
    <div className="w-[170px] rounded-xl bg-white p-4 shadow-[0_10px_32px_rgba(11,19,84,0.1)] sm:w-[184px] sm:p-[1.125rem]">
      <div className="flex items-start gap-1">
        <span className="text-[1.875rem] font-bold leading-none text-primary sm:text-[2rem]">87%</span>
        <ArrowUpRight className="mt-0.5 h-5 w-5 text-primary sm:h-[1.375rem] sm:w-[1.375rem]" strokeWidth={2.5} />
      </div>
      <p className="mt-1 text-xs font-medium text-[#717171]">
        Increase in Engagement
      </p>
      <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-[#E8E4F8]">
        <div className="h-full w-[87%] rounded-full bg-primary" />
      </div>
    </div>
  );
}
