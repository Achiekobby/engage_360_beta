import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  LayoutTemplate,
  Smartphone,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import LogoMark from '../brand/LogoMark';
import CampaignMobilePreview from './CampaignMobilePreview';
import { CAMPAIGNS_BASE } from './campaignsNavData';

const fieldClass =
  'w-full rounded-sm border border-[#E4E4E7] bg-white px-3 py-2.5 text-sm text-[#0B1354] outline-none';

export default function SmsTemplateDetailView({ template, onBack, onUse, embedded = false }) {
  return (
    <div
      className={clsx(
        embedded
          ? 'relative flex min-h-0 flex-1 flex-col overflow-hidden'
          : 'mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10',
      )}
    >
      {embedded ? (
        <EmbeddedTemplateDetail template={template} onBack={onBack} onUse={onUse} />
      ) : (
        <PageTemplateDetail template={template} onBack={onBack} onUse={onUse} />
      )}
    </div>
  );
}

function PreviewModeToggle({ mode, onChange }) {
  return (
    <div
      className="inline-flex rounded-full border border-[#E4E6EC] bg-white/90 p-1 shadow-[0_2px_10px_rgba(11,19,84,0.06)] backdrop-blur"
      role="tablist"
      aria-label="Preview mode"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'fields'}
        onClick={() => onChange('fields')}
        className={clsx(
          'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all',
          mode === 'fields'
            ? 'bg-primary text-white shadow-sm'
            : 'text-[#717171] hover:text-[#0B1354]',
        )}
      >
        <LayoutTemplate className="h-3.5 w-3.5" strokeWidth={2.25} />
        Fields
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'phone'}
        onClick={() => onChange('phone')}
        className={clsx(
          'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all',
          mode === 'phone'
            ? 'bg-primary text-white shadow-sm'
            : 'text-[#717171] hover:text-[#0B1354]',
        )}
      >
        <Smartphone className="h-3.5 w-3.5" strokeWidth={2.25} />
        Phone
      </button>
    </div>
  );
}

