export const SETTINGS_COPY = {
  birthday: {
    title: 'Settings',
    subtitle: 'Set-up your birthday automatically at once',
  },
  welcome: {
    title: 'Settings',
    subtitle: 'Set-up your welcome message automatically at once',
  },
  anniversary: {
    title: 'Settings',
    subtitle: 'Set-up your customer anniversary automatically at once',
  },
  events: {
    title: 'Settings',
    subtitle: 'Set-up your event automations in one place',
  },
  reminders: {
    title: 'Settings',
    subtitle: 'Set-up your reminder automations in one place',
  },
};

export const APPROVAL_OPTIONS = [
  { value: 'auto', label: 'Auto-approval' },
  { value: 'business', label: 'Business-approval' },
];

export const ALERT_DAY_OPTIONS = [
  { value: '1', label: '1 day before' },
  { value: '2', label: '2 days before' },
  { value: '3', label: '3 days before' },
  { value: '5', label: '5 days before' },
  { value: '7', label: '7 days before' },
];

export const SENDING_TIME_OPTIONS = [
  { value: '08:00', label: '08:00 AM' },
  { value: '09:00', label: '09:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '15:00', label: '03:00 PM' },
  { value: '18:00', label: '06:00 PM' },
];

export const CHANNEL_OPTIONS = [
  { value: 'sms', label: 'SMS' },
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

export const CTA_OPTIONS = [
  { value: 'shop-now', label: 'Shop now' },
  { value: 'claim-offer', label: 'Claim offer' },
  { value: 'learn-more', label: 'Learn more' },
  { value: 'contact-us', label: 'Contact us' },
  { value: 'other', label: 'Other' },
];

export const TEMPLATE_SETUP_FILTERS = [
  { value: 'all', label: 'All types' },
  { value: 'offer-setup', label: 'Offer Setup' },
  { value: 'attachment-only', label: 'Attachment Only' },
  { value: 'message-only', label: 'Message only' },
];

export const MESSAGE_TEMPLATES_BY_CHANNEL = {
  sms: [
    {
      id: 'sms-offer-short',
      name: 'Offer + link',
      offerSetup: 'offer-setup',
      title: 'Birthday offer inside',
      callToAction: 'shop-now',
      ctaLink: 'https://example.com/birthday-offer',
      offerLink: 'https://example.com/birthday-offer',
      attachmentLink: 'https://example.com/media/birthday-banner.jpg',
      description: 'A limited birthday discount reserved for this customer.',
      voucherCode: 'BDAY20',
      offerVisual: 'image',
      price: '100',
      discountedPrice: '80',
      message:
        'Happy Birthday! Enjoy your special birthday offer today.\nOffer: https://example.com/birthday-offer\nImage: https://example.com/media/birthday-banner.jpg\nReply STOP to opt out.',
    },
    {
      id: 'sms-offer-loyalty',
      name: 'Loyalty offer link',
      offerSetup: 'offer-setup',
      title: 'Thanks for being with us',
      callToAction: 'claim-offer',
      ctaLink: 'https://example.com/reward',
      offerLink: 'https://example.com/reward',
      attachmentLink: 'https://example.com/media/loyalty-card.jpg',
      description: 'Birthday reward for loyal customers.',
      voucherCode: 'LOYALBDAY',
      offerVisual: 'image',
      price: '50',
      discountedPrice: '0',
      message:
        'Happy Birthday! Thanks for being a valued customer.\nClaim offer: https://example.com/reward\nView card: https://example.com/media/loyalty-card.jpg',
    },
    {
      id: 'sms-attachment-media',
      name: 'Attachment link',
      offerSetup: 'attachment-only',
      title: 'Birthday media ready',
      callToAction: 'learn-more',
      ctaLink: 'https://example.com/media/birthday-video',
      attachmentLink: 'https://example.com/media/birthday-video.mp4',
      attachmentType: 'video',
      message:
        'Happy Birthday! Your birthday media is ready.\nWatch / download: https://example.com/media/birthday-video.mp4\nReply STOP to opt out.',
    },
    {
      id: 'sms-attachment-image',
      name: 'Image attachment link',
      offerSetup: 'attachment-only',
      title: 'Birthday image',
      callToAction: 'shop-now',
      ctaLink: 'https://example.com/media/birthday-image',
      attachmentLink: 'https://example.com/media/birthday-image.jpg',
      attachmentType: 'image',
      message:
        'Happy Birthday! Open your birthday image here:\nhttps://example.com/media/birthday-image.jpg',
    },
    {
      id: 'sms-message-warm',
      name: 'Warm SMS wish',
      offerSetup: 'message-only',
      title: 'Happy Birthday!',
      callToAction: 'contact-us',
      ctaLink: 'https://example.com/contact',
      message:
        'Happy Birthday from all of us! We hope your day is filled with joy. Reply STOP to opt out.',
    },
    {
      id: 'sms-message-short',
      name: 'Short celebration note',
      offerSetup: 'message-only',
      title: 'Celebrate with us',
      callToAction: 'learn-more',
      ctaLink: 'https://example.com/celebrate',
      message: 'Happy Birthday! Wishing you a wonderful day from our team.',
    },
  ],
  email: [
    {
      id: 'email-offer-celebration',
      name: 'Offer celebration',
      offerSetup: 'offer-setup',
      title: 'Let’s celebrate you today',
      callToAction: 'claim-offer',
      ctaLink: 'https://example.com/celebrate',
      description: 'A curated birthday surprise with a limited-time discount.',
      voucherCode: 'CELEBRATE20',
      offerVisual: 'image',
      price: '120',
      discountedPrice: '96',
      hasBanner: true,
      hasAttachment: true,
      message:
        'Wishing you a wonderful birthday!\n\nCelebrate with us and discover a surprise offer curated specially for your big day.\n\nUse the button below to claim your birthday surprise.',
    },
    {
      id: 'email-offer-exclusive',
      name: 'Exclusive offer email',
      offerSetup: 'offer-setup',
      title: 'A gift just for you',
      callToAction: 'shop-now',
      ctaLink: 'https://example.com/exclusive',
      description: 'Exclusive birthday pricing on selected products.',
      voucherCode: 'EXCLUSIVEBDAY',
      offerVisual: 'image',
      price: '200',
      discountedPrice: '150',
      hasBanner: true,
      hasAttachment: false,
      message:
        'It is your birthday, and we have something exclusive waiting for you.\n\nShop today and enjoy your birthday discount before it expires.',
    },
    {
      id: 'email-attachment-media',
      name: 'Attachment highlight',
      offerSetup: 'attachment-only',
      title: 'Your birthday media',
      callToAction: 'learn-more',
      ctaLink: 'https://example.com/media',
      attachmentType: 'image',
      hasAttachment: true,
      message:
        'Happy Birthday!\n\nWe prepared a special birthday attachment for you. Open it below and enjoy a little surprise from our team.',
    },
    {
      id: 'email-attachment-video',
      name: 'Video attachment',
      offerSetup: 'attachment-only',
      title: 'Watch your birthday clip',
      callToAction: 'learn-more',
      ctaLink: 'https://example.com/birthday-clip',
      attachmentType: 'video',
      hasAttachment: true,
      message:
        'Happy Birthday!\n\nYour birthday video message is ready. Play the attachment below whenever you are ready to celebrate.',
    },
    {
      id: 'email-message-premium',
      name: 'Premium note',
      offerSetup: 'message-only',
      title: 'Your birthday perk is ready',
      callToAction: 'contact-us',
      ctaLink: 'https://example.com/support',
      message:
        'Happy Birthday!\n\nYour premium birthday perk is ready. If you need help redeeming it, our team is happy to celebrate with you.',
    },
    {
      id: 'email-message-loyalty',
      name: 'Loyalty thank you',
      offerSetup: 'message-only',
      title: 'Thank you for being with us',
      callToAction: 'claim-offer',
      ctaLink: 'https://example.com/loyalty',
      message:
        'Happy Birthday!\n\nThank you for being a valued customer. We are grateful to celebrate another year with you.',
    },
  ],
  whatsapp: [
    {
      id: 'wa-offer-warm',
      name: 'Offer with media',
      offerSetup: 'offer-setup',
      title: 'Happy Birthday!',
      callToAction: 'claim-offer',
      ctaLink: 'https://example.com/wa-claim',
      description: 'A special birthday treat with a quick claim action.',
      voucherCode: 'WABDAY',
      offerVisual: 'image',
      price: '80',
      discountedPrice: '60',
      hasBanner: true,
      hasAttachment: true,
      message:
        'Happy Birthday from all of us! We hope your day is filled with joy.\n\nEnjoy a special birthday treat from us — tap below to claim your offer.',
    },
    {
      id: 'wa-offer-exclusive',
      name: 'Exclusive treat',
      offerSetup: 'offer-setup',
      title: 'A gift just for you',
      callToAction: 'shop-now',
      ctaLink: 'https://example.com/wa-shop',
      description: 'Exclusive WhatsApp birthday discount.',
      voucherCode: 'WASHOP15',
      offerVisual: 'image',
      price: '90',
      discountedPrice: '76',
      hasBanner: true,
      hasAttachment: false,
      message:
        'It is your birthday, and we have something exclusive waiting for you.\n\nShop today and enjoy your birthday discount before it expires.',
    },
    {
      id: 'wa-attachment-image',
      name: 'Image attachment',
      offerSetup: 'attachment-only',
      title: 'Birthday image for you',
      callToAction: 'learn-more',
      ctaLink: 'https://example.com/wa-media',
      attachmentType: 'image',
      hasAttachment: true,
      message:
        'Happy Birthday!\n\nWe sent a birthday image just for you. Open the attachment below to view it.',
    },
    {
      id: 'wa-attachment-video',
      name: 'Video attachment',
      offerSetup: 'attachment-only',
      title: 'Birthday video ready',
      callToAction: 'learn-more',
      ctaLink: 'https://example.com/wa-video',
      attachmentType: 'video',
      hasAttachment: true,
      message:
        'Happy Birthday!\n\nYour birthday video is ready. Tap the attachment to watch whenever you like.',
    },
    {
      id: 'wa-message-celebration',
      name: 'Celebration invite',
      offerSetup: 'message-only',
      title: 'Let’s celebrate you',
      callToAction: 'learn-more',
      ctaLink: 'https://example.com/wa-celebrate',
      message:
        'Wishing you a wonderful birthday!\n\nCelebrate with us — we are glad you are part of our community.',
    },
    {
      id: 'wa-message-support',
      name: 'Concierge birthday help',
      offerSetup: 'message-only',
      title: 'Need help with your gift?',
      callToAction: 'contact-us',
      ctaLink: 'https://example.com/wa-help',
      message:
        'Happy Birthday! Your birthday perk is ready.\n\nReply to this chat if you need help redeeming it — we are happy to celebrate with you.',
    },
  ],
};

export function getMessageTemplatesForChannel(channel, offerSetup = 'all') {
  const templates = MESSAGE_TEMPLATES_BY_CHANNEL[channel] || MESSAGE_TEMPLATES_BY_CHANNEL.sms;
  if (!offerSetup || offerSetup === 'all') return templates;
  return templates.filter((template) => template.offerSetup === offerSetup);
}

export function getChannelLabel(channel) {
  return CHANNEL_OPTIONS.find((option) => option.value === channel)?.label || 'SMS';
}

export const OFFER_VISUAL_OPTIONS = [
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'none', label: 'No visual' },
];

export const OFFER_SETUP_OPTIONS = [
  { value: 'offer-setup', label: 'Offer Setup' },
  { value: 'attachment-only', label: 'Attachment Only' },
  { value: 'message-only', label: 'Message only' },
];

export function getOfferSetupLabel(offerSetup) {
  return OFFER_SETUP_OPTIONS.find((option) => option.value === offerSetup)?.label || offerSetup;
}

export const ATTACHMENT_TYPE_OPTIONS = [
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'gif', label: 'GIF' },
];

