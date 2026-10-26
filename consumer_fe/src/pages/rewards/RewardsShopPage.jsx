import { useCallback, useMemo, useState } from 'react';
import { Smartphone } from 'lucide-react';
import { formatGhanaPhone } from '../../constants/ghanaNetworks';
import { REWARDS, TELCO_NETWORKS } from '../../constants/rewardsCatalog';
import useRecipient from '../../hooks/useRecipient';
import RewardFlow from '../../components/recipient-offer/reward-flow/RewardFlow';
import RedeemDialog from '../../components/rewards/redeem/RedeemDialog';
import PointsWalletCard from '../../components/rewards/shop/PointsWalletCard';
import ProfileNudge from '../../components/rewards/shop/ProfileNudge';
import RewardFilterTabs from '../../components/rewards/shop/RewardFilterTabs';
import RewardGrid from '../../components/rewards/shop/RewardGrid';

const TABS = [
  { id: 'all', label: 'All Rewards', count: REWARDS.length },
  ...TELCO_NETWORKS.map((network) => ({
    id: network.id,
    label: network.label,
    count: REWARDS.filter((reward) => reward.network === network.id).length,
  })),
];

export default function RewardsShopPage() {
  const { phone, wallet, gaps, now } = useRecipient();
  const [filter, setFilter] = useState('all');
  const [redeem, setRedeem] = useState({ reward: null, open: false, key: 0 });
  const [profileOpen, setProfileOpen] = useState(false);

  const visibleRewards = useMemo(
    () => (filter === 'all' ? REWARDS : REWARDS.filter((reward) => reward.network === filter)),
    [filter],
  );

  const openRedeem = useCallback(
    (reward) => setRedeem((current) => ({ reward, open: true, key: current.key + 1 })),
    [],
  );
  const closeRedeem = useCallback(() => setRedeem((current) => ({ ...current, open: false })), []);
  const closeProfile = useCallback(() => setProfileOpen(false), []);

  return (
    <div className="space-y-6 sm:space-y-8">
      <PointsWalletCard wallet={wallet} rewards={REWARDS} now={now} />

      {gaps.count > 0 ? <ProfileNudge gaps={gaps} onComplete={() => setProfileOpen(true)} /> : null}

      <section aria-labelledby="airtime-rewards">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <h1 id="airtime-rewards" className="text-2xl font-extrabold text-[#0B1354] sm:text-[28px]">
              Redeem airtime
            </h1>
            <p className="mt-1 max-w-xl text-sm text-[#6B7191]">
              Airtime goes to your verified number. Choose the network that number is on today — porting keeps the
              old prefix, so a 024 line is not always MTN.
            </p>
          </div>
          <p className="inline-flex items-center gap-2 rounded-full border border-[#DDE0EA] bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[#3A3F66]">
            <Smartphone className="h-4 w-4 text-primary" strokeWidth={2.25} />
            Sent to <span className="tabular-nums text-[#0B1354]">{formatGhanaPhone(phone)}</span>
          </p>
        </div>

        <RewardFilterTabs tabs={TABS} active={filter} onChange={setFilter} />

        <div className="mt-5">
          <RewardGrid rewards={visibleRewards} wallet={wallet} onRedeem={openRedeem} />
        </div>
      </section>

      {redeem.reward ? (
        <RedeemDialog key={redeem.key} reward={redeem.reward} open={redeem.open} onClose={closeRedeem} />
      ) : null}

      <RewardFlow open={profileOpen} onClose={closeProfile} />
    </div>
  );
}