function FieldsPreview({ template }) {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-[#F3F0FF]/90 p-4 shadow-[0_8px_28px_rgba(11,19,84,0.08)] ring-1 ring-white/70 sm:p-5">
        <div>
          <label htmlFor="sms-preview" className="mb-1.5 block text-xs font-medium text-[#717171] sm:text-sm">
            SMS Message
          </label>
          <textarea
            id="sms-preview"
            readOnly
            rows={4}
            value={template.smsMessage}
            className={`${fieldClass} resize-none leading-relaxed`}
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
          <div>
            <label htmlFor="title-preview" className="mb-1.5 block text-xs font-medium text-[#717171] sm:text-sm">
              Title
            </label>
            <input
              id="title-preview"
              readOnly
              value={template.previewTitle}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="cta-preview" className="mb-1.5 block text-xs font-medium text-[#717171] sm:text-sm">
              Call to Action
            </label>
            <input
              id="cta-preview"
              readOnly
              value={template.callToAction}
              className={fieldClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmbeddedTemplateDetail({ template, onBack, onUse }) {
  const [previewMode, setPreviewMode] = useState('phone');
  const isPhone = previewMode === 'phone';

  return (
    <>
      <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-[#EEF0F4] px-5 py-3.5 sm:px-7 sm:py-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#717171] transition-colors hover:text-primary"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F0FF] text-primary ring-1 ring-primary/10 transition-colors hover:bg-[#EDE8F8]">
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          </span>
          <span className="hidden sm:inline">Back to library</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#F3F0FF] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
            {template.categoryLabel || 'SMS Template'}
          </span>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#717171] transition-colors hover:bg-[#F4F5F8] hover:text-[#0B1354]"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2.25} />
          </button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(17rem,0.95fr)]">
        <section className="flex min-h-0 flex-col justify-center overflow-y-auto px-5 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F4FC] px-2.5 py-1 text-[11px] font-semibold text-[#2E7DAD]">
              <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
              Popularity {template.popularity}
            </div>

            <h1
              id="template-detail-title"
              className="mt-3 text-3xl font-bold tracking-tight text-[#0B1354] sm:text-[2.15rem] sm:leading-tight"
            >
              {template.title}
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#717171] sm:text-[15px]">
              {template.description}
            </p>

            <button
              type="button"
              onClick={onUse}
              className="group mt-6 inline-flex w-full max-w-sm cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(58,16,205,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#320EB8] hover:shadow-[0_12px_28px_rgba(58,16,205,0.34)]"
            >
              Use Template
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2.5}
              />
            </button>

            <div className="mt-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[#0B1354]/55">
                Ideal for
              </h2>
              <ul className="mt-3 space-y-2.5">
                {template.idealFor.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#545454]">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8F8EF] text-[#1F9D55]">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7 space-y-3 border-t border-[#EEF0F4] pt-6">
              <aside className="flex gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3F0FF] text-primary">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={2.25} />
                </span>
                <p className="text-sm leading-relaxed text-[#545454]">{template.inspiration}</p>
              </aside>
              <aside className="flex gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8F4FC] text-[#2E7DAD]">
                  <BarChart3 className="h-3.5 w-3.5" strokeWidth={2.25} />
                </span>
                <p className="text-sm leading-relaxed text-[#545454]">{template.analyticsNote}</p>
              </aside>
            </div>

            <div className="mt-7 flex items-center gap-2.5">
              <span className="text-xs text-[#9AA0B0]">Powered by</span>
              <div className="flex items-center gap-2">
                <LogoMark size={36} variant="on-white" />
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary">
                  Engage 360
                </span>
              </div>
            </div>
          </div>
        </section>

        <section
          className={clsx(
            'relative flex min-h-[22rem] overflow-hidden border-t border-[#EEF0F4] px-5 py-5 sm:min-h-[26rem] sm:px-8 sm:py-6 lg:min-h-0 lg:border-l lg:border-t-0 lg:px-8 lg:py-7',
            isPhone ? 'flex-col items-center' : 'flex-col items-center justify-center',
          )}
          aria-label="SMS message preview"
          style={
            isPhone
              ? {
                  background:
                    'radial-gradient(ellipse 80% 70% at 50% 35%, rgba(58,16,205,0.12) 0%, transparent 55%), linear-gradient(165deg, #F7F5FF 0%, #EEF2FA 48%, #E8ECF6 100%)',
                }
              : {
                  background: 'linear-gradient(180deg, #FAFBFD 0%, #F5F3FF 100%)',
                }
          }
        >
          {isPhone ? (
            <>
              <div
                className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-8 -right-6 h-44 w-44 rounded-full bg-[#5B9FD4]/20 blur-3xl"
                aria-hidden="true"
              />
            </>
          ) : null}

          <div className="relative z-[1] mb-4 shrink-0">
            <PreviewModeToggle mode={previewMode} onChange={setPreviewMode} />
          </div>

          {isPhone ? (
            <div className="relative z-[1] flex min-h-0 w-full max-w-[17.5rem] flex-1 flex-col items-center">
              <div className="min-h-0 w-full flex-1">
                <CampaignMobilePreview
                  channel="sms"
                  headline={template.previewTitle}
                  body={template.smsMessage}
                  cta={template.callToAction}
                  compact
                  fillHeight
                />
              </div>
            </div>
          ) : (
            <div className="relative z-[1] flex w-full flex-1 items-center justify-center">
              <FieldsPreview template={template} />
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function PageTemplateDetail({ template, onBack, onUse }) {
  const [previewMode, setPreviewMode] = useState('phone');
  const isPhone = previewMode === 'phone';

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex shrink-0 cursor-pointer items-center gap-2 text-sm font-medium text-[#717171] transition-colors hover:text-primary"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EDE8F8] text-primary">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
        </span>
        Back
      </button>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-14 xl:gap-16">
        <section className="min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F4FC] px-2.5 py-1 text-[11px] font-semibold text-[#2E7DAD]">
            <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
            Popularity {template.popularity}
          </div>
          <h1
            id="template-detail-title"
            className="mt-3 text-3xl font-bold tracking-tight text-[#0B1354] sm:text-4xl"
          >
            {template.title}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#717171]">{template.description}</p>

          <button
            type="button"
            onClick={onUse}
            className="group mt-8 inline-flex w-full max-w-sm cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(58,16,205,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#320EB8] sm:text-base"
          >
            Use Template
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
          </button>

          <div className="mt-10">
            <h2 className="text-sm font-bold text-[#0B1354] sm:text-base">This template is ideal for</h2>
            <ul className="mt-4 space-y-2.5">
              {template.idealFor.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#545454]">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8F8EF] text-[#1F9D55]">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 space-y-3 text-sm leading-relaxed text-[#0B1354] sm:text-base">
            <p>{template.inspiration}</p>
            <p>{template.analyticsNote}</p>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <span className="text-sm text-[#717171]">Powered by</span>
            <div className="flex items-center gap-2">
              <LogoMark size={36} variant="on-white" />
              <span className="text-xs font-bold uppercase tracking-wide text-primary">Engage 360</span>
            </div>
          </div>
        </section>

        <section className="flex min-w-0 flex-col items-center gap-4 lg:pt-2" aria-label="SMS message preview">
          <PreviewModeToggle mode={previewMode} onChange={setPreviewMode} />
          {isPhone ? (
            <CampaignMobilePreview
              channel="sms"
              headline={template.previewTitle}
              body={template.smsMessage}
              cta={template.callToAction}
            />
          ) : (
            <FieldsPreview template={template} />
          )}
        </section>
      </div>
    </>
  );
}

export function useTemplateDetailNavigation() {
  const navigate = useNavigate();

  return {
    goToDetail: (templateId) => navigate(`${CAMPAIGNS_BASE}/library/${templateId}`),
    goToWizard: (template) =>
      navigate(
        `${CAMPAIGNS_BASE}/create/wizard?template=${template.id}&category=${template.categoryId}&source=library`,
      ),
  };
}
