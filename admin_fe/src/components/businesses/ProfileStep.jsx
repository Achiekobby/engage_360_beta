import { useEffect, useState } from 'react';
import { Field, FieldArray, useFormikContext } from 'formik';
import { CloudUpload, Plus, Trash2 } from 'lucide-react';
import { SOCIAL_PLATFORMS } from '../../constants/businesses';
import { FieldLabel, fieldErrorClass, fieldInputClass } from './fields';

export default function ProfileStep() {
  const { setFieldValue, values, errors, touched } = useFormikContext();
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoError, setLogoError] = useState('');

  useEffect(() => {
    if (!values.companyLogo) {
      setLogoPreview(null);
      return undefined;
    }

    const previewUrl = URL.createObjectURL(values.companyLogo);
    setLogoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [values.companyLogo]);

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setFieldValue('companyLogo', null);
      setLogoError('');
      return;
    }
    if (file.size > 1_500_000) {
      setLogoError('Logo must be under 1.5MB');
      event.target.value = '';
      return;
    }
    setLogoError('');
    setFieldValue('companyLogo', file);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#0B1354]">Profile</h2>
        <p className="mt-1 text-sm text-[#717171]">
          Optional. You can onboard the business now and add a logo or social links later.
        </p>
      </div>

      <div>
        <FieldLabel optional>Company logo</FieldLabel>
        <label className="mt-1.5 flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#D4D4D8] bg-[#FAFBFC] px-6 py-8 transition-colors hover:border-primary/30 hover:bg-primary/[0.02]">
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Company logo preview"
              className="mb-3 h-20 w-20 rounded-lg object-cover shadow-sm"
            />
          ) : (
            <CloudUpload className="h-8 w-8 text-[#A1A1AA]" strokeWidth={1.5} />
          )}
          <span className="text-sm font-medium text-[#0B1354]">
            {values.companyLogo ? values.companyLogo.name : 'Upload company logo'}
          </span>
          <span className="mt-1 text-xs text-[#717171]">PNG, JPG, or WebP up to 1.5MB</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={handleLogoChange}
          />
        </label>
        {logoError ? <p className={fieldErrorClass}>{logoError}</p> : null}
      </div>

      <FieldArray name="socialLinks">
        {({ push, remove }) => (
          <div className="space-y-3">
            <FieldLabel optional>Social links</FieldLabel>
            {values.socialLinks.map((link, index) => {
              const platformError = touched.socialLinks?.[index]?.platform
                ? errors.socialLinks?.[index]?.platform
                : null;
              const urlError = touched.socialLinks?.[index]?.url ? errors.socialLinks?.[index]?.url : null;

              return (
                <div key={index} className="flex items-start gap-2">
                  <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`socialLinks.${index}.platform`} className="sr-only">
                        Social platform
                      </label>
                      <Field
                        as="select"
                        id={`socialLinks.${index}.platform`}
                        name={`socialLinks.${index}.platform`}
                        className={fieldInputClass}
                      >
                        <option value="">Select platform</option>
                        {SOCIAL_PLATFORMS.map((platform) => (
                          <option key={platform} value={platform}>
                            {platform}
                          </option>
                        ))}
                      </Field>
                      {platformError ? <p className={fieldErrorClass}>{platformError}</p> : null}
                    </div>
                    <div>
                      <label htmlFor={`socialLinks.${index}.url`} className="sr-only">
                        Social link
                      </label>
                      <Field
                        id={`socialLinks.${index}.url`}
                        name={`socialLinks.${index}.url`}
                        type="url"
                        placeholder="https://"
                        className={fieldInputClass}
                      />
                      {urlError ? <p className={fieldErrorClass}>{urlError}</p> : null}
                    </div>
                  </div>

                  {values.socialLinks.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#E4E4E7] text-[#717171] transition-colors hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
                      aria-label="Remove social link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => push({ platform: '', url: '' })}
              className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
            >
              <Plus className="h-4 w-4" />
              Add another
            </button>
          </div>
        )}
      </FieldArray>
    </div>
  );
}