export const ATTACHMENT_SIZE_GUIDES = {
  image: {
    dimensions: '1200 × 628 px',
    maxSize: '5 MB',
    formats: 'JPG, PNG, or WebP',
    maxBytes: 5 * 1024 * 1024,
    recommendedWidth: 1200,
    recommendedHeight: 628,
    acceptMimes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  video: {
    dimensions: '1280 × 720 px (16:9)',
    maxSize: '50 MB',
    formats: 'MP4 or MOV',
    maxBytes: 50 * 1024 * 1024,
    recommendedWidth: 1280,
    recommendedHeight: 720,
    acceptMimes: ['video/mp4', 'video/quicktime'],
  },
  gif: {
    dimensions: '800 × 800 px',
    maxSize: '8 MB',
    formats: 'GIF only',
    maxBytes: 8 * 1024 * 1024,
    recommendedWidth: 800,
    recommendedHeight: 800,
    acceptMimes: ['image/gif'],
  },
};

export const FIELD_HELP = {
  approvalOption: 'Choose whether birthday messages send automatically or need business approval first.',
  alertDays: 'How many days before a customer birthday your team should get an alert.',
  sendingTime: 'The time of day birthday messages should be sent to customers.',
  title: 'A short offer headline customers will see in the birthday message.',
  callToAction: 'The action button or prompt that encourages customers to respond. Choose Other to enter a custom CTA.',
  customCtaLabel: 'Enter the custom call-to-action text customers will see on the button.',
  ctaLink: 'The destination URL opened when customers tap the call-to-action.',
  message: 'The full birthday message text delivered through your selected channel.',
  description: 'A short summary of the birthday offer to help customers understand the value.',
  bannerName: 'Optional banner creative shown with the offer. Recommended 1200 × 628 px, up to 5 MB.',
  offerVisual: 'Select whether the offer uses an image, video, or no visual asset.',
  voucherCode: 'Optional promo or voucher code customers can redeem with the offer.',
  attachmentName: 'Optional supporting file (image or video) attached to the birthday offer.',
  offerExpiryDate: 'The last date customers can use this birthday offer.',
  price: 'Original price of the offer before any birthday discount is applied.',
  discountedPrice: 'Final price after discount. Must be less than or equal to the original price.',
  attachmentType: 'Pick the media type you want to attach to this birthday automation.',
  attachmentUpload: 'Upload the selected media file. Follow the size guide for best results.',
};

export const MEDIA_SETTING_KEYS = [
  'bannerName',
  'bannerPreviewUrl',
  'bannerFileSize',
  'bannerFileBytes',
  'attachmentName',
  'attachmentPreviewUrl',
  'attachmentFileSize',
  'attachmentFileBytes',
  'attachmentMimeType',
  'extraAttachments',
];

export const DEFAULT_AUTOMATION_SETTINGS = {
  enabled: true,
  approvalOption: '',
  alertDays: '',
  sendingTime: '',
  channel: 'sms',
  title: '',
  callToAction: '',
  customCtaLabel: '',
  ctaLink: '',
  message: '',
  offerSetup: 'offer-setup',
  description: '',
  offerVisual: 'image',
  voucherCode: '',
  offerExpiryDate: '',
  price: '',
  discountedPrice: '',
  bannerName: '',
  bannerPreviewUrl: '',
  bannerFileSize: '',
  bannerFileBytes: 0,
  attachmentName: '',
  attachmentPreviewUrl: '',
  attachmentFileSize: '',
  attachmentFileBytes: 0,
  attachmentMimeType: '',
  attachmentType: 'image',
  extraAttachments: [],
};

function defaultOfferExpiryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
}

