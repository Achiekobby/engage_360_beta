import { useNavigate } from 'react-router-dom';
import {
  Award,
  BarChart3,
  Bell,
  CalendarDays,
  Gift,
  MessageSquare,
  Settings,
  Wallet,
} from 'lucide-react';
import { CUSTOMER_ENGAGEMENT_BASE } from '../customerEngagementNavData';

const KIND_ICONS = {
  gift: Gift,
  message: MessageSquare,
  award: Award,
  calendar: CalendarDays,
  bell: Bell,
  wallet: Wallet,
};

export default function AutomationsPageHeader({ kind }) {
  const navigate = useNavigate();
  const Icon = KIND_ICONS[kind?.icon] ?? Gift;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white sm:h-12 sm:w-12">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-[#0B1354] sm:text-[1.75rem]">
            {kind?.title}
          </h1>
          <p className="mt-1 text-sm text-[#717171] sm:text-base">{kind?.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() =>
            navigate(
              `${CUSTOMER_ENGAGEMENT_BASE}/automations/${kind?.id || 'birthday'}/settings`,
            )
          }
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#E4E4E7] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B1354] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF]"
        >
          <Settings className="h-4 w-4" strokeWidth={2} />
          Settings
        </button>
        <button
          type="button"
          onClick={() =>
            navigate(
              `${CUSTOMER_ENGAGEMENT_BASE}/automations/${kind?.id || 'birthday'}/analytics`,
            )
          }
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#E4E4E7] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B1354] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF]"
        >
          <BarChart3 className="h-4 w-4" strokeWidth={2} />
          Analytics
        </button>
      </div>
    </div>
  );
}
