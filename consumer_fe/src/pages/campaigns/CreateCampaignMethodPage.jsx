import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  Mail,
  Megaphone,
  MessageSquare,
  PenLine,
  Send,
  Sparkles,
  Users,
} from 'lucide-react';
import { Reveal, StaggerItem, StaggerReveal } from '../../components/motion';
import { CAMPAIGNS_BASE } from '../../components/campaigns-module/campaignsNavData';
import {
  getCategoryMeta,
  isValidCampaignCategory,
} from '../../components/campaigns-module/campaignCategoryMeta';

const ROUTES = [
  {
    id: 'template',
    title: 'Start with a template',
    description:
      'Pick a ready-made SMS, WhatsApp, or email design for this category, preview it, then customize.',
    icon: Sparkles,
    badge: 'Quickest way',
    features: ['Matched to this category', 'Live preview', 'Easy to customize'],
    visual: 'template',
    href: (categoryId, fromHome) =>
      `${CAMPAIGNS_BASE}/create/templates?category=${categoryId}${fromHome ? '&from=home' : ''}`,
  },
  {
    id: 'direct',
    title: 'Start from scratch',
    description:
      'Write your own message, choose a channel, and set audience and schedule yourself.',
    icon: PenLine,
    badge: 'Build your own',
    features: ['Blank starting point', 'Any channel', 'Guided setup'],
    visual: 'direct',
    href: (categoryId, fromHome) =>
      `${CAMPAIGNS_BASE}/create/wizard?category=${categoryId}${fromHome ? '&from=home' : ''}`,
  },
];

const FLOATING_ICONS = [
  { Icon: Megaphone, className: 'left-[6%] top-[18%] text-primary', size: 36, delay: '0s' },
  { Icon: Mail, className: 'right-[8%] top-[14%] text-[#5B9FD4]', size: 32, delay: '0.8s' },
  { Icon: MessageSquare, className: 'left-[12%] bottom-[22%] text-primary', size: 40, delay: '1.4s' },
  { Icon: Bell, className: 'right-[10%] bottom-[28%] text-[#E67E22]', size: 28, delay: '0.4s' },
  { Icon: Send, className: 'left-[42%] top-[10%] text-primary', size: 26, delay: '1.1s' },
  { Icon: Users, className: 'right-[28%] bottom-[12%] text-[#6B4FE0]', size: 34, delay: '1.8s' },
  { Icon: Sparkles, className: 'left-[22%] top-[42%] text-[#E67E22]', size: 24, delay: '0.6s' },
  { Icon: Mail, className: 'right-[18%] top-[48%] text-primary', size: 22, delay: '2s' },
];

export default function CreateCampaignMethodPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const fromHome = searchParams.get('from') === 'home';

  if (!categoryId || !isValidCampaignCategory(categoryId)) {
    return <Navigate to={`${CAMPAIGNS_BASE}/create`} replace />;
  }

  const category = getCategoryMeta(categoryId);
  const CategoryIcon = category.icon;
  const backPath = fromHome
    ? `${CAMPAIGNS_BASE}?category=${categoryId}`
    : `${CAMPAIGNS_BASE}/create`;
  const backLabel = fromHome ? 'Back to campaigns' : 'Back to categories';
  const stepNumber = fromHome ? '1' : '2';

  return (
    <main className="relative min-h-[calc(100dvh-4rem)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(58,16,205,0.07),transparent)]" />
        {FLOATING_ICONS.map(({ Icon, className, size, delay }, index) => (
          <span
            key={`${Icon.displayName || Icon.name}-${index}`}
            className={`absolute hidden opacity-[0.12] sm:inline-flex ${className}`}
            style={{ animation: `float 5.5s ease-in-out ${delay} infinite` }}
          >
            <Icon style={{ width: size, height: size }} strokeWidth={1.5} />
          </span>
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Reveal variant="fadeUp" amount={0.15}>
          <div className="flex justify-end">
            <Link
              to={backPath}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#717171] transition-colors hover:text-primary"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EDE8F8] text-primary">
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              {backLabel}
            </Link>
          </div>
        </Reveal>

        <div className="mx-auto mt-8 max-w-4xl text-center">
          <Reveal variant="fadeUp" amount={0.15} delay={0.04}>
            <p className="inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                {stepNumber}
              </span>
              New Campaign
            </p>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#0B1354] sm:text-3xl">
              How do you want to create?
            </h1>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-[#717171]">Creating for</span>
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-[#F3F0FF] px-2.5 py-1 text-sm font-semibold text-primary ring-1 ring-primary/15">
                <CategoryIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                {category.label}
              </span>
            </div>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#717171] sm:text-base">
              Choose a ready-made design or build your own. Both options use the same setup steps
              for this {category.label.toLowerCase()} campaign.
            </p>
          </Reveal>

          <StaggerReveal className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6" stagger={0.1}>
            {ROUTES.map((route) => (
              <StaggerItem key={route.id}>
                <MethodRouteCard
                  route={route}
                  onSelect={() => navigate(route.href(categoryId, fromHome))}
                />
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </div>
    </main>
  );
}

function MethodRouteCard({ route, onSelect }) {
  const Icon = route.icon;
  const isTemplate = route.visual === 'template';

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex h-full w-full cursor-pointer flex-col border-2 border-[#D4D8E4] bg-white/95 p-5 text-left shadow-[0_4px_20px_rgba(11,19,84,0.04)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_16px_36px_rgba(58,16,205,0.12)] sm:p-6"
    >
      <div
        className="mb-5 overflow-hidden rounded-sm px-4 py-5"
        style={{
          background: isTemplate
            ? 'linear-gradient(145deg, #FFF8F0 0%, #FFE8D1 100%)'
            : 'linear-gradient(145deg, #F5F2FF 0%, #E4DCFF 100%)',
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <span
            className={`inline-flex h-11 w-11 items-center justify-center rounded-sm text-white shadow-sm transition-transform duration-300 group-hover:scale-105 ${
              isTemplate
                ? 'bg-gradient-to-br from-[#E67E22] to-[#F5A623]'
                : 'bg-gradient-to-br from-primary to-[#6B4FE0]'
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
              isTemplate
                ? 'bg-white/90 text-[#C45F10] ring-1 ring-[#E67E22]/20'
                : 'bg-white/90 text-primary ring-1 ring-primary/15'
            }`}
          >
            {route.badge}
          </span>
        </div>
      </div>

      <h2 className="text-lg font-bold tracking-tight text-[#0B1354] sm:text-xl">{route.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#717171]">{route.description}</p>

      <ul className="mt-4 space-y-2">
        {route.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-sm text-[#545454]">
            <span
              className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                isTemplate ? 'bg-[#FFF4E8] text-[#E67E22]' : 'bg-[#EDE8F8] text-primary'
              }`}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <span
        className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${
          isTemplate ? 'text-[#C45F10]' : 'text-primary'
        }`}
      >
        Continue
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          strokeWidth={2.5}
        />
      </span>
    </button>
  );
}
