import { useCallback, useMemo } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Reveal } from '../../components/motion';
import AnalyticsAudienceView from '../../components/automations/AnalyticsAudienceView';
import AnalyticsMetricsView from '../../components/automations/AnalyticsMetricsView';
import AnalyticsOverviewView from '../../components/automations/AnalyticsOverviewView';
import AutomationInsightNav from '../../components/automations/AutomationInsightNav';
import { getAutomationKindMeta } from '../../components/automations/automationsData';

function resolveTab(tabParam) {
  if (tabParam === 'audience' || tabParam === 'overview') return tabParam;
  return 'analytics';
}

export default function AutomationsAnalyticsPage() {
  const { kindId = 'birthday' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const kindMeta = useMemo(() => getAutomationKindMeta(kindId), [kindId]);
  const activeTab = resolveTab(searchParams.get('tab'));
  const backPath = `/automations/${kindMeta.id}`;

  const handleTabChange = useCallback(
    (tabId) => {
      if (tabId === 'analytics') {
        setSearchParams({}, { replace: true });
        return;
      }
      setSearchParams({ tab: tabId }, { replace: true });
    },
    [setSearchParams],
  );

  const tabLabel =
    activeTab === 'audience'
      ? 'Audience'
      : activeTab === 'overview'
        ? `${kindMeta.label} Overview`
        : 'Analytics';

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <Reveal when="load" variant="fadeUp" delay={0.04}>
        <div className="mb-6">
          <AutomationInsightNav
            kindId={kindMeta.id}
            activeTab={activeTab}
            backPath={backPath}
            onTabChange={handleTabChange}
          />
        </div>
      </Reveal>

      <Reveal when="load" variant="fadeUp" delay={0.08}>
        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium text-[#717171]">
          <Link to={backPath} className="hover:text-primary">
            Automations
          </Link>
          <span className="text-[#D4D4D8]" aria-hidden="true">
            /
          </span>
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="cursor-pointer hover:text-primary"
          >
            {kindMeta.title}
          </button>
          <span className="text-[#D4D4D8]" aria-hidden="true">
            /
          </span>
          <span className="text-primary">{tabLabel}</span>
        </div>
      </Reveal>

      <Reveal when="load" variant="fadeUp" delay={0.1}>
        {activeTab === 'audience' ? (
          <AnalyticsAudienceView />
        ) : activeTab === 'overview' ? (
          <AnalyticsOverviewView
            kindId={kindMeta.id}
            onClose={() => navigate(backPath)}
          />
        ) : (
          <AnalyticsMetricsView kindId={kindMeta.id} />
        )}
      </Reveal>
    </div>
  );
}
