import { Form, Formik, ErrorMessage, Field } from 'formik';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Reveal } from '../components/motion';
import LogoMark from '../components/brand/LogoMark';
import SignInLeftPanel from '../components/auth/signin/SignInLeftPanel';
import PasswordField from '../components/auth/PasswordField';
import BackButton from '../components/auth/BackButton';
import AuthFieldLabel from '../components/auth/AuthFieldLabel';
import FormFieldLegend from '../components/auth/FormFieldLegend';
import { signInSchema } from '../components/auth/signin/signInValidation';
import {
  authErrorClass,
  authInputClass,
  authPageBgClass,
  authPrimaryBtnClass,
} from '../components/auth/authStyles';
import { useAppDispatch } from '../store/hooks';
import { login, setPendingVerification } from '../store/slices/authSlice';
import { accountNeedsVerification, loginAccount, sessionFromLogin } from '../services/auth/login';

const INITIAL_VALUES = {
  email: '',
  password: '',
  rememberMe: false,
};

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [authError, setAuthError] = useState('');
  const redirectTo =
    location.state?.from && location.state.from !== '/signin' ? location.state.from : '/dashboard';

  return (
    <div className={`flex items-center justify-center px-4 py-10 ${authPageBgClass}`}>
      <div className="w-full max-w-4xl">
        <div className="mb-4 flex justify-end">
          <BackButton />
        </div>

        <div className="flex items-stretch max-lg:flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(11,19,84,0.08)] lg:min-h-[520px]">
          <SignInLeftPanel />

          <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 sm:py-12">
            <Reveal when="load" variant="fadeUp" delay={0.08} className="mx-auto w-full max-w-sm">
              <div className="mb-8 flex flex-col items-center text-center">
                <LogoMark size={56} variant="on-white" />
                <h1 className="mt-4 text-xl font-bold text-[#0B1354] sm:text-2xl">
                  Login into your account
                </h1>
                <p className="mt-2 text-sm text-[#717171]">Use the main email for your account.</p>
              </div>

              <Formik
                initialValues={INITIAL_VALUES}
                validationSchema={signInSchema}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={async (values, { setSubmitting }) => {
                  setAuthError('');
                  setSubmitting(true);
                  try {
                    const result = await loginAccount(values);
                    const session = sessionFromLogin(result, values.email.trim());
                    if (accountNeedsVerification(result)) {
                      dispatch(setPendingVerification(session));
                      navigate('/verify-otp', {
                        replace: true,
                        state: { email: session.email, requestNewCode: true },
                      });
                      return;
                    }
                    dispatch(login(session));
                    navigate(redirectTo, { replace: true });
                  } catch (error) {
                    setAuthError(error.message || 'Login could not be completed.');
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    {authError ? (
                      <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-sm text-[#B91C1C]">
                        {authError}
                      </p>
                    ) : null}
                    <FormFieldLegend />

                    <div>
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
                    </div>

                    <PasswordField
                      label="Password"
                      name="password"
                      placeholder="Enter password"
                      showForgotLink
                      required
                    />

               

                    <button type="submit" disabled={isSubmitting} className={authPrimaryBtnClass}>
                      {isSubmitting ? (
                        <span className="inline-flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Logging in...
                        </span>
                      ) : (
                        'Login'
                      )}
                    </button>
                  </Form>
                )}
              </Formik>
            </Reveal>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-[#717171]">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:text-primary/80">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
