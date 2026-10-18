export { CAMPAIGNS_BASE } from './campaignsNavData';

export const CAMPAIGN_CHANNELS = [
  {
    id: 'sms',
    label: 'SMS',
    description: 'Short promotional texts with high open rates',
    accent: 'bg-[#E8F4FC] text-[#2E7DAD]',
    bar: 'from-[#2E7DAD] to-[#5B9FD4]',
  },
  {
    id: 'email',
    label: 'Email',
    description: 'Rich layouts with images, links, and CTAs',
    accent: 'bg-[#EDE8F8] text-primary',
    bar: 'from-primary to-[#6B4FE0]',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    description: 'Conversational reach on WhatsApp Business',
    accent: 'bg-[#E8F8EF] text-[#1F9D55]',
    bar: 'from-[#1F9D55] to-[#34D399]',
  },
  {
    id: 'push',
    label: 'Push Notification',
    description: 'Instant alerts on mobile lock screens',
    accent: 'bg-[#FFF4E8] text-[#E67E22]',
    bar: 'from-[#E67E22] to-[#F5A623]',
  },
];

export const CAMPAIGN_OBJECTIVES = [
  'Drive Sales',
  'Promote Product',
  'Customer Retention',
  'Event Announcement',
  'Brand Awareness',
  'Generate Leads',
];

/**
 * Sensible default objective per campaign category. Used to pre-select an
 * objective for BOTH the "start from scratch" and "start with a template"
 * routes — the direct route otherwise stays blank/unpopulated everywhere
 * else (name, message, questions, etc.), it just doesn't force the user to
 * re-pick an objective that's already implied by the category they chose.
 */
export const CATEGORY_DEFAULT_OBJECTIVES = {
  promotions: 'Promote Product',
  advertisement: 'Brand Awareness',
  'lead-generation': 'Generate Leads',
  'customer-engagement': 'Customer Retention',
  'customer-supports': 'Customer Retention',
  'service-alerts': 'Event Announcement',
  'events-activation': 'Event Announcement',
  'sales-conversion': 'Drive Sales',
  'upsell-cross-sell': 'Drive Sales',
  subscriptions: 'Generate Leads',
  'customer-onboarding': 'Customer Retention',
  'customer-retention': 'Customer Retention',
  're-engagement': 'Customer Retention',
  'product-signups': 'Generate Leads',
};

export function getDefaultObjectiveForCategory(categoryId) {
  return CATEGORY_DEFAULT_OBJECTIVES[categoryId] || 'Promote Product';
}

export const AUDIENCE_OPTIONS = [
  { id: 'all', label: 'All Customers', count: '52k' },
  { id: 'vip', label: 'VIP Members', count: '9.4k' },
  { id: 'new-leads', label: 'New Leads Q2', count: '18k' },
  { id: 'loyalty', label: 'Loyalty Program', count: '7.8k' },
  { id: 'retail', label: 'Retail Outreach', count: '4.2k' },
];

export const CUSTOMER_CATEGORIES = [
  { id: 'retail', label: 'Retail Customers' },
  { id: 'vip', label: 'VIP Members' },
  { id: 'new-leads', label: 'New Leads' },
  { id: 'loyalty', label: 'Loyalty Program' },
];

export const CUSTOMER_COLLECTIONS = [
  { id: 'summer-promo', label: 'Summer Promo List' },
  { id: 'newsletter', label: 'Newsletter Subscribers' },
  { id: 'inactive', label: 'Inactive Customers' },
  { id: 'high-value', label: 'High Value Accounts' },
];

export const GHANA_REGIONS = [
  'Ahafo',
  'Ashanti',
  'Bono',
  'Bono East',
  'Central',
  'Eastern',
  'Greater Accra',
  'North East',
  'Northern',
  'Oti',
  'Savannah',
  'Upper East',
  'Upper West',
  'Volta',
  'Western',
  'Western North',
];

