import { useEffect, useRef, useState } from 'react';
import { Form, Formik, ErrorMessage, Field } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { AnimateStep } from '../components/motion';
import LogoMark from '../components/brand/LogoMark';
import PasswordField from '../components/auth/PasswordField';
import BackButton from '../components/auth/BackButton';
import AuthFieldLabel from '../components/auth/AuthFieldLabel';
import FormFieldLegend from '../components/auth/FormFieldLegend';
import {
  forgotEmailSchema,
  resetPasswordSchema,
} from '../components/auth/signin/signInValidation';
import {
  authErrorClass,
  authInputClass,
  authPageBgClass,
  authPrimaryBtnClass,
} from '../components/auth/authStyles';
import { forgotPassword, resetPassword } from '../services/auth/password';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SEC = 60;

function maskEmail(email = '') {
  if (!email || !email.includes('@')) return 'your email';
  const [local, domain] = email.split('@');
  if (local.length <= 1) return `*@${domain}`;
  return `${local[0]}${'*'.repeat(Math.min(local.length - 1, 4))}@${domain}`;
}

function FormAlert({ children }) {
  if (!children) return null;
  return (
    <div
      role="alert"
      className="mb-4 flex gap-2.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3.5 py-3 text-left text-sm text-[#B91C1C]"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.25} aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}

function OtpStep({ email, initialError = '', onComplete }) {
  const [digits, setDigits] = useState(() => Array(CODE_LENGTH).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState(initialError);
  const [notice, setNotice] = useState('');
  const inputRefs = useRef([]);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const code = digits.join('');
    if (code.length !== CODE_LENGTH) return;
    setIsSubmitting(true);
    onComplete(code);
  };

  const handleResend = async () => {
    if (!email || isResending || secondsLeft > 0) return;
    setError('');
    setNotice('');
    setIsResending(true);
    try {
      const result = await forgotPassword({ email });
      setDigits(Array(CODE_LENGTH).fill(''));
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

  return (
    <>
      <h1 className="text-xl font-bold text-[#0B1354] sm:text-2xl">Enter your code</h1>
      <p className="mt-2 text-sm text-[#717171]">
        A verification code has been sent to the main email{' '}
        <span className="font-semibold text-[#0B1354]">{maskEmail(email)}</span>
      </p>

      <form onSubmit={handleSubmit} className="mt-8">
        <FormAlert>{error}</FormAlert>
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

        <p className="mt-6 text-center text-sm text-[#717171]">
          Didn&apos;t receive your code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || secondsLeft > 0}
            className="cursor-pointer font-semibold text-primary tabular-nums disabled:cursor-not-allowed disabled:text-[#717171]"
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
              Continuing...
            </span>
          ) : (
            'Continue'
          )}
        </button>
      </form>
    </>
  );
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [formError, setFormError] = useState('');

  return (
    <div className={`flex items-center justify-center px-4 py-10 ${authPageBgClass}`}>
      <div className="w-full max-w-md">
        <div className="mb-4 flex justify-end">
          <BackButton fallback="/signin" />
        </div>

        <div className="rounded-2xl bg-white px-6 py-10 text-center shadow-[0_12px_40px_rgba(11,19,84,0.08)] sm:px-10 sm:py-12">
        <AnimateStep stepKey={step}>
        {step === 0 && (
          <>
            <div className="mb-6 flex justify-center">
              <LogoMark size={56} variant="on-white" />
            </div>
            <h1 className="text-xl font-bold text-[#0B1354] sm:text-2xl">Forgot Your Password?</h1>
            <p className="mt-2 text-sm text-[#717171]">
              Enter the main email for your account and we&apos;ll send you a code to reset your password.
            </p>

            <Formik
              initialValues={{ email: '' }}
              validationSchema={forgotEmailSchema}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={async (values, { setSubmitting }) => {
                setFormError('');
                setSubmitting(true);
                try {
                  await forgotPassword({ email: values.email });
                  setEmail(values.email.trim());
                  setStep(1);
                } catch (error) {
                  setFormError(error.message || 'A reset code could not be sent.');
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="mt-8 text-left">
                  <FormAlert>{formError}</FormAlert>
                  <FormFieldLegend />

                  <AuthFieldLabel htmlFor="email" required>
                    Email
                  </AuthFieldLabel>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className={authInputClass}
                  />
                  <ErrorMessage name="email" component="p" className={authErrorClass} />

                  <button type="submit" disabled={isSubmitting} className={`${authPrimaryBtnClass} mt-6`}>
                    {isSubmitting ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      'Continue'
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            <p className="mt-6 text-sm text-[#717171]">
              Remember your password?{' '}
              <Link to="/signin" className="font-semibold text-primary">
                Sign in
              </Link>
            </p>
          </>
        )}

        {step === 1 && (
          <OtpStep
            email={email}
            initialError={formError}
            onComplete={(nextCode) => {
              setCode(nextCode);
              setFormError('');
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <>
            <div className="mb-6 flex justify-center">
              <LogoMark size={56} variant="on-white" />
            </div>
            <h1 className="text-xl font-bold text-[#0B1354] sm:text-2xl">Reset Password</h1>

            <Formik
              initialValues={{ password: '' }}
              validationSchema={resetPasswordSchema}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={async (values, { setSubmitting, setFieldError }) => {
                setFormError('');
                setSubmitting(true);
                try {
                  await resetPassword({ email, code, password: values.password });
                  navigate('/signin', { replace: true });
                } catch (error) {
                  if (error.fieldErrors?.code) {
                    setFormError(error.fieldErrors.code);
                    setStep(1);
                    return;
                  }
                  const passwordError = error.fieldErrors?.password;
                  if (passwordError) setFieldError('password', passwordError);
                  setFormError(passwordError ? '' : error.message || 'The password could not be reset.');
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="mt-8 text-left">
                  <FormAlert>{formError}</FormAlert>
                  <FormFieldLegend />

                  <PasswordField label="New Password" name="password" placeholder="Enter password" required />

                  <button type="submit" disabled={isSubmitting} className={`${authPrimaryBtnClass} mt-6`}>
                    {isSubmitting ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </span>
                    ) : (
                      'Continue'
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </>
        )}
        </AnimateStep>
        </div>
      </div>
    </div>
  );
}
