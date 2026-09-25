import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Eye, Mail, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { Reveal, StaggerItem, StaggerReveal } from '../../components/motion';
import TemplatePreviewDrawer from '../../components/campaigns-module/TemplatePreviewDrawer';
import CampaignsPagination from '../../components/campaigns-module/CampaignsPagination';
import { TemplateMiniPreview, SmsTemplateMiniPreview } from '../../components/campaigns-module/CampaignMobilePreview';
import {
  CAMPAIGN_TEMPLATES,
  CAMPAIGNS_BASE,
} from '../../components/campaigns-module/campaignsData';
import {
  getCategoryMeta,
  isValidCampaignCategory,
} from '../../components/campaigns-module/campaignCategoryMeta';
import { getTemplatesByCategory } from '../../components/campaigns-module/smsTemplateLibraryData';

const TABS = [
  { id: 'sms', label: 'SMS Templates', icon: MessageSquare },
  { id: 'email', label: 'Email Templates', icon: Mail },
];

const PAGE_SIZE = 6;

export default function ChooseCampaignTemplatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const fromHome = searchParams.get('from') === 'home';
  const [activeTab, setActiveTab] = useState('sms');
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState(null);

  const categoryValid = Boolean(categoryId && isValidCampaignCategory(categoryId));
  const category = categoryValid ? getCategoryMeta(categoryId) : null;

  const smsTemplates = useMemo(
    () => (categoryValid ? getTemplatesByCategory(categoryId) : []),
    [categoryId, categoryValid],
  );

  // Shared email templates (no categoryId) show everywhere; category-specific
  // ones (e.g. Lead Generation) only appear for their matching category.
  const emailTemplates = useMemo(
    () =>
      CAMPAIGN_TEMPLATES.filter(
        (template) => !template.categoryId || template.categoryId === categoryId,
      ),
    [categoryId],
  );
  const list = activeTab === 'email' ? emailTemplates : smsTemplates;

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const pagedList = useMemo(
    () => list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [list, page],
  );

  if (!categoryValid || !category) {
    return <Navigate to={`${CAMPAIGNS_BASE}/create`} replace />;
  }

  const CategoryIcon = category.icon;
  const fromQuery = fromHome ? '&from=home' : '';
  const backToMethod = `${CAMPAIGNS_BASE}/create/method?category=${categoryId}${fromHome ? '&from=home' : ''}`;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPage(1);
  };

  const handleUseTemplate = (channel, template) => {
    setPreview(null);
    if (channel === 'sms') {
      navigate(
        `${CAMPAIGNS_BASE}/create/wizard?template=${template.id}&category=${categoryId}&source=library&channel=sms${fromQuery}`,
      );
      return;
    }
    navigate(
      `${CAMPAIGNS_BASE}/create/wizard?template=${template.id}&category=${categoryId}&channel=email${fromQuery}`,
    );
  };

  const handleUse = () => {
    if (!preview) return;
    handleUseTemplate(preview.channel, preview.template);
  };

  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Reveal variant="fadeUp" amount={0.15}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-10">
          <div className="min-w-0 max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                {fromHome ? '2' : '3'}
              </span>
              From a template
            </p>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#0B1354] sm:text-3xl">
              Choose a template
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm text-[#717171]">Showing templates for</span>
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-[#F3F0FF] px-2.5 py-1 text-sm font-semibold text-primary ring-1 ring-primary/15">
                <CategoryIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                {category.label}
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-[#717171] sm:text-base">
              SMS templates are filtered for {category.label.toLowerCase()}. Preview a design, then
              continue into campaign setup.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:items-end lg:pt-1">
            <Link
              to={backToMethod}
              className="inline-flex items-center gap-2 self-end text-sm font-medium text-[#717171] transition-colors hover:text-primary"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EDE8F8] text-primary">
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              Back to create options
            </Link>

            <div
              className="relative inline-flex w-full rounded-full border border-[#E4E4E7] bg-[#FAFBFC] p-1 sm:w-auto"
              role="tablist"
              aria-label="Template channel"
            >
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleTabChange(id)}
                    className={clsx(
                      'relative inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:flex-none sm:px-5',
                      active ? 'text-white' : 'text-[#717171] hover:text-[#0B1354]',
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="template-channel-pill"
                        className="absolute inset-0 rounded-full bg-primary shadow-[0_4px_14px_rgba(58,16,205,0.3)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <Icon className="relative h-4 w-4" strokeWidth={2} />
                    <span className="relative">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTab}-${categoryId}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="mt-8"
        >
          <div className="mb-4 flex items-end justify-between gap-3">
            <p className="text-sm text-[#717171]">
              <span className="font-semibold text-[#0B1354]">{list.length}</span>{' '}
              {activeTab === 'email' ? 'email' : 'SMS'} template
              {list.length === 1 ? '' : 's'}
              {activeTab === 'sms' ? ` for ${category.label.toLowerCase()}` : ''}
            </p>
          </div>

          {list.length === 0 ? (
            <div className="border border-dashed border-[#E4E4E7] bg-white px-6 py-16 text-center">
              <h2 className="text-lg font-bold text-[#0B1354]">
                No {activeTab === 'email' ? 'email' : 'SMS'} templates in this category yet
              </h2>
              <p className="mt-2 text-sm text-[#717171]">
                Try the {activeTab === 'email' ? 'SMS' : 'email'} tab, or go back and start this
                campaign from scratch.
              </p>
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `${CAMPAIGNS_BASE}/create/wizard?category=${categoryId}${fromQuery}`,
                  )
                }
                className="mt-5 cursor-pointer text-sm font-semibold text-primary"
              >
                Start from scratch instead
              </button>
            </div>
          ) : (
            <>
              <StaggerReveal
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                stagger={0.05}
              >
                {activeTab === 'email'
                  ? pagedList.map((template) => (
                      <StaggerItem key={template.id}>
                        <TemplateGridCard
                          eyebrow={template.category}
                          title={template.name}
                          description={template.body}
                          media={<TemplateMiniPreview template={template} />}
                          onPreview={() =>
                            setPreview({
                              channel: 'email',
                              template,
                              title: template.name,
                              subtitle: `${category.label} · Email`,
                              headline: template.headline,
                              body: template.body,
                              cta: template.cta,
                              accent: template.accent,
                              products: template.products,
                            })
                          }
                          onUse={() => handleUseTemplate('email', template)}
                        />
                      </StaggerItem>
                    ))
                  : pagedList.map((template) => (
                      <StaggerItem key={template.id}>
                        <TemplateGridCard
                          eyebrow={template.categoryLabel}
                          title={template.title}
                          description={template.description}
                          media={
                            <SmsTemplateMiniPreview
                              headline={template.previewTitle}
                              body={template.smsMessage}
                              cta={template.callToAction}
                            />
                          }
                          onPreview={() =>
                            setPreview({
                              channel: 'sms',
                              template,
                              title: template.title,
                              subtitle: `${template.categoryLabel} · SMS`,
                              headline: template.previewTitle,
                              body: template.smsMessage,
                              cta: template.callToAction,
                            })
                          }
                          onUse={() => handleUseTemplate('sms', template)}
                        />
                      </StaggerItem>
                    ))}
              </StaggerReveal>

              <CampaignsPagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={list.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <TemplatePreviewDrawer
        isOpen={Boolean(preview)}
        onClose={() => setPreview(null)}
        onUse={handleUse}
        channel={preview?.channel || 'sms'}
        title={preview?.title}
        subtitle={preview?.subtitle}
        headline={preview?.headline}
        body={preview?.body}
        cta={preview?.cta}
        accent={preview?.accent}
        products={preview?.products}
      />
    </main>
  );
}

function TemplateGridCard({ eyebrow, title, description, media, onPreview, onUse }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_16px_36px_rgba(58,16,205,0.1)]">
      <div className="p-3 sm:p-4">
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-[#F0F2F7]">
          <div className="h-full w-full overflow-hidden rounded-sm transition-transform duration-500 group-hover:scale-[1.02]">
            {media}
          </div>
          <button
            type="button"
            onClick={onPreview}
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-sm bg-[#0B1354]/0 opacity-0 transition-all duration-300 group-hover:bg-[#0B1354]/45 group-hover:opacity-100"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-[#0B1354] shadow-lg">
              <Eye className="h-3.5 w-3.5" strokeWidth={2} />
              Preview
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
        <h3 className="mt-1.5 text-base font-bold leading-snug text-[#0B1354]">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[#717171] line-clamp-2">
          {description}
        </p>

        <button
          type="button"
          onClick={onUse}
          className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-[#F3F0FF] px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Use this template
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </article>
  );
}