export const REGION_LOCATIONS = {
  'Greater Accra': ['Accra', 'Tema', 'Madina', 'Ashaiman', 'Adenta', 'Dome'],
  Ashanti: ['Kumasi', 'Obuasi', 'Ejisu', 'Konongo', 'Bekwai'],
  Western: ['Takoradi', 'Sekondi', 'Tarkwa', 'Axim'],
  'Western North': ['Sefwi Wiawso', 'Bibiani', 'Enchi'],
  Central: ['Cape Coast', 'Winneba', 'Kasoa', 'Elmina'],
  Eastern: ['Koforidua', 'Nkawkaw', 'Akosombo', 'Suhum'],
  Volta: ['Ho', 'Hohoe', 'Keta', 'Aflao'],
  Oti: ['Dambai', 'Kete Krachi', 'Jasikan'],
  Northern: ['Tamale', 'Yendi', 'Savelugu'],
  Savannah: ['Damongo', 'Salaga', 'Bole'],
  'North East': ['Nalerigu', 'Walewale', 'Gambaga'],
  'Upper East': ['Bolgatanga', 'Bawku', 'Navrongo'],
  'Upper West': ['Wa', 'Tumu', 'Lawra'],
  Bono: ['Sunyani', 'Berekum', 'Dormaa Ahenkro'],
  'Bono East': ['Techiman', 'Kintampo', 'Nkoranza'],
  Ahafo: ['Goaso', 'Bechem', 'Duayaw Nkwanta'],
};

export function getLocationOptions(region) {
  return REGION_LOCATIONS[region] || [];
}

export const SEGMENTATION_FILTER_TYPES = {
  gender: {
    label: 'Gender',
    options: ['Male', 'Female'],
  },
  region: {
    label: 'Region',
    options: GHANA_REGIONS,
    searchable: true,
  },
  location: {
    label: 'Location',
    options: [],
    dependsOn: 'region',
    allowCustom: true,
  },
  age: {
    label: 'Age',
    options: ['18-24', '25-34', '35-44', '45-54', '55+'],
  },
};

export const DEFAULT_SEGMENT_FILTER_TYPES = ['gender', 'region', 'location', 'age'];

export function createDefaultSegmentFilters() {
  return DEFAULT_SEGMENT_FILTER_TYPES.map((type) => ({
    id: type,
    type,
    value: '',
  }));
}

export const PROMO_VISUAL_OPTIONS = [
  { id: 'image', label: 'Image' },
  { id: 'video', label: 'Video' },
  { id: 'gif', label: 'GIF' },
];

export const WIZARD_STEPS = [
  { id: 1, label: 'Message & Primary Asset' },
  { id: 2, label: 'Attachment' },
  { id: 3, label: 'Customer Targeting' },
  { id: 4, label: 'Scan & Breakdown' },
];

export const EVENT_WIZARD_STEPS = [
  { id: 1, label: 'Message & Asset' },
  { id: 2, label: 'Event Details' },
  { id: 3, label: 'Registration' },
  { id: 4, label: 'Targeting' },
  { id: 5, label: 'Scan & Breakdown' },
];

export function getWizardSteps(categoryId) {
  if (categoryId === 'lead-generation') {
    return WIZARD_STEPS.map((step) =>
      step.id === 1 ? { ...step, label: 'Lead Capture Form' } : step,
    );
  }

  if (categoryId === 'events-activation') return EVENT_WIZARD_STEPS;

  // Sales conversion matches the default 4-step flow; step 1 uses a tailored
  // Message & Primary Asset layout with an optional banner beside description.
  if (categoryId === 'sales-conversion') return WIZARD_STEPS;

  return WIZARD_STEPS;
}

export function createEmptyBanner() {
  return {
    file: null,
    fileName: '',
    previewUrl: '',
    fileMimeType: '',
    promoVisual: 'image',
  };
}

export function detectPromoVisualFromFile(file) {
  if (!file) return null;
  const type = file.type || '';
  const name = (file.name || '').toLowerCase();
  if (type === 'image/gif' || name.endsWith('.gif')) return 'gif';
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('image/')) return 'image';
  return null;
}

export const EVENT_CURRENCIES = ['GHS', 'USD', 'EUR', 'GBP'];

export const EVENT_TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2);
  const minute = index % 2 === 0 ? '00' : '30';
  const value = `${String(hour).padStart(2, '0')}:${minute}`;
  const date = new Date();
  date.setHours(hour, Number(minute), 0, 0);
  const label = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return { value, label };
});

export function formatEventTime(value) {
  return EVENT_TIME_OPTIONS.find((option) => option.value === value)?.label || value || '—';
}

export function createEmptyEventDetails() {
  return {
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    venue: '',
    hasRsvpWebsite: 'no',
    rsvpUrl: '',
    hasEntryFee: 'no',
    tickets: [],
  };
}

