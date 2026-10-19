import { Mail, MessageSquare, Smartphone } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { FieldError, FieldLabel, inputClassName } from './WizardFormField';
import { CAMPAIGN_CHANNELS } from './campaignsData';

const EVENT_CHANNELS = CAMPAIGN_CHANNELS.filter((channel) =>
  ['sms', 'email', 'whatsapp'].includes(channel.id),
);

const CHANNEL_ICONS = {
  sms: MessageSquare,
  email: Mail,
  whatsapp: Smartphone,
};

const FIELD_HELP = {
  channel: 'Choose how guests will receive this event invitation.',
  body: 'The invite message your audience will read. Lead with the event name, date, and why they should come.',
  cta: 'The action you want guests to take — e.g. Reserve your seat, RSVP Now, Get Tickets.',
  headline: 'A clear event title guests will recognize.',
  description: 'Supporting details about the event experience, agenda highlights, or what to expect.',
};

function messageLabelForChannel(channel) {
  if (channel === 'email') return 'Email Message';
  if (channel === 'whatsapp') return 'WhatsApp Message';
  return 'SMS Message';
}

export default function EventsActivationMessageStep({ form, errors, onUpdate }) {
  const messageLabel = messageLabelForChannel(form.channel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div className="rounded-sm border border-primary/10 bg-[#F7F8FF] px-4 py-3">
        <p className="text-sm font-semibold text-[#0B1354]">Events & Activation</p>
        <p className="mt-0.5 text-xs leading-relaxed text-[#717171]">
          Write a clear invite first. You&apos;ll add venue, tickets, and registration on the next
          step.
        </p>
      </div>

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
          {EVENT_CHANNELS.map(({ id, label }) => {
            const Icon = CHANNEL_ICONS[id];
            const selected = form.channel === id;

            return (
              <label
                key={id}
                className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-[#0B1354]"
              >
                <input
                  type="radio"
                  name="event-channel"
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
                  className={clsx(
                    'h-4 w-4 transition-colors',
                    selected ? 'text-primary' : 'text-[#9AA0B0]',
                  )}
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
        <FieldLabel htmlFor="event-body" help={FIELD_HELP.body}>
          {messageLabel}
        </FieldLabel>
        <textarea
          id="event-body"
          value={form.body}
          onChange={(event) => onUpdate('body', event.target.value)}
          rows={4}
          placeholder="You're invited! Join us for an unforgettable evening. Trust is built over time — experience brands that are transparent, reliable, and committed to serving you better."
          className={clsx(inputClassName(errors.body), 'resize-none')}
          aria-invalid={Boolean(errors.body)}
        />
        <FieldError message={errors.body} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="event-cta" help={FIELD_HELP.cta}>
            Call to Action
          </FieldLabel>
          <input
            id="event-cta"
            value={form.cta}
            onChange={(event) => onUpdate('cta', event.target.value)}
            placeholder="Reserve your seat"
            className={inputClassName(errors.cta)}
          />
        </div>

        <div>
          <FieldLabel htmlFor="event-headline" help={FIELD_HELP.headline}>
            Event Title
          </FieldLabel>
          <input
            id="event-headline"
            value={form.headline}
            onChange={(event) => onUpdate('headline', event.target.value)}
            placeholder="Summer Brand Experience Night"
            className={inputClassName(errors.headline)}
            aria-invalid={Boolean(errors.headline)}
          />
          <FieldError message={errors.headline} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="event-description" help={FIELD_HELP.description}>
          Event Description
        </FieldLabel>
        <textarea
          id="event-description"
          value={form.description}
          onChange={(event) => onUpdate('description', event.target.value)}
          rows={5}
          placeholder="Share what guests can expect — speakers, networking, product reveals, and why this night matters."
          className={clsx(inputClassName(errors.description), 'resize-none')}
        />
      </div>
    </motion.div>
  );
}
