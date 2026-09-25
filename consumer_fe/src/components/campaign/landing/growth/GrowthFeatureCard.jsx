import { Briefcase, Target, UserPlus } from 'lucide-react';

const ICONS = {
  advertising: Target,
  talent: UserPlus,
  freelance: Briefcase,
};

export default function GrowthFeatureCard({ id, title, description }) {
  const Icon = ICONS[id];

  return (
    <article className="flex gap-4 rounded-xl border border-[#E4E6EC]/80 bg-white p-5 shadow-[0_4px_18px_rgba(11,19,84,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/10 hover:shadow-[0_12px_32px_rgba(11,19,84,0.08)] sm:gap-5 sm:p-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D6EAF8] text-[#2E7DAD] sm:h-12 sm:w-12">
        <Icon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-bold tracking-tight text-[#0B1354] sm:text-[1.05rem]">
          {title}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#717171] sm:text-sm">
          {description}
        </p>
      </div>
    </article>
  );
}