export function validateEventDetails(event, attachment) {
  const errors = {};
  if (!event?.startDate) errors['event.startDate'] = 'Choose the date the event starts.';
  if (!event?.startTime) errors['event.startTime'] = 'Choose a start time.';
  if (!event?.endDate) errors['event.endDate'] = 'Choose the date the event ends.';
  if (!event?.endTime) errors['event.endTime'] = 'Choose an end time.';

  if (event?.startDate && event?.startTime && event?.endDate && event?.endTime) {
    const start = new Date(`${event.startDate}T${event.startTime}`);
    const end = new Date(`${event.endDate}T${event.endTime}`);
    if (!(end > start)) {
      errors['event.endDate'] = 'The event must end after it starts.';
    }
  }

  if (!event?.venue?.trim()) errors['event.venue'] = 'Add the venue or where guests should go.';

  if (event?.hasRsvpWebsite === 'yes') {
    const url = event.rsvpUrl?.trim() || '';
    if (!url) {
      errors['event.rsvpUrl'] = 'Add the RSVP website link.';
    } else {
      try {
        const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
        if (!parsed.hostname.includes('.')) throw new Error('invalid');
      } catch {
        errors['event.rsvpUrl'] = 'Enter a valid website address, like rsvp.yourbrand.com.';
      }
    }
  }

  if (event?.hasEntryFee === 'yes' && (event.tickets?.length || 0) === 0) {
    errors['event.tickets'] = 'Add at least one ticket. You marked this event as paid.';
  }

  if (attachment?.fileName && !detectPromoVisualFromFile({ type: attachment.fileMimeType, name: attachment.fileName })) {
    errors['attachments.0.file'] = 'Use an image, GIF, or video file.';
  }

  return errors;
}

export const EVENT_QUESTION_TYPES = {
  multipleChoice: {
    id: 'multipleChoice',
    label: 'Multiple Choice',
    shortLabel: 'Multi-select',
    group: 'Choice',
    description: 'Guests can pick more than one answer.',
  },
  singleChoice: {
    id: 'singleChoice',
    label: 'Single Choice',
    shortLabel: 'Single-select',
    group: 'Choice',
    description: 'Guests pick one answer.',
  },
  dropdown: {
    id: 'dropdown',
    label: 'Dropdown',
    shortLabel: 'Dropdown',
    group: 'Choice',
    description: 'A compact list when there are many options.',
  },
  yesNo: {
    id: 'yesNo',
    label: 'Yes / No',
    shortLabel: 'Yes / No',
    group: 'Choice',
    description: 'A simple two-way answer.',
  },
  shortText: {
    id: 'shortText',
    label: 'Short Text',
    shortLabel: 'Short text',
    group: 'Written',
    description: 'One line, such as a name or company.',
    examplePlaceholder: 'e.g. Ama Mensah',
    questionHint: 'What is your full name?',
  },
  freeText: {
    id: 'freeText',
    label: 'Free Text',
    shortLabel: 'Long text',
    group: 'Written',
    description: 'An open answer with room to write.',
    examplePlaceholder: 'Share any details we should know...',
    questionHint: 'Anything else we should know?',
  },
  email: {
    id: 'email',
    label: 'Email',
    shortLabel: 'Email',
    group: 'Written',
    description: 'Collect an email address.',
    examplePlaceholder: 'name@email.com',
    questionHint: 'What email should we use?',
  },
  phone: {
    id: 'phone',
    label: 'Phone',
    shortLabel: 'Phone',
    group: 'Written',
    description: 'Collect a phone number.',
    examplePlaceholder: 'e.g. 024 123 4567',
    questionHint: 'What number can we reach you on?',
  },
  number: {
    id: 'number',
    label: 'Number',
    shortLabel: 'Number',
    group: 'Written',
    description: 'A numeric answer, such as guest count.',
    examplePlaceholder: 'e.g. 2',
    questionHint: 'How many guests are you bringing?',
  },
  date: {
    id: 'date',
    label: 'Date',
    shortLabel: 'Date',
    group: 'Written',
    description: 'A calendar date.',
  },
  terms: {
    id: 'terms',
    label: 'Terms & Conditions',
    shortLabel: 'Consent',
    group: 'Consent',
    description: 'Guests must agree before registering.',
  },
};

export const EVENT_QUESTION_TYPE_ORDER = [
  'multipleChoice',
  'singleChoice',
  'dropdown',
  'yesNo',
  'shortText',
  'freeText',
  'email',
  'phone',
  'number',
  'date',
  'terms',
];

