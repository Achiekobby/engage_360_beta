import PlatformReportsSection from './PlatformReportsSection';
import { buildAnniversaryReport } from './anniversaryReportsData';

const ANNIVERSARY_THEME = {
  iconClass: 'text-primary',
  selectClass:
    'border-[#E4E4E7] text-[#0B1354] hover:border-primary/30 focus:border-primary/40 focus:ring-primary/15',
  titleClass: 'text-[#0B1354]',
  valueClass: 'text-[#0B1354]',
  chipClass: 'bg-[#EDE8F8] text-primary',
  rateLabelClass: 'text-[#717171]',
  tabActiveClass: 'bg-primary text-white shadow-sm',
};

export default function AnniversaryReportsSection() {
  return (
    <PlatformReportsSection
      buildReport={buildAnniversaryReport}
      theme={ANNIVERSARY_THEME}
      scopeNoun="customer anniversary"
      statsReportLabel="Anniversary stats report"
      insightsSubtitle="Cross-business delivery, channel, approval, and anniversary pipeline health."
      deepDiveSubtitle="Funnel, rate breakdown, and click-to-conversion trends for anniversary automations."
    />
  );
}
