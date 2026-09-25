import { useState } from 'react';
import { Form, Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { setPendingVerification } from '../store/slices/authSlice';
import { AnimateStep, Reveal } from '../components/motion';
import LogoMark from '../components/brand/LogoMark';
import SignUpLeftPanel from '../components/auth/signup/SignUpLeftPanel';
import SignUpProgress from '../components/auth/signup/SignUpProgress';
import BackButton from '../components/auth/BackButton';
import StepCompanyDetails from '../components/auth/signup/StepCompanyDetails';
import StepAdditionalDetails from '../components/auth/signup/StepAdditionalDetails';
import StepPasswordSetup from '../components/auth/signup/StepPasswordSetup';
import {
  SIGNUP_INITIAL_VALUES,
  SIGNUP_STEP_META,
} from '../components/auth/signup/signupStepsData';
import { STEP_SCHEMAS } from '../components/auth/signup/signupValidation';
import {
  authPrimaryBtnClass,
  authSecondaryBtnClass,
} from '../components/auth/authStyles';

const STEP_COMPONENTS = [StepCompanyDetails, StepAdditionalDetails, StepPasswordSetup];

export default function SignUpPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const panel = SIGNUP_STEP_META[activeStep];
  const StepForm = STEP_COMPONENTS[activeStep];
  const completedCount = activeStep;

  return (
    <div className="min-h-screen lg:flex lg:h-screen lg:overflow-hidden">
      <SignUpLeftPanel
        panel={panel}
        activeStep={activeStep}
        totalSteps={SIGNUP_STEP_META.length}
      />

      <div className="flex min-h-screen w-full flex-col bg-white lg:h-screen lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 xl:px-16">
          <BackButton className="mb-6 ml-auto self-end" />

          <Reveal when="load" variant="fadeUp" delay={0.05}>
            <div className="mb-6 flex flex-col items-center text-center">
              <LogoMark size={56} variant="on-white" />
              <h1 className="mt-4 text-xl font-bold text-[#0B1354] sm:text-2xl">Create Account</h1>
            </div>
          </Reveal>

          <SignUpProgress
            steps={SIGNUP_STEP_META}
            activeStep={activeStep}
            completedCount={completedCount}
          />

          <Formik
            initialValues={SIGNUP_INITIAL_VALUES}
            validationSchema={STEP_SCHEMAS[activeStep]}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={async (values, { setSubmitting }) => {
              if (activeStep < SIGNUP_STEP_META.length - 1) {
                setActiveStep((s) => s + 1);
                return;
              }

              setSubmitting(true);
              await new Promise((r) => setTimeout(r, 900));
              setSubmitting(false);

              const phone = values.contactPhone || values.companyPhone;
              const email = values.contactEmail || values.companyEmail;

              dispatch(setPendingVerification({ phone, email }));

              navigate('/verify-otp', {
                state: { phone, email },
              });
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <AnimateStep stepKey={activeStep}>
                  <StepForm />
                </AnimateStep>

                <div className="mt-8 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={authPrimaryBtnClass}
                  >
                    {isSubmitting && activeStep === SIGNUP_STEP_META.length - 1 ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      'Continue'
                    )}
                  </button>

                  {activeStep > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveStep((s) => s - 1)}
                      className={authSecondaryBtnClass}
                    >
                      Back
                    </button>
                  )}
                </div>
              </Form>
            )}
          </Formik>

          <p className="mt-6 text-center text-sm text-[#717171] lg:hidden">
            Already have an account?{' '}
            <Link to="/signin" className="font-semibold text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