const EVENT_CHOICE_TYPES = new Set(['multipleChoice', 'singleChoice', 'dropdown']);
const EVENT_PLACEHOLDER_TYPES = new Set(['shortText', 'freeText', 'email', 'phone', 'number']);

export function createEmptyEventQuestionDraft(type = 'multipleChoice') {
  return {
    type,
    question: '',
    options: EVENT_CHOICE_TYPES.has(type) ? ['', ''] : [],
    placeholder: '',
    required: true,
    termsText: '',
    checkboxLabel: 'I agree to the event terms',
  };
}

export function validateEventQuestionDraft(draft) {
  const errors = {};

  if (draft.type === 'terms') {
    if (!draft.termsText.trim()) {
      errors.termsText = 'Write the terms guests need to agree to.';
    }
    return errors;
  }

  if (!draft.question.trim()) {
    errors.question = 'Write the question guests will see.';
  }

  if (EVENT_CHOICE_TYPES.has(draft.type)) {
    const filled = draft.options.map((option) => option.trim()).filter(Boolean);
    if (filled.length < 2) {
      errors.options = 'Add at least 2 options.';
    }
  }

  return errors;
}

export function buildEventQuestionFromDraft(draft, id) {
  return {
    id: id || `event-question-${Date.now()}`,
    type: draft.type,
    question: draft.type === 'terms' ? 'Terms & Conditions' : draft.question.trim(),
    options: EVENT_CHOICE_TYPES.has(draft.type)
      ? draft.options.map((option) => option.trim()).filter(Boolean)
      : draft.type === 'yesNo'
        ? ['Yes', 'No']
        : [],
    placeholder: EVENT_PLACEHOLDER_TYPES.has(draft.type) ? draft.placeholder?.trim() || '' : '',
    required: draft.required !== false,
    termsText: draft.termsText?.trim() || '',
    checkboxLabel: draft.checkboxLabel?.trim() || 'I agree to the event terms',
  };
}

/* ------------------------------------------------------------------ */
/* Lead Generation form builder                                       */
/* ------------------------------------------------------------------ */

export const LEAD_QUESTION_TYPES = {
  multipleChoice: {
    id: 'multipleChoice',
    label: 'Multiple Choice',
    shortLabel: 'Multi-select',
    description: 'Respondents can select more than one option.',
  },
  singleChoice: {
    id: 'singleChoice',
    label: 'Single Choice',
    shortLabel: 'Single-select',
    description: 'Respondents pick exactly one option.',
  },
  freeText: {
    id: 'freeText',
    label: 'Free Text',
    shortLabel: 'Open text',
    description: 'Collect an open-ended written answer.',
  },
  terms: {
    id: 'terms',
    label: 'Terms & Conditions',
    shortLabel: 'Consent',
    description: 'Require agreement before the form can be submitted.',
  },
};

export const LEAD_QUESTION_TYPE_ORDER = ['multipleChoice', 'singleChoice', 'freeText', 'terms'];

const CHOICE_TYPES = new Set(['multipleChoice', 'singleChoice']);

export function createEmptyLeadQuestionDraft(type = 'multipleChoice') {
  return {
    type,
    question: '',
    options: CHOICE_TYPES.has(type) ? ['', ''] : [],
    placeholder: '',
    required: true,
    termsText: '',
    checkboxLabel: 'I agree to the Terms & Conditions',
  };
}

export function validateLeadQuestionDraft(draft) {
  const errors = {};

  if (draft.type === 'terms') {
    if (!draft.termsText.trim()) {
      errors.termsText = 'Add the terms & conditions text customers must agree to.';
    }
    return errors;
  }

  if (!draft.question.trim()) {
    errors.question = 'Enter the question text.';
  }

  if (CHOICE_TYPES.has(draft.type)) {
    const filled = draft.options.map((option) => option.trim()).filter(Boolean);
    if (filled.length < 2) {
      errors.options = 'Add at least 2 answer options.';
    }
  }

  return errors;
}

