import { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Reveal } from '../../components/motion';
import AnalyticsAudienceView from '../../components/customer-engagement/automations/AnalyticsAudienceView';
import AnalyticsMetricsView from '../../components/customer-engagement/automations/AnalyticsMetricsView';
import AutomationInsightNav from '../../components/customer-engagement/automations/AutomationInsightNav';
import {
  getKindMeta,
  getKindsForType,
} from '../../components/customer-engagement/automations/automationsData';
import { CUSTOMER_ENGAGEMENT_BASE } from '../../components/customer-engagement/customerEngagementNavData';

function resolveKindMeta(kindId) {
  return (
    getKindsForType('customers').find((kind) => kind.id === kindId) ||
    getKindsForType('calendar').find((kind) => kind.id === kindId) ||
    getKindMeta('customers', 'birthday')
  );
}

export default function CustomerEngagementAutomationAnalyticsPage() {
  const { kindId = 'birthday' } = useParams();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab = tabParam === 'audience' ? 'audience' : 'analytics';

  const kindMeta = useMemo(() => resolveKindMeta(kindId), [kindId]);
  const backPath = `${CUSTOMER_ENGAGEMENT_BASE}/automations`;

  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Reveal when="load" variant="fadeUp" delay={0.04}>
        <div className="mb-6">
          <AutomationInsightNav kindId={kindId} activeTab={activeTab} backPath={backPath} />
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
          <span className="text-primary">{kindMeta?.title || 'Birthday'}</span>
          <span className="text-[#D4D4D8]" aria-hidden="true">
            /
          </span>
          <span className="text-primary">
            {activeTab === 'audience' ? 'Audience' : 'Analytics'}
          </span>
        </div>
      </Reveal>

      <Reveal when="load" variant="fadeUp" delay={0.1}>
        {activeTab === 'audience' ? <AnalyticsAudienceView /> : <AnalyticsMetricsView />}
      </Reveal>
    </main>
  );
}
