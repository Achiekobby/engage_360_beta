import { BadgeCheck, Gift, MapPin, UserRound } from 'lucide-react';
import { REWARDS_CONFIG } from '../../../../constants/rewardsConfig';
import { FLOW_TITLE_ID, FlowBodyPanel, GhostButton, PrimaryButton } from '../FlowChrome';

export default function WelcomeStep({ gaps, onContinue, onClose }) {
  const sections = [
    gaps.needsLocation && { icon: MapPin, label: 'Add your location' },
    gaps.needsDetails && { icon: UserRound, label: 'Add your interests and email' },
  ].filter(Boolean);
  const potential = sections.length * REWARDS_CONFIG.profilePoints;

  return (
    <FlowBodyPanel className="pt-7 text-center">
      <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#6B3DF0] text-white shadow-[0_14px_30px_rgba(58,16,205,0.35)]">
        <Gift className="h-7 w-7" strokeWidth={2} />
        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-white bg-[#17A36B] text-white">
          <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
        </span>
      </div>

      <h2 id={FLOW_TITLE_ID} className="text-xl font-bold text-[#0B1354] sm:text-2xl">
        Number verified!
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#5B6180]">
        You’re one step away. Complete your profile to unlock{' '}
        <strong className="font-bold text-primary">{potential} bonus points</strong> and offers tailored to you.
      </p>

      <ul className="mx-auto mt-4 max-w-xs space-y-2 text-left">
        {sections.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center justify-between gap-3 rounded-xl border border-[#E8E4FB] bg-[#FAF9FF] px-3.5 py-2.5"
          >
            <span className="flex items-center gap-2.5 text-sm font-semibold text-[#0B1354]">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                <Icon className="h-4 w-4" strokeWidth={2.25} />
              </span>
              {label}
            </span>
            <span className="text-xs font-bold text-primary">+{REWARDS_CONFIG.profilePoints} pts</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 space-y-1">
        <PrimaryButton type="button" onClick={onContinue}>
          Get started
        </PrimaryButton>
        <GhostButton onClick={onClose}>Maybe later</GhostButton>
      </div>
    </FlowBodyPanel>
  );
}