export function buildLeadQuestionFromDraft(draft, id) {
  return {
    id: id || `question-${Date.now()}`,
    type: draft.type,
    question: draft.type === 'terms' ? 'Terms & Conditions' : draft.question.trim(),
    options: CHOICE_TYPES.has(draft.type)
      ? draft.options.map((option) => option.trim()).filter(Boolean)
      : [],
    placeholder: draft.placeholder?.trim() || '',
    required: draft.required !== false,
    termsText: draft.termsText?.trim() || '',
    checkboxLabel: draft.checkboxLabel?.trim() || 'I agree to the Terms & Conditions',
  };
}

export function validateLeadQuestions(questions) {
  if (!questions || questions.length === 0) {
    return 'Add at least one question to your lead capture form.';
  }
  return null;
}

export const TEST_BLAST_MAX_CONTACTS = 5;

const ORDINALS = ['1st', '2nd', '3rd', '4th', '5th'];

export function getTestBlastOrdinal(index) {
  return ORDINALS[index] || `${index + 1}th`;
}

const PHONE_PATTERN = /^\+?[\d\s()-]{7,}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TEST_BLAST_CHANNEL_CONFIG = {
  sms: {
    fieldLabel: 'Contact Numbers',
    inputType: 'tel',
    note: 'Enter up to 5 phone contacts for your SMS campaign verification before launch.',
    placeholder: (index) => `Enter ${getTestBlastOrdinal(index)} phone number`,
    isValid: (value) => PHONE_PATTERN.test(value.trim()),
    invalidMessage: 'Enter a valid phone number.',
    emptyMessage: 'Add at least one phone number to send a test blast.',
  },
  email: {
    fieldLabel: 'Email Addresses',
    inputType: 'email',
    note: 'Enter up to 5 email addresses for your email campaign verification before launch.',
    placeholder: (index) => `Enter ${getTestBlastOrdinal(index)} email address`,
    isValid: (value) => EMAIL_PATTERN.test(value.trim()),
    invalidMessage: 'Enter a valid email address.',
    emptyMessage: 'Add at least one email address to send a test blast.',
  },
  whatsapp: {
    fieldLabel: 'Contact Numbers',
    inputType: 'tel',
    note: 'Enter up to 5 WhatsApp numbers for your campaign verification before launch.',
    placeholder: (index) => `Enter ${getTestBlastOrdinal(index)} phone number`,
    isValid: (value) => PHONE_PATTERN.test(value.trim()),
    invalidMessage: 'Enter a valid phone number.',
    emptyMessage: 'Add at least one phone number to send a test blast.',
  },
  push: {
    fieldLabel: 'Contact Numbers',
    inputType: 'tel',
    note: 'Enter up to 5 device numbers for your push notification verification before launch.',
    placeholder: (index) => `Enter ${getTestBlastOrdinal(index)} phone number`,
    isValid: (value) => PHONE_PATTERN.test(value.trim()),
    invalidMessage: 'Enter a valid phone number.',
    emptyMessage: 'Add at least one contact number to send a test blast.',
  },
};

export function getTestBlastConfig(channel) {
  return TEST_BLAST_CHANNEL_CONFIG[channel] || TEST_BLAST_CHANNEL_CONFIG.sms;
}

function validateTestBlastContacts(contacts, config) {
  const errors = {};
  const filled = contacts.map((value) => value.trim()).filter(Boolean);

  if (filled.length === 0) {
    errors.contacts = config.emptyMessage;
    return errors;
  }

  contacts.forEach((value, index) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (!config.isValid(trimmed)) {
      errors[`contact.${index}`] = config.invalidMessage;
    }
  });

  return errors;
}

export function validateTestBlastContactsForChannel(channel, contacts) {
  return validateTestBlastContacts(contacts, getTestBlastConfig(channel));
}

const COLLECTION_BASE_COUNTS = {
  'summer-promo': 12500,
  newsletter: 18400,
  inactive: 9200,
  'high-value': 6400,
};

export function formatReachCount(value) {
  if (value >= 1000) {
    const thousands = value / 1000;
    return Number.isInteger(thousands) ? `${thousands}k` : `${thousands.toFixed(1)}k`;
  }

  return String(value);
}

export function resolvePreferredReach(form, stats) {
  if (form.reachMode === 'all') {
    return stats.estimatedReach;
  }

  const customReach = Number(form.preferredReach);
  return customReach > 0 ? customReach : stats.estimatedReach;
}

