import { ErrorMessage, Field } from 'formik';
import PhoneInputField from '../PhoneInputField';
import AuthFieldLabel from '../AuthFieldLabel';
import FormFieldLegend from '../FormFieldLegend';
import { authErrorClass, authInputClass } from '../authStyles';

function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  className = '',
  required = true,
  optional = false,
}) {
  return (
    <div className={className}>
      <AuthFieldLabel htmlFor={name} required={required} optional={optional}>
        {label}
      </AuthFieldLabel>
      <Field id={name} name={name} type={type} placeholder={placeholder} className={authInputClass} />
      <ErrorMessage name={name} component="p" className={authErrorClass} />
    </div>
  );
}

export default function StepCompanyDetails() {
  return (
    <div className="space-y-4">
      <FormFieldLegend />

      <FormField label="Company Name" name="companyName" placeholder="Enter Company Name" required />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PhoneInputField label="Phone Number" name="companyPhone" required />
        <FormField label="Email" name="companyEmail" type="email" placeholder="Enter Email" required />
      </div>

      <FormField
        label="Contact Person Name"
        name="contactPersonName"
        placeholder="Enter Contact Person Name"
        required
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PhoneInputField label="Phone Number" name="contactPhone" required />
        <FormField label="Email" name="contactEmail" type="email" placeholder="Enter Email" required />
      </div>
    </div>
  );
}
