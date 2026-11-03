import { Form, Formik, ErrorMessage, Field } from 'formik';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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
  authPrimaryBtnClass,
} from '../components/auth/authStyles';
import { useAppDispatch } from '../store/hooks';
import { login, setPendingVerification } from '../store/slices/authSlice';
import { accountNeedsVerification, loginAccount, sessionFromLogin } from '../services/auth/login';
import { notifyError } from '../utils/toast';

const INITIAL_VALUES = {
  email: '',
  password: '',
  rememberMe: false,
};

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const redirectTo =
    location.state?.from && location.state.from !== '/signin' ? location.state.from : '/dashboard';

  return (
    <div className="min-h-screen lg:flex lg:h-screen lg:overflow-hidden">
      <SignInLeftPanel />

      <div
        data-app-scroll
        className="flex min-h-screen w-full flex-col bg-white lg:h-screen lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
      >
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 xl:px-16">
          <Reveal when="load" variant="fadeUp" delay={0.08} className="mx-auto w-full max-w-md sm:max-w-lg">
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
                  dispatch(
                    notifyError(error.message || 'Login could not be completed.', {
                      title: 'Login failed',
                    }),
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
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

                  <BackButton
                    label="Go back"
                    className="mt-1 w-full justify-center rounded-lg border border-[#E4E4E7] bg-white px-4 py-3 text-sm font-semibold text-[#0B1354] shadow-[0_1px_2px_rgba(11,19,84,0.04)] transition-all hover:border-primary/25 hover:bg-[#F7F8FF] hover:text-primary"
                  />
                </Form>
              )}
            </Formik>

            <p className="mt-8 text-center text-sm text-[#717171] lg:hidden">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-primary hover:text-primary/80">
                Sign up
              </Link>
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
