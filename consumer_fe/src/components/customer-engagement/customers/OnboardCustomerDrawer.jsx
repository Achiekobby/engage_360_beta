import { useEffect, useMemo, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import SlideDrawer from './SlideDrawer';
import { useContactFields } from '../../../hooks/useContactFields';
import { fieldsForCustomerForm } from '../../../services/customer-engagement/contactFields';
import { SEGMENT_TAGS } from './collectionCustomersData';

const CHOICE_OPTIONS = {
  gender: ['Male', 'Female', 'Other'],
  customer_type: SEGMENT_TAGS,
};

function FieldLabel({ children, htmlFor, required }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-[#717171]">
      {children}
      {required ? <span className="ml-1 text-[#E53935]">*</span> : null}
    </label>
  );
}

const inputClass =
  'w-full rounded-sm border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#0B1354] outline-none transition-all placeholder:text-[#717171] focus:border-primary/40 focus:ring-2 focus:ring-primary/10';

function toPhoneValue(number) {
  if (!number) return '';
  const raw = String(number);
  if (raw.startsWith('+')) return raw;
  const digits = raw.replace(/\D/g, '');
  return digits ? `+${digits}` : '';
}

function optionValue(option) {
  if (option && typeof option === 'object') return String(option.value ?? option.id ?? option.label ?? '');
  return String(option ?? '');
}

function optionLabel(option) {
  if (option && typeof option === 'object') return String(option.label ?? option.name ?? option.value ?? '');
  return String(option ?? '');
}

function inputKind(field) {
  const type = String(field.type || '').toLowerCase();
  const key = field.key;
  if (type === 'phone' || key === 'phone_number' || key.endsWith('_phone')) return 'phone';
  if (type === 'email' || key === 'email') return 'email';
  if (type === 'date' || key === 'date_of_birth') return 'date';
  if (type === 'select' || (Array.isArray(field.options) && field.options.length) || CHOICE_OPTIONS[key]) {
    return 'select';
  }
  return 'text';
}

function choiceOptions(field) {
  if (Array.isArray(field.options) && field.options.length) return field.options;
  return CHOICE_OPTIONS[field.key] || [];
}

export function valuesFromCustomer(customer, fields = []) {
  if (!customer) return {};
  const custom = customer.custom_fields || {};
  const [firstFromName = '', ...restName] = String(customer.fullName || '').split(' ');
  const values = {};

  fields.forEach((field) => {
    if (field.key === 'first_name') {
      values[field.key] = customer.firstName || custom.first_name || firstFromName || '';
      return;
    }
    if (field.key === 'last_name') {
      values[field.key] = customer.lastName || custom.last_name || restName.join(' ') || '';
      return;
    }
    if (field.key === 'phone_number') {
      values[field.key] = toPhoneValue(customer.phone || custom.phone_number || '');
      return;
    }
    values[field.key] =
      customer[field.key] ||
      custom[field.key] ||
      (field.key === 'residential_location' ? customer.location : '') ||
      (field.key === 'customer_type' ? customer.segment : '') ||
      '';
  });

  return values;
}

export function contactFromFormValues(values = {}) {
  const firstName = String(values.first_name || '').trim();
  const lastName = String(values.last_name || '').trim();
  const phone = String(values.phone_number || '').replace(/\D/g, '');

  return {
    firstName,
    lastName,
    fullName: [firstName, lastName].filter(Boolean).join(' ') || 'Unknown',
    phone,
    email: values.email || '',
    gender: values.gender || '',
    region: values.region || '',
    location: values.residential_location || values.location || '',
    segment: values.customer_type || '',
    age: values.age_range || '',
    custom_fields: { ...values },
  };
}

export default function OnboardCustomerDrawer({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  contextLabel = '',
  uploadId = null,
}) {
  const contactFields = useContactFields(isOpen);
  const fields = useMemo(
    () => fieldsForCustomerForm(contactFields.data || {
      standard: contactFields.standard,
      recommended: contactFields.recommended,
      custom: contactFields.custom,
    }),
    [contactFields.custom, contactFields.data, contactFields.recommended, contactFields.standard],
  );
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (!isOpen) return;
    setValues(valuesFromCustomer(initialData, fields));
    setErrors({});
  }, [fields, initialData, isOpen]);

  const update = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  const handleSubmit = async () => {
    const nextErrors = {};
    fields.forEach((field) => {
      if (!field.required) return;
      if (!String(values[field.key] || '').trim()) nextErrors[field.key] = `Enter ${field.label}.`;
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        id: initialData?.id,
        values,
        uploadId,
      });
      onClose?.();
    } catch {
      // The page reports the failure.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SlideDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit customer' : 'Add customer'}
      subtitle={contextLabel || 'Fields follow the columns saved for your contacts.'}
      footer={
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || contactFields.isLoading}
          className="w-full cursor-pointer rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.25)] transition-all hover:bg-[#320EB8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add customer'}
        </button>
      }
    >
      <p className="mb-4 text-sm text-[#717171]">
        First name, last name, and phone number are always required. Any other column you saved is
        included here.
      </p>

      {contactFields.isLoading ? (
        <p className="text-sm font-medium text-[#0B1354]">Loading columns…</p>
      ) : (
        <div className="space-y-4">
          {fields.map((field) => {
            const kind = inputKind(field);
            const value = values[field.key] || '';
            const error = errors[field.key];

            return (
              <div key={field.key}>
                {kind === 'phone' ? (
                  <>
                    <FieldLabel htmlFor={field.key} required={field.required}>
                      {field.label}
                    </FieldLabel>
                    <PhoneInput
                      id={field.key}
                      defaultCountry="GH"
                      international
                      countryCallingCodeEditable={false}
                      placeholder="8023456789"
                      value={value || undefined}
                      onChange={(next) => update(field.key, next ?? '')}
                      className="ce-phone-input"
                    />
                  </>
                ) : kind === 'select' ? (
                  <>
                    <FieldLabel htmlFor={field.key} required={field.required}>
                      {field.label}
                    </FieldLabel>
                    <select
                      id={field.key}
                      value={value}
                      onChange={(event) => update(field.key, event.target.value)}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">Select {field.label}</option>
                      {choiceOptions(field).map((option) => (
                        <option key={optionValue(option)} value={optionValue(option)}>
                          {optionLabel(option)}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <FieldLabel htmlFor={field.key} required={field.required}>
                      {field.label}
                    </FieldLabel>
                    <input
                      id={field.key}
                      type={kind === 'email' ? 'email' : kind === 'date' ? 'date' : 'text'}
                      value={value}
                      onChange={(event) => update(field.key, event.target.value)}
                      placeholder={`Enter ${field.label}`}
                      className={inputClass}
                    />
                  </>
                )}
                {error ? <p className="mt-1 text-xs font-medium text-[#E53935]">{error}</p> : null}
              </div>
            );
          })}
        </div>
      )}
    </SlideDrawer>
  );
}
