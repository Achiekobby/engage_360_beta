import { PartyPopper, Wallet } from 'lucide-react';
import { FLOW_TITLE_ID, FlowBodyPanel, GhostButton, PrimaryButton } from '../FlowChrome';

export default function DoneStep({ pointsEarned, balance, returning, onViewRewards, onClose }) {
  const earned = pointsEarned > 0;

  return (
    <FlowBodyPanel className="pt-7 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EFFBF4] text-[#17A36B] ring-8 ring-[#EFFBF4]/60">
        <PartyPopper className="h-7 w-7" strokeWidth={2} />
      </div>

      <h2 id={FLOW_TITLE_ID} className="text-xl font-bold text-[#0B1354] sm:text-2xl">
        {earned ? 'Points added!' : returning ? 'Welcome back!' : 'You’re all set!'}
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#5B6180]">
        {earned
          ? `You earned ${pointsEarned} points for completing your profile.`
          : 'Your profile is complete. Redeem your points for airtime any time.'}
      </p>

      <div className="mx-auto mt-5 flex max-w-xs items-center justify-between gap-3 rounded-2xl bg-gradient-to-br from-primary to-[#6B3DF0] px-5 py-4 text-left text-white shadow-[0_14px_30px_rgba(58,16,205,0.3)]">
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <Wallet className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="text-sm font-medium text-white/80">Available points</span>
        </span>
        <span className="text-xl font-bold tabular-nums">{balance.toLocaleString()}</span>
      </div>

      <div className="mt-5 space-y-1">
        <PrimaryButton type="button" onClick={onViewRewards}>
          View my rewards
        </PrimaryButton>
        <GhostButton onClick={onClose}>Keep browsing offers</GhostButton>
      </div>
    </FlowBodyPanel>
  );
}
