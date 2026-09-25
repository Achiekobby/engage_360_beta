import Images from '../../utils/Images';

export const SUCCESS_STORIES_HEADER = {
  title: 'Customers Stories',
  subtitle:
    'Choose from 100+ campaign examples. Create your SMS, Email & WhatsApp campaign from built-in expert campaign template easily',
};

const DEFAULT_BODY = [
  'When Palm Gardens Guest House started using Engage 360, occupancy was inconsistent and follow-ups were manual. The team needed a way to reach guests quickly, confirm bookings, and stay top-of-mind without hiring more front desk staff.',
  'By launching automated SMS and WhatsApp reminders, Palm Gardens kept potential guests engaged from inquiry to check-in. Campaign templates made it easy to send the right message at the right time — without starting from scratch every week.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Within weeks, empty rooms became fully booked periods. The guest house measured higher response rates, faster confirmations, and a smoother experience for both staff and visitors — all from one unified platform.',
  'Engage 360 helped Palm Gardens turn scattered communication into a repeatable growth engine. That is the power of connected customer engagement.',
];

export const SUCCESS_STORIES = [
  {
    id: 'palm-gardens-guest-house',
    companyName: 'Palm Gardens Guest House',
    author: 'Rishi Rajani',
    date: '26 Mar 2025',
    publishedOn: 'March 26, 2025',
    overlayText: 'HOW PALM GARDENS IS USING ENGAGE 360 TO FILL EVERY ROOM',
    title:
      'How Palm Gardens Guest House Went From Empty Rooms to Fully Booked in Weeks with Engage 360',
    excerpt:
      'With automated SMS reminders and WhatsApp follow-ups, Palm Gardens turned idle inventory into consistent bookings — without adding staff or manual outreach.',
    readTime: '7 min read',
    views: 2,
    image: Images.growth.growth_section,
    body: DEFAULT_BODY,
  },
  {
    id: 'ecopharm-sales',
    companyName: 'Ecopharm',
    author: 'Ama Mensah',
    date: '26 Mar 2025',
    publishedOn: 'March 26, 2025',
    overlayText: 'HOW ECOPHARM IS USING ENGAGE 360 CRM TO INCREASE ITS SALES',
    title: 'How Ecopharm Boosted Repeat Purchases by 40% with Targeted Campaigns',
    excerpt:
      'Ecopharm unified customer data and launched segmented SMS campaigns that brought customers back faster — driving measurable sales growth across retail locations.',
    readTime: '7 min read',
    views: 2,
    image: Images.growth.growth_section,
    body: DEFAULT_BODY,
  },
  {
    id: 'metro-retail-chain',
    companyName: 'Metro Retail',
    author: 'Kwame Asante',
    date: '18 Mar 2025',
    publishedOn: 'March 18, 2025',
    overlayText: 'HOW METRO RETAIL CUT RESPONSE TIME BY HALF WITH ENGAGE 360',
    title: 'Metro Retail Chain Streamlined Customer Support Across 12 Branches',
    excerpt:
      'By centralising inquiries from SMS, email, and WhatsApp, Metro Retail reduced response times and improved satisfaction scores within the first month.',
    readTime: '6 min read',
    views: 5,
    image: Images.about.about_section,
    body: DEFAULT_BODY,
  },
  {
    id: 'sunrise-clinic',
    companyName: 'Sunrise Clinic',
    author: 'Efua Boateng',
    date: '12 Mar 2025',
    publishedOn: 'March 12, 2025',
    overlayText: 'HOW SUNRISE CLINIC IMPROVED PATIENT ENGAGEMENT WITH SURVEYS',
    title: 'Sunrise Clinic Increased Appointment Attendance with Smart Reminders',
    excerpt:
      'Automated appointment reminders and post-visit surveys helped Sunrise Clinic reduce no-shows and collect feedback that improved service delivery.',
    readTime: '5 min read',
    views: 8,
    image: Images.about.about_section,
    body: DEFAULT_BODY,
  },
];

export function getSuccessStory(slug) {
  return SUCCESS_STORIES.find((story) => story.id === slug) ?? null;
}

export function getPopularStories(excludeId, limit = 4) {
  return SUCCESS_STORIES.filter((story) => story.id !== excludeId).slice(0, limit);
}

export function getRelatedStories(story, limit = 2) {
  const sameCompany = SUCCESS_STORIES.filter(
    (item) => item.id !== story.id && item.companyName === story.companyName,
  );

  if (sameCompany.length >= limit) {
    return sameCompany.slice(0, limit);
  }

  const others = SUCCESS_STORIES.filter(
    (item) => item.id !== story.id && item.companyName !== story.companyName,
  );

  return [...sameCompany, ...others].slice(0, limit);
}