export function computeCustomerScanStats(form) {
  const customerBase =
    form.customerSource === 'internal'
      ? COLLECTION_BASE_COUNTS[form.collection] || 12500
      : 12500;

  const activeFilters = form.segmentFilters.filter((filter) => filter.value).length;
  const reachRatio = Math.max(0.08, 0.12 - activeFilters * 0.015);
  const estimatedReach = Math.max(500, Math.round(customerBase * reachRatio));
  const validCustomers = Math.round(customerBase * 0.88);
  const invalidCustomers = Math.max(customerBase - validCustomers, 0);
  const quotaTotal = estimatedReach;
  const quotaUsed = Math.round(estimatedReach * 0.72);
  const quotaLeft = Math.max(quotaTotal - quotaUsed, 0);

  return {
    customerBase,
    estimatedReach,
    validCustomers,
    invalidCustomers,
    quotaTotal,
    quotaUsed,
    quotaLeft,
  };
}

export const SAMPLE_SCAN_CUSTOMERS = {
  valid: [
    { id: 1, name: 'Ama Mensah', contact: '+233 24 123 4567' },
    { id: 2, name: 'Kwame Asante', contact: 'kwame.a@email.com' },
    { id: 3, name: 'Efua Boateng', contact: '+233 55 987 6543' },
    { id: 4, name: 'Kojo Owusu', contact: 'kojo.o@email.com' },
  ],
  invalid: [
    { id: 1, name: 'Unknown Contact', contact: 'invalid-number' },
    { id: 2, name: 'Duplicate Entry', contact: '+233 20 000 0000' },
    { id: 3, name: 'Opted Out User', contact: 'optout@email.com' },
  ],
};

export const CAMPAIGN_TEMPLATES = [
  {
    id: 'perfect-day-sale',
    name: 'The Perfect Day Sale',
    category: 'Retail',
    thumbnail: '/images/campaigns/bullhorn.png',
    headline: 'The Perfect Day Sale',
    body: 'Exclusive discounts on your favourite products. Limited time only!',
    cta: 'Shop Now',
    accent: 'from-[#E67E22] to-[#F5A623]',
    products: [
      { label: 'Sneakers', price: '40% Off' },
      { label: 'Bags', price: '30% Off' },
      { label: 'Watches', price: '25% Off' },
      { label: 'Apparel', price: 'Buy 2 Get 1' },
    ],
  },
  {
    id: 'holiday-special',
    name: 'Holiday Special',
    category: 'Seasonal',
    thumbnail: '/images/campaigns/envelope.png',
    headline: 'Holiday Special Offers',
    body: 'Celebrate the season with up to 40% off selected items.',
    cta: 'View Deals',
    accent: 'from-primary to-[#6B4FE0]',
    products: [
      { label: 'Gifts', price: '40% Off' },
      { label: 'Decor', price: 'From GHS 50' },
      { label: 'Bundles', price: 'Save More' },
      { label: 'Limited', price: 'While Stocks' },
    ],
  },
  {
    id: 'birthday-offer',
    name: 'Birthday Offer',
    category: 'Retention',
    thumbnail: '/images/campaigns/person.png',
    headline: 'Happy Birthday!',
    body: 'Enjoy a special birthday discount just for you.',
    cta: 'Claim Offer',
    accent: 'from-[#1F9D55] to-[#34D399]',
    products: [
      { label: 'Gift', price: '15% Off' },
      { label: 'Treat', price: 'Free Treat' },
      { label: 'Points', price: '2x Points' },
      { label: 'VIP', price: 'Exclusive' },
    ],
  },
  {
    id: 'flash-sale',
    name: 'Flash Sale',
    category: 'Promotions',
    thumbnail: '/images/services/campaigns.png',
    headline: '24-Hour Flash Sale',
    body: 'Grab the best deals before they are gone.',
    cta: 'Shop Flash Sale',
    accent: 'from-[#8B2942] to-[#C0396B]',
    products: [
      { label: 'Hot', price: '50% Off' },
      { label: 'Deal', price: 'Ends Soon' },
      { label: 'Top', price: 'Best Sellers' },
      { label: 'Clear', price: 'Final Call' },
    ],
  },
  {
    id: 'new-collection',
    name: 'New Collection',
    category: 'Product Launch',
    thumbnail: '/images/campaigns/bullhorn.png',
    headline: 'Discover Our New Collection',
    body: 'Be the first to explore our latest arrivals.',
    cta: 'Explore Now',
    accent: 'from-[#2E7DAD] to-[#5B9FD4]',
    products: [
      { label: 'New', price: 'Just In' },
      { label: 'Drop', price: 'Edition 01' },
      { label: 'Look', price: 'Shop Look' },
      { label: 'Pre', price: 'Pre-order' },
    ],
  },
  {
    id: 'win-back',
    name: 'Win-Back Campaign',
    category: 'Retention',
    thumbnail: '/images/campaigns/envelope.png',
    headline: 'We Miss You!',
    body: 'Come back and enjoy 15% off your next purchase.',
    cta: 'Return & Save',
    accent: 'from-[#0B1354] to-[#2E7DAD]',
    products: [
      { label: 'Welcome', price: '15% Off' },
      { label: 'Picks', price: 'For You' },
      { label: 'Bonus', price: 'Extra Points' },
      { label: 'Back', price: 'Come Back' },
    ],
  },
  {
    id: 'lead-gen-ebook-download',
    name: 'Free eBook Download',
    category: 'Lead Generation',
    categoryId: 'lead-generation',
    thumbnail: '/images/campaigns/envelope.png',
    headline: 'Get Your Free Guide',
    body: 'Download our exclusive guide packed with insider tips to grow your business.',
    cta: 'Download Now',
    accent: 'from-[#1F9D55] to-[#34D399]',
    products: [
      { label: 'Guide', price: 'Free' },
      { label: 'Tips', price: '20+ Pages' },
      { label: 'Bonus', price: 'Checklist' },
      { label: 'Instant', price: 'Access' },
    ],
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
          'By submitting this form, you agree to receive marketing communications from us and accept our privacy policy.',
        checkboxLabel: 'I agree to the Terms & Conditions',
      },
    ],
  },
  {
    id: 'lead-gen-consultation-booking',
    name: 'Free Consultation Booking',
    category: 'Lead Generation',
    categoryId: 'lead-generation',
    thumbnail: '/images/campaigns/person.png',
    headline: 'Book Your Free Consultation',
    body: 'Speak with one of our specialists and get personalized recommendations at no cost.',
    cta: 'Book Now',
    accent: 'from-primary to-[#6B4FE0]',
    products: [
      { label: 'Free', price: '30 Min Call' },
      { label: 'Expert', price: '1-on-1' },
      { label: 'No Cost', price: 'Zero Fee' },
      { label: 'Flexible', price: 'Your Time' },
    ],
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
        id: 'q-time',
        type: 'singleChoice',
        question: 'What time works best for a call?',
        options: ['Morning', 'Afternoon', 'Evening'],
        placeholder: '',
        required: true,
        termsText: '',
        checkboxLabel: '',
      },
      {
        id: 'q-topics',
        type: 'multipleChoice',
        question: 'What would you like to discuss?',
        options: ['Pricing', 'Product Demo', 'Custom Plan', 'Support'],
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
        termsText: 'By booking a consultation, you agree to be contacted by our team.',
        checkboxLabel: 'I agree to the Terms & Conditions',
      },
    ],
  },
];

