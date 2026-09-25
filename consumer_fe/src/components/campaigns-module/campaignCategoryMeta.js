import {
  Bell,
  CalendarDays,
  Headphones,
  Heart,
  Layers,
  Megaphone,
  Package,
  RefreshCw,
  Repeat,
  Sparkles,
  Tag,
  TrendingUp,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { CAMPAIGN_CATEGORIES } from './campaignsNavData';

export const CATEGORY_ICONS = {
  promotions: Tag,
  advertisement: Megaphone,
  'lead-generation': UserPlus,
  'customer-engagement': Sparkles,
  'customer-supports': Headphones,
  'service-alerts': Bell,
  'events-activation': CalendarDays,
  'sales-conversion': TrendingUp,
  'upsell-cross-sell': Layers,
  subscriptions: Repeat,
  'customer-onboarding': UserCheck,
  'customer-retention': Heart,
  're-engagement': RefreshCw,
  'product-signups': Package,
};

export function getCategoryMeta(categoryId) {
  const category = CAMPAIGN_CATEGORIES.find((item) => item.id === categoryId);
  if (!category) return null;

  return {
    ...category,
    icon: CATEGORY_ICONS[category.id] || Tag,
  };
}

export function isValidCampaignCategory(categoryId) {
  return CAMPAIGN_CATEGORIES.some((item) => item.id === categoryId);
}
