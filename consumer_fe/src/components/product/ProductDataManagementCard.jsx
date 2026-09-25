import { Activity, FileUp, Filter, Search, Shield, UserPlus } from 'lucide-react';
import {
  LIFECYCLE_STATS,
  REGISTRATION_FORM_FIELDS,
} from './productDataManagementData';

const ICONS = {
  userPlus: UserPlus,
  fileUp: FileUp,
  filter: Filter,
  activity: Activity,
  search: Search,
  shield: Shield,
};

function RegistrationVisual() {
  return (
    <div className="w-full max-w-[280px] shrink-0 bg-[#E8F4FC] p-4 sm:max-w-[300px] sm:p-5">
      <div className="space-y-2">
        {REGISTRATION_FORM_FIELDS.map(({ label, value }) => (
          <div
            key={label}
            className="border border-[#E4E4E7] bg-white px-3 py-2.5 text-xs italic sm:text-[13px]"
          >
            <span className="text-[#717171]">{label}: </span>
            <span className="text-[#0B1354]">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LifecycleVisual() {
  return (
    <div className="flex shrink-0 gap-3">
      {LIFECYCLE_STATS.map(({ label, value, bg, text }) => (
        <div key={label} className={`px-5 py-4 ${bg}`}>
          <span className={`text-[10px] font-bold tracking-wide ${text}`}>{label}</span>
          <p className="mt-1 text-2xl font-bold text-[#0B1354]">{value}</p>
        </div>
      ))}
    </div>
  );
}

function CardVisual({ type }) {
  if (type === 'registration') return <RegistrationVisual />;
  if (type === 'lifecycle') return <LifecycleVisual />;
  return null;
}

function CardIcon({ icon, iconBg, iconColor }) {
  const Icon = ICONS[icon];

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${iconBg} ${iconColor}`}
    >
      <Icon className="h-5 w-5" strokeWidth={2} />
    </div>
  );
}

function CardCopy({ title, description }) {
  return (
    <>
      <h3 className="text-lg font-bold text-[#0B1354] sm:text-xl">{title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-[#717171] sm:text-[15px] sm:leading-7">
        {description}
      </p>
    </>
  );
}

export default function ProductDataManagementCard({
  title,
  description,
  icon,
  iconBg,
  iconColor,
  visual,
}) {
  const hasVisual = visual === 'registration' || visual === 'lifecycle';

  if (hasVisual) {
    return (
      <article className="flex h-full flex-col rounded-lg border border-[#EEF0F4] bg-white p-6 shadow-[0_4px_24px_rgba(11,19,84,0.04)] sm:p-8">
        <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="min-w-0 flex-1">
            <CardIcon icon={icon} iconBg={iconBg} iconColor={iconColor} />
            <div className="mt-5">
              <CardCopy title={title} description={description} />
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <CardVisual type={visual} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col rounded-lg border border-[#EEF0F4] bg-white p-6 shadow-[0_4px_24px_rgba(11,19,84,0.04)] sm:p-8">
      <CardIcon icon={icon} iconBg={iconBg} iconColor={iconColor} />
      <div className="mt-5">
        <CardCopy title={title} description={description} />
      </div>
    </article>
  );
}