/** Default form values when settings are enabled (media stays empty for the user to upload). */
export function getPopulatedAutomationSettings() {
  return {
    ...DEFAULT_AUTOMATION_SETTINGS,
    enabled: true,
    approvalOption: 'auto',
    alertDays: '3',
    sendingTime: '09:00',
    channel: 'sms',
    title: 'Happy Birthday!',
    callToAction: 'claim-offer',
    customCtaLabel: '',
    ctaLink: 'https://example.com/birthday-offer',
    message:
      'Happy Birthday from all of us! Enjoy a special birthday treat reserved just for you. Tap below to claim your offer. Reply STOP to opt out.',
    offerSetup: 'offer-setup',
    description: 'A limited birthday discount curated as a thank-you for being a valued customer.',
    offerVisual: 'image',
    voucherCode: 'BDAY20',
    offerExpiryDate: defaultOfferExpiryDate(),
    price: '100',
    discountedPrice: '80',
    attachmentType: 'image',
  };
}

export function applyEnabledDefaults(currentValues, defaults = getPopulatedAutomationSettings()) {
  const next = { ...currentValues, enabled: true };
  const mediaKeys = new Set(MEDIA_SETTING_KEYS);

  Object.keys(defaults).forEach((key) => {
    if (key === 'enabled' || mediaKeys.has(key)) return;

    const current = currentValues[key];
    const isEmpty =
      current === '' ||
      current === null ||
      current === undefined ||
      (Array.isArray(current) && current.length === 0);

    if (isEmpty) {
      next[key] = defaults[key];
    }
  });

  return next;
}

export function getSettingsCopy(kindId) {
  return SETTINGS_COPY[kindId] ?? SETTINGS_COPY.birthday;
}
