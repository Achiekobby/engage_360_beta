import PlatformReportsSection from './PlatformReportsSection';
import { buildHolidayReport } from './holidayReportsData';

const HOLIDAY_THEME = {
  iconClass: 'text-primary',
  selectClass:
    'border-[#E4E4E7] text-[#0B1354] hover:border-primary/30 focus:border-primary/40 focus:ring-primary/15',
  titleClass: 'text-[#0B1354]',
  valueClass: 'text-[#0B1354]',
  chipClass: 'bg-[#EDE8F8] text-primary',
  rateLabelClass: 'text-[#717171]',
  tabActiveClass: 'bg-primary text-white shadow-sm',
};

export default function HolidayReportsSection() {
  return (
    <PlatformReportsSection
      buildReport={buildHolidayReport}
      theme={HOLIDAY_THEME}
      scopeNoun="holiday & festive season"
      statsReportLabel="Holiday stats report"
      insightsSubtitle="Cross-business delivery, channel, approval, and festive pipeline health."
      deepDiveSubtitle="Funnel, rate breakdown, and click-to-conversion trends for holiday automations."
    />
  );
}
