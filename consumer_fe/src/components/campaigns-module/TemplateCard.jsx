import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { CAMPAIGNS_BASE } from './campaignsData';
import CampaignMobilePreview, { TemplateMiniPreview } from './CampaignMobilePreview';

export default function TemplateCard({ template, onUse, onPreview }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_20px_rgba(11,19,84,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_40px_rgba(58,16,205,0.12)]">
      <div className="relative min-h-[11rem] overflow-hidden">
        <TemplateMiniPreview template={template} />
        <div className="absolute inset-0 flex items-center justify-center bg-[#0B1354]/0 opacity-0 transition-all duration-300 group-hover:bg-[#0B1354]/45 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onPreview?.(template)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm bg-white px-3 py-2 text-xs font-semibold text-[#0B1354] shadow-lg"
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={2} />
            Preview
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
              {template.category}
            </p>
            <h3 className="mt-1 text-base font-bold text-[#0B1354] sm:text-lg">{template.name}</h3>
          </div>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[#717171]">{template.body}</p>

        <button
          type="button"
          onClick={() => onUse(template)}
          className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.25)] transition-all hover:bg-[#320EB8]"
        >
          Use Template
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </article>
  );
}

export function TemplatePreviewModal({ template, isOpen, onClose, onUse }) {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#0B1354]/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close preview"
      />
      <div className="relative grid w-full max-w-3xl gap-6 overflow-hidden rounded-sm border border-[#EEF0F4] bg-white p-6 shadow-[0_24px_64px_rgba(11,19,84,0.2)] sm:grid-cols-[1fr_17rem] sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {template.category} template
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#0B1354]">{template.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#717171]">{template.body}</p>

          <div className="mt-6 space-y-3 rounded-sm border border-[#EEF0F4] bg-[#FAFBFC] p-4">
            <div>
              <p className="text-xs font-medium text-[#717171]">Headline</p>
              <p className="mt-1 text-sm font-semibold text-[#0B1354]">{template.headline}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-[#717171]">Call to action</p>
              <p className="mt-1 text-sm font-semibold text-[#0B1354]">{template.cta}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onUse(template)}
              className="cursor-pointer rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-[#320EB8]"
            >
              Use This Template
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-sm border border-[#E4E4E7] px-4 py-3 text-sm font-semibold text-[#717171] hover:bg-[#FAFBFC]"
            >
              Close
            </button>
          </div>
        </div>

        <CampaignMobilePreview
          templateMode
          channel="email"
          headline={template.headline}
          body={template.body}
          cta={template.cta}
          accent={template.accent}
          products={template.products}
        />
      </div>
    </div>
  );
}

export function TemplatesPageHeader() {
  return (
    <div className="relative overflow-hidden rounded-sm border border-[#EEF0F4] bg-white px-5 py-5 shadow-[0_4px_20px_rgba(11,19,84,0.04)] sm:px-6 sm:py-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[#6B4FE0] to-[#5B9FD4]"
        aria-hidden="true"
      />
      <div className="flex items-start gap-3">
        <Link
          to={CAMPAIGNS_BASE}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[#EEF0F4] text-[#717171] transition-colors hover:border-primary/20 hover:bg-[#F7F8FF] hover:text-primary"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            From a template
          </p>
          <h1 className="mt-1 text-xl font-bold text-[#0B1354] sm:text-2xl">Select a Template</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#717171]">
            Preview each design on a mobile canvas, then customize content in the setup steps.
          </p>
        </div>
      </div>
    </div>
  );
}
