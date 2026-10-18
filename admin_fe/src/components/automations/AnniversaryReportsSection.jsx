import PlatformReportsSection from './PlatformReportsSection';
import { buildAnniversaryReport } from './anniversaryReportsData';

const ANNIVERSARY_THEME = {
  iconClass: 'text-[#BE185D]',
  selectClass:
    'border-[#FBCFE8] text-[#9F1239] hover:border-[#F9A8D4] focus:border-[#BE185D] focus:ring-[#BE185D]/20',
  titleClass: 'text-[#9F1239]',
  valueClass: 'text-[#BE185D]',
  chipClass: 'bg-[#FCE7F3] text-[#BE185D]',
  rateLabelClass: 'text-[#BE185D]',
  tabActiveClass: 'bg-[#BE185D] text-white shadow-sm',
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
