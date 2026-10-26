import { CalendarClock, Gift, TrendingDown, TrendingUp, Trophy } from 'lucide-react';

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

function Trend({ current, previous }) {
  if (!previous) return null;
  const change = Math.round(((current - previous) / previous) * 100);
  const up = change >= 0;
  const Icon = up ? TrendingUp : TrendingDown;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
        up ? 'bg-[#EFFBF4] text-[#17734A]' : 'bg-[#FFF3F3] text-[#B42328]'
      }`}
    >
      <Icon className="h-3 w-3" strokeWidth={2.75} />
      {up ? '+' : ''}
      {change}% vs last month
    </span>
  );
}

function StatCard({ icon: Icon, tone, label, hint, value, trend }) {
  return (
    <article className="flex flex-col rounded-2xl border border-[#E6E8F0] bg-white p-4 shadow-[0_6px_20px_rgba(11,19,84,0.05)] sm:p-5">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
        <Icon className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <p className="mt-4 text-[13px] font-semibold leading-tight text-[#5B6180]">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums text-[#0B1354]" title={`${value.toLocaleString()} pts`}>
        {value >= 100000 ? compact.format(value) : value.toLocaleString()}
        <span className="ml-1 text-sm font-semibold text-[#8A90A6]">pts</span>
      </p>
      <div className="mt-2 flex min-h-[22px] flex-wrap items-center gap-2 text-xs text-[#8A90A6]">
        <span>{hint}</span>
        {trend}
      </div>
    </article>
  );
}

export default function ActivityStatCards({ wallet }) {
  return (
    <section aria-labelledby="rewards-overview">
      <h2 id="rewards-overview" className="mb-4 text-xl font-bold text-[#0B1354]">
        Rewards Overview
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        <StatCard
          icon={Gift}
          tone="bg-[#EEE9FF] text-primary"
          label="Points earned"
          hint="This month"
          value={wallet.earnedThisMonth}
          trend={<Trend current={wallet.earnedThisMonth} previous={wallet.earnedLastMonth} />}
        />
        <StatCard
          icon={Trophy}
          tone="bg-[#E6F6EE] text-[#17A36B]"
          label="Total points earned"
          hint="All time"
          value={wallet.totalEarned}
        />
        <StatCard
          icon={CalendarClock}
          tone="bg-[#FFF1E3] text-[#E8780C]"
          label="Points expired"
          hint="Unused for 12 months"
          value={wallet.expiredPoints}
        />
        <StatCard
          icon={TrendingUp}
          tone="bg-[#E3F2FF] text-[#1F7BD8]"
          label="Total points redeemed"
          hint="All time"
          value={wallet.totalRedeemed}
          trend={<Trend current={wallet.redeemedThisMonth} previous={wallet.redeemedLastMonth} />}
        />
      </div>
    </section>
  );
}
