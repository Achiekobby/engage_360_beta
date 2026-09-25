import { Network, ShieldCheck, Zap } from 'lucide-react';

const ICONS = {
  modular: Zap,
  scalable: ShieldCheck,
  intelligence: Network,
};

export default function WhyChooseUsFeature({ id, title, description }) {
  const Icon = ICONS[id];

  return (
    <article className="flex gap-4 sm:gap-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#D6EAF8] text-[#2E7DAD] sm:h-12 sm:w-12">
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
