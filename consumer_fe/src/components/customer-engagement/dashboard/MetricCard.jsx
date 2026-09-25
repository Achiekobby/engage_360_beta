import {
  AlertCircle,
  CheckCircle,
  Copy,
  Files,
  FolderTree,
  PhoneOff,
  TrendingUp,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';

const ICONS = {
  users: Users,
  userPlus: UserPlus,
  userCheck: UserCheck,
  userMinus: UserMinus,
  checkCircle: CheckCircle,
  alertCircle: AlertCircle,
  copy: Copy,
  phoneOff: PhoneOff,
  folderTree: FolderTree,
  files: Files,
  trending: TrendingUp,
};

export default function MetricCard({ label, value, change, icon, accent, bar }) {
  const Icon = ICONS[icon];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E4E4E7] hover:shadow-[0_10px_28px_rgba(11,19,84,0.08)]">
      <div className={`h-0.5 w-full bg-gradient-to-r ${bar}`} aria-hidden="true" />

      <div className="flex flex-1 flex-col px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-start justify-between gap-3">
          <p className="text-base font-medium text-[#717171]">{label}</p>
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm transition-transform duration-300 group-hover:scale-105 ${accent}`}
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
          </div>
        </div>

        <p className="mt-4 text-[2rem] font-bold leading-none tracking-tight text-[#0B1354] sm:text-[2.15rem]">
          {value}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-sm bg-[#F7F8FF] px-2.5 py-1 text-sm font-semibold text-primary ring-1 ring-primary/10">
              <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
              {change}%
            </span>
            <span className="text-sm text-[#717171]">Last 30 days</span>
          </div>

          <div className="hidden items-end gap-0.5 sm:flex" aria-hidden="true">
            {[38, 52, 44, 60, 48, 64, 56].map((height, index) => (
              <span
                key={index}
                className={`w-1 rounded-full bg-gradient-to-t ${bar} opacity-40 transition-opacity duration-300 group-hover:opacity-70`}
                style={{ height: `${height * 0.22}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
