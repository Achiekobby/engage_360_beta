import { ArrowRight, MessageSquare } from 'lucide-react';
import { SmsTemplateMiniPreview } from './CampaignMobilePreview';

export default function SmsTemplateCard({ template, onSelect }) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(template)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(template);
        }
      }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-sm border border-[#EEF0F4] bg-white text-left shadow-[0_4px_20px_rgba(11,19,84,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_14px_36px_rgba(58,16,205,0.1)]"
    >
      <div className="p-3 sm:p-4">
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-[#F0F2F7]">
          <div className="h-full w-full overflow-hidden rounded-sm transition-transform duration-500 group-hover:scale-[1.02]">
            <SmsTemplateMiniPreview
              headline={template.previewTitle}
              body={template.smsMessage}
              cta={template.callToAction}
            />
          </div>
          <div className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold text-[#2E7DAD] shadow-sm ring-1 ring-[#E8F4FC]">
            <MessageSquare className="h-3 w-3" strokeWidth={2} />
            SMS
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
        <p className="text-xs font-semibold text-[#5B9FD4]">{template.categoryLabel}</p>
        <h3 className="mt-1.5 text-base font-bold leading-snug text-[#0B1354] sm:text-lg">
          {template.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[#717171] line-clamp-3">
          {template.description}
        </p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-[#320EB8]">
          View template
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2.5}
          />
        </span>
      </div>
    </article>
  );
}
