import { ArrowRight, Bell, Globe, Megaphone, MessageCircleWarning, Target, UserPlus } from 'lucide-react';

const ICONS = {
  megaphone: Megaphone,
  userPlus: UserPlus,
  target: Target,
  bell: Bell,
  globe: Globe,
  messageAlert: MessageCircleWarning,
};

export default function CampaignGrowthCard({ title, description, icon }) {
  const Icon = ICONS[icon];

  return (
    <article className="flex h-full flex-col rounded-lg border border-[#EEF0F4] bg-white p-6 shadow-[0_4px_24px_rgba(11,19,84,0.04)] sm:p-8">
      <Icon className="h-6 w-6 text-[#0D9488]" strokeWidth={2} />

      <h3 className="mt-5 text-lg font-bold text-[#0B1354] sm:text-xl">{title}</h3>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#717171] sm:text-[15px] sm:leading-7">
        {description}
      </p>

      <a
        href="#"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
      >
        Learn more
        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
      </a>
    </article>
  );
}
