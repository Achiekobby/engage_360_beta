import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Loader2 } from 'lucide-react';
import { Reveal } from '../components/motion';
import LogoMark from '../components/brand/LogoMark';
import SignUpLeftPanel from '../components/auth/signup/SignUpLeftPanel';
import BackButton from '../components/auth/BackButton';
import ConfirmModal from '../components/auth/ConfirmModal';
import { VERIFY_OTP_PANEL } from '../components/auth/signup/signupStepsData';
import { authPrimaryBtnClass, authSecondaryBtnClass } from '../components/auth/authStyles';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { completeVerification, logout } from '../store/slices/authSlice';

function maskPhone(phone = '') {
  const cleaned = phone.replace(/\s/g, '');
  if (!cleaned) return '+233*********';

  if (cleaned.startsWith('+233') && cleaned.length > 7) {
    return `+233${'*'.repeat(Math.max(4, cleaned.length - 7))}${cleaned.slice(-4)}`;
  }

  const digits = cleaned.replace(/\D/g, '');
  if (digits.length < 6) return '+233*********';
  const prefix = cleaned.startsWith('+') ? cleaned.slice(0, 4) : `+${digits.slice(0, 3)}`;
  return `${prefix}${'*'.repeat(Math.max(4, digits.length - 7))}${digits.slice(-4)}`;
}

export default function OtpVerificationPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const authUser = useAppSelector((state) => state.auth.user);
  const pendingVerification = useAppSelector((state) => state.auth.pendingVerification);
  const phone = location.state?.phone ?? authUser?.phone ?? '';
  const [digits, setDigits] = useState(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyLaterOpen, setVerifyLaterOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!phone && !pendingVerification) {
      navigate('/signup', { replace: true });
    }
  }, [phone, pendingVerification, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;
    event.preventDefault();
    const next = pasted.split('').concat(['', '', '', '']).slice(0, 4);
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 3)]?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (digits.some((d) => !d)) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    dispatch(completeVerification());
    navigate('/', { replace: true });
  };

  const handleVerifyLater = () => {
    setVerifyLaterOpen(true);
  };

  const handleConfirmVerifyLater = async () => {
    setIsLoggingOut(true);
    await new Promise((r) => setTimeout(r, 400));
    dispatch(logout());
    setIsLoggingOut(false);
    setVerifyLaterOpen(false);
    navigate('/signin', { replace: true });
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
          <BackButton fallback="/signup" className="mb-6 ml-auto self-end" />

          <Reveal when="load" variant="fadeUp" delay={0.06}>
            <div className="mb-8 flex flex-col items-center text-center">
              <LogoMark size={56} variant="on-white" />
              <h1 className="mt-4 text-xl font-bold text-[#0B1354] sm:text-2xl">OTP Verification</h1>
              <p className="mt-2 text-sm text-[#717171]">
                Set a new password to secure your account
              </p>
            </div>
          </Reveal>

          <Reveal when="load" variant="fadeUp" delay={0.12}>
          <div className="text-center">
            <p className="text-sm text-[#717171]">
              Enter the four digits sent to{' '}
              <span className="font-semibold text-[#0B1354]">{maskPhone(phone)}</span>
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="flex items-center justify-center gap-3 sm:gap-4">
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
                    className="h-14 w-14 rounded-xl border border-[#E4E4E7] text-center text-xl font-semibold text-[#0B1354] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 sm:h-16 sm:w-16"
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>

              <p className="mt-6 text-sm text-[#717171]">
                Didn&apos;t receive your code?{' '}
                <button type="button" className="font-semibold text-primary cursor-pointer">
                  Resend Code
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
