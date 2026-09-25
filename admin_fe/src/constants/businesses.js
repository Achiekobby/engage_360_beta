import { Building2, ImagePlus, KeyRound } from 'lucide-react';

export const ONBOARDING_STEPS = [
  {
    id: 'company',
    label: 'Company',
    description: 'Details',
    icon: Building2,
  },
  {
    id: 'profile',
    label: 'Profile',
    description: 'Logo and links',
    icon: ImagePlus,
  },
  {
    id: 'access',
    label: 'Access',
    description: 'Password',
    icon: KeyRound,
  },
];

export const SOCIAL_PLATFORMS = [
  'Facebook',
  'Instagram',
  'LinkedIn',
  'Twitter / X',
  'TikTok',
  'YouTube',
];

export const ONBOARDING_INITIAL_VALUES = {
  companyName: '',
  companyPhone: '',
  companyEmail: '',
  contactPersonName: '',
  contactPhone: '',
  contactEmail: '',
  companyLogo: null,
  socialLinks: [{ platform: '', url: '' }],
  password: '',
  confirmPassword: '',
};

export const SEED_BUSINESSES = [
  {
    id: 'biz-oneflow',
    companyName: 'OneFlow',
    companyEmail: 'hello@oneflow.com',
    companyPhone: '+233302555010',
    contactPersonName: 'Ama Mensah',
    contactPhone: '+233244100220',
    contactEmail: 'ama@oneflow.com',
    logoDataUrl: null,
    socialLinks: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/oneflow' },
      { platform: 'Twitter / X', url: 'https://x.com/oneflow' },
      { platform: 'Instagram', url: 'https://instagram.com/oneflow' },
    ],
    status: 'active',
    onboardedAt: '2026-08-12T09:30:00.000Z',
    credentialsSet: true,
  },
  {
    id: 'biz-petcom',
    companyName: 'Petcom',
    companyEmail: 'care@petcom.com',
    companyPhone: '+233302441200',
    contactPersonName: 'Kwame Boateng',
    contactPhone: '+233201884433',
    contactEmail: 'kwame@petcom.com',
    logoDataUrl: null,
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/petcom' },
      { platform: 'Facebook', url: 'https://facebook.com/petcom' },
      { platform: 'TikTok', url: 'https://tiktok.com/@petcom' },
    ],
    status: 'active',
    onboardedAt: '2026-07-03T14:15:00.000Z',
    credentialsSet: true,
  },
  {
    id: 'biz-harbor',
    companyName: 'Harbor & Co',
    companyEmail: 'studio@harborandco.com',
    companyPhone: '+233302778901',
    contactPersonName: 'Efua Darko',
    contactPhone: '+233550221198',
    contactEmail: 'efua@harborandco.com',
    logoDataUrl: null,
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/harborandco' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/harborandco' },
      { platform: 'YouTube', url: 'https://youtube.com/@harborandco' },
    ],
    status: 'active',
    onboardedAt: '2026-05-19T11:00:00.000Z',
    credentialsSet: true,
  },
  {
    id: 'biz-kente',
    companyName: 'Kente & Co',
    companyEmail: 'hello@kenteandco.com',
    companyPhone: '+233302610440',
    contactPersonName: 'Akosua Frimpong',
    contactPhone: '+233244880112',
    contactEmail: 'akosua@kenteandco.com',
    logoDataUrl: null,
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/kenteandco' },
      { platform: 'Facebook', url: 'https://facebook.com/kenteandco' },
      { platform: 'TikTok', url: 'https://tiktok.com/@kenteandco' },
    ],
    status: 'active',
    onboardedAt: '2026-04-02T10:00:00.000Z',
    credentialsSet: true,
  },
  {
    id: 'biz-accra-fresh',
    companyName: 'Accra Fresh',
    companyEmail: 'orders@accrafresh.com',
    companyPhone: '+233302220118',
    contactPersonName: 'Yaw Owusu',
    contactPhone: '+233201445590',
    contactEmail: 'yaw@accrafresh.com',
    logoDataUrl: null,
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/accrafresh' },
      { platform: 'Facebook', url: 'https://facebook.com/accrafresh' },
      { platform: 'TikTok', url: 'https://tiktok.com/@accrafresh' },
    ],
    status: 'active',
    onboardedAt: '2026-03-18T08:40:00.000Z',
    credentialsSet: true,
  },
  {
    id: 'biz-bluepeak',
    companyName: 'BluePeak Logistics',
    companyEmail: 'desk@bluepeak.com',
    companyPhone: '+233302900221',
    contactPersonName: 'Nana Adjei',
    contactPhone: '+233550334221',
    contactEmail: 'nana@bluepeak.com',
    logoDataUrl: null,
    socialLinks: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/bluepeak' },
      { platform: 'Twitter / X', url: 'https://x.com/bluepeak' },
    ],
    status: 'active',
    onboardedAt: '2026-02-11T13:20:00.000Z',
    credentialsSet: true,
  },
  {
    id: 'biz-sahel',
    companyName: 'Sahel Media',
    companyEmail: 'studio@sahelmedia.com',
    companyPhone: '+233302118900',
    contactPersonName: 'Aisha Bello',
    contactPhone: '+233244667100',
    contactEmail: 'aisha@sahelmedia.com',
    logoDataUrl: null,
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/sahelmedia' },
      { platform: 'YouTube', url: 'https://youtube.com/@sahelmedia' },
      { platform: 'Twitter / X', url: 'https://x.com/sahelmedia' },
      { platform: 'TikTok', url: 'https://tiktok.com/@sahelmedia' },
    ],
    status: 'active',
    onboardedAt: '2026-01-27T09:10:00.000Z',
    credentialsSet: true,
  },
  {
    id: 'biz-nunya',
    companyName: 'Nunya Health',
    companyEmail: 'care@nunyahealth.com',
    companyPhone: '+233302445670',
    contactPersonName: 'Kojo Asare',
    contactPhone: '+233201998221',
    contactEmail: 'kojo@nunyahealth.com',
    logoDataUrl: null,
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com/nunyahealth' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/nunyahealth' },
      { platform: 'Instagram', url: 'https://instagram.com/nunyahealth' },
    ],
    status: 'active',
    onboardedAt: '2025-12-09T15:00:00.000Z',
    credentialsSet: true,
  },
  {
    id: 'biz-goldline',
    companyName: 'Goldline Retail',
    companyEmail: 'shops@goldline.com',
    companyPhone: '+233302776210',
    contactPersonName: 'Esi Quaye',
    contactPhone: '+233244221009',
    contactEmail: 'esi@goldline.com',
    logoDataUrl: null,
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/goldline' },
      { platform: 'Facebook', url: 'https://facebook.com/goldline' },
      { platform: 'TikTok', url: 'https://tiktok.com/@goldline' },
    ],
    status: 'active',
    onboardedAt: '2025-11-04T11:45:00.000Z',
    credentialsSet: true,
  },
  {
    id: 'biz-volta',
    companyName: 'Volta Studio',
    companyEmail: 'hello@voltastudio.com',
    companyPhone: '+233302330145',
    contactPersonName: 'Selorm Agbeko',
    contactPhone: '+233550112478',
    contactEmail: 'selorm@voltastudio.com',
    logoDataUrl: null,
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/voltastudio' },
      { platform: 'YouTube', url: 'https://youtube.com/@voltastudio' },
      { platform: 'TikTok', url: 'https://tiktok.com/@voltastudio' },
    ],
    status: 'active',
    onboardedAt: '2025-10-16T10:05:00.000Z',
    credentialsSet: true,
  },
  {
    id: 'biz-palm',
    companyName: 'Palm Court',
    companyEmail: 'stay@palmcourt.com',
    companyPhone: '+233302880334',
    contactPersonName: 'Adwoa Serwaa',
    contactPhone: '+233201334890',
    contactEmail: 'adwoa@palmcourt.com',
    logoDataUrl: null,
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/palmcourt' },
      { platform: 'Facebook', url: 'https://facebook.com/palmcourt' },
    ],
    status: 'active',
    onboardedAt: '2025-09-22T12:30:00.000Z',
    credentialsSet: true,
  },
  {
    id: 'biz-ridge',
    companyName: 'Ridge Legal',
    companyEmail: 'office@ridgelegal.com',
    companyPhone: '+233302101256',
    contactPersonName: 'Kofi Mensah',
    contactPhone: '+233244909331',
    contactEmail: 'kofi@ridgelegal.com',
    logoDataUrl: null,
    socialLinks: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/ridgelegal' },
      { platform: 'Twitter / X', url: 'https://x.com/ridgelegal' },
    ],
    status: 'active',
    onboardedAt: '2025-08-08T09:00:00.000Z',
    credentialsSet: true,
  },
];

export const BUSINESS_PAGE_SIZE = 5;

export function formatOnboardedDate(iso) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export function businessInitials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
