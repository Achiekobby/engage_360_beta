import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Eye, ListChecks, X } from 'lucide-react';
import { clsx } from 'clsx';
import CampaignMobilePreview from './CampaignMobilePreview';
import EmailPreviewCanvas from './EmailPreviewCanvas';

const fieldClass =
  'w-full rounded-sm border border-[#E4E4E7] bg-white px-3 py-2.5 text-sm text-[#0B1354] outline-none';

function DetailsFields({ channel, headline, body, cta }) {
  return (
    <div
      className={clsx(
        'mx-auto w-full rounded-2xl bg-[#F3F0FF]/80 p-5 shadow-[0_8px_28px_rgba(11,19,84,0.06)] ring-1 ring-white/70 sm:p-6',
        channel === 'email' ? 'max-w-xl' : 'max-w-sm',
      )}
    >
      <div>
        <label className="mb-1.5 block text-xs font-medium text-[#717171]">
          {channel === 'email' ? 'Subject line' : 'Message'}
        </label>
        {channel === 'email' ? (
          <input readOnly value={headline || ''} className={fieldClass} />
        ) : (
          <textarea readOnly rows={4} value={body || ''} className={`${fieldClass} resize-none leading-relaxed`} />
        )}
      </div>

      {channel === 'email' ? (
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-[#717171]">Body</label>
          <textarea readOnly rows={5} value={body || ''} className={`${fieldClass} resize-none leading-relaxed`} />
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {channel !== 'email' ? (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#717171]">Title</label>
            <input readOnly value={headline || ''} className={fieldClass} />
          </div>
        ) : null}
        <div className={channel === 'email' ? 'sm:col-span-2' : ''}>
          <label className="mb-1.5 block text-xs font-medium text-[#717171]">Call to action</label>
          <input readOnly value={cta || ''} className={fieldClass} />
        </div>
      </div>
    </div>
  );
}

function ModeToggle({ mode, onChange }) {
  const options = [
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'details', label: 'Details', icon: ListChecks },
  ];

  return (
    <div
      className="inline-flex rounded-full border border-[#E4E6EC] bg-white p-1"
      role="tablist"
      aria-label="Preview mode"
    >
      {options.map(({ id, label, icon: Icon }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={clsx(
              'relative inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-colors',
              active ? 'text-white' : 'text-[#717171] hover:text-[#0B1354]',
            )}
          >
            {active ? (
              <motion.span
                layoutId="preview-mode-pill"
                className="absolute inset-0 rounded-full bg-primary shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            ) : null}
            <Icon className="relative h-3.5 w-3.5" strokeWidth={2.25} />
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function TemplatePreviewDrawer({
  isOpen,
  onClose,
  onUse,
  channel,
  title,
  subtitle,
  headline,
  body,
  cta,
  accent,
  products,
}) {
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState('preview');
  const isEmail = channel === 'email';

  useEffect(() => {
    if (isOpen) setMode('preview');
  }, [isOpen, title]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[300]">
          <motion.button
            type="button"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[#0B1354]/40 backdrop-blur-[2px]"
            onClick={onClose}
            aria-label="Close preview"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="template-preview-title"
            initial={reduceMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className={clsx(
              'absolute right-0 top-0 flex h-full w-full flex-col border-l border-[#EEF0F4] bg-white shadow-[-12px_0_48px_rgba(11,19,84,0.12)]',
              isEmail
                ? 'max-w-[26rem] sm:max-w-[32rem] lg:max-w-[36rem]'
                : 'max-w-[24rem] sm:max-w-[28rem] lg:max-w-[30rem]',
            )}
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#F0F2F7] px-5 py-4 sm:px-6">
              <div className="min-w-0">
                {subtitle ? (
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                    {subtitle}
                  </p>
                ) : null}
                <h2
                  id="template-preview-title"
                  className="mt-0.5 truncate text-lg font-bold text-[#0B1354]"
                >
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-sm text-[#717171] transition-colors hover:bg-[#F7F8FF] hover:text-[#0B1354]"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <div className="flex shrink-0 items-center justify-center border-b border-[#F0F2F7] bg-[#FAFBFC] px-5 py-3.5 sm:px-6">
              <ModeToggle mode={mode} onChange={setMode} />
            </div>

            <div
              className={clsx(
                'min-h-0 flex-1 px-5 sm:px-6',
                mode === 'preview' && !isEmail
                  ? 'flex flex-col overflow-hidden py-5'
                  : 'overflow-y-auto py-6',
              )}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className={mode === 'preview' && !isEmail ? 'flex min-h-0 flex-1 flex-col' : ''}
                >
                  {mode === 'preview' ? (
                    isEmail ? (
                      <EmailPreviewCanvas
                        headline={headline}
                        body={body}
                        cta={cta}
                        accent={accent}
                        products={products}
                      />
                    ) : (
                      <div
                        className="flex min-h-0 flex-1 items-center justify-center rounded-sm px-2 py-2"
                        style={{
                          background:
                            'radial-gradient(ellipse 80% 70% at 50% 35%, rgba(58,16,205,0.1) 0%, transparent 55%), linear-gradient(165deg, #F7F5FF 0%, #EEF2FA 48%, #E8ECF6 100%)',
                        }}
                      >
                        <CampaignMobilePreview
                          channel="sms"
                          headline={headline}
                          body={body}
                          cta={cta}
                          fillHeight
                          expanded
                          compact
                        />
                      </div>
                    )
                  ) : (
                    <DetailsFields channel={channel} headline={headline} body={body} cta={cta} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex shrink-0 flex-col gap-2.5 border-t border-[#F0F2F7] px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={onUse}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#320EB8]"
              >
                Use Template
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex w-full cursor-pointer items-center justify-center rounded-sm border border-[#E4E4E7] px-4 py-3 text-sm font-semibold text-[#717171] transition-colors hover:bg-[#FAFBFC] hover:text-[#0B1354]"
              >
                Close Preview
              </button>
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
