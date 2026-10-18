import { CAMPAIGN_CATEGORIES } from './campaignsNavData';
import { SMS_TEMPLATE_LIBRARY } from './smsTemplateLibraryData';

function toWhatsAppTemplate(template) {
  return {
    id: `wa-${template.id}`,
    categoryId: template.categoryId,
    categoryLabel: template.categoryLabel,
    title: template.title,
    popularity: template.popularity,
    description: template.description,
    previewTitle: template.previewTitle,
    whatsappMessage: template.smsMessage,
    callToAction: template.callToAction || 'Learn More',
    idealFor: template.idealFor,
    inspiration: template.inspiration,
    analyticsNote: template.analyticsNote,
    image: template.image,
    featured: Boolean(template.featured),
    leadQuestions: template.leadQuestions || [],
    footerNote: 'Reply STOP to opt out · Powered by Engage 360',
  };
}

/** WhatsApp business templates for the create-from-template gallery. */
export const WHATSAPP_TEMPLATE_LIBRARY = SMS_TEMPLATE_LIBRARY.map(toWhatsAppTemplate);

export function getWhatsAppLibraryTemplateById(id) {
  return WHATSAPP_TEMPLATE_LIBRARY.find((item) => item.id === id) || null;
}

export function getWhatsAppTemplatesByCategory(categoryId) {
  return WHATSAPP_TEMPLATE_LIBRARY.filter((item) => item.categoryId === categoryId);
}

export function getFeaturedWhatsAppTemplateForCategory(categoryId) {
  const inCategory = getWhatsAppTemplatesByCategory(categoryId);
  return inCategory.find((item) => item.featured) || inCategory[0] || null;
}

export function getWhatsAppCategoryCounts() {
  return CAMPAIGN_CATEGORIES.reduce((acc, category) => {
    acc[category.id] = WHATSAPP_TEMPLATE_LIBRARY.filter(
      (item) => item.categoryId === category.id,
    ).length;
    return acc;
  }, {});
}
