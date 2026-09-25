import { useEffect, useState } from 'react';
import { Mail, MessageSquare, Plus, Send, Smartphone, X } from 'lucide-react';
import { clsx } from 'clsx';
import AnimatedModal from '../motion/AnimatedModal';
import { FieldError, FieldLabel, inputClassName } from './WizardFormField';
import {
  CAMPAIGN_CHANNELS,
  getTestBlastConfig,
  TEST_BLAST_MAX_CONTACTS,
  validateTestBlastContactsForChannel,
} from './campaignsData';

const CHANNEL_ICONS = {
  sms: MessageSquare,
  email: Mail,
  whatsapp: Smartphone,
  push: Send,
};

export default function TestBlastModal({ isOpen, onClose, channel, onProceed }) {
  const config = getTestBlastConfig(channel);
  const [contacts, setContacts] = useState(['']);
  const [errors, setErrors] = useState({});

  const channelMeta = CAMPAIGN_CHANNELS.find((item) => item.id === channel);
  const ChannelIcon = CHANNEL_ICONS[channel] || Send;

  useEffect(() => {
    if (!isOpen) {
      setContacts(['']);
      setErrors({});
    }
  }, [isOpen]);

  const updateContact = (index, value) => {
    setContacts((prev) => prev.map((item, itemIndex) => (itemIndex === index ? value : item)));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`contact.${index}`];
      delete next.contacts;
      return next;
    });
  };

  const addContact = () => {
    if (contacts.length >= TEST_BLAST_MAX_CONTACTS) return;
    setContacts((prev) => [...prev, '']);
  };

  const removeContact = (index) => {
    if (contacts.length <= 1) return;
    setContacts((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith('contact.')) delete next[key];
      });
      return next;
    });
  };

  const handleProceed = () => {
    const validationErrors = validateTestBlastContactsForChannel(channel, contacts);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onProceed?.(contacts.map((value) => value.trim()).filter(Boolean));
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      panelClassName="relative flex w-full max-w-lg max-h-[90vh] flex-col overflow-hidden rounded-xl border-2 border-[#EEF0F4] bg-white shadow-[0_28px_72px_rgba(11,19,84,0.22)]"
    >
      <div className="border-b border-[#EEF0F4] bg-gradient-to-br from-[#F7F8FF] via-white to-[#FAFBFC] px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-[0_8px_20px_rgba(58,16,205,0.25)]">
              <Send className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#0B1354] sm:text-xl">Test Blast</h2>
              <p className="mt-0.5 text-xs text-[#717171] sm:text-sm">
                Send a preview to up to {TEST_BLAST_MAX_CONTACTS} contacts via{' '}
                <span className="font-semibold text-primary">{channelMeta?.label || channel}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#EEF0F4] text-[#717171] transition-colors hover:bg-[#F7F8FF] hover:text-[#0B1354]"
            aria-label="Close test blast"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
          <ChannelIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
          {config.fieldLabel}
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
        <div className="rounded-lg border border-[#E4E8EF] bg-[#F7F8FC] px-4 py-3.5 text-sm leading-relaxed text-[#717171]">
          <span className="font-semibold text-[#0B1354]">Tip:</span> {config.note}
        </div>

        <div>
          <FieldLabel>{config.fieldLabel}</FieldLabel>

          <div className="space-y-3">
            {contacts.map((contact, index) => (
              <div key={index}>
                <div className="flex gap-2">
                  <input
                    type={config.inputType}
                    value={contact}
                    onChange={(event) => updateContact(index, event.target.value)}
                    placeholder={config.placeholder(index)}
                    className={inputClassName(errors[`contact.${index}`])}
                    aria-invalid={Boolean(errors[`contact.${index}`])}
                  />
                  {contacts.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      className="inline-flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-[#E4E4E7] bg-white text-[#717171] transition-colors hover:border-[#E5484D]/40 hover:bg-[#FFF5F5] hover:text-[#E5484D]"
                      aria-label={`Remove ${config.fieldLabel.toLowerCase()} ${index + 1}`}
                    >
                      <X className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  ) : null}
                  {index === contacts.length - 1 && contacts.length < TEST_BLAST_MAX_CONTACTS ? (
                    <button
                      type="button"
                      onClick={addContact}
                      className="inline-flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-[#C8CDD8] bg-white text-[#0B1354] transition-colors hover:border-primary/40 hover:bg-[#F7F8FF] hover:text-primary"
                      aria-label={`Add another ${config.fieldLabel.toLowerCase()}`}
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  ) : null}
                </div>
                <FieldError message={errors[`contact.${index}`]} />
              </div>
            ))}
          </div>

          <FieldError message={errors.contacts} />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#F0F2F7] bg-[#FAFBFC] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-sm border border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-[#F7F8FF]"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleProceed}
          className={clsx(
            'inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all hover:bg-[#320EB8] sm:ml-auto',
          )}
        >
          <Send className="h-4 w-4" strokeWidth={2.25} />
          Send Test
        </button>
      </div>
    </AnimatedModal>
  );
}
