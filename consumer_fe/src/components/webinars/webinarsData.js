import Images from '../../utils/Images';
import { BLOG_CATEGORIES } from '../blogs/blogData';

export { BLOG_CATEGORIES as WEBINAR_CATEGORIES };

export const WEBINARS = [
  {
    id: 'sales-marketing-structure',
    category: 'customer-management',
    title: 'Structuring your sales and Marketing to drive the most sales',
    image: Images.about.about_hero,
  },
  {
    id: 'customer-retention-playbook',
    category: 'customer-management',
    title: 'Building a customer retention playbook with Engage 360',
    image: Images.growth.growth_section,
  },
  {
    id: 'sms-campaign-masterclass',
    category: 'campaigns',
    title: 'SMS campaign masterclass: from setup to conversion',
    image: Images.about.about_section,
  },
  {
    id: 'whatsapp-broadcast-tips',
    category: 'campaigns',
    title: 'WhatsApp broadcast tips that actually get responses',
    image: Images.growth.growth_section,
  },
  {
    id: 'survey-design-basics',
    category: 'survey',
    title: 'Survey design basics for actionable customer feedback',
    image: Images.about.about_hero,
  },
  {
    id: 'nps-follow-up-workflows',
    category: 'survey',
    title: 'Turning NPS scores into follow-up workflows',
    image: Images.about.about_section,
  },
  {
    id: 'ads-hub-overview',
    category: 'advertising',
    title: 'Advertising with Engage 360: reach the right audience',
    image: Images.growth.growth_section,
  },
  {
    id: 'ussd-ad-campaigns',
    category: 'advertising',
    title: 'Launching USSD ad campaigns in under an hour',
    image: Images.about.about_hero,
  },
  {
    id: 'front-desk-automation',
    category: 'front-desk',
    title: 'Automating front desk communication without losing the personal touch',
    image: Images.about.about_section,
  },
  {
    id: 'visitor-check-in-flows',
    category: 'front-desk',
    title: 'Designing visitor check-in flows that save time',
    image: Images.growth.growth_section,
  },
];

export function getWebinarsByCategory(categoryId) {
  return WEBINARS.filter((webinar) => webinar.category === categoryId);
}

export function getWebinar(slug) {
  return WEBINARS.find((webinar) => webinar.id === slug) ?? null;
}
