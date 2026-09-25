import { Building2, ImagePlus, LockKeyhole } from 'lucide-react';

export const SIGNUP_STEP_META = [
  {
    id: 'company',
    label: 'Company Details',
    icon: Building2,
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    title: 'Connect More. Engage Smarter. Grow Faster.',
    description:
      'Create your Engage360 account and unlock a unified platform for Campaign (SMS, WhatsApp, Email), Customer Engagement, Survey and more all from one dashboard.',
  },
  {
    id: 'additional',
    label: 'Additional Details',
    icon: ImagePlus,
    image:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80',
    title: 'Every Conversation Counts.',
    description:
      'Reach the right audience, automate meaningful interactions, and build lasting customer relationships with Engage360. Sign up today and start engaging with confidence.',
  },
  {
    id: 'password',
    label: 'Password Setup',
    icon: LockKeyhole,
    image:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
    title: 'One Platform. Endless Engagement.',
    description:
      'Transform the way you connect with customers using powerful campaigns, surveys, and automation designed to help your business grow.',
  },
];

export const VERIFY_OTP_PANEL = {
  id: 'verify',
  image:
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  title: 'Almost There!',
  description:
    'Verify your account to complete registration and unlock your Engage360 dashboard.',
};

export const SOCIAL_PLATFORMS = [
  'Facebook',
  'Instagram',
  'LinkedIn',
  'Twitter / X',
  'TikTok',
  'YouTube',
];

export const SIGNUP_INITIAL_VALUES = {
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
