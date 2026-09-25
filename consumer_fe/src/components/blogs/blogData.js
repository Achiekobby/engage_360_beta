import Images from '../../utils/Images';

export const BLOG_CATEGORIES = [
  { id: 'customer-management', label: 'Customer Management' },
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'survey', label: 'Survey' },
  { id: 'advertising', label: 'Advertising' },
  { id: 'front-desk', label: 'Front Desk Management' },
];

const DEFAULT_BODY = [
  'Customer engagement is no longer a nice-to-have — it is how modern organizations build trust, retain loyalty, and grow sustainably. Teams that rely on scattered tools often miss important signals and respond too slowly to what customers actually need.',
  'Engage 360 brings communication, data, and workflows into one place so every team member can act with full context. Whether you are sending a campaign, collecting feedback, or managing front desk operations, the platform keeps your customer journey connected.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'When your channels work together, you reduce duplicate effort, improve response times, and create experiences that feel personal at scale. That is the difference between broadcasting messages and building meaningful relationships.',
  'Start with one workflow, measure the impact, and expand across your organization as results compound. Engage 360 is built to grow with you — from your first SMS blast to enterprise-wide engagement programs.',
];

export const BLOG_POSTS = [
  {
    id: 'unified-customer-view',
    category: 'customer-management',
    date: '26 Mar 2025',
    publishedOn: 'March 26, 2025',
    title: 'Why Every Business Needs a Unified Customer View',
    excerpt:
      'Think customer data lives in one place? Think again. Interactions happen across SMS, email, WhatsApp, and in-person — Engage 360 brings them together so your team never loses context.',
    readTime: '7 min read',
    views: 2,
    image: Images.about.about_section,
    body: DEFAULT_BODY,
  },
  {
    id: 'multi-channel-campaigns',
    category: 'campaigns',
    date: '26 Mar 2025',
    publishedOn: 'March 26, 2025',
    title: "How Multi-Channel Campaigns Work in Ghana (And Why They're Game-Changing)",
    excerpt:
      'Multi-channel campaigns let you reach customers where they are — no scattered tools, no duplicate lists. With Engage 360, launch SMS, email, and WhatsApp campaigns from one dashboard.',
    readTime: '7 min read',
    views: 2,
    image: Images.about.about_section,
    body: DEFAULT_BODY,
  },
  {
    id: 'feedback-before-scale',
    category: 'survey',
    date: '26 Mar 2025',
    publishedOn: 'March 26, 2025',
    title: 'Protect Your Brand: 4 Reasons to Collect Feedback Before You Scale',
    excerpt:
      '1. Catch issues early  2. Improve service quality  3. Build customer trust  4. Make data-driven decisions — surveys help you grow with confidence, not guesswork.',
    readTime: '7 min read',
    views: 2,
    image: Images.about.about_section,
    body: DEFAULT_BODY,
  },
  {
    id: 'ussd-campaign-launch',
    category: 'advertising',
    date: '26 Mar 2025',
    publishedOn: 'March 26, 2025',
    title: 'How to Launch a USSD Campaign in Under 60 Seconds',
    excerpt:
      'No complex setup? No problem. Configure your message, select your audience, and go live from Engage 360 in less than a minute — even on basic mobile networks.',
    readTime: '7 min read',
    views: 2,
    image: Images.about.about_section,
    body: DEFAULT_BODY,
  },
  {
    id: 'front-desk-workflows',
    category: 'front-desk',
    date: '18 Mar 2025',
    publishedOn: 'March 18, 2025',
    title: 'Streamline Front Desk Operations with Smart Workflows',
    excerpt:
      'From check-ins to follow-ups, front desk teams handle dozens of touchpoints daily. Learn how automated workflows reduce wait times and keep every visitor informed.',
    readTime: '5 min read',
    views: 4,
    image: Images.about.about_section,
    body: DEFAULT_BODY,
  },
  {
    id: 'customer-segmentation',
    category: 'customer-management',
    date: '12 Mar 2025',
    publishedOn: 'March 12, 2025',
    title: 'Customer Segmentation That Actually Drives Engagement',
    excerpt:
      'Generic blasts underperform. Segment by behaviour, location, or lifecycle stage and send messages that feel personal — without the manual spreadsheet work.',
    readTime: '6 min read',
    views: 8,
    image: Images.about.about_section,
    body: DEFAULT_BODY,
  },
];

export function getCategoryLabel(categoryId) {
  return BLOG_CATEGORIES.find((category) => category.id === categoryId)?.label ?? categoryId;
}

export function getBlogPost(slug) {
  return BLOG_POSTS.find((post) => post.id === slug) ?? null;
}

export function getPopularPosts(excludeId, limit = 4) {
  return BLOG_POSTS.filter((post) => post.id !== excludeId).slice(0, limit);
}

export function getRelatedPosts(post, limit = 2) {
  const sameCategory = BLOG_POSTS.filter(
    (item) => item.id !== post.id && item.category === post.category,
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const others = BLOG_POSTS.filter(
    (item) => item.id !== post.id && item.category !== post.category,
  );

  return [...sameCategory, ...others].slice(0, limit);
}

export function formatReadTimeUppercase(readTime = '') {
  return readTime.replace(' min read', ' MIN READ').toUpperCase();
}
