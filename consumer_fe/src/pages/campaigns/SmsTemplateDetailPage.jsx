import { useNavigate, useParams } from 'react-router-dom';
import SmsTemplateDetailView from '../../components/campaigns-module/SmsTemplateDetailView';
import { CAMPAIGNS_BASE } from '../../components/campaigns-module/campaignsNavData';
import {
  getFeaturedTemplateForCategory,
  getLibraryTemplateById,
} from '../../components/campaigns-module/smsTemplateLibraryData';

export default function SmsTemplateDetailPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const template = getLibraryTemplateById(templateId);

  if (!template) {
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

  return (
    <SmsTemplateDetailView
      template={template}
      onBack={() => navigate(`${CAMPAIGNS_BASE}/create/templates`)}
      onUse={() =>
        navigate(
          `${CAMPAIGNS_BASE}/create/wizard?template=${template.id}&category=${template.categoryId}&source=library`,
        )
      }
    />
  );
}

/** Resolves Create Campaign dropdown category → featured template detail. */
export function CampaignCategoryEntryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const template = getFeaturedTemplateForCategory(categoryId);

  if (!template) {
    return (
      <main className="mx-auto max-w-8xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-[#0B1354]">No templates in this category</h1>
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

  return (
    <SmsTemplateDetailView
      template={template}
      onBack={() => navigate(`${CAMPAIGNS_BASE}/create/templates`)}
      onUse={() =>
        navigate(
          `${CAMPAIGNS_BASE}/create/wizard?template=${template.id}&category=${template.categoryId}&source=library`,
        )
      }
    />
  );
}
