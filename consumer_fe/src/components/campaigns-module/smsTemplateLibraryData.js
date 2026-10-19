import { CAMPAIGN_CATEGORIES } from './campaignsNavData';

function withDefaults(template) {
  return {
    popularity: '500x',
    smsMessage: template.description,
    previewTitle: template.title,
    callToAction: 'Learn More',
    idealFor: [
      'Growing customer awareness',
      'Driving timely engagement',
      'Supporting multi-channel outreach',
    ],
    inspiration:
      'Be inspired by Engage360 customer awareness campaign, the content of which you can fully customize as needed.',
    analyticsNote:
      'The Awareness template can be fully edited. Engage360 will give you a detailed analytics of all your campaign.',
    ...template,
  };
}

/** Library templates shown on campaigns home (SMS template gallery). */
export const SMS_TEMPLATE_LIBRARY = [
  withDefaults({
    id: 'brand-trust-building',
    categoryId: 'promotions',
    categoryLabel: 'Promotions',
    title: 'Brand Trust Building',
    popularity: '1000x',
    description:
      'Builds credibility by reassuring customers about brand reliability, transparency, and long-term presence.',
    smsMessage:
      'Trust is built over time. Choose brands that are transparent, reliable, and committed to serving you better.',
    previewTitle: 'Exclusive summer flash sales',
    callToAction: 'Buy Now',
    idealFor: [
      'Early brand lifecycle',
      'Before launching paid promotions',
      'When entering new regions',
    ],
    image:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    featured: true,
  }),
  withDefaults({
    id: 'health-conscious-living',
    categoryId: 'promotions',
    categoryLabel: 'Promotions',
    title: 'Health Conscious Living',
    description:
      'Encourage healthier habits with tips, wellness offers, and lifestyle reminders your audience can act on.',
    smsMessage:
      'Your health journey starts today. Discover tips, offers, and wellness picks crafted for a healthier lifestyle.',
    previewTitle: 'Wellness week specials',
    callToAction: 'Explore Offers',
    idealFor: [
      'Health & wellness brands',
      'Seasonal lifestyle campaigns',
      'Loyalty members seeking tips',
    ],
    image:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'financial-readiness',
    categoryId: 'promotions',
    categoryLabel: 'Promotions',
    title: 'Financial Readiness',
    description:
      'Help customers prepare for goals with savings prompts, budget tips, and timely promotional offers.',
    image:
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'small-business-growth',
    categoryId: 'promotions',
    categoryLabel: 'Promotions',
    title: 'Small Business Growth Insights',
    description:
      'Share practical growth ideas and limited-time offers tailored for small business owners.',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'family-safety-first',
    categoryId: 'promotions',
    categoryLabel: 'Promotions',
    title: 'Family Safety First',
    description:
      'Promote safety products and tips that keep families protected while driving conversions.',
    image:
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'weekend-flash-deals',
    categoryId: 'promotions',
    categoryLabel: 'Promotions',
    title: 'Weekend Flash Deals',
    description:
      'Drive urgency with weekend-only discounts and clear calls to action for quick purchases.',
    image:
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'loyalty-rewards-boost',
    categoryId: 'promotions',
    categoryLabel: 'Promotions',
    title: 'Loyalty Rewards Boost',
    description:
      'Remind members of points balances and exclusive rewards waiting to be claimed.',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'brand-awareness-burst',
    categoryId: 'advertisement',
    categoryLabel: 'Advertisement',
    title: 'Brand Awareness Burst',
    popularity: '850x',
    description:
      'Introduce your brand with a concise, memorable SMS that sparks curiosity and visits.',
    featured: true,
    image:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'product-spotlight-ad',
    categoryId: 'advertisement',
    categoryLabel: 'Advertisement',
    title: 'Product Spotlight Ad',
    description:
      'Feature a hero product with benefits, pricing hooks, and a direct response link.',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'lead-magnet-offer',
    categoryId: 'lead-generation',
    categoryLabel: 'Lead Generation',
    title: 'Lead Magnet Offer',
    popularity: '920x',
    description:
      'Capture interest with a free guide or demo invite and a clear opt-in path.',
    featured: true,
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    leadQuestions: [
      {
        id: 'q-name',
        type: 'freeText',
        question: 'What is your full name?',
        options: [],
        placeholder: 'Enter your full name',
        required: true,
        termsText: '',
        checkboxLabel: '',
      },
      {
        id: 'q-phone',
        type: 'freeText',
        question: 'What is your phone number?',
        options: [],
        placeholder: 'e.g. 024 123 4567',
        required: true,
        termsText: '',
        checkboxLabel: '',
      },
      {
        id: 'q-interest',
        type: 'singleChoice',
        question: 'What are you most interested in?',
        options: ['Free Guide', 'Live Demo', 'Pricing Info'],
        placeholder: '',
        required: true,
        termsText: '',
        checkboxLabel: '',
      },
      {
        id: 'q-terms',
        type: 'terms',
        question: 'Terms & Conditions',
        options: [],
        placeholder: '',
        required: true,
        termsText:
          'By submitting this form, you agree to receive marketing communications from us.',
        checkboxLabel: 'I agree to the Terms & Conditions',
      },
    ],
  }),
  withDefaults({
    id: 'webinar-signup-push',
    categoryId: 'lead-generation',
    categoryLabel: 'Lead Generation',
    title: 'Webinar Sign-up Push',
    description:
      'Fill seats fast with date, value promise, and a one-tap registration CTA.',
    image:
      'https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=800&q=80',
    leadQuestions: [
      {
        id: 'q-name',
        type: 'freeText',
        question: 'What is your full name?',
        options: [],
        placeholder: 'Enter your full name',
        required: true,
        termsText: '',
        checkboxLabel: '',
      },
      {
        id: 'q-email',
        type: 'freeText',
        question: 'What is your email address?',
        options: [],
        placeholder: 'you@email.com',
        required: true,
        termsText: '',
        checkboxLabel: '',
      },
      {
        id: 'q-time',
        type: 'singleChoice',
        question: 'Which session time works best for you?',
        options: ['Morning (10AM)', 'Afternoon (2PM)', 'Evening (6PM)'],
        placeholder: '',
        required: true,
        termsText: '',
        checkboxLabel: '',
      },
      {
        id: 'q-topics',
        type: 'multipleChoice',
        question: 'What topics would you like covered?',
        options: ['Product Demo', 'Pricing', 'Case Studies', 'Q&A'],
        placeholder: '',
        required: true,
        termsText: '',
        checkboxLabel: '',
      },
      {
        id: 'q-terms',
        type: 'terms',
        question: 'Terms & Conditions',
        options: [],
        placeholder: '',
        required: true,
        termsText: 'By registering, you agree to receive event reminders and follow-up emails.',
        checkboxLabel: 'I agree to the Terms & Conditions',
      },
    ],
  }),
  withDefaults({
    id: 'check-in-nudge',
    categoryId: 'customer-engagement',
    categoryLabel: 'Customer Engagement',
    title: 'Friendly Check-in Nudge',
    featured: true,
    description:
      'Stay top of mind with a warm check-in that invites replies and feedback.',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'support-ticket-update',
    categoryId: 'customer-supports',
    categoryLabel: 'Customer Supports',
    title: 'Support Ticket Update',
    featured: true,
    description:
      'Keep customers informed on case status with clear next steps and contact options.',
    image:
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'outage-service-alert',
    categoryId: 'service-alerts',
    categoryLabel: 'Service Alerts',
    title: 'Downtime Alert',
    featured: true,
    popularity: '1100x',
    description:
      'Notify customers of an unexpected outage, expected resolution, and where to get help.',
    smsMessage:
      'We are experiencing a temporary service disruption. Our team is working to restore access. Reply HELP or call support for updates.',
    previewTitle: 'Downtime',
    callToAction: 'Learn More',
    idealFor: [
      'Unexpected outages and downtime',
      'High-impact platform incidents',
      'Customers needing immediate status clarity',
    ],
    inspiration:
      'Be inspired by Engage360 service alert campaigns — customize the status message, ETA, and support contact for every incident.',
    image:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'scheduled-maintenance-alert',
    categoryId: 'service-alerts',
    categoryLabel: 'Service Alerts',
    title: 'Scheduled Maintenance',
    popularity: '900x',
    description:
      'Give customers advance notice of planned maintenance windows and expected impact.',
    smsMessage:
      'Scheduled maintenance tonight from 11PM–2AM. Some features may be unavailable. Please save your work and plan ahead.',
    previewTitle: 'Scheduled Maintenance',
    callToAction: 'View Details',
    idealFor: [
      'Planned infrastructure work',
      'Product release cutovers',
      'Reducing surprise downtime complaints',
    ],
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'service-restored-alert',
    categoryId: 'service-alerts',
    categoryLabel: 'Service Alerts',
    title: 'Service Restored',
    popularity: '850x',
    description:
      'Confirm that an earlier disruption is resolved and services are back to normal.',
    smsMessage:
      'Good news — the earlier disruption has been resolved and services are running normally again. Thank you for your patience.',
    previewTitle: 'Service Restored',
    callToAction: 'Check Status',
    idealFor: [
      'Post-incident all-clear notices',
      'Rebuilding trust after outages',
      'Closing the loop with affected customers',
    ],
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'security-fraud-alert',
    categoryId: 'service-alerts',
    categoryLabel: 'Service Alerts',
    title: 'Security Notice',
    popularity: '780x',
    description:
      'Alert customers about suspicious activity or a security precaution with clear next steps.',
    smsMessage:
      'Security notice: unusual activity was detected on your account. If this was not you, secure your account now and contact support immediately.',
    previewTitle: 'Security Notice',
    callToAction: 'Secure Account',
    idealFor: [
      'Fraud and suspicious login alerts',
      'Password reset prompts',
      'Compliance-driven security notices',
    ],
    image:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'event-invite-blast',
    categoryId: 'events-activation',
    categoryLabel: 'Events & Activation',
    title: 'Event Invite Blast',
    featured: true,
    popularity: '1200x',
    description:
      'Drive attendance with date, venue highlights, and an easy RSVP call to action.',
    smsMessage:
      "You're invited! Join us for Summer Brand Experience Night at Accra Conference Center. Reserve your seat before spots fill up.",
    previewTitle: 'Summer Brand Experience Night',
    callToAction: 'Reserve your seat',
    idealFor: [
      'Product launches and brand nights',
      'Networking and community events',
      'Ticketed experiences with RSVP',
    ],
    inspiration:
      'Be inspired by Engage360 event campaigns — customize the invite, venue, and ticket flow for every activation.',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    registrationQuestions: [
      {
        id: 'eq-name',
        type: 'freeText',
        question: 'Full name',
        options: [],
        placeholder: 'Enter your full name',
        required: true,
        termsText: '',
        checkboxLabel: '',
      },
      {
        id: 'eq-phone',
        type: 'freeText',
        question: 'Phone number',
        options: [],
        placeholder: 'Enter your phone number',
        required: true,
        termsText: '',
        checkboxLabel: '',
      },
    ],
  }),
  withDefaults({
    id: 'event-early-bird-tickets',
    categoryId: 'events-activation',
    categoryLabel: 'Events & Activation',
    title: 'Early Bird Tickets',
    featured: true,
    description:
      'Create urgency with limited early-bird pricing and a clear path to buy tickets.',
    smsMessage:
      'Early bird is open! Get VIP or Regular tickets for our flagship event before prices go up. Tap to secure your spot.',
    previewTitle: 'Early Bird Access',
    callToAction: 'Get Tickets',
    idealFor: [
      'Paid conferences and festivals',
      'VIP + standard ticket tiers',
      'Time-bound promotions',
    ],
    image:
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'event-reminder-rsvp',
    categoryId: 'events-activation',
    categoryLabel: 'Events & Activation',
    title: 'Event Reminder & RSVP',
    description:
      'Nudge registered guests with date, time, and venue so turnout stays high.',
    smsMessage:
      'Reminder: Your event starts tomorrow at 12pm at Accra Conference Center. Reply YES to confirm you will attend.',
    previewTitle: 'See you tomorrow',
    callToAction: 'Confirm RSVP',
    idealFor: [
      'Day-before attendance boosts',
      'Registered guest lists',
      'Reducing no-shows',
    ],
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'event-workshop-signup',
    categoryId: 'events-activation',
    categoryLabel: 'Events & Activation',
    title: 'Workshop Signup',
    description:
      'Invite customers to a hands-on workshop with limited seats and a simple signup CTA.',
    smsMessage:
      'Seats are limited for our hands-on workshop this weekend. Learn, network, and leave with practical takeaways. Sign up today.',
    previewTitle: 'Hands-on Workshop',
    callToAction: 'Sign Up',
    idealFor: [
      'Educational activations',
      'Community workshops',
      'Small-capacity venues',
    ],
    image:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'cart-recovery-sale',
    categoryId: 'sales-conversion',
    categoryLabel: 'Sales Conversion',
    title: 'Cart Recovery Sale',
    featured: true,
    description:
      'Win back abandoners with a gentle reminder and a time-bound incentive.',
    image:
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'upgrade-upsell-nudge',
    categoryId: 'upsell-cross-sell',
    categoryLabel: 'Upsell & Cross Sell',
    title: 'Upgrade Upsell Nudge',
    featured: true,
    description:
      'Recommend a higher-value plan or add-on based on what customers already use.',
    image:
      'https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'trial-to-paid',
    categoryId: 'subscriptions',
    categoryLabel: 'Subscriptions Sign-ups',
    title: 'Trial to Paid Convert',
    featured: true,
    description:
      'Convert trial users with benefit reminders and a frictionless subscribe link.',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'welcome-onboarding',
    categoryId: 'customer-onboarding',
    categoryLabel: 'Customer Onboarding',
    title: 'Welcome Onboarding Series',
    featured: true,
    description:
      'Guide new customers through first steps with friendly, actionable SMS tips.',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'vip-retention-offer',
    categoryId: 'customer-retention',
    categoryLabel: 'Customer Retention',
    title: 'VIP Retention Offer',
    featured: true,
    description:
      'Reward loyal customers with exclusive perks that reinforce long-term value.',
    image:
      'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'we-miss-you',
    categoryId: 're-engagement',
    categoryLabel: 'Re-Engagement',
    title: 'We Miss You Comeback',
    featured: true,
    description:
      'Reactivate dormant contacts with a personal tone and a compelling return offer.',
    image:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  }),
  withDefaults({
    id: 'product-signups-launch',
    categoryId: 'product-signups',
    categoryLabel: 'Product Sign-ups',
    title: 'Product Sign-up Launch',
    featured: true,
    description:
      'Invite customers to try a new product with a clear benefit and sign-up link.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  }),
];

export function getLibraryTemplateById(id) {
  return SMS_TEMPLATE_LIBRARY.find((item) => item.id === id) || null;
}

export function getTemplatesByCategory(categoryId) {
  return SMS_TEMPLATE_LIBRARY.filter((item) => item.categoryId === categoryId);
}

export function getFeaturedTemplateForCategory(categoryId) {
  const inCategory = getTemplatesByCategory(categoryId);
  return inCategory.find((item) => item.featured) || inCategory[0] || null;
}

export function getCategoryLabel(categoryId) {
  return CAMPAIGN_CATEGORIES.find((item) => item.id === categoryId)?.label || 'Promotions';
}

export function getCategoryCounts() {
  return CAMPAIGN_CATEGORIES.reduce((acc, category) => {
    acc[category.id] = SMS_TEMPLATE_LIBRARY.filter((item) => item.categoryId === category.id)
      .length;
    return acc;
  }, {});
}
