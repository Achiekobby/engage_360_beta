import { useState } from 'react';
import { Form, Formik, ErrorMessage, Field } from 'formik';
import { Loader2 } from 'lucide-react';
import { Reveal } from '../motion';
import PhoneInputField from '../auth/PhoneInputField';
import AuthFieldLabel from '../auth/AuthFieldLabel';
import FormFieldLegend from '../auth/FormFieldLegend';
import {
  authErrorClass,
  authInputClass,
  authPrimaryBtnClass,
} from '../auth/authStyles';
import { CONTACT_INITIAL_VALUES, contactSchema } from './contactValidation';
import ContactFormFooter from './ContactFormFooter';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Reveal variant="fadeUp" amount={0.15} delay={0.12} className="h-full">
      <div className="flex h-full flex-col rounded-2xl border border-[#E4E4E7] bg-white px-5 py-6 sm:px-8 sm:py-8">
        {submitted ? (
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <h2 className="text-xl font-bold text-[#0B1354]">Message received</h2>
            <p className="mt-2 text-sm text-[#717171]">
              Thanks for reaching out. Our team will get back to you shortly.
            </p>
          </div>
        ) : (
          <Formik
            initialValues={CONTACT_INITIAL_VALUES}
            validationSchema={contactSchema}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={async (_values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              await new Promise((r) => setTimeout(r, 900));
              setSubmitting(false);
              resetForm();
              setSubmitted(true);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex h-full flex-1 flex-col space-y-5">
                <FormFieldLegend />

                <div>
                  <AuthFieldLabel htmlFor="companyName" required>
                    Company Name
                  </AuthFieldLabel>
                  <Field
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder="Enter Business Name"
                    className={authInputClass}
                  />
                  <ErrorMessage name="companyName" component="p" className={authErrorClass} />
                </div>

                <div>
                  <AuthFieldLabel htmlFor="email" required>
                    Email Address
                  </AuthFieldLabel>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    className={authInputClass}
                  />
                  <ErrorMessage name="email" component="p" className={authErrorClass} />
                </div>

                <PhoneInputField label="Phone Number" name="phone" required />

                <button type="submit" disabled={isSubmitting} className={authPrimaryBtnClass}>
                  {isSubmitting ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    'Continue'
                  )}
                </button>

                <ContactFormFooter />
              </Form>
            )}
          </Formik>
        )}
      </div>
    </Reveal>
  );
}
