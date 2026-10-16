import Images from '../../utils/Images';

export const ACADEMY_HERO = {
  eyebrow: 'Engage 360 Academy',
  title: 'Learn the platform. Master engagement.',
  description:
    'Practical courses, playbooks, and guided lessons that help your team launch campaigns, run messaging channels, and turn customer data into growth — at your own pace.',
  primaryCta: 'Start learning',
  secondaryCta: 'Watch webinars',
  tracks: ['Campaigns', 'Messaging', 'Customer engagement', 'Analytics'],
};

export const ACADEMY_PATHS_HEADER = {
  title: 'Learning paths',
  subtitle: 'Pick a track and build skills that map directly to how your team uses Engage 360.',
};

export const ACADEMY_PATHS = [
  {
    id: 'campaigns',
    title: 'Campaigns',
    description: 'Plan, launch, and optimize multi-channel campaigns from brief to reporting.',
    courseCount: 3,
    icon: 'megaphone',
    iconBg: 'bg-[#EDE8F8] text-primary',
    accent: 'bg-primary',
  },
  {
    id: 'messaging',
    title: 'Messaging',
    description: 'Get fluent with SMS, WhatsApp, Email, and USSD delivery best practices.',
    courseCount: 3,
    icon: 'message',
    iconBg: 'bg-[#E8F4FC] text-[#2E7DAD]',
    accent: 'bg-[#2E7DAD]',
  },
  {
    id: 'customer-engagement',
    title: 'Customer engagement',
    description: 'Segment audiences, nurture relationships, and run retention workflows.',
    courseCount: 2,
    icon: 'users',
    iconBg: 'bg-[#E8F8EF] text-[#1F9D55]',
    accent: 'bg-[#1F9D55]',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Read performance clearly and turn engagement data into better decisions.',
    courseCount: 2,
    icon: 'chart',
    iconBg: 'bg-[#FFF4E8] text-[#E67E22]',
    accent: 'bg-[#E67E22]',
  },
];

export const ACADEMY_COURSES = [
  {
    id: 'campaign-foundations',
    path: 'campaigns',
    title: 'Campaign foundations',
    excerpt: 'Define goals, audiences, and channel mix before you hit send.',
    duration: '35 min',
    level: 'Beginner',
    image: Images.platform_services.campaigns,
  },
  {
    id: 'multi-channel-launch',
    path: 'campaigns',
    title: 'Multi-channel launch playbook',
    excerpt: 'Coordinate SMS, Email, and WhatsApp in one coordinated campaign flow.',
    duration: '50 min',
    level: 'Intermediate',
    image: Images.about.about_hero,
  },
  {
    id: 'campaign-reporting',
    path: 'campaigns',
    title: 'Campaign reporting that drives action',
    excerpt: 'Measure delivery, engagement, and conversion without drowning in dashboards.',
    duration: '40 min',
    level: 'Intermediate',
    image: Images.growth.growth_section,
  },
  {
    id: 'sms-essentials',
    path: 'messaging',
    title: 'SMS essentials',
    excerpt: 'Write clearer messages, manage sender IDs, and improve delivery rates.',
    duration: '30 min',
    level: 'Beginner',
    image: Images.platform_services.communication,
  },
  {
    id: 'whatsapp-engagement',
    path: 'messaging',
    title: 'WhatsApp engagement basics',
    excerpt: 'Use templates, timing, and follow-ups that invite real replies.',
    duration: '45 min',
    level: 'Beginner',
    image: Images.about.about_section,
  },
  {
    id: 'email-and-ussd',
    path: 'messaging',
    title: 'Email and USSD together',
    excerpt: 'Combine rich email journeys with USSD for broader reach across audiences.',
    duration: '40 min',
    level: 'Intermediate',
    image: Images.platform_services.customer_engagement,
  },
  {
    id: 'audience-segmentation',
    path: 'customer-engagement',
    title: 'Audience segmentation',
    excerpt: 'Build useful segments from customer data without overcomplicating your CRM.',
    duration: '45 min',
    level: 'Beginner',
    image: Images.platform_services.leads_management,
  },
  {
    id: 'retention-workflows',
    path: 'customer-engagement',
    title: 'Retention workflows',
    excerpt: 'Design nurture and win-back journeys that stay personal at scale.',
    duration: '55 min',
    level: 'Intermediate',
    image: Images.platform_services.growth_center,
  },
  {
    id: 'engagement-metrics',
    path: 'analytics',
    title: 'Engagement metrics that matter',
    excerpt: 'Focus on the KPIs that show whether your programs are actually working.',
    duration: '35 min',
    level: 'Beginner',
    image: Images.platform_services.surveys,
  },
  {
    id: 'data-to-decisions',
    path: 'analytics',
    title: 'From data to decisions',
    excerpt: 'Turn campaign and survey insights into weekly actions for your team.',
    duration: '50 min',
    level: 'Advanced',
    image: Images.products.outcome,
  },
];

export const ACADEMY_COURSES_HEADER = {
  title: 'Featured courses',
  subtitle: 'Short, practical lessons you can complete between real work.',
};

export const ACADEMY_STEPS_HEADER = {
  title: 'How learning works',
  subtitle: 'A simple path from first lesson to confident execution.',
};

export const ACADEMY_STEPS = [
  {
    id: 'choose',
    step: '01',
    title: 'Choose a path',
    description: 'Start with the track that matches your role — campaigns, messaging, engagement, or analytics.',
  },
  {
    id: 'learn',
    step: '02',
    title: 'Learn by doing',
    description: 'Follow short courses with clear examples tied to the Engage 360 workflows you already use.',
  },
  {
    id: 'apply',
    step: '03',
    title: 'Apply and grow',
    description: 'Put the lessons into live campaigns, then deepen skills with webinars and the help center.',
  },
];

export const ACADEMY_CTA = {
  title: 'Want live sessions instead?',
  description:
    'Join Engage 360 webinars for walkthroughs with our team, or visit the help center when you need quick answers.',
  primaryCta: 'Watch webinars',
  secondaryCta: 'Visit help center',
};

export function getCoursesByPath(pathId) {
  if (!pathId || pathId === 'all') return ACADEMY_COURSES;
  return ACADEMY_COURSES.filter((course) => course.path === pathId);
}
