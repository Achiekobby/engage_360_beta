import { memo } from 'react';
import { SearchX } from 'lucide-react';
import { getRewardAvailability } from '../../../services/recipient';
import RewardCard from './RewardCard';

/** 2 columns on mobile, 4 on desktop. */
function RewardGrid({ rewards, wallet, onRedeem }) {
  if (!rewards.length) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#D5D9E6] bg-white px-6 py-14 text-center">
        <SearchX className="h-8 w-8 text-[#9AA0B4]" strokeWidth={1.75} />
        <p className="mt-3 text-base font-bold text-[#0B1354]">No rewards here yet</p>
        <p className="mt-1 text-sm text-[#6B7191]">More reward types are coming soon.</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {rewards.map((reward) => (
        <li key={reward.id} className="min-w-0">
          <RewardCard
            reward={reward}
            availability={getRewardAvailability(reward, { wallet })}
            balance={wallet.balance}
            onRedeem={onRedeem}
          />
        </li>
      ))}
    </ul>
  );
}

export default memo(RewardGrid);
