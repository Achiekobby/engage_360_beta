import { Form, Formik, ErrorMessage, Field } from 'formik';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import SlideDrawer from './SlideDrawer';
import { createCollectionSchema } from './customersFormValidation';

const INITIAL_VALUES = {
  name: '',
};

const fieldClass =
  'w-full rounded-sm border bg-white px-3.5 py-2.5 text-sm text-[#0B1354] outline-none transition-all placeholder:text-[#717171] focus:ring-2 disabled:cursor-not-allowed disabled:bg-[#FAFBFC]';

export default function AddCollectionDrawer({ isOpen, onClose, onSubmit, categoryName }) {
  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validationSchema={createCollectionSchema}
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize
      onSubmit={async (values, { setSubmitting, resetForm, setFieldError }) => {
        if (!categoryName) {
          setFieldError('name', 'Open a category before creating a collection.');
          setSubmitting(false);
          return;
        }

        try {
          await onSubmit?.(values.name.trim());
          resetForm();
          onClose();
        } catch {
          // Keep the drawer open if the parent rejects the create.
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, values, errors, touched, submitForm, resetForm, handleSubmit }) => {
        const closeDrawer = () => {
          if (isSubmitting) return;
          resetForm();
          onClose();
        };

        return (
          <SlideDrawer
            isOpen={isOpen}
            onClose={closeDrawer}
            title="Add Collection"
            footer={
              <button
                type="button"
                onClick={submitForm}
                disabled={isSubmitting || !categoryName}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all hover:bg-[#320EB8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            }
          >
            <Form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <p className="mb-1.5 text-sm font-medium text-[#717171]">
                  Category <span className="text-[#E53935]">*</span>
                </p>
                <div className="rounded-sm border border-[#E4E4E7] bg-[#FAFBFC] px-3.5 py-2.5 text-sm font-semibold text-[#0B1354]">
                  {categoryName || 'Select a category first'}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#717171]">
                  This collection is created inside the category. Contacts are stored in the
                  collection.
                </p>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label
                    htmlFor="collectionName"
                    className="block text-sm font-medium text-[#717171]"
                  >
                    Collection Name <span className="text-[#E53935]">*</span>
                  </label>
                  <span className="text-xs text-[#9AA0B0]">{values.name.length}/80</span>
                </div>
                <Field
                  id="collectionName"
                  name="name"
                  type="text"
                  maxLength={80}
                  placeholder="e.g. VIP Members"
                  disabled={isSubmitting || !categoryName}
                  className={clsx(
                    fieldClass,
                    errors.name && touched.name
                      ? 'border-[#FECACA] focus:border-[#F87171] focus:ring-[#FECACA]/40'
                      : 'border-[#E4E4E7] focus:border-primary/40 focus:ring-primary/10',
                  )}
                />
                <ErrorMessage name="name" component="p" className="mt-1.5 text-xs text-[#E53935]" />
                <p className="mt-1.5 text-xs leading-relaxed text-[#9AA0B0]">
                  2–80 characters. Letters, numbers, spaces, and - _ &apos; &amp; ( ) / are allowed.
                </p>
              </div>
            </Form>
          </SlideDrawer>
        );
      }}
    </Formik>
  );
}
