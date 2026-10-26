import { Gift, Megaphone, Wallet, Smartphone, Clock3, ShieldCheck, Repeat } from 'lucide-react';
import { AIRTIME_AMOUNTS_GHS } from '../../constants/rewardsCatalog';
import { REWARDS_CONFIG } from '../../constants/rewardsConfig';

const { profilePoints, pointsPerCedi, pointsValidityDays, clearingHours, maxRedemptionsPerDay } = REWARDS_CONFIG;
const amounts = AIRTIME_AMOUNTS_GHS.map((amount) => `GHS ${amount}`).join(', ');
const validityMonths = Math.round(pointsValidityDays / 30);

export const EARN_STEPS = [
  {
    id: 1,
    icon: Megaphone,
    title: 'Engage with brands’ campaigns',
    description:
      'Open offers from brands you hear from by SMS, email or WhatsApp, then complete the action they ask for: a purchase, a sign-up, a form or an event registration.',
  },
  {
    id: 2,
    icon: Wallet,
    title: 'Collect your points',
    description: `Points land in your wallet once the brand confirms your action (usually within ${clearingHours} hours). Completing your profile adds ${profilePoints} points per section instantly.`,
  },
  {
    id: 3,
    icon: Gift,
    title: 'Redeem a reward',
    description: `Swap points for airtime (${amounts}) on MTN, Telecel or AT. Every ${pointsPerCedi} points is worth GHS 1.`,
  },
];

export const GOOD_TO_KNOW = [
  {
    icon: Clock3,
    title: `Points last ${validityMonths} months`,
    description: 'Older points are used first when you redeem, so nothing is wasted.',
  },
  {
    icon: Smartphone,
    title: 'Airtime goes to your verified number',
    description:
      'Airtime is sent to the number you verified. You choose the network that number is on now, because a ported line keeps its old prefix.',
  },
  {
    icon: Repeat,
    title: `Up to ${maxRedemptionsPerDay} redemptions a day`,
    description: 'A daily limit keeps every account safe from misuse.',
  },
  {
    icon: ShieldCheck,
    title: 'One reward per action',
    description: 'Each completed action is rewarded once, so repeat clicks won’t add points.',
  },
];

export const FAQ_ITEMS = [
  {
    id: 'open-link',
    question: 'Do I earn points just by opening a link?',
    answer:
      'No. Opening a link only takes you to the offer. Points are credited after you complete the action the campaign asks for and it has been confirmed, for example a purchase, a sign-up or a registration.',
  },
  {
    id: 'how-many',
    question: 'How many points can I earn?',
    answer: `It depends on the campaign; each offer shows what you need to do. You can also earn ${profilePoints} points for each profile section you complete (location, then interests and email). Each section is rewarded once.`,
  },
  {
    id: 'when-appear',
    question: 'When will my points appear?',
    answer: `Profile points are added instantly. Points for purchases and sign-ups show as Pending until the brand confirms the action, usually within ${clearingHours} hours, then move to Earned.`,
  },
  {
    id: 'redeem-for',
    question: 'What can I redeem my points for?',
    answer: `Right now you can redeem airtime for MTN, Telecel and AT in these amounts: ${amounts}. Every ${pointsPerCedi} points is worth GHS 1. Pick the network your number is on today. Porting does not change the number, so a prefix that looks like MTN may now be Telecel or AT. More rewards are coming soon.`,
  },
  {
    id: 'expire',
    question: 'Do my points expire?',
    answer: `Yes. Points expire ${validityMonths} months after you earn them. When you redeem, the points closest to expiring are used first. Expired points appear under “Points expired” on the Track points page.`,
  },
  {
    id: 'not-credited',
    question: 'Why were my points not credited?',
    answer:
      'The most common reasons are: the action has not been confirmed yet (it will show as Pending), the action was already rewarded once, or it was completed with a different phone number or email. If you still can’t see them, contact us with the offer name and your number.',
  },
  {
    id: 'help',
    question: 'How do I get help?',
    answer:
      'Use the Contact us page to message our support team, or call or WhatsApp us directly. Include your verified number and what you need help with so we can resolve it quickly.',
  },
];
