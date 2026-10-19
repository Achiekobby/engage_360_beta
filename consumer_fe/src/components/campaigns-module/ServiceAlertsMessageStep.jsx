import { Mail, MessageSquare, Smartphone } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { FieldError, FieldLabel, inputClassName } from './WizardFormField';
import { CAMPAIGN_CHANNELS } from './campaignsData';

const ALERT_CHANNELS = CAMPAIGN_CHANNELS.filter((channel) =>
  ['sms', 'email', 'whatsapp'].includes(channel.id),
);

const CHANNEL_ICONS = {
  sms: MessageSquare,
  email: Mail,
  whatsapp: Smartphone,
};

const FIELD_HELP = {
  channel: 'Choose how customers will receive this service alert.',
  body: 'A clear alert message — state what happened, impact, and what customers should do.',
  headline: 'A short alert title customers will recognize — e.g. Downtime, Maintenance.',
  cta: 'The next action you want customers to take — e.g. Learn More, Call Now, Check Status.',
  description: 'Extra context such as expected resolution time, affected areas, or workarounds.',
};

function messageLabelForChannel(channel) {
  if (channel === 'email') return 'Email Message';
  if (channel === 'whatsapp') return 'WhatsApp Message';
  return 'SMS Message';
}

export default function ServiceAlertsMessageStep({ form, errors, onUpdate }) {
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
          {ALERT_CHANNELS.map(({ id, label }) => {
            const Icon = CHANNEL_ICONS[id];
            const selected = form.channel === id;

            return (
              <label
                key={id}
                className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-[#0B1354]"
              >
                <input
                  type="radio"
                  name="service-alert-channel"
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
        <FieldLabel htmlFor="alert-body" help={FIELD_HELP.body}>
          {messageLabel}
        </FieldLabel>
        <textarea
          id="alert-body"
          value={form.body}
          onChange={(event) => onUpdate('body', event.target.value)}
          rows={4}
          placeholder="Trust is built over time. Choose brands that are transparent, reliable, and committed to serving you better."
          className={clsx(inputClassName(errors.body), 'resize-none')}
          aria-invalid={Boolean(errors.body)}
        />
        <FieldError message={errors.body} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="alert-headline" help={FIELD_HELP.headline}>
            Title
          </FieldLabel>
          <input
            id="alert-headline"
            value={form.headline}
            onChange={(event) => onUpdate('headline', event.target.value)}
            placeholder="Downtime"
            className={inputClassName(errors.headline)}
            aria-invalid={Boolean(errors.headline)}
          />
          <FieldError message={errors.headline} />
        </div>

        <div>
          <FieldLabel htmlFor="alert-cta" help={FIELD_HELP.cta}>
            Call to Action
          </FieldLabel>
          <input
            id="alert-cta"
            value={form.cta}
            onChange={(event) => onUpdate('cta', event.target.value)}
            placeholder="Learn More"
            className={inputClassName(errors.cta)}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="alert-description" help={FIELD_HELP.description}>
          Description
        </FieldLabel>
        <textarea
          id="alert-description"
          value={form.description}
          onChange={(event) => onUpdate('description', event.target.value)}
          rows={5}
          placeholder="Trust is built over time. Choose brands that are transparent, reliable, and committed to serving you better."
          className={clsx(inputClassName(errors.description), 'resize-none')}
        />
      </div>
    </motion.div>
  );
}
