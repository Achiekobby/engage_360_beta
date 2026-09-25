import { useState } from 'react';
import { Film, Image as ImageIcon, Plus, Sparkles, Ticket, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import PromoVisualPicker from './PromoVisualPicker';
import { FieldError, FieldLabel, FileUploadZone, inputClassName } from './WizardFormField';
import {
  EVENT_CURRENCIES,
  EVENT_TIME_OPTIONS,
  PROMO_VISUAL_OPTIONS,
  detectPromoVisualFromFile,
  formatEventTime,
} from './campaignsData';

const VISUAL_ACCEPT = 'image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,video/quicktime';

const SEGMENT_META = {
  image: { icon: ImageIcon, empty: 'Image preview' },
  video: { icon: Film, empty: 'Video preview' },
  gif: { icon: Sparkles, empty: 'GIF preview' },
};

function SectionHeading({ children, hint }) {
  return (
    <div className="pt-2">
      <h3 className="text-sm font-semibold text-primary">{children}</h3>
      {hint ? <p className="mt-1 text-xs text-[#717171]">{hint}</p> : null}
      <div className="mt-2 h-px bg-[#EEF0F4]" />
    </div>
  );
}

function YesNoField({ name, label, value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-[#0B1354]">{label}</legend>
      <div className="flex items-center gap-6">
        {[
          { id: 'yes', label: 'Yes' },
          { id: 'no', label: 'No' },
        ].map((option) => {
          const selected = value === option.id;
          return (
            <label
              key={option.id}
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-[#0B1354]"
            >
              <input
                type="radio"
                name={name}
                className="sr-only"
                checked={selected}
                onChange={() => onChange(option.id)}
              />
              <span
                className={clsx(
                  'flex h-4 w-4 items-center justify-center rounded-full border-2',
                  selected ? 'border-primary' : 'border-[#C8CDD8]',
                )}
              >
                {selected ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
              </span>
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function DateTimePair({
  dateId,
  timeId,
  dateLabel,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
}) {
  return (
    <div>
      <FieldLabel htmlFor={dateId}>{dateLabel}</FieldLabel>
      <div className="grid grid-cols-[minmax(0,1fr)_8.5rem] gap-2">
        <input
          id={dateId}
          type="date"
          value={dateValue}
          onChange={(event) => onDateChange(event.target.value)}
          className={inputClassName(dateError)}
          aria-invalid={Boolean(dateError)}
        />
        <select
          id={timeId}
          value={timeValue}
          onChange={(event) => onTimeChange(event.target.value)}
          className={clsx(inputClassName(timeError), 'cursor-pointer')}
          aria-invalid={Boolean(timeError)}
        >
          <option value="">Time</option>
          {EVENT_TIME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <FieldError message={dateError || timeError} />
    </div>
  );
}

function VisualSegments({ promoVisual, previewUrl, fileName, fileMimeType }) {
  const detected = detectPromoVisualFromFile(
    fileMimeType || fileName ? { type: fileMimeType, name: fileName } : null,
  );

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-[#0B1354]">Preview</p>
      <p className="text-xs leading-relaxed text-[#717171]">
        Image, video, and GIF each have their own panel. Your file appears in the matching one.
      </p>
      {PROMO_VISUAL_OPTIONS.map((option) => {
        const meta = SEGMENT_META[option.id];
        const Icon = meta.icon;
        const filled = Boolean(previewUrl) && detected === option.id;
        const selected = promoVisual === option.id;

        return (
          <div
            key={option.id}
            className={clsx(
              'overflow-hidden rounded-lg border bg-white',
              filled
                ? 'border-primary/30 shadow-[0_6px_18px_rgba(58,16,205,0.08)]'
                : selected
                  ? 'border-primary/20'
                  : 'border-[#EEF0F4]',
            )}
          >
            <div className="flex items-center gap-2 border-b border-[#F0F2F7] px-3 py-2">
              <span
                className={clsx(
                  'flex h-6 w-6 items-center justify-center rounded-md',
                  filled || selected ? 'bg-primary text-white' : 'bg-[#F0F2F7] text-[#717171]',
                )}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wide text-[#0B1354]">
                {option.label}
              </span>
              {filled ? (
                <span className="ml-auto truncate text-[11px] text-[#717171]">{fileName}</span>
              ) : (
                <span className="ml-auto text-[11px] text-[#9AA0B0]">
                  {selected ? 'Selected' : 'Empty'}
                </span>
              )}
            </div>
            {filled ? (
              <div className="bg-[#0B1354]/5 p-2">
                {option.id === 'video' ? (
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-44 w-full rounded-md object-contain"
                    aria-label={fileName || 'Event video preview'}
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt={fileName || `${option.label} preview`}
                    className="max-h-44 w-full rounded-md object-contain"
                  />
                )}
              </div>
            ) : (
              <div className="px-3 py-3 text-xs text-[#9AA0B0]">{meta.empty} will show here.</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function formatTicketPrice(ticket) {
  if (!ticket.price) return 'Free';
  return `${ticket.currency} ${ticket.price}`;
}

export function ticketIncludedItems(included) {
  if (Array.isArray(included)) return included.map((item) => item.trim()).filter(Boolean);
  if (typeof included === 'string' && included.trim()) return [included.trim()];
  return [];
}

function sanitizePriceInput(value) {
  const cleaned = value.replace(/[^\d.]/g, '');
  const dot = cleaned.indexOf('.');
  if (dot === -1) return cleaned;
  const whole = cleaned.slice(0, dot);
  const fraction = cleaned.slice(dot + 1).replace(/\./g, '').slice(0, 2);
  return `${whole}.${fraction}`;
}

function isValidPrice(value) {
  return /^\d+(\.\d{1,2})?$/.test(value);
}

export function EventGuestPreview({ form }) {
  const event = form.event;
  const attachment = form.attachments?.[0];
  const visual = attachment?.promoVisual || 'image';
  const questions = form.registrationQuestions || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#EEF0F4] bg-white shadow-sm">
      {attachment?.previewUrl ? (
        visual === 'video' ? (
          <video src={attachment.previewUrl} controls className="aspect-video w-full bg-[#0B1354] object-contain" />
        ) : (
          <img
            src={attachment.previewUrl}
            alt=""
            className="aspect-video w-full object-cover"
          />
        )
      ) : (
        <div className="flex aspect-video items-center justify-center bg-[#F7F8FF] text-xs text-[#9AA0B0]">
          Event visual
        </div>
      )}
      <div className="space-y-3 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">Event</p>
        <h4 className="text-base font-bold text-[#0B1354]">{form.headline || 'Event title'}</h4>
        <p className="text-xs leading-relaxed text-[#717171]">{form.body || 'Your invitation message.'}</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-[#FAFBFC] px-3 py-2">
            <p className="font-semibold text-[#0B1354]">Starts</p>
            <p className="mt-0.5 text-[#717171]">
              {event?.startDate || 'Date'} · {formatEventTime(event?.startTime)}
            </p>
          </div>
          <div className="rounded-lg bg-[#FAFBFC] px-3 py-2">
            <p className="font-semibold text-[#0B1354]">Ends</p>
            <p className="mt-0.5 text-[#717171]">
              {event?.endDate || 'Date'} · {formatEventTime(event?.endTime)}
            </p>
          </div>
        </div>
        <p className="text-xs text-[#545454]">
          <span className="font-semibold text-[#0B1354]">Venue. </span>
          {event?.venue || 'Venue not set'}
        </p>
        {event?.tickets?.length ? (
          <div className="space-y-1.5">
            {event.tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between rounded-lg border border-[#EEF0F4] px-3 py-2 text-xs">
                <span className="font-semibold text-[#0B1354]">{ticket.title}</span>
                <span className="text-[#717171]">{formatTicketPrice(ticket)}</span>
              </div>
            ))}
          </div>
        ) : null}
        {questions.length ? (
          <div className="border-t border-[#F0F2F7] pt-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#9AA0B0]">Registration</p>
            <div className="mt-2 space-y-2">
              {questions.map((item, index) => (
                <p key={item.id} className="text-xs text-[#0B1354]">
                  {index + 1}. {item.type === 'terms' ? item.checkboxLabel : item.question}
                </p>
              ))}
            </div>
          </div>
        ) : null}
        <div className="rounded-lg bg-primary py-2.5 text-center text-xs font-semibold text-white">
          {form.cta || 'Register'}
        </div>
      </div>
    </div>
  );
}

export default function EventActivationAttachmentStep({
  attachment,
  event,
  errors,
  onVisualChange,
  onFileChange,
  onEventChange,
  onAddTicket,
  onRemoveTicket,
}) {
  const [draft, setDraft] = useState({
    title: '',
    price: '',
    currency: 'GHS',
    included: [''],
    slots: '',
  });
  const [draftError, setDraftError] = useState('');

  const updateIncluded = (index, value) => {
    setDraft((prev) => ({
      ...prev,
      included: prev.included.map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
  };

  const addIncluded = (index) => {
    setDraft((prev) => {
      const next = [...prev.included];
      next.splice(index + 1, 0, '');
      return { ...prev, included: next };
    });
  };

  const removeIncluded = (index) => {
    setDraft((prev) => {
      if (prev.included.length === 1) return { ...prev, included: [''] };
      return { ...prev, included: prev.included.filter((_, itemIndex) => itemIndex !== index) };
    });
  };

  const addTicket = () => {
    const price = draft.price.trim().replace(/\.$/, '');

    if (!draft.title.trim()) {
      setDraftError('Give the ticket a title, like General Admission.');
      return;
    }
    if (event.hasEntryFee === 'yes' && !price) {
      setDraftError('Add a price for this ticket.');
      return;
    }
    if (price && !isValidPrice(price)) {
      setDraftError('Enter a price like 1000 or 999.99.');
      return;
    }
    if (draft.slots.trim() && (!Number.isInteger(Number(draft.slots)) || Number(draft.slots) < 1)) {
      setDraftError('Ticket slots should be a whole number greater than 0.');
      return;
    }

    onAddTicket({
      id: `ticket-${Date.now()}`,
      title: draft.title.trim(),
      price,
      currency: draft.currency,
      included: ticketIncludedItems(draft.included),
      slots: draft.slots.trim(),
    });
    setDraft({ title: '', price: '', currency: draft.currency, included: [''], slots: '' });
    setDraftError('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-base font-bold text-[#0B1354]">Event details</h2>
        <p className="mt-1 text-sm text-[#717171]">
          Add one visual, then tell guests when, where, and how they get in.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)]">
        <div className="space-y-5">
          <PromoVisualPicker
            name={`promoVisual-${attachment.id}`}
            label="Event Visual Creative"
            value={attachment.promoVisual}
            onChange={onVisualChange}
            help="Choose image, video, or GIF. The upload accepts all three, and the preview puts the file in the matching panel."
            error={errors[`attachments.0.promoVisual`]}
          />
          <FileUploadZone
            id={`attachment-file-${attachment.id}`}
            label="Creative file"
            fileName={attachment.fileName}
            previewUrl={attachment.previewUrl}
            promoVisual={attachment.promoVisual}
            fileMimeType={attachment.fileMimeType}
            onChange={onFileChange}
            error={errors['attachments.0.file']}
            help="PNG, JPG, WEBP, GIF, MP4, or WEBM. One file is used for this event."
            accept={VISUAL_ACCEPT}
            emptyTitle="Image, video, or GIF"
            emptyHint="Click here to upload"
            hidePreview
            compact
          />
        </div>
        <VisualSegments
          promoVisual={attachment.promoVisual}
          previewUrl={attachment.previewUrl}
          fileName={attachment.fileName}
          fileMimeType={attachment.fileMimeType}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DateTimePair
          dateId="event-start-date"
          timeId="event-start-time"
          dateLabel="Event Start Date & Time"
          dateValue={event.startDate}
          timeValue={event.startTime}
          onDateChange={(value) => onEventChange({ startDate: value })}
          onTimeChange={(value) => onEventChange({ startTime: value })}
          dateError={errors['event.startDate']}
          timeError={errors['event.startTime']}
        />
        <DateTimePair
          dateId="event-end-date"
          timeId="event-end-time"
          dateLabel="Event End Date & Time"
          dateValue={event.endDate}
          timeValue={event.endTime}
          onDateChange={(value) => onEventChange({ endDate: value })}
          onTimeChange={(value) => onEventChange({ endTime: value })}
          dateError={errors['event.endDate']}
          timeError={errors['event.endTime']}
        />
      </div>

      <div>
        <FieldLabel htmlFor="event-venue">Event Venue</FieldLabel>
        <input
          id="event-venue"
          value={event.venue}
          onChange={(inputEvent) => onEventChange({ venue: inputEvent.target.value })}
          placeholder="Accra Conference Center"
          className={inputClassName(errors['event.venue'])}
          aria-invalid={Boolean(errors['event.venue'])}
        />
        <FieldError message={errors['event.venue']} />
      </div>

      <div className="space-y-4">
        <SectionHeading hint="These answers decide what we ask for next.">Event Questions</SectionHeading>
        <YesNoField
          name="event-rsvp"
          label="Do you have a RSVP website"
          value={event.hasRsvpWebsite}
          onChange={(value) => onEventChange({ hasRsvpWebsite: value, rsvpUrl: value === 'no' ? '' : event.rsvpUrl })}
        />
        {event.hasRsvpWebsite === 'yes' ? (
          <div>
            <FieldLabel htmlFor="event-rsvp-url">RSVP website</FieldLabel>
            <input
              id="event-rsvp-url"
              value={event.rsvpUrl}
              onChange={(inputEvent) => onEventChange({ rsvpUrl: inputEvent.target.value })}
              placeholder="https://rsvp.yourbrand.com"
              className={inputClassName(errors['event.rsvpUrl'])}
              aria-invalid={Boolean(errors['event.rsvpUrl'])}
            />
            <FieldError message={errors['event.rsvpUrl']} />
          </div>
        ) : null}
        <YesNoField
          name="event-entry-fee"
          label="Is there entry fee for this event"
          value={event.hasEntryFee}
          onChange={(value) => onEventChange({ hasEntryFee: value })}
        />
      </div>

      <div className="space-y-4">
        <SectionHeading
          hint={
            event.hasEntryFee === 'yes'
              ? 'Add each ticket guests can buy. Price is required.'
              : 'Optional. Add ticket types if you want to track capacity. Leave price blank for free entry.'
          }
        >
          Ticket Information
        </SectionHeading>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="ticket-title">Ticket Title</FieldLabel>
            <input
              id="ticket-title"
              value={draft.title}
              onChange={(inputEvent) => setDraft((prev) => ({ ...prev, title: inputEvent.target.value }))}
              placeholder="General Admission"
              className={inputClassName()}
            />
          </div>
          <div>
            <FieldLabel htmlFor="ticket-price">Price</FieldLabel>
            <div className="flex">
              <select
                aria-label="Currency"
                value={draft.currency}
                onChange={(inputEvent) => setDraft((prev) => ({ ...prev, currency: inputEvent.target.value }))}
                className="w-[5.75rem] shrink-0 cursor-pointer rounded-l-sm border border-[#E4E4E7] bg-white px-2 py-2.5 text-sm font-semibold text-[#0B1354] outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              >
                {EVENT_CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              <input
                id="ticket-price"
                inputMode="decimal"
                value={draft.price}
                onChange={(inputEvent) =>
                  setDraft((prev) => ({ ...prev, price: sanitizePriceInput(inputEvent.target.value) }))
                }
                placeholder={event.hasEntryFee === 'yes' ? '999.99' : '0'}
                className="min-w-0 flex-1 rounded-r-sm rounded-l-none border border-l-0 border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#0B1354] outline-none placeholder:text-[#9AA0B0] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="ticket-slots">Ticket Slots</FieldLabel>
            <input
              id="ticket-slots"
              inputMode="numeric"
              value={draft.slots}
              onChange={(inputEvent) => setDraft((prev) => ({ ...prev, slots: inputEvent.target.value }))}
              placeholder="100"
              className={inputClassName()}
            />
          </div>
        </div>

        <div>
          <FieldLabel>What&apos;s included</FieldLabel>
          <div className="space-y-2">
            {draft.included.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  id={index === 0 ? 'ticket-included' : undefined}
                  value={item}
                  onChange={(inputEvent) => updateIncluded(index, inputEvent.target.value)}
                  placeholder="Seat, welcome drink"
                  className={inputClassName()}
                />
                <button
                  type="button"
                  onClick={() => addIncluded(index)}
                  className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-primary/30 text-primary transition-colors hover:bg-[#F7F8FF]"
                  aria-label="Add another inclusion"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => removeIncluded(index)}
                  className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] text-[#9AA0B0] transition-colors hover:border-[#E5484D]/40 hover:bg-[#FFF5F5] hover:text-[#E5484D]"
                  aria-label={`Remove inclusion ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={addTicket}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-colors hover:bg-[#320EB8]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Add Tickets
          </button>
        </div>
        <FieldError message={draftError || errors['event.tickets']} />

        {event.tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#E4E8EF] px-6 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4F5F8] text-[#C8CDD8]">
              <Ticket className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <p className="mt-3 text-sm font-semibold text-[#717171]">No Ticket Added yet</p>
            <p className="mt-1 text-xs text-[#9AA0B0]">Start adding tickets using the input fields above</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {event.tickets.map((ticket) => (
              <li
                key={ticket.id}
                className="flex items-start gap-3 rounded-lg border border-[#EEF0F4] bg-[#FAFBFC] px-4 py-3"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#EDE8F8] text-primary">
                  <Ticket className="h-4 w-4" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#0B1354]">{ticket.title}</p>
                  <p className="mt-0.5 text-xs text-[#717171]">
                    {formatTicketPrice(ticket)}
                    {ticket.slots ? ` · ${ticket.slots} slots` : ''}
                    {ticketIncludedItems(ticket.included).length
                      ? ` · ${ticketIncludedItems(ticket.included).join(', ')}`
                      : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveTicket(ticket.id)}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#9AA0B0] transition-colors hover:bg-[#FFF5F5] hover:text-[#E5484D]"
                  aria-label={`Remove ${ticket.title}`}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