export const CHANNEL_CARD_STYLES = {
  SMS: 'bg-[#E8F4FC] text-[#2E7DAD]',
  Email: 'bg-[#EDE8F8] text-primary',
  WhatsApp: 'bg-[#E8F8EF] text-[#1F9D55]',
  Push: 'bg-[#FFF4E8] text-[#E67E22]',
  'Push Notification': 'bg-[#FFF4E8] text-[#E67E22]',
};

export const MOCK_CAMPAIGNS = [
  {
    id: 'dealboxx-summer',
    name: 'DealBoxx Summer Promo',
    channel: 'SMS',
    status: 'Active',
    audienceReach: '12k',
    openRate: '68%',
    clickRate: '24%',
    dateCreated: '12-06-26',
    route: 'direct',
    categoryId: 'sales-conversion',
    headline: 'Clear Offer',
    body: 'Trust is built over time. Choose brands that are transparent, reliable, and committed to serving you better.',
    description:
      'Trust is built over time. Choose brands that are transparent, reliable, and committed to serving you better.',
    cta: 'Buy Now',
    customerCategoryLabel: 'Deal Box Promotion',
    collectionLabel: 'New Customers',
  },
  {
    id: 'vip-exclusive',
    name: 'VIP Exclusive Offer',
    channel: 'Email',
    status: 'Scheduled',
    audienceReach: '9.4k',
    openRate: '—',
    clickRate: '—',
    dateCreated: '08-04-26',
    route: 'template',
    templateId: 'holiday-special',
    categoryId: 'promotions',
    headline: 'VIP Members Only',
    cta: 'Claim Offer',
  },
  {
    id: 'flash-friday',
    name: 'Flash Friday Alert',
    channel: 'WhatsApp',
    status: 'Draft',
    audienceReach: '4.2k',
    openRate: '—',
    clickRate: '—',
    dateCreated: '01-06-26',
    route: 'direct',
    categoryId: 'sales-conversion',
    headline: 'Flash Friday',
    cta: 'Shop Now',
  },
  {
    id: 'loyalty-birthday',
    name: 'Loyalty Birthday Blast',
    channel: 'Email',
    status: 'Completed',
    audienceReach: '7.8k',
    openRate: '72%',
    clickRate: '31%',
    dateCreated: '22-05-26',
    route: 'template',
    templateId: 'birthday-offer',
    categoryId: 'customer-engagement',
    headline: 'Happy Birthday!',
    cta: 'Redeem Gift',
  },
  {
    id: 'lead-magnet-guide',
    name: 'Free Guide Lead Magnet',
    channel: 'SMS',
    status: 'Active',
    audienceReach: '5.1k',
    openRate: '54%',
    clickRate: '18%',
    dateCreated: '03-07-26',
    route: 'template',
    categoryId: 'lead-generation',
    headline: 'Get Your Free Guide',
    cta: 'Download',
  },
  {
    id: 'event-summer-fest',
    name: 'Summer Fest Invite',
    channel: 'WhatsApp',
    status: 'Scheduled',
    audienceReach: '3.6k',
    openRate: '—',
    clickRate: '—',
    dateCreated: '15-07-26',
    route: 'direct',
    categoryId: 'events-activation',
    headline: 'You are invited',
    cta: 'RSVP Now',
  },
];

