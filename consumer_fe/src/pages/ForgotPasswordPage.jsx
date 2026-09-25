import { useRef, useState } from 'react';
import { Form, Formik, ErrorMessage, Field } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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

function maskEmail(email = '') {
  if (!email || !email.includes('@')) return 'your email';
  const [local, domain] = email.split('@');
  if (local.length <= 1) return `*@${domain}`;
  return `${local[0]}${'*'.repeat(Math.min(local.length - 1, 4))}@${domain}`;
}

function OtpStep({ email, onComplete }) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);

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
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    onComplete();
  };

  return (
    <>
      <h1 className="text-xl font-bold text-[#0B1354] sm:text-2xl">Enter your code</h1>
      <p className="mt-2 text-sm text-[#717171]">
        A verification code has been sent to your email ending in{' '}
        <span className="font-semibold text-[#0B1354]">{maskEmail(email)}</span>
      </p>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="flex items-center justify-center gap-3">
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
              className="h-14 w-14 rounded-xl border border-[#E4E4E7] text-center text-xl font-semibold text-[#0B1354] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-[#717171]">
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
              Enter your email address and we&apos;ll send you a code to reset your password.
            </p>

            <Formik
              initialValues={{ email: '' }}
              validationSchema={forgotEmailSchema}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                await new Promise((r) => setTimeout(r, 800));
                setEmail(values.email);
                setSubmitting(false);
                setStep(1);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="mt-8 text-left">
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

        {step === 1 && <OtpStep email={email} onComplete={() => setStep(2)} />}

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
              onSubmit={async (_values, { setSubmitting }) => {
                setSubmitting(true);
                await new Promise((r) => setTimeout(r, 900));
                setSubmitting(false);
                navigate('/signin', { replace: true });
              }}
            >
              {({ isSubmitting }) => (
                <Form className="mt-8 text-left">
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
