export const CAMPAIGN_MESSAGE_SECTION = {
  title: 'The Right Message at the Right Time',
  subtitle:
    'Deliver the right message to the right audience at the right time with our unified communication engine. OmniChannel Pro ensures no customer is left behind by orchestrating delivery across the most effective touchpoints.',
};

export const CAMPAIGN_SCALE_SECTION = {
  title: 'Everything You Need to Scale',
  subtitle:
    'Precision-engineered tools to manage complex multi-channel communication at an enterprise global scale.',
};

export const CAMPAIGN_SCALE_FEATURES = [
  {
    id: 'multi-channel',
    title: 'Multi-Channel Messaging',
    description:
      'Native integrations for SMS, WhatsApp, and Email. Reach users on the platforms they use most daily without switching tools.',
    icon: 'multiChannel',
    iconBg: 'bg-[#E8F0FE]',
    iconColor: 'text-[#3A10CD]',
    accent: 'from-[#3A10CD] via-[#5B7FD4] to-[#2E7DAD]',
    colSpan: 'lg:col-span-4',
    channels: ['SMS', 'WhatsApp', 'Email'],
  },
  {
    id: 'audience-targeting',
    title: 'Audience Targeting',
    description:
      'Deep segmentation by Location, Interests, Demographics, and Real-time Behavior.',
    icon: 'users',
    iconBg: 'bg-[#EDE8F8]',
    iconColor: 'text-[#3A10CD]',
    accent: 'from-[#3A10CD] to-[#7C5CBF]',
    colSpan: 'lg:col-span-2',
  },
  {
    id: 'message-templates',
    title: 'Message Templates',
    description: 'Fast setup with pre-built enterprise-grade or custom brand templates.',
    icon: 'layout',
    iconBg: 'bg-[#E8F4FC]',
    iconColor: 'text-[#2E7DAD]',
    accent: 'from-[#2E7DAD] to-[#5B9FD4]',
    colSpan: 'lg:col-span-2',
  },
  {
    id: 'campaign-scheduling',
    title: 'Campaign Scheduling',
    description: 'Intelligent automation and workflow planning across all timezones.',
    icon: 'calendar',
    iconBg: 'bg-[#E8F4FC]',
    iconColor: 'text-[#2E7DAD]',
    accent: 'from-[#2E7DAD] to-[#5B9FD4]',
    colSpan: 'lg:col-span-2',
  },
  {
    id: 'smart-links',
    title: 'Smart Links',
    description: 'Dynamic tracking for all your campaign setups',
    icon: 'link',
    iconBg: 'bg-[#E8ECF8]',
    iconColor: 'text-[#1E3A8A]',
    accent: 'from-[#1E3A8A] to-[#3A10CD]',
    colSpan: 'lg:col-span-2',
  },
  {
    id: 'fallback-system',
    title: 'Fallback System',
    description:
      'Never lose a conversion. Automatic switching to WhatsApp or Email if primary channels like SMS fail to deliver.',
    icon: 'diamond',
    iconBg: 'bg-white/15',
    iconColor: 'text-white',
    accent: 'from-[#5B9FD4] to-[#5B9FD4]',
    colSpan: 'lg:col-span-3',
    variant: 'primary',
  },
  {
    id: 'performance-tracking',
    title: 'Performance Tracking',
    description:
      'Real-time monitoring of delivery, open, click, and conversion rates across the entire journey.',
    icon: 'chart',
    iconBg: 'bg-[#E8F4FC]',
    iconColor: 'text-[#2E7DAD]',
    accent: 'from-[#2E7DAD] to-[#14B8A6]',
    colSpan: 'lg:col-span-3',
  },
];
