import { ArrowRight, Sparkles } from 'lucide-react';
import { REWARDS_CONFIG } from '../../../constants/rewardsConfig';

/** Shown while the recipient still has profile sections to complete. */
export default function ProfileNudge({ gaps, onComplete }) {
  const potential = gaps.count * REWARDS_CONFIG.profilePoints;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E4DEFB] bg-[#F7F5FF] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
          <Sparkles className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <div>
          <p className="text-[15px] font-bold text-[#0B1354]">Earn {potential} bonus points</p>
          <p className="text-sm text-[#5B6180]">
            Finish your profile — {gaps.count} quick step{gaps.count === 1 ? '' : 's'} left.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onComplete}
        className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-[#320EB8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Complete profile
        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
