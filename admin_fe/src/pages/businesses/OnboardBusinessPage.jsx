import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Formik, setIn } from 'formik';
import { Loader2 } from 'lucide-react';
import { PageHeading } from '../../components/layout/PageBackLink';
import { useAppDispatch } from '../../store/hooks';
import { addBusiness } from '../../store/slices/businessesSlice';
import { AnimateStep } from '../../components/motion';
import CompanyStep from '../../components/businesses/CompanyStep';
import ProfileStep from '../../components/businesses/ProfileStep';
import AccessStep from '../../components/businesses/AccessStep';
import OnboardingStepper from '../../components/businesses/OnboardingStepper';
import OnboardingSuccessModal from '../../components/businesses/OnboardingSuccessModal';
import { STEP_SCHEMAS, collectStepErrors } from '../../components/businesses/onboardingValidation';
import { ONBOARDING_INITIAL_VALUES, ONBOARDING_STEPS } from '../../constants/businesses';

const STEP_COMPONENTS = [CompanyStep, ProfileStep, AccessStep];

function readLogo(file) {
  if (!file) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function OnboardBusinessPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [created, setCreated] = useState(null);
  const StepForm = STEP_COMPONENTS[step];
  const isLastStep = step === ONBOARDING_STEPS.length - 1;

  const goToStep = (next) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <PageHeading
        title="Onboard a business"
        description="Create the account directly. The business is active as soon as you finish, with the password you set here."
        backTo="/businesses"
        backLabel="Businesses"
      />

      <div className="mt-8 rounded-2xl border border-[#EEF0F4] bg-white p-5 shadow-[0_8px_30px_rgba(11,19,84,0.04)] sm:p-8">
        <OnboardingStepper step={step} onStepSelect={goToStep} />

        <Formik
          initialValues={ONBOARDING_INITIAL_VALUES}
          validationSchema={STEP_SCHEMAS[step]}
          validateOnBlur
          validateOnChange
          onSubmit={() => {}}
        >
          {({ values, isSubmitting, setSubmitting, setErrors, setFieldTouched, setFieldError }) => {
            const validateCurrentStep = async () => {
              const errors = await collectStepErrors(STEP_SCHEMAS[step], values);
              const paths = Object.keys(errors);
              if (!paths.length) {
                setErrors({});
                return true;
              }
              paths.forEach((path) => setFieldTouched(path, true, false));
              setErrors(paths.reduce((acc, path) => setIn(acc, path, errors[path]), {}));
              const focusId = paths[0].replace(/\[(\d+)\]/g, '.$1');
              document.getElementById(focusId)?.focus();
              return false;
            };

            const handleContinue = async () => {
              const valid = await validateCurrentStep();
              if (!valid) return;
              if (!isLastStep) {
                goToStep(step + 1);
                return;
              }

              setSubmitting(true);
              try {
                const logoDataUrl = await readLogo(values.companyLogo);
                const business = {
                  id: crypto.randomUUID(),
                  companyName: values.companyName.trim(),
                  companyEmail: values.companyEmail.trim(),
                  companyPhone: values.companyPhone,
                  contactPersonName: values.contactPersonName.trim(),
                  contactPhone: values.contactPhone,
                  contactEmail: values.contactEmail.trim(),
                  logoDataUrl,
                  socialLinks: values.socialLinks.filter((link) => link.platform && link.url),
                  status: 'active',
                  onboardedAt: new Date().toISOString(),
                  credentialsSet: true,
                };
                dispatch(addBusiness(business));
                setCreated(business);
              } catch {
                setFieldError('companyLogo', 'The logo could not be read. Try another image.');
                goToStep(1);
              } finally {
                setSubmitting(false);
              }
            };

            return (
              <Form
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  handleContinue();
                }}
              >
                <AnimateStep stepKey={step} direction={direction}>
                  <StepForm />
                </AnimateStep>

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#F0F2F7] pt-6 sm:flex-row sm:items-center sm:justify-between">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => goToStep(step - 1)}
                      className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0B1354] transition-colors hover:bg-[#F4F4F5]"
                    >
                      Back
                    </button>
                  ) : (
                    <span className="hidden text-xs text-[#717171] sm:block">Required fields are marked *</span>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-40"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating
                      </>
                    ) : isLastStep ? (
                      'Onboard business'
                    ) : (
                      'Continue'
                    )}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>

      <OnboardingSuccessModal
        business={created}
        onView={() => navigate(`/businesses/${created.id}`)}
        onBackToList={() => navigate('/businesses')}
      />
    </div>
  );
}
