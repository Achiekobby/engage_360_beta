import PlatformReportsSection from './PlatformReportsSection';
import { buildHolidayReport } from './holidayReportsData';

const HOLIDAY_THEME = {
  iconClass: 'text-[#C2410C]',
  selectClass:
    'border-[#FED7AA] text-[#9A3412] hover:border-[#FDBA74] focus:border-[#EA580C] focus:ring-[#EA580C]/20',
  titleClass: 'text-[#9A3412]',
  valueClass: 'text-[#C2410C]',
  chipClass: 'bg-[#FFF1E8] text-[#C2410C]',
  rateLabelClass: 'text-[#C2410C]',
  tabActiveClass: 'bg-[#C2410C] text-white shadow-sm',
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
