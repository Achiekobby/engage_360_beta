import { Mail, MessageSquare, Smartphone } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { FieldError, FieldLabel, FileUploadZone, inputClassName } from './WizardFormField';
import CampaignCtaConfigFields from './CampaignCtaConfigFields';
import { CAMPAIGN_CHANNELS } from './campaignsData';

const SALES_CHANNELS = CAMPAIGN_CHANNELS.filter((channel) =>
  ['sms', 'email', 'whatsapp'].includes(channel.id),
);

const CHANNEL_ICONS = {
  sms: MessageSquare,
  email: Mail,
  whatsapp: Smartphone,
};

const FIELD_HELP = {
  channel: 'Choose how customers will receive this sales message.',
  body: 'The conversion-focused message your audience will read. Keep it clear and action-oriented.',
  headline: 'A short offer title that grabs attention.',
  cta: 'The action you want customers to take — e.g. Order Now, Buy Now, Shop Deal.',
  ctaType:
    'Payments are not processed on Engage 360. Link customers to a URL, phone line, or WhatsApp.',
  ctaValue: 'Where the call to action sends customers off-platform.',
  description: 'Supporting details that explain the offer, value, or urgency.',
  banner: 'Optional hero image or video that represents this offer.',
};

function messageLabelForChannel(channel) {
  if (channel === 'email') return 'Email Message';
  if (channel === 'whatsapp') return 'WhatsApp Message';
  return 'SMS Message';
}

export default function SalesConversionMessageStep({
  form,
  errors,
  onUpdate,
  onBannerChange,
}) {
  const messageLabel = messageLabelForChannel(form.channel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div>
        <FieldLabel help={FIELD_HELP.channel}>Campaign Channel</FieldLabel>
        <div
          className={clsx(
            'flex flex-wrap gap-x-6 gap-y-3 rounded-sm border px-4 py-3.5',
            errors.channel ? 'border-[#E5484D] bg-[#FFF5F5]' : 'border-[#EEF0F4] bg-white',
          )}
          role="radiogroup"
          aria-label="Campaign channel"
        >
          {SALES_CHANNELS.map(({ id, label }) => {
            const Icon = CHANNEL_ICONS[id];
            const selected = form.channel === id;

            return (
              <label
                key={id}
                className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-[#0B1354]"
              >
                <input
                  type="radio"
                  name="sales-channel"
                  className="sr-only"
                  checked={selected}
                  onChange={() => onUpdate('channel', id)}
                />
                <span
                  className={clsx(
                    'flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors',
                    selected ? 'border-primary' : 'border-[#C8CDD8]',
                  )}
                >
                  {selected ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                </span>
                <Icon
                  className={clsx('h-4 w-4 transition-colors', selected ? 'text-primary' : 'text-[#9AA0B0]')}
                  strokeWidth={2}
                />
                {label}
              </label>
            );
          })}
        </div>
        <FieldError message={errors.channel} />
      </div>

      <div>
        <FieldLabel htmlFor="sales-body" help={FIELD_HELP.body}>
          {messageLabel}
        </FieldLabel>
        <textarea
          id="sales-body"
          value={form.body}
          onChange={(event) => onUpdate('body', event.target.value)}
          rows={4}
          placeholder="Trust is built over time. Choose brands that are transparent, reliable, and committed to serving you better."
          className={clsx(inputClassName(errors.body), 'resize-none')}
          aria-invalid={Boolean(errors.body)}
        />
        <FieldError message={errors.body} />
      </div>

      <div>
        <FieldLabel htmlFor="sales-headline" help={FIELD_HELP.headline}>
          Title
        </FieldLabel>
        <input
          id="sales-headline"
          value={form.headline}
          onChange={(event) => onUpdate('headline', event.target.value)}
          placeholder="Clear Offer"
          className={inputClassName(errors.headline)}
          aria-invalid={Boolean(errors.headline)}
        />
        <FieldError message={errors.headline} />
      </div>

      <CampaignCtaConfigFields
        idPrefix="sales-cta"
        cta={form.cta}
        ctaType={form.ctaType}
        ctaValue={form.ctaValue}
        errors={errors}
        onUpdate={onUpdate}
        ctaPlaceholder="Order Now"
        help={FIELD_HELP}
      />

      <div className="grid gap-5 sm:grid-cols-2 sm:items-start">
        <div>
          <FieldLabel htmlFor="sales-description" help={FIELD_HELP.description}>
            Description
          </FieldLabel>
          <textarea
            id="sales-description"
            value={form.description}
            onChange={(event) => onUpdate('description', event.target.value)}
            rows={6}
            placeholder="Trust is built over time. Choose brands that are transparent, reliable, and committed to serving you better."
            className={clsx(inputClassName(errors.description), 'min-h-[11rem] resize-none')}
          />
        </div>

        <FileUploadZone
          id="sales-banner"
          label="Banner (Optional)"
          fileName={form.banner?.fileName}
          previewUrl={form.banner?.previewUrl}
          promoVisual={form.banner?.promoVisual || 'image'}
          fileMimeType={form.banner?.fileMimeType}
          onChange={onBannerChange}
          error={errors.banner}
          help={FIELD_HELP.banner}
          compact
        />
      </div>
    </motion.div>
  );
}
