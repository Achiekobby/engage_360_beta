import { Form, Formik, ErrorMessage, Field } from 'formik';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import SlideDrawer from './SlideDrawer';
import { createCategorySchema } from './customersFormValidation';

const EMPTY_VALUES = {
  name: '',
  description: '',
};

const fieldClass =
  'w-full rounded-sm border bg-white px-3.5 py-2.5 text-sm text-[#0B1354] outline-none transition-all placeholder:text-[#717171] focus:ring-2 disabled:cursor-not-allowed disabled:bg-[#FAFBFC]';

export default function CreateCustomerCategoryDrawer({
  isOpen,
  onClose,
  onSubmit,
  initialCategory = null,
}) {
  const isEdit = Boolean(initialCategory?.id);
  const initialValues = isEdit
    ? {
        name: initialCategory.name || '',
        description: initialCategory.description || '',
      }
    : EMPTY_VALUES;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={createCategorySchema}
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          await onSubmit?.({
            name: values.name.trim(),
            description: values.description.trim(),
          });
          resetForm();
          onClose();
        } catch {
          // Parent shows the error toast; keep the drawer open for edits.
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
            title={isEdit ? 'Edit Customer Category' : 'Create Customer Category'}
            footer={
              <button
                type="button"
                onClick={submitForm}
                disabled={isSubmitting}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all hover:bg-[#320EB8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                    {isEdit ? 'Saving...' : 'Creating...'}
                  </>
                ) : isEdit ? (
                  'Save Changes'
                ) : (
                  'Create'
                )}
              </button>
            }
          >
            <Form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label htmlFor="categoryName" className="block text-sm font-medium text-[#717171]">
                    Category Name <span className="text-[#E53935]">*</span>
                  </label>
                  <span className="text-xs text-[#9AA0B0]">{values.name.length}/80</span>
                </div>
                <Field
                  id="categoryName"
                  name="name"
                  type="text"
                  maxLength={80}
                  placeholder="e.g. Promotions"
                  disabled={isSubmitting}
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

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label
                    htmlFor="categoryDescription"
                    className="block text-sm font-medium text-[#717171]"
                  >
                    Description <span className="text-[#E53935]">*</span>
                  </label>
                  <span className="text-xs text-[#9AA0B0]">{values.description.length}/500</span>
                </div>
                <Field
                  as="textarea"
                  id="categoryDescription"
                  name="description"
                  maxLength={500}
                  rows={4}
                  placeholder="Describe what this category is for"
                  disabled={isSubmitting}
                  className={clsx(
                    fieldClass,
                    'resize-none',
                    errors.description && touched.description
                      ? 'border-[#FECACA] focus:border-[#F87171] focus:ring-[#FECACA]/40'
                      : 'border-[#E4E4E7] focus:border-primary/40 focus:ring-primary/10',
                  )}
                />
                <ErrorMessage
                  name="description"
                  component="p"
                  className="mt-1.5 text-xs text-[#E53935]"
                />
                <p className="mt-1.5 text-xs leading-relaxed text-[#9AA0B0]">
                  Add 10–500 characters so your team knows when to use this category.
                </p>
              </div>
            </Form>
          </SlideDrawer>
        );
      }}
    </Formik>
  );
}
