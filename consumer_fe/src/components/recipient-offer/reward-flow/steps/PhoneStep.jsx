import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { detectNetwork, normalizeGhanaPhone } from '../../../../constants/ghanaNetworks';
import { getNetworkLabel } from '../../../../constants/rewardsCatalog';
import { getErrorMessage, requestOtp } from '../../../../services/recipient';
import { FieldError, FieldLabel, FormAlert, fieldClass } from '../../../ui/formControls';
import { FlowBodyPanel, FlowHeader, LegalNote, PrimaryButton } from '../FlowChrome';

export default function PhoneStep({ notice, initialValue = '', onCodeSent, onClose }) {
  const [number, setNumber] = useState(initialValue);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const normalized = normalizeGhanaPhone(number);
  const networkLabel = normalized ? getNetworkLabel(detectNetwork(normalized)) : null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy) return;

    if (!normalized) {
      setError('Enter a valid Ghana mobile number, e.g. 024 123 4567.');
      return;
    }

    setError('');
    setBusy(true);
    try {
      const result = await requestOtp(normalized);
      onCodeSent({ phone: normalized, ...result });
    } catch (err) {
      setError(getErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <>
      <FlowHeader
        pill="Earn 50+ reward points"
        title="Verify your number to claim your rewards"
        subtitle="We’ll text you a 6-digit code. It takes less than a minute."
        onClose={onClose}
      />

      <FlowBodyPanel>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {notice ? <FormAlert tone="info">{notice}</FormAlert> : null}

          <div>
            <FieldLabel htmlFor="recipient-phone">Mobile number</FieldLabel>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-[#E4E6EF] px-4 text-[15px] font-semibold text-[#0B1354]">
                +233
              </span>
              <input
                id="recipient-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                autoFocus
                value={number}
                maxLength={18}
                placeholder="24 123 4567"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'recipient-phone-error' : 'recipient-phone-hint'}
                onChange={(event) => {
                  setNumber(event.target.value);
                  if (error) setError('');
                }}
                className={fieldClass(error, 'h-12 pl-[5rem] pr-[7.5rem] tracking-wide')}
              />
              {networkLabel ? (
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <span className="rounded-full bg-[#F4F5F9] px-2.5 py-1 text-[11px] font-bold text-[#3A3F66]">
                    Looks like {networkLabel}
                  </span>
                </span>
              ) : null}
            </div>
            <FieldError id="recipient-phone-error">{error}</FieldError>
            {!error ? (
              <p id="recipient-phone-hint" className="mt-1.5 text-xs text-[#8A90A6]">
                Use the number you want rewards and airtime linked to.
              </p>
            ) : null}
          </div>

          <PrimaryButton busy={busy} busyLabel="Sending code…">
            Send verification code
          </PrimaryButton>

          <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#6B7191]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#17734A]" strokeWidth={2.25} />
            Your number is only used to verify you and deliver rewards.
          </p>
        </form>

        <LegalNote />
      </FlowBodyPanel>
    </>
  );
}
