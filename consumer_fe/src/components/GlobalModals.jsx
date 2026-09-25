import { Loader2, X } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  closeCampaignModal,
  closeLoginModal,
} from '../store/slices/uiSlice';
import { AnimatedModal } from './motion';

const campaignSchema = Yup.object({
  campaignName: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .required('Campaign name is required'),
  campaignChannel: Yup.string()
    .oneOf(['email', 'sms', 'whatsapp'], 'Select a valid channel')
    .required('Channel is required'),
});

const loginSchema = Yup.object({
  demoName: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  demoEmail: Yup.string()
    .trim()
    .email('Enter a valid email')
    .required('Email is required'),
});

function ModalShell({ isOpen, onClose, title, children }) {
  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      backdropClassName="absolute inset-0 bg-black/50 backdrop-blur-sm"
      panelClassName="relative bg-card text-foreground max-w-md w-full overflow-hidden rounded-xl border border-border shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-border p-6">
        <h3 id="modal-title" className="font-heading text-lg font-bold">
          {title}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </AnimatedModal>
  );
}

const inputClass =
  'w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground';
const errorClass = 'text-destructive text-xs mt-1';
const labelClass = 'block text-sm font-medium text-muted-foreground mb-1';

export default function GlobalModals() {
  const dispatch = useAppDispatch();
  const { campaignModalOpen, loginModalOpen } = useAppSelector((state) => state.ui);

  return (
    <>
      <ModalShell
        isOpen={campaignModalOpen}
        onClose={() => dispatch(closeCampaignModal())}
        title="Create New Campaign"
      >
        <Formik
          initialValues={{ campaignName: '', campaignChannel: 'email' }}
          validationSchema={campaignSchema}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            await new Promise((r) => setTimeout(r, 1200));
            setSubmitting(false);
            resetForm();
            dispatch(closeCampaignModal());
            alert('Campaign created successfully!');
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="campaignName" className={labelClass}>Campaign Name</label>
                <Field
                  id="campaignName"
                  name="campaignName"
                  type="text"
                  placeholder="e.g. Summer Sale 2025"
                  className={inputClass}
                />
                <ErrorMessage name="campaignName" component="p" className={errorClass} />
              </div>
              <div>
                <label htmlFor="campaignChannel" className={labelClass}>Primary Channel</label>
                <Field as="select" id="campaignChannel" name="campaignChannel" className={inputClass}>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                </Field>
                <ErrorMessage name="campaignChannel" component="p" className={errorClass} />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Launch Campaign'
                )}
              </button>
            </Form>
          )}
        </Formik>
      </ModalShell>

      <ModalShell
        isOpen={loginModalOpen}
        onClose={() => dispatch(closeLoginModal())}
        title="Book a Live Demo"
      >
        <Formik
          initialValues={{ demoName: '', demoEmail: '' }}
          validationSchema={loginSchema}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            await new Promise((r) => setTimeout(r, 1200));
            setSubmitting(false);
            resetForm();
            dispatch(closeLoginModal());
            alert('Demo booked successfully! We will reach out shortly.');
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="demoName" className={labelClass}>Full Name</label>
                <Field
                  id="demoName"
                  name="demoName"
                  type="text"
                  placeholder="John Doe"
                  className={inputClass}
                />
                <ErrorMessage name="demoName" component="p" className={errorClass} />
              </div>
              <div>
                <label htmlFor="demoEmail" className={labelClass}>Work Email</label>
                <Field
                  id="demoEmail"
                  name="demoEmail"
                  type="email"
                  placeholder="john@company.com"
                  className={inputClass}
                />
                <ErrorMessage name="demoEmail" component="p" className={errorClass} />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  'Schedule Demo'
                )}
              </button>
            </Form>
          )}
        </Formik>
      </ModalShell>
    </>
  );
}
