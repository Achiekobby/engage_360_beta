import { useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Activity,
  BadgeCheck,
  Radio,
  TrendingUp,
  Wallet,
  Workflow,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { clsx } from 'clsx';
import { PageHeading } from '../../components/layout/PageBackLink';
import { springTransition, stepTransition } from '../../components/motion/motionPresets';
import {
  AdoptionTab,
  ApprovalTab,
  ChannelsTab,
  OverviewTab,
  PlatformAutomationsFilters,
  RevenueTab,
} from '../../components/settings/PlatformAutomationsViews';
import {
  PLATFORM_AUTOMATION_TABS,
  PLATFORM_BUSINESS_FILTERS,
  PLATFORM_DATE_FILTERS,
  buildPlatformAutomationsBundle,
} from '../../components/settings/platformAutomationsData';

const TAB_ICONS = {
  overview: Activity,
  adoption: TrendingUp,
  channels: Radio,
  approval: BadgeCheck,
  revenue: Wallet,
};

function resolveParam(value, options, fallback) {
  return options.some((item) => item.id === value || item.value === value) ? value : fallback;
}

function TabPanel({ tab, direction, reduceMotion, children }) {
  if (reduceMotion) {
    return <div className="mt-6">{children}</div>;
  }

  const offset = direction >= 0 ? 18 : -18;

  return (
    <div className="mt-6 overflow-hidden">
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={tab}
          custom={direction}
          initial={{ opacity: 0, x: offset, y: 6 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -offset * 0.6, y: -4 }}
          transition={stepTransition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function PlatformAutomationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const reduceMotion = useReducedMotion();
  const directionRef = useRef(1);

  const tab = resolveParam(
    searchParams.get('tab'),
    PLATFORM_AUTOMATION_TABS,
    'overview',
  );
  const dateFilter = resolveParam(
    searchParams.get('range'),
    PLATFORM_DATE_FILTERS.map((item) => ({ id: item.value })),
    '30d',
  );
  const businessId = resolveParam(
    searchParams.get('business'),
    PLATFORM_BUSINESS_FILTERS.map((item) => ({ id: item.value })),
    'all',
  );
  const approvalMode = resolveParam(
    searchParams.get('approval'),
    [{ id: 'business' }, { id: 'auto' }],
    'business',
  );

  const patchParams = (patch) => {
    if (patch.tab && patch.tab !== tab) {
      const from = PLATFORM_AUTOMATION_TABS.findIndex((item) => item.id === tab);
      const to = PLATFORM_AUTOMATION_TABS.findIndex((item) => item.id === patch.tab);
      directionRef.current = to >= from ? 1 : -1;
    }

    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (
        value == null ||
        value === '' ||
        (key === 'tab' && value === 'overview') ||
        (key === 'range' && value === '30d') ||
        (key === 'business' && value === 'all') ||
        (key === 'approval' && value === 'business')
      ) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    setSearchParams(next, { replace: true });
  };

  const bundle = useMemo(
    () => buildPlatformAutomationsBundle({ businessId, dateFilter, approvalMode }),
    [businessId, dateFilter, approvalMode],
  );

  const activeMeta = {
    overview: bundle.overview,
    adoption: bundle.adoption,
    channels: bundle.channels,
    approval: bundle.approval,
    revenue: bundle.revenue,
  }[tab];

  const panel = {
    overview: <OverviewTab data={bundle.overview} />,
    adoption: <AdoptionTab data={bundle.adoption} />,
    channels: <ChannelsTab data={bundle.channels} />,
    approval: (
      <ApprovalTab
        data={bundle.approval}
        approvalMode={approvalMode}
        onModeChange={(value) => patchParams({ approval: value })}
      />
    ),
    revenue: <RevenueTab data={bundle.revenue} />,
  }[tab];

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageHeading
        title={activeMeta.title}
        description={activeMeta.subtitle}
        actions={
          <span className="inline-flex items-center gap-2 rounded-full bg-[#EDE8F8] px-3 py-1.5 text-xs font-semibold text-primary">
            <Workflow className="h-3.5 w-3.5" strokeWidth={2.25} />
            Platform automations
          </span>
        }
      >
        <div className="flex w-full min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div
              role="tablist"
              aria-label="Automation analytics sections"
              className="inline-flex w-max max-w-none items-center gap-0.5 rounded-full border border-[#EEF0F4] bg-[#F4F5F7] p-1 shadow-[inset_0_1px_2px_rgba(11,19,84,0.04)]"
            >
              {PLATFORM_AUTOMATION_TABS.map((item) => {
                const active = tab === item.id;
                const Icon = TAB_ICONS[item.id] ?? Activity;

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => patchParams({ tab: item.id })}
                    className={clsx(
                      'relative shrink-0 cursor-pointer rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 sm:px-3.5',
                      active
                        ? 'text-white'
                        : 'text-[#717171] hover:text-[#0B1354]',
                    )}
                  >
                    {active && !reduceMotion ? (
                      <motion.span
                        layoutId="platform-automations-tab-pill"
                        className="absolute inset-0 rounded-full bg-primary shadow-[0_6px_16px_rgba(58,16,205,0.28)]"
                        transition={springTransition}
                      />
                    ) : null}
                    {active && reduceMotion ? (
                      <span className="absolute inset-0 rounded-full bg-primary shadow-[0_6px_16px_rgba(58,16,205,0.28)]" />
                    ) : null}

                    <span className="relative z-10 inline-flex items-center gap-1.5 whitespace-nowrap">
                      <Icon
                        className={clsx(
                          'h-3.5 w-3.5 transition-transform duration-200',
                          active ? 'scale-110' : 'opacity-80',
                        )}
                        strokeWidth={2.25}
                      />
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex shrink-0 justify-start lg:justify-end">
            <PlatformAutomationsFilters
              dateFilter={dateFilter}
              businessId={businessId}
              onDateChange={(value) => patchParams({ range: value })}
              onBusinessChange={(value) => patchParams({ business: value })}
            />
          </div>
        </div>
      </PageHeading>

      <TabPanel tab={tab} direction={directionRef.current} reduceMotion={reduceMotion}>
        {panel}
      </TabPanel>
    </div>
  );
}
