import { ArrowRight, Megaphone, Sparkles, X } from 'lucide-react';
import AnimatedModal from '../motion/AnimatedModal';

const ROUTES = [
  {
    id: 'direct',
    title: 'Start from scratch',
    description: 'Write your own message, pick a channel, and launch with full control.',
    icon: Megaphone,
    accent: 'from-primary to-[#6B4FE0]',
    iconBg: 'bg-white/15 text-white',
    badge: 'Build your own',
  },
  {
    id: 'template',
    title: 'Start with a template',
    description: 'Start from a polished promo design, then customize copy and audience.',
    icon: Sparkles,
    accent: 'from-[#E67E22] to-[#F5A623]',
    iconBg: 'bg-white/15 text-white',
    badge: 'Quickest way',
  },
];

export default function CampaignRouteModal({ isOpen, onClose, onSelectRoute }) {
  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      panelClassName="relative w-full max-w-2xl overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_24px_64px_rgba(11,19,84,0.18)]"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-sm text-[#717171] transition-colors hover:bg-[#F7F8FF] hover:text-[#0B1354]"
        aria-label="Close"
      >
        <X className="h-5 w-5" strokeWidth={2} />
      </button>

      <div className="border-b border-[#F0F2F7] px-6 py-6 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">New Campaign</p>
        <h2 className="mt-1 text-2xl font-bold text-[#0B1354]">How do you want to create?</h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#717171]">
          Both paths use the same 4-step wizard. Templates simply pre-fill your content and
          unlock a richer promotional preview.
        </p>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
        {ROUTES.map(({ id, title, description, icon: Icon, accent, badge }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelectRoute(id)}
            className="group flex cursor-pointer flex-col overflow-hidden rounded-sm border border-[#EEF0F4] bg-white text-left shadow-[0_4px_20px_rgba(11,19,84,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_36px_rgba(58,16,205,0.14)]"
          >
            <div className={`bg-gradient-to-br ${accent} px-5 py-6`}>
              <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-white/15 text-white backdrop-blur-sm transition-transform group-hover:scale-105">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-white/80">
                {badge}
              </p>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-base font-bold text-[#0B1354]">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#717171]">{description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Continue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </AnimatedModal>
  );
}
