const PLACEHOLDER_BANNER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="240" viewBox="0 0 480 240" fill="none">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="480" y2="240" gradientUnits="userSpaceOnUse">
          <stop stop-color="#8B7355"/>
          <stop offset="0.5" stop-color="#C4A574"/>
          <stop offset="1" stop-color="#6B5344"/>
        </linearGradient>
      </defs>
      <rect width="480" height="240" fill="url(#g)"/>
      <circle cx="360" cy="70" r="40" fill="#F5E6C8" opacity="0.35"/>
      <rect x="40" y="150" width="220" height="12" rx="6" fill="#fff" opacity="0.25"/>
      <rect x="40" y="172" width="140" height="10" rx="5" fill="#fff" opacity="0.18"/>
    </svg>`,
  );

export const APPROVAL_OPTIONS = [
  { value: 'auto', label: 'Auto-approval' },
  { value: 'business', label: 'Business-approval' },
];

export const ALERT_DAY_OPTIONS = [
  { value: '1', label: '1 day' },
  { value: '2', label: '2 days' },
  { value: '3', label: '3 days' },
  { value: '5', label: '5 days' },
  { value: '7', label: '7 days' },
];

export const SENDING_TIME_OPTIONS = [
  { value: '00:00', label: '12:00 AM' },
  { value: '08:00', label: '08:00 AM' },
  { value: '09:00', label: '09:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '15:00', label: '03:00 PM' },
  { value: '18:00', label: '06:00 PM' },
];

export const ANNIVERSARY_TIME_OPTIONS = [
  { value: '1', label: '1 yr' },
  { value: '2', label: '2 yrs' },
  { value: '3', label: '3 yrs' },
  { value: '5', label: '5 yrs' },
  { value: '10', label: '10 yrs' },
  { value: 'every', label: 'Every year' },
];

export const CHANNEL_OPTIONS = [
  { value: 'sms', label: 'SMS' },
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

export const CTA_OPTIONS = [
  { value: 'buy-now', label: 'Buy Now' },
  { value: 'shop-now', label: 'Shop now' },
  { value: 'claim-offer', label: 'Claim offer' },
  { value: 'learn-more', label: 'Learn more' },
  { value: 'contact-us', label: 'Contact us' },
  { value: 'other', label: 'Other' },
];

export const OFFER_VISUAL_OPTIONS = [
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'none', label: 'No visual' },
];

export const OFFER_SETUP_OPTIONS = [
  { value: 'offer-setup', label: 'Offer set-up' },
  { value: 'attachment-only', label: 'Attachment Only' },
  { value: 'message-only', label: 'Message only' },
];

const OVERVIEW_COPY = {
  birthday: {
    title: 'Overview',
    subtitle: 'Review the birthday automation configured by this business',
    labels: {
      approvalOption: 'Approval Options',
      alertDays: 'Business Alerts Before Birthday',
      sendingTime: 'Birthday Sending Time',
      title: 'Title',
      callToAction: 'Call to Action',
      message: 'Message',
      description: 'Description',
      bannerName: 'Banner',
      offerVisual: 'Offer Visual',
      voucherCode: 'Voucher / Offer Code',
      attachmentName: 'Attachment',
      offerExpiryDate: 'Offer Expiry Date',
      price: 'Price',
      discountedPrice: 'Discounted Price',
      anniversaryTime: 'Anniversary Time',
    },
    headerIcon: 'gift',
  },
  welcome: {
    title: 'Overview',
    subtitle: 'Review the welcome automation configured by this business',
    labels: {
      approvalOption: 'Approval Options',
      alertDays: 'Business Alerts Before Welcome',
      sendingTime: 'Welcome Sending Time',
      title: 'Title',
      callToAction: 'Call to Action',
      message: 'Message',
      description: 'Description',
      bannerName: 'Banner',
      offerVisual: 'Offer Visual',
      voucherCode: 'Voucher / Offer Code',
      attachmentName: 'Attachment',
      offerExpiryDate: 'Offer Expiry Date',
      price: 'Price',
      discountedPrice: 'Discounted Price',
      anniversaryTime: 'Anniversary Time',
    },
    headerIcon: 'message',
  },
  anniversary: {
    title: 'Overview',
    subtitle: 'Review the anniversary automation configured by this business',
    labels: {
      approvalOption: 'Approval Options',
      alertDays: 'Business Alerts Before Anniversary',
      sendingTime: 'Anniversary Sending Time',
      title: 'Title',
      callToAction: 'Call to Action',
      message: 'Message',
      description: 'Description',
      bannerName: 'Banner',
      offerVisual: 'Offer Visual',
      voucherCode: 'Voucher / Offer Code',
      attachmentName: 'Attachment',
      offerExpiryDate: 'Offer Expiry Date',
      price: 'Price',
      discountedPrice: 'Discounted Price',
      anniversaryTime: 'Anniversary Time',
    },
    headerIcon: 'award',
  },
  holidays: {
    title: 'Overview',
    subtitle: 'Review the holiday automation configured by this business',
    labels: {
      approvalOption: 'Approval Options',
      alertDays: 'Business Alerts Before Holiday',
      sendingTime: 'Holiday Sending Time',
      title: 'Title',
      callToAction: 'Call to Action',
      message: 'Message',
      description: 'Description',
      bannerName: 'Banner',
      offerVisual: 'Offer Visual',
      voucherCode: 'Voucher / Offer Code',
      attachmentName: 'Attachment',
      offerExpiryDate: 'Offer Expiry Date',
      price: 'Price',
      discountedPrice: 'Discounted Price',
      anniversaryTime: 'Anniversary Time',
    },
    headerIcon: 'wallet',
  },
};

const OVERVIEW_SAMPLE = {
  birthday: {
    enabled: true,
    businessName: 'DealBoxx',
    businessId: 'dealboxx',
    approvalOption: 'auto',
    alertDays: '2',
    sendingTime: '00:00',
    channel: 'sms',
    title: 'Exclusive summer flash sales',
    callToAction: 'buy-now',
    customCtaLabel: '',
    ctaLink: 'https://example.com/summer-sale',
    message:
      'Trust is built over time. Choose brands that are transparent, reliable, and committed to serving you better.',
    offerSetup: 'offer-setup',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    offerVisual: 'image',
    voucherCode: 'GHS8599',
    offerExpiryDate: '2026-06-25',
    price: 'GHS8599',
    discountedPrice: 'GHS8599',
    bannerName: 'summer-banner.jpg',
    bannerPreviewUrl: PLACEHOLDER_BANNER,
    attachmentName: 'offer-visual.jpg',
    attachmentPreviewUrl: PLACEHOLDER_BANNER,
    attachmentType: 'image',
  },
  welcome: {
    enabled: true,
    businessName: 'TxtConnect',
    businessId: 'txtconnect',
    approvalOption: 'auto',
    alertDays: '1',
    sendingTime: '10:00',
    channel: 'sms',
    title: 'Welcome aboard!',
    callToAction: 'claim-offer',
    customCtaLabel: '',
    ctaLink: 'https://example.com/welcome',
    message:
      'Welcome from all of us! Enjoy a special treat reserved just for you. Tap below to claim your offer.',
    offerSetup: 'offer-setup',
    description: 'A limited welcome discount curated as a thank-you for joining.',
    offerVisual: 'image',
    voucherCode: 'WELCOME15',
    offerExpiryDate: '2026-07-15',
    price: 'GHS100',
    discountedPrice: 'GHS85',
    bannerName: 'welcome-banner.jpg',
    bannerPreviewUrl: PLACEHOLDER_BANNER,
    attachmentName: 'welcome-offer.jpg',
    attachmentPreviewUrl: PLACEHOLDER_BANNER,
    attachmentType: 'image',
  },
  anniversary: {
    enabled: true,
    businessName: 'Venus Retail',
    businessId: 'venus-retail',
    approvalOption: 'business',
    alertDays: '3',
    sendingTime: '09:00',
    anniversaryTime: '5',
    channel: 'email',
    title: 'Happy anniversary!',
    callToAction: 'claim-offer',
    customCtaLabel: '',
    ctaLink: 'https://example.com/anniversary',
    message:
      'Happy anniversary from all of us! Thank you for another year. Enjoy a special treat reserved just for you.',
    offerSetup: 'offer-setup',
    description: 'A limited anniversary discount for another year together.',
    offerVisual: 'image',
    voucherCode: 'ANNIV20',
    offerExpiryDate: '2026-08-01',
    price: 'GHS120',
    discountedPrice: 'GHS96',
    bannerName: 'anniversary-banner.jpg',
    bannerPreviewUrl: PLACEHOLDER_BANNER,
    attachmentName: 'anniversary-offer.jpg',
    attachmentPreviewUrl: PLACEHOLDER_BANNER,
    attachmentType: 'image',
  },
  holidays: {
    enabled: true,
    businessName: 'Northstar Foods',
    businessId: 'northstar',
    approvalOption: 'auto',
    alertDays: '5',
    sendingTime: '08:00',
    channel: 'whatsapp',
    title: 'Happy holidays!',
    callToAction: 'shop-now',
    customCtaLabel: '',
    ctaLink: 'https://example.com/holidays',
    message:
      'Happy holidays from all of us! Enjoy a special festive treat reserved just for you.',
    offerSetup: 'offer-setup',
    description: 'A limited festive-season discount for holiday campaigns.',
    offerVisual: 'image',
    voucherCode: 'FESTIVE20',
    offerExpiryDate: '2026-12-31',
    price: 'GHS150',
    discountedPrice: 'GHS120',
    bannerName: 'holiday-banner.jpg',
    bannerPreviewUrl: PLACEHOLDER_BANNER,
    attachmentName: 'holiday-offer.jpg',
    attachmentPreviewUrl: PLACEHOLDER_BANNER,
    attachmentType: 'image',
  },
};

export function getOverviewCopy(kindId = 'birthday') {
  return OVERVIEW_COPY[kindId] ?? OVERVIEW_COPY.birthday;
}

export function getOverviewSettings(kindId = 'birthday') {
  return OVERVIEW_SAMPLE[kindId] ?? OVERVIEW_SAMPLE.birthday;
}

export function getOptionLabel(options, value, fallback = '—') {
  return options.find((option) => option.value === value)?.label || fallback;
}

export function getChannelLabel(channel) {
  return getOptionLabel(CHANNEL_OPTIONS, channel, 'SMS');
}

export function getOfferSetupLabel(offerSetup) {
  return getOptionLabel(OFFER_SETUP_OPTIONS, offerSetup, 'Offer set-up');
}

export function formatDisplayDate(isoDate) {
  if (!isoDate) return '—';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}-${month}-${year}`;
}
