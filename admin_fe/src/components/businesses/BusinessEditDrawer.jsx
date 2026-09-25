import { Form, Formik } from 'formik';
import { companySchema } from './onboardingValidation';
import { PhoneField, TextField } from './fields';
import SlideOver from './SlideOver';
import { useAppDispatch } from '../../store/hooks';
import { updateBusiness } from '../../store/slices/businessesSlice';

export default function BusinessEditDrawer({ business, onClose }) {
  const dispatch = useAppDispatch();

  return (
    <SlideOver open={Boolean(business)} onClose={onClose} title="Edit business">
      {business ? (
        <Formik
          enableReinitialize
          initialValues={{
            companyName: business.companyName,
            companyPhone: business.companyPhone,
            companyEmail: business.companyEmail,
            contactPersonName: business.contactPersonName,
            contactPhone: business.contactPhone,
            contactEmail: business.contactEmail,
          }}
          validationSchema={companySchema}
          onSubmit={(values) => {
            dispatch(
              updateBusiness({
                id: business.id,
                changes: {
                  companyName: values.companyName.trim(),
                  companyPhone: values.companyPhone,
                  companyEmail: values.companyEmail.trim(),
                  contactPersonName: values.contactPersonName.trim(),
                  contactPhone: values.contactPhone,
                  contactEmail: values.contactEmail.trim(),
                },
              }),
            );
            onClose();
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex min-h-0 flex-1 flex-col" noValidate>
              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                <p className="text-sm text-[#717171]">
                  Update company and contact details for {business.companyName}.
                </p>
                <TextField label="Company name" name="companyName" required />
                <PhoneField label="Company phone" name="companyPhone" required />
                <TextField label="Company email" name="companyEmail" type="email" required />
                <TextField label="Contact person" name="contactPersonName" required />
                <PhoneField label="Contact phone" name="contactPhone" required />
                <TextField label="Contact email" name="contactEmail" type="email" required />
              </div>
              <div className="flex justify-end gap-2 border-t border-[#F0F2F7] px-5 py-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0B1354] hover:bg-[#F4F4F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
                >
                  Save changes
                </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : null}
    </SlideOver>
  );
}
