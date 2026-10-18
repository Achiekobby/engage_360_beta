import { Link } from 'react-router-dom';
import {
  Award,
  BarChart3,
  Gift,
  MessageSquare,
  PartyPopper,
  Wallet,
} from 'lucide-react';
import { clsx } from 'clsx';

const KIND_VISUALS = {
  birthday: {
    icon: Gift,
    accent: 'from-[#5B21B6] via-primary to-[#2563EB]',
    iconWrap: 'bg-gradient-to-br from-[#5B21B6] to-primary',
    chip: 'Birthday automations',
    chipClass: 'bg-[#EDE8F8] text-primary',
    panel: 'from-[#F7F5FF] via-white to-[#EFF6FF]',
    tabActive: 'bg-primary text-white shadow-sm',
    cta: 'bg-primary shadow-[0_8px_20px_rgba(58,16,205,0.28)] hover:bg-primary/90 focus-visible:ring-primary/30',
    borderSoft: 'border-[#EDE8F8]/80',
  },
  welcome: {
    icon: MessageSquare,
    accent: 'from-[#155E75] via-[#0E7490] to-[#14B8A6]',
    iconWrap: 'bg-gradient-to-br from-[#0E7490] to-[#14B8A6]',
    chip: 'Welcome automations',
    chipClass: 'bg-[#CCFBF1] text-[#0F766E]',
    panel: 'from-[#F0FDFA] via-white to-[#ECFEFF]',
    tabActive: 'bg-[#0E7490] text-white shadow-sm',
    cta: 'bg-[#0E7490] shadow-[0_8px_20px_rgba(14,116,144,0.28)] hover:bg-[#0F766E] focus-visible:ring-[#0891B2]/35',
    borderSoft: 'border-[#CFFAFE]/90',
  },
  anniversary: {
    icon: Award,
    accent: 'from-[#4338CA] via-primary to-[#2563EB]',
    iconWrap: 'bg-gradient-to-br from-[#4338CA] to-primary',
    chip: 'Anniversary automations',
    chipClass: 'bg-[#EDE8F8] text-primary',
    panel: 'from-[#F7F5FF] via-white to-[#EFF6FF]',
    tabActive: 'bg-primary text-white shadow-sm',
    cta: 'bg-primary shadow-[0_8px_20px_rgba(58,16,205,0.28)] hover:bg-primary/90 focus-visible:ring-primary/30',
    borderSoft: 'border-[#EDE8F8]/80',
  },
  holidays: {
    icon: Wallet,
    accent: 'from-[#0B1354] via-primary to-[#2563EB]',
    iconWrap: 'bg-gradient-to-br from-[#0B1354] to-primary',
    chip: 'Holiday automations',
    chipClass: 'bg-[#EEF2FF] text-[#0B1354]',
    panel: 'from-[#F8F9FC] via-white to-[#EFF6FF]',
    tabActive: 'bg-primary text-white shadow-sm',
    cta: 'bg-primary shadow-[0_8px_20px_rgba(58,16,205,0.28)] hover:bg-primary/90 focus-visible:ring-primary/30',
    borderSoft: 'border-[#EDE8F8]/80',
  },
};

export default function AutomationsPageHeader({
  kindMeta,
  activeSection = 'automations',
  sectionTabs = [],
  onSectionChange,
  showAnalyticsCta = true,
}) {
  const visual = KIND_VISUALS[kindMeta?.id] || KIND_VISUALS.birthday;
  const Icon = visual.icon;
  const showSectionTabs = sectionTabs.length > 0;

  return (
    <header
      className={clsx(
        'admin-card relative overflow-hidden rounded-2xl border border-[#EEF0F4] bg-gradient-to-br',
        visual.panel,
      )}
    >
      <div
        className={clsx('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', visual.accent)}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-primary/5 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 left-1/3 h-36 w-36 rounded-full bg-[#93C5FD]/20 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
            <span
              className={clsx(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_10px_24px_rgba(58,16,205,0.28)] sm:h-14 sm:w-14',
                visual.iconWrap,
              )}
            >
              <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
            </span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={clsx(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
                    visual.chipClass,
                  )}
                >
                  {kindMeta?.id === 'birthday' ? (
                    <PartyPopper className="h-3 w-3" strokeWidth={2.25} />
                  ) : null}
                  {visual.chip}
                </span>
                {activeSection === 'reports' ? (
                  <span className="inline-flex rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-[#717171] ring-1 ring-[#E4E4E7]">
                    Platform view
                  </span>
                ) : null}
              </div>

              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0B1354] sm:text-3xl">
                {kindMeta?.title}
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#717171] sm:text-base">
                {kindMeta?.description}
              </p>
            </div>
          </div>

          {showAnalyticsCta && activeSection === 'automations' ? (
            <Link
              to={`/automations/${kindMeta.id}/analytics`}
              className={clsx(
                'inline-flex shrink-0 cursor-pointer items-center gap-2 self-start rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2',
                visual.cta,
              )}
            >
              <BarChart3 className="h-4 w-4" strokeWidth={2} />
              View Analytics
            </Link>
          ) : null}
        </div>

        {showSectionTabs ? (
          <div className={clsx('mt-5 border-t pt-4', visual.borderSoft)}>
            <div className="inline-flex rounded-full bg-white/90 p-1 shadow-[0_1px_2px_rgba(11,19,84,0.05)] ring-1 ring-[#EEF0F4]">
              {sectionTabs.map((tab) => {
                const active = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onSectionChange?.(tab.id)}
                    className={clsx(
                      'cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5',
                      active
                        ? visual.tabActive
                        : 'bg-transparent text-[#717171] hover:text-[#0B1354]',
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