export const STATUS_STYLES = {
  Active: 'bg-[#E8F8EF] text-[#1F9D55] ring-[#1F9D55]/20',
  Scheduled: 'bg-[#FFF4E8] text-[#E67E22] ring-[#E67E22]/20',
  Draft: 'bg-[#F0F2F7] text-[#717171] ring-[#717171]/20',
  Completed: 'bg-[#EDE8F8] text-primary ring-primary/20',
};

export function getTemplateById(id) {
  return CAMPAIGN_TEMPLATES.find((item) => item.id === id) || null;
}

export function createCampaignFromForm(form, route = 'direct', templateId = null, categoryId = null) {
  const channelLabel =
    CAMPAIGN_CHANNELS.find((item) => item.id === form.channel)?.label || form.channel;

  const stats = computeCustomerScanStats(form);
  const resolvedReach = resolvePreferredReach(form, stats);

  const audienceReach =
    form.customerSource === 'internal'
      ? CUSTOMER_COLLECTIONS.find((item) => item.id === form.collection)?.label || '—'
      : form.externalListFileName || 'External list';

  return {
    id: `campaign-${Date.now()}`,
    name: form.name,
    channel: channelLabel,
    status: form.scheduleType === 'now' ? 'Active' : 'Scheduled',
    audienceReach: formatReachCount(resolvedReach),
    openRate: '—',
    clickRate: '—',
    dateCreated: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
    route,
    templateId,
    categoryId,
    objective: form.objective,
    headline: form.headline,
    body: form.body,
    description: form.description,
    cta: form.cta,
    attachmentName: form.attachments?.[0]?.fileName || '',
    attachments: form.attachments,
    banner: form.banner || null,
    leadQuestions: form.leadQuestions || [],
    event: form.event || null,
    registrationQuestions: form.registrationQuestions || [],
    targeting: {
      customerSource: form.customerSource,
      customerCategory: form.customerCategory,
      collection: form.collection,
      externalListFileName: form.externalListFileName,
      segmentFilters: form.segmentFilters,
      reachMode: form.reachMode,
      preferredReach: resolvedReach,
      scanStats: stats,
    },
  };
}

export const CAMPAIGN_CREATED_SUCCESS = {
  title: 'Campaign Launch Successful',
  description: 'Your campaign is now live and actively reaching your selected audience.',
  actionLabel: 'Track Analytics',
};

export const TEST_BLAST_SUCCESS = {
  title: 'Test Blast Successful',
  description:
    'Your test message has been sent successfully and delivered to the selected recipients.',
  actionLabel: 'Back to Campaign Launch',
};
