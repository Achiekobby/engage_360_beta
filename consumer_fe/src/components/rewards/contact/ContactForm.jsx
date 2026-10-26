import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { formatGhanaPhone } from '../../../constants/ghanaNetworks';
import useRecipient from '../../../hooks/useRecipient';
import { SUPPORT_TOPICS, getErrorMessage, submitSupportRequest } from '../../../services/recipient';
import SearchableSelect from '../../ui/SearchableSelect';
import { FieldError, FieldLabel, FormAlert, fieldClass } from '../../ui/formControls';

const MAX_LENGTH = 800;

export default function ContactForm() {
  const { phone } = useRecipient();
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy) return;

    const found = {};
    if (!topic) found.topic = 'Choose what you need help with.';
    if (message.trim().length < 10) found.message = 'Tell us a little more (at least 10 characters).';
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }

    setBusy(true);
    setFormError('');
    try {
      const result = await submitSupportRequest(phone, { topic, message });
      setReference(result.reference);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (reference) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-[#E6E8F0] bg-white p-8 text-center shadow-[0_6px_20px_rgba(11,19,84,0.05)]">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EFFBF4] text-[#17A36B] ring-8 ring-[#EFFBF4]/60">
          <CheckCircle2 className="h-8 w-8" strokeWidth={2} />
        </span>
        <h2 className="mt-5 text-xl font-bold text-[#0B1354]">Message sent</h2>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#5B6180]">
          Thanks for reaching out. We’ll reply to {formatGhanaPhone(phone)} as soon as we can. Your reference is{' '}
          <strong className="font-mono font-bold text-[#0B1354]">{reference}</strong>.
        </p>
        <button
          type="button"
          onClick={() => {
            setReference('');
            setTopic('');
            setMessage('');
          }}
          className="mt-6 cursor-pointer text-sm font-semibold text-primary underline-offset-2 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-2xl border border-[#E6E8F0] bg-white p-5 shadow-[0_6px_20px_rgba(11,19,84,0.05)] sm:p-7"
    >
      <div>
        <h2 className="text-xl font-bold text-[#0B1354]">Send us a message</h2>
        <p className="mt-1 text-sm text-[#6B7191]">
          We’ll reply to <span className="font-semibold tabular-nums text-[#0B1354]">{formatGhanaPhone(phone)}</span>.
        </p>
      </div>

      <div>
        <FieldLabel htmlFor="contact-topic">What do you need help with?</FieldLabel>
        <SearchableSelect
          id="contact-topic"
          value={topic}
          onChange={(next) => {
            setTopic(next);
            setErrors((current) => ({ ...current, topic: '' }));
          }}
          options={SUPPORT_TOPICS}
          searchable={false}
          placeholder="Select a topic"
          error={Boolean(errors.topic)}
          describedBy={errors.topic ? 'contact-topic-error' : undefined}
        />
        <FieldError id="contact-topic-error">{errors.topic}</FieldError>
      </div>

      <div>
        <FieldLabel htmlFor="contact-message">Message</FieldLabel>
        <textarea
          id="contact-message"
          rows={5}
          value={message}
          maxLength={MAX_LENGTH}
          placeholder="Include the offer name and what went wrong"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          onChange={(event) => {
            setMessage(event.target.value);
            setErrors((current) => ({ ...current, message: '' }));
          }}
          className={fieldClass(errors.message, 'resize-none py-3 leading-relaxed')}
        />
        <div className="flex items-start justify-between gap-3">
          <FieldError id="contact-message-error">{errors.message}</FieldError>
          <p className="ml-auto mt-1.5 text-xs tabular-nums text-[#8A90A6]">
            {message.length}/{MAX_LENGTH}
          </p>
        </div>
      </div>

      <FormAlert>{formError}</FormAlert>

      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-primary text-[15px] font-semibold text-white shadow-[0_10px_22px_rgba(58,16,205,0.28)] transition-colors hover:bg-[#320EB8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
      >
        {busy ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
