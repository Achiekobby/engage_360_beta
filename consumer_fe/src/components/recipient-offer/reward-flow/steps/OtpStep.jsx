import { useCallback, useEffect, useRef, useState } from 'react';
import { Info, Pencil } from 'lucide-react';
import { formatGhanaPhone } from '../../../../constants/ghanaNetworks';
import { REWARDS_CONFIG } from '../../../../constants/rewardsConfig';
import { getErrorMessage, requestOtp, verifyOtp } from '../../../../services/recipient';
import { FieldError, FormAlert } from '../../../ui/formControls';
import OtpInput from '../../../ui/OtpInput';
import { FlowBodyPanel, FlowHeader, PrimaryButton } from '../FlowChrome';

export default function OtpStep({ phone, cooldownSec, onVerified, onChangeNumber, onClose }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(cooldownSec);
  const [focusKey, setFocusKey] = useState(0);
  const submitting = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const submit = useCallback(
    async (value) => {
      if (submitting.current) return;
      if (value.length !== REWARDS_CONFIG.otpLength) {
        setError(`Enter the ${REWARDS_CONFIG.otpLength}-digit code we sent you.`);
        return;
      }

      submitting.current = true;
      setBusy(true);
      setError('');
      setNotice('');
      try {
        const { gaps } = await verifyOtp(phone, value);
        onVerified(gaps);
      } catch (err) {
        setError(getErrorMessage(err));
        setCode('');
        setFocusKey((key) => key + 1);
        setBusy(false);
        submitting.current = false;
      }
    },
    [phone, onVerified],
  );

  const handleResend = async () => {
    if (secondsLeft > 0 || resending || busy) return;
    setResending(true);
    setError('');
    setNotice('');
    try {
      const result = await requestOtp(phone);
      setCode('');
      setSecondsLeft(result.cooldownSec);
      setFocusKey((key) => key + 1);
      setNotice('A new code is on its way.');
    } catch (err) {
      setError(getErrorMessage(err));
      if (err.meta?.retryInSec) setSecondsLeft(err.meta.retryInSec);
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <FlowHeader
        pill="Earn 50+ reward points"
        title="Enter the 6-digit code"
        subtitle={`We sent a code to ${formatGhanaPhone(phone)}.`}
        onClose={onClose}
      />

      <FlowBodyPanel>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(code);
          }}
          noValidate
          className="space-y-5"
        >
          <div>
            <OtpInput
              value={code}
              onChange={(next) => {
                setCode(next);
                if (error) setError('');
              }}
              onComplete={submit}
              length={REWARDS_CONFIG.otpLength}
              disabled={busy}
              error={Boolean(error)}
              focusKey={focusKey}
            />
            <FieldError>{error}</FieldError>
          </div>

          {notice && !error ? <FormAlert tone="success">{notice}</FormAlert> : null}

          {import.meta.env.DEV ? (
            <p className="flex items-start gap-2 rounded-xl border border-dashed border-[#CFC6F7] bg-[#F7F5FF] px-3.5 py-2.5 text-xs leading-snug text-[#4A3FA0]">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
              <span>
                Demo mode: no SMS is sent. Use code{' '}
                <strong className="font-bold tracking-wider">{REWARDS_CONFIG.demoOtp}</strong>.
              </span>
            </p>
          ) : null}

          <PrimaryButton busy={busy} busyLabel="Verifying…">
            Verify code
          </PrimaryButton>

          <div className="flex flex-col items-center gap-2 text-sm sm:flex-row sm:justify-between">
            <p className="text-[#6B7191]">
              Didn’t get it?{' '}
              {secondsLeft > 0 ? (
                <span className="font-semibold tabular-nums text-[#0B1354]">Resend in {secondsLeft}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || busy}
                  className="cursor-pointer font-semibold text-primary underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resending ? 'Sending…' : 'Resend code'}
                </button>
              )}
            </p>
            <button
              type="button"
              onClick={onChangeNumber}
              disabled={busy}
              className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-[#5B6180] transition-colors hover:text-primary disabled:opacity-60"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2.25} />
              Change number
            </button>
          </div>
        </form>
      </FlowBodyPanel>
    </>
  );
}
