import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Gift, Hourglass, Repeat, Wallet } from 'lucide-react';
import { REWARDS_CONFIG } from '../../../constants/rewardsConfig';

const EXPIRY_WARNING_MS = 60 * 24 * 60 * 60 * 1000;

function Chip({ icon: Icon, children }) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
      <Icon className="h-3.5 w-3.5 text-white/80" strokeWidth={2.25} />
      {children}
    </li>
  );
}

/**
 * Wallet banner. The progress bar tracks the next reward the recipient can still unlock
 * (the cheapest one above their balance); when nothing is left to unlock it says so.
 */
export default function PointsWalletCard({ wallet, rewards, now }) {
  const nextReward = [...rewards].sort((a, b) => a.points - b.points).find((reward) => reward.points > wallet.balance);
  const progress = nextReward ? Math.min(100, Math.round((wallet.balance / nextReward.points) * 100)) : 100;
  const expiringSoon = wallet.nextExpiry && wallet.nextExpiry.at - now <= EXPIRY_WARNING_MS;
  const daysToExpiry = expiringSoon ? Math.max(1, Math.ceil((wallet.nextExpiry.at - now) / 86400000)) : 0;

  return (
    <section
      aria-label="Points wallet"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[#4B1FE2] to-[#6B3DF0] p-6 text-white shadow-[0_24px_48px_rgba(58,16,205,0.28)] sm:p-8"
    >
      <span aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
      <span aria-hidden className="pointer-events-none absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-white/[0.06]" />
      <Gift
        aria-hidden
        className="pointer-events-none absolute -bottom-6 right-6 hidden h-40 w-40 rotate-12 text-white/10 sm:block"
        strokeWidth={1.25}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-white/85">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              <Wallet className="h-4 w-4" strokeWidth={2.25} />
            </span>
            Points Wallet
          </p>
        </div>

        <Link
          to="/rewards/activity"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-[0_8px_20px_rgba(11,19,84,0.2)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Track points
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
      </div>

      <div className="relative mt-6">
        <p className="text-sm font-medium text-white/75">Available points</p>
        <p className="mt-1 flex items-baseline gap-2" aria-live="polite">
          <span className="text-[44px] font-extrabold leading-none tabular-nums sm:text-6xl">
            {wallet.balance.toLocaleString()}
          </span>
          <span className="text-lg font-semibold text-white/80">pts</span>
        </p>

        <div className="mt-5 max-w-xl">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="Progress to your next reward"
            className="h-2.5 overflow-hidden rounded-full bg-white/20"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FFE08A] to-[#FFB84D] transition-[width] duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-[13px] font-medium text-white/80">
            {nextReward
              ? `${(nextReward.points - wallet.balance).toLocaleString()} pts to unlock ${nextReward.networkLabel} GHS ${nextReward.amountGhs} airtime`
              : 'You have enough points for any airtime reward'}
          </p>
        </div>

        <ul className="mt-5 flex flex-wrap gap-2">
          {wallet.pendingPoints > 0 ? (
            <Chip icon={Hourglass}>{wallet.pendingPoints.toLocaleString()} pts pending</Chip>
          ) : null}
          {expiringSoon ? (
            <Chip icon={Clock}>
              {wallet.nextExpiry.points.toLocaleString()} pts expire in {daysToExpiry} day{daysToExpiry === 1 ? '' : 's'}
            </Chip>
          ) : null}
          <Chip icon={Repeat}>
            {wallet.redemptionsLeftToday} of {REWARDS_CONFIG.maxRedemptionsPerDay} redemptions left today
          </Chip>
        </ul>
      </div>
    </section>
  );
}
