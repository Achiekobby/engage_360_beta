import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Reveal } from '../../components/motion';
import AutomationInsightNav from '../../components/customer-engagement/automations/AutomationInsightNav';
import AutomationSettingsForm from '../../components/customer-engagement/automations/AutomationSettingsForm';
import {
  getPopulatedAutomationSettings,
  getSettingsCopy,
} from '../../components/customer-engagement/automations/settingsData';
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

export default function CustomerEngagementAutomationSettingsPage() {
  const { kindId = 'birthday' } = useParams();
  const navigate = useNavigate();
  const [savedNotice, setSavedNotice] = useState('');

  const copy = useMemo(() => getSettingsCopy(kindId), [kindId]);
  const kindMeta = useMemo(() => resolveKindMeta(kindId), [kindId]);
  const backPath = `${CUSTOMER_ENGAGEMENT_BASE}/automations`;

  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Reveal when="load" variant="fadeUp" delay={0.04}>
        <div className="mb-6">
          <AutomationInsightNav kindId={kindId} activeTab="overview" backPath={backPath} />
        </div>
      </Reveal>

      <Reveal when="load" variant="fadeUp" delay={0.06}>
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
          <span className="text-primary">Overview</span>
        </div>
      </Reveal>

      {savedNotice ? (
        <div className="mb-5 rounded-sm border border-[#C6F0D5] bg-[#E8F8EF] px-4 py-3 text-sm font-medium text-[#1F9D55]">
          {savedNotice}
        </div>
      ) : null}

      <AutomationSettingsForm
        initialValues={getPopulatedAutomationSettings()}
        title={copy.title}
        subtitle={copy.subtitle}
        onClose={() => navigate(backPath)}
        onSaved={() => {
          setSavedNotice('Automation settings saved successfully.');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </main>
  );
}
