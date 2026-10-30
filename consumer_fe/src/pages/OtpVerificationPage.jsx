import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, Loader2 } from 'lucide-react';
import { Reveal } from '../components/motion';
import LogoMark from '../components/brand/LogoMark';
import SignUpLeftPanel from '../components/auth/signup/SignUpLeftPanel';
import BackButton from '../components/auth/BackButton';
import ConfirmModal from '../components/auth/ConfirmModal';
import { VERIFY_OTP_PANEL } from '../components/auth/signup/signupStepsData';
import { authPrimaryBtnClass, authSecondaryBtnClass } from '../components/auth/authStyles';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { persistor } from '../store';
import { login, logout } from '../store/slices/authSlice';
import { sessionFromVerification } from '../services/auth/login';
import { resendVerificationCode, verifyAccount } from '../services/auth/verifyAccount';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SEC = 60;

function maskEmail(email = '') {
  const [name, domain] = email.split('@');
  if (!name || !domain) return 'your email';
  const visible = name.slice(0, 1);
  return `${visible}${'*'.repeat(Math.max(2, name.length - 1))}@${domain}`;
}

export default function OtpVerificationPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const authUser = useAppSelector((state) => state.auth.user);
  const email = location.state?.email ?? authUser?.email ?? '';
  const requestNewCode = Boolean(location.state?.requestNewCode);
  const [digits, setDigits] = useState(() => Array(CODE_LENGTH).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [codeRequested, setCodeRequested] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [verifyLaterOpen, setVerifyLaterOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const inputRefs = useRef([]);
  const leavingRef = useRef(false);

  useEffect(() => {
    if (leavingRef.current || email) return undefined;
    const timer = window.setTimeout(() => {
      if (leavingRef.current) return;
      navigate('/signin', { replace: true });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [email, navigate]);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);

    setError('');
    setNotice('');
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;
    event.preventDefault();
    const next = pasted.split('').concat(Array(CODE_LENGTH).fill('')).slice(0, CODE_LENGTH);
    setDigits(next);
    setError('');
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const code = digits.join('');
    if (code.length !== CODE_LENGTH || !email) return;

    setError('');
    setIsSubmitting(true);
    try {
      const result = await verifyAccount({ email, code });
      dispatch(login(sessionFromVerification(result, email)));
      navigate('/dashboard', { replace: true });
    } catch (verifyError) {
      setError(verifyError.message || 'That code could not be verified.');
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email || isResending || isSubmitting || secondsLeft > 0) return;
    setError('');
    setNotice('');
    setIsResending(true);
    try {
      const result = await resendVerificationCode({ email });
      setDigits(Array(CODE_LENGTH).fill(''));
      setCodeRequested(true);
      setNotice(result?.message || 'A new code has been sent.');
      setSecondsLeft(RESEND_COOLDOWN_SEC);
      inputRefs.current[0]?.focus();
    } catch (resendError) {
      setError(resendError.message || 'A new code could not be sent.');
      if (resendError.status === 429) setSecondsLeft(RESEND_COOLDOWN_SEC);
    } finally {
      setIsResending(false);
    }
  };

  const leaveVerification = async () => {
    leavingRef.current = true;
    dispatch(logout());
    try {
      await persistor.flush();
    } finally {
      navigate('/signin', { replace: true });
    }
  };

  const handleVerifyLater = () => {
    setVerifyLaterOpen(true);
  };

  const handleConfirmVerifyLater = async () => {
    setIsLoggingOut(true);
    await leaveVerification();
    setIsLoggingOut(false);
    setVerifyLaterOpen(false);
  };

  return (
    <>
      <ConfirmModal
        isOpen={verifyLaterOpen}
        onClose={() => setVerifyLaterOpen(false)}
        onConfirm={handleConfirmVerifyLater}
        icon={Clock}
        title="Verify later?"
        description="You can verify your account the next time you sign in. You'll be logged out for now and can pick up where you left off."
        confirmLabel="Log out"
        cancelLabel="Stay and verify"
        isLoading={isLoggingOut}
      />

      <div className="min-h-screen lg:flex lg:h-screen lg:overflow-hidden">
      <SignUpLeftPanel panel={VERIFY_OTP_PANEL} showProgress={false} />

      <div className="flex min-h-screen w-full flex-col bg-white lg:h-screen lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 xl:px-16">
          <BackButton onBack={leaveVerification} className="mb-6 ml-auto self-end" />

          <Reveal when="load" variant="fadeUp" delay={0.06}>
            <div className="mb-8 flex flex-col items-center text-center">
              <LogoMark size={56} variant="on-white" />
              <h1 className="mt-4 text-xl font-bold text-[#0B1354] sm:text-2xl">Verify your account</h1>
              <p className="mt-2 text-sm text-[#717171]">
                Enter the code we sent so you can finish creating your account.
              </p>
            </div>
          </Reveal>

          <Reveal when="load" variant="fadeUp" delay={0.12}>
          <div className="text-center">
            <p className="text-sm text-[#717171]">
              Enter the six digits sent to the main email{' '}
              <span className="font-semibold text-[#0B1354]">{maskEmail(email)}</span>
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              {requestNewCode && !codeRequested ? (
                <div
                  role="status"
                  className="mb-4 rounded-xl border border-[#DDD6FE] bg-[#F5F3FF] px-3.5 py-3 text-left text-sm text-[#3A10CD]"
                >
                  Your account is not verified yet. Request a new code, then enter it here.
                </div>
              ) : null}
              {error ? (
                <div
                  role="alert"
                  className="mb-4 flex gap-2.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3.5 py-3 text-left text-sm text-[#B91C1C]"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.25} aria-hidden="true" />
                  <p>{error}</p>
                </div>
              ) : null}
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="h-12 w-10 rounded-xl border border-[#E4E4E7] text-center text-lg font-semibold text-[#0B1354] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 sm:h-14 sm:w-12 sm:text-xl"
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>

              {notice ? (
                <p role="status" className="mt-6 text-sm font-medium text-[#157A42]">
                  {notice}
                </p>
              ) : null}

              <p className="mt-6 text-sm text-[#717171]">
                Didn&apos;t receive your code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending || isSubmitting || !email || secondsLeft > 0}
                  className="cursor-pointer font-semibold text-primary tabular-nums disabled:cursor-not-allowed disabled:text-[#717171] disabled:opacity-100"
                >
                  {isResending ? 'Sending…' : secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Resend Code'}
                </button>
              </p>

              <button
                type="submit"
                disabled={isSubmitting || digits.some((d) => !d)}
                className={`${authPrimaryBtnClass} mt-8`}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  'Verify Code'
                )}
              </button>

              <button
                type="button"
                onClick={handleVerifyLater}
                disabled={isSubmitting}
                className={`${authSecondaryBtnClass} mt-3`}
              >
                Verify Later
              </button>
            </form>
          </div>
          </Reveal>
        </div>
      </div>
    </div>
    </>
  );
}
