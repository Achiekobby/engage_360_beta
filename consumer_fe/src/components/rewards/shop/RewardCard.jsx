import { Coins, Lock } from 'lucide-react';

/**
 * One reward. The footer button reflects `availability` (from getRewardAvailability):
 * available → purple CTA; otherwise a disabled state that says exactly why.
 */
export default function RewardCard({ reward, availability, balance, onRedeem }) {
  const canRedeem = availability.state === 'available';
  const progress = Math.min(100, Math.round((balance / reward.points) * 100));

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
        canRedeem
          ? 'border-[#E6E8F0] shadow-[0_8px_24px_rgba(11,19,84,0.06)] hover:-translate-y-1 hover:border-[#3A10CD]/30 hover:shadow-[0_18px_38px_rgba(58,16,205,0.16)]'
          : 'border-[#E6E8F0] shadow-[0_4px_14px_rgba(11,19,84,0.04)]'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F0F2F7]">
        <img
          src={reward.image}
          alt={`${reward.networkLabel} logo`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-[#0B1354] shadow-[0_4px_12px_rgba(11,19,84,0.18)] sm:left-3 sm:top-3 sm:text-[13px]">
          GHS {reward.amountGhs}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="text-sm font-bold text-[#0B1354] sm:text-base">{reward.title}</h3>
        <p className="mt-0.5 text-[13px] font-semibold text-[#0B1354] sm:text-sm">{reward.headline}</p>
        <p className="mt-0.5 text-xs leading-snug text-[#6B7191]">{reward.description}</p>

        <div className="mt-3 flex items-center gap-1.5 text-base font-extrabold text-primary sm:text-lg">
          <Coins className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.5} />
          {reward.points.toLocaleString()} pts
        </div>

        <div className="mt-auto pt-3 sm:pt-4">
          {availability.state === 'insufficient' ? (
            <div
              className="mb-2 h-1.5 overflow-hidden rounded-full bg-[#ECEEF5]"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label={`${progress}% of the points needed`}
            >
              <div className="h-full rounded-full bg-[#3A10CD]/70" style={{ width: `${progress}%` }} />
            </div>
          ) : null}

          <button
            type="button"
            disabled={!canRedeem}
            onClick={() => onRedeem(reward)}
            title={availability.message || undefined}
            className={`inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl px-2 text-[13px] font-semibold transition-[background-color,transform,box-shadow] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-11 sm:text-sm ${
              canRedeem
                ? 'cursor-pointer bg-primary text-white shadow-[0_8px_18px_rgba(58,16,205,0.28)] hover:bg-[#320EB8] active:scale-[0.98]'
                : 'cursor-not-allowed bg-[#F0F2F7] text-[#7C829B]'
            }`}
          >
            {canRedeem ? null : <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />}
            <span className="truncate">{availability.label}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
