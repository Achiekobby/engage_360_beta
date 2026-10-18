import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CreateCampaignWizard from '../../components/campaigns-module/CreateCampaignWizard';
import CampaignSuccessModal from '../../components/campaigns-module/CampaignSuccessModal';
import {
  CAMPAIGN_CREATED_SUCCESS,
  CAMPAIGNS_BASE,
  getTemplateById,
} from '../../components/campaigns-module/campaignsData';
import { getCategoryLabel } from '../../components/campaigns-module/smsTemplateLibraryData';
import { SMS_TEMPLATE_LIBRARY } from '../../components/campaigns-module/smsTemplateLibraryData';
import { getWhatsAppLibraryTemplateById } from '../../components/campaigns-module/whatsappTemplateLibraryData';

export default function CreateCampaignPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const categoryId = searchParams.get('category');
  const source = searchParams.get('source');
  const channelParam = searchParams.get('channel');
  const [successOpen, setSuccessOpen] = useState(false);
  const [createdCampaign, setCreatedCampaign] = useState(null);

  const designTemplate = useMemo(() => getTemplateById(templateId), [templateId]);
  const smsLibraryTemplate = useMemo(
    () => SMS_TEMPLATE_LIBRARY.find((item) => item.id === templateId) || null,
    [templateId],
  );
  const whatsappLibraryTemplate = useMemo(
    () => getWhatsAppLibraryTemplateById(templateId),
    [templateId],
  );

  const seedTemplate = useMemo(() => {
    if (designTemplate) {
      return {
        ...designTemplate,
        channel: channelParam || designTemplate.channel || 'email',
      };
    }

    if (whatsappLibraryTemplate || channelParam === 'whatsapp') {
      const libraryTemplate = whatsappLibraryTemplate;
      if (!libraryTemplate) return null;

      return {
        id: libraryTemplate.id,
        name: libraryTemplate.title,
        category: libraryTemplate.categoryLabel,
        headline: libraryTemplate.previewTitle || libraryTemplate.title,
        body: libraryTemplate.whatsappMessage,
        cta: libraryTemplate.callToAction || 'Learn More',
        channel: 'whatsapp',
        image: libraryTemplate.image,
        accent: 'from-[#075E54] to-[#128C7E]',
        products: [
          { label: 'Offer', price: 'Special' },
          { label: 'Deal', price: 'Limited' },
          { label: 'New', price: 'Just In' },
          { label: 'Hot', price: 'Popular' },
        ],
        leadQuestions: libraryTemplate.leadQuestions || [],
      };
    }

    if (!smsLibraryTemplate) return null;

    return {
      id: smsLibraryTemplate.id,
      name: smsLibraryTemplate.title,
      category: smsLibraryTemplate.categoryLabel,
      headline: smsLibraryTemplate.previewTitle || smsLibraryTemplate.title,
      body: smsLibraryTemplate.smsMessage || smsLibraryTemplate.description,
      cta: smsLibraryTemplate.callToAction || 'Learn More',
      channel: channelParam || 'sms',
      accent: 'from-primary to-[#6B4FE0]',
      products: [
        { label: 'Offer', price: 'Special' },
        { label: 'Deal', price: 'Limited' },
        { label: 'New', price: 'Just In' },
        { label: 'Hot', price: 'Popular' },
      ],
      leadQuestions: smsLibraryTemplate.leadQuestions || [],
    };
  }, [designTemplate, smsLibraryTemplate, whatsappLibraryTemplate, channelParam]);

  const route = seedTemplate || source === 'library' ? 'template' : 'direct';

  if (templateId && !seedTemplate) {
    return (
      <main className="mx-auto max-w-8xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1354]">Template not found</h1>
        <button
          type="button"
          onClick={() => navigate(`${CAMPAIGNS_BASE}/create/templates`)}
          className="mt-4 cursor-pointer text-sm font-semibold text-primary"
        >
          Back to templates
        </button>
      </main>
    );
  }

  const goToAnalytics = () => {
    setSuccessOpen(false);
    if (createdCampaign?.id) {
      navigate(`${CAMPAIGNS_BASE}/${createdCampaign.id}`, {
        state: { newCampaign: createdCampaign },
      });
      return;
    }

    navigate(`${CAMPAIGNS_BASE}/reports`);
  };

  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <CreateCampaignWizard
        route={route}
        templateId={seedTemplate?.id || null}
        seedTemplate={seedTemplate}
        categoryId={categoryId}
        categoryLabel={categoryId ? getCategoryLabel(categoryId) : null}
        onComplete={(campaign) => {
          setCreatedCampaign(campaign);
          setSuccessOpen(true);
        }}
      />

      <CampaignSuccessModal
        isOpen={successOpen}
        onClose={goToAnalytics}
        {...CAMPAIGN_CREATED_SUCCESS}
        onAction={goToAnalytics}
        variant="launch"
      />
    </main>
  );
}
