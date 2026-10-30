import { useEffect, useState } from 'react';
import { ErrorMessage, Field, FieldArray, useFormikContext } from 'formik';
import { CloudUpload, Plus, Trash2 } from 'lucide-react';
import AuthFieldLabel from '../AuthFieldLabel';
import { authErrorClass, authInputClass } from '../authStyles';
import { SOCIAL_PLATFORMS } from './signupStepsData';

export default function StepAdditionalDetails() {
  const { setFieldValue, values } = useFormikContext();
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (!values.companyLogo) {
      setLogoPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(values.companyLogo);
    setLogoPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [values.companyLogo]);

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setFieldValue('companyLogo', file);
  };

  return (
    <div className="space-y-5">
      <p className="text-xs text-[#717171]">All fields on this step are optional.</p>

      <div>
        <AuthFieldLabel optional>Company Logo</AuthFieldLabel>
        <label className="mt-1.5 flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#D4D4D8] bg-[#FAFAFA] px-6 py-8 transition-colors hover:border-primary/30 hover:bg-primary/[0.02]">
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Company logo preview"
              className="mb-3 h-24 w-24 rounded-lg object-cover shadow-sm"
            />
          ) : (
            <CloudUpload className="h-8 w-8 text-[#A1A1AA]" strokeWidth={1.5} />
          )}
          <span className="text-sm font-medium text-[#0B1354]">
            {values.companyLogo ? values.companyLogo.name : 'Upload company logo'}
          </span>
          <span className="mt-1 text-xs text-[#717171]">PNG, JPG up to 5MB</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={handleLogoChange}
          />
        </label>
        <ErrorMessage name="companyLogo" component="p" className={authErrorClass} />
      </div>

      <FieldArray name="socialLinks">
        {({ push, remove }) => (
          <div className="space-y-3">
            {values.socialLinks.map((link, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <AuthFieldLabel htmlFor={`socialLinks.${index}.platform`} optional>
                      Social Media Name
                    </AuthFieldLabel>
                    <Field
                      as="select"
                      id={`socialLinks.${index}.platform`}
                      name={`socialLinks.${index}.platform`}
                      className={authInputClass}
                    >
                      <option value="">Select platform</option>
                      {SOCIAL_PLATFORMS.map((platform) => (
                        <option key={platform} value={platform}>
                          {platform}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div>
                    <AuthFieldLabel htmlFor={`socialLinks.${index}.url`} optional>
                      Attach Link
                    </AuthFieldLabel>
                    <Field
                      id={`socialLinks.${index}.url`}
                      name={`socialLinks.${index}.url`}
                      type="url"
                      placeholder="https://"
                      className={authInputClass}
                    />
                    <ErrorMessage name={`socialLinks.${index}.url`} component="p" className={authErrorClass} />
                  </div>
                </div>

                {values.socialLinks.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mb-0.5 flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg border border-[#E4E4E7] text-[#717171] transition-colors hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive cursor-pointer"
                    aria-label="Remove social link"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            ))}

            <button
              type="button"
              onClick={() => push({ platform: '', url: '' })}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Another
            </button>
          </div>
        )}
      </FieldArray>
    </div>
  );
}
