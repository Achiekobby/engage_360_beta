import { useEffect, useMemo, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import SlideDrawer from './SlideDrawer';
import { FORM_OPTIONS } from './collectionCustomersData';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  gender: '',
  phone: '',
  whatsapp: '',
  region: '',
  location: '',
  segment: '',
  category: '',
  subCategory: '',
};

function FieldLabel({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-[#717171]">
      {children}
    </label>
  );
}

function SelectField({ id, label, value, onChange, options, placeholder }) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full cursor-pointer rounded-sm border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#0B1354] outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({ id, label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-sm border border-[#E4E4E7] bg-white px-3.5 py-2.5 text-sm text-[#0B1354] outline-none transition-all placeholder:text-[#717171] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
      />
    </div>
  );
}

function toPhoneValue(number) {
  if (!number) return '';
  const digits = String(number).replace(/\D/g, '');
  return digits ? `+${digits}` : '';
}

export default function OnboardCustomerDrawer({ isOpen, onClose, onSubmit, initialData = null }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        gender: initialData.gender || '',
        phone: toPhoneValue(initialData.phone),
        whatsapp: toPhoneValue(initialData.whatsapp),
        region: initialData.region || '',
        location: initialData.location || '',
        segment: initialData.segment || '',
        category: initialData.category || '',
        subCategory: initialData.subCategory || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setStep(1);
  }, [isOpen, initialData]);

  const subCategoryOptions = useMemo(
    () => FORM_OPTIONS.subCategories[form.category] || [],
    [form.category],
  );

  const handleClose = () => {
    onClose();
  };

  const update = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'category') next.subCategory = '';
      return next;
    });
  };

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    onSubmit?.({
      ...form,
      id: initialData?.id,
    });
    onClose();
  };

  const stepSubtitle = step === 1 ? 'Personal information' : 'Customer Segment & Interest';

  return (
    <SlideDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? 'Edit Customer' : 'Onboard Customer'}
      subtitle={stepSubtitle}
      footer={
        <button
          type="button"
          onClick={handleContinue}
          className="w-full cursor-pointer rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.25)] transition-all hover:bg-[#320EB8]"
        >
          {step === 1 ? 'Continue' : isEdit ? 'Save Changes' : 'Add Customer'}
        </button>
      }
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EDE8F8]">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>
        <span className="shrink-0 text-sm font-semibold text-primary">Step {step} of 2</span>
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <TextField
            id="fullName"
            label="Full Name"
            value={form.fullName}
            onChange={(value) => update('fullName', value)}
            placeholder="Enter Full Name"
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => update('email', value)}
            placeholder="Enter Email"
          />
          <SelectField
            id="gender"
            label="Gender"
            value={form.gender}
            onChange={(value) => update('gender', value)}
            options={FORM_OPTIONS.genders}
            placeholder="Select Gender"
          />
          <div>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <PhoneInput
              id="phone"
              defaultCountry="GH"
              international
              countryCallingCodeEditable={false}
              placeholder="8023456789"
              value={form.phone || undefined}
              onChange={(value) => update('phone', value ?? '')}
              className="ce-phone-input"
            />
          </div>
          <div>
            <FieldLabel htmlFor="whatsapp">WhatsApp Number</FieldLabel>
            <PhoneInput
              id="whatsapp"
              defaultCountry="GH"
              international
              countryCallingCodeEditable={false}
              placeholder="8023456789"
              value={form.whatsapp || undefined}
              onChange={(value) => update('whatsapp', value ?? '')}
              className="ce-phone-input"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <SelectField
            id="region"
            label="Region"
            value={form.region}
            onChange={(value) => update('region', value)}
            options={FORM_OPTIONS.regions}
            placeholder="Select Customer Region"
          />
          <SelectField
            id="location"
            label="Location"
            value={form.location}
            onChange={(value) => update('location', value)}
            options={FORM_OPTIONS.locations}
            placeholder="Select Customer Town/City"
          />
          <SelectField
            id="segment"
            label="Customer Segment"
            value={form.segment}
            onChange={(value) => update('segment', value)}
            options={FORM_OPTIONS.segments}
            placeholder="Select"
          />
          <SelectField
            id="category"
            label="Customer Category"
            value={form.category}
            onChange={(value) => update('category', value)}
            options={FORM_OPTIONS.categories}
            placeholder="Select"
          />
          <SelectField
            id="subCategory"
            label="Customer Sub-Category"
            value={form.subCategory}
            onChange={(value) => update('subCategory', value)}
            options={subCategoryOptions}
            placeholder="Select"
          />
        </div>
      )}
    </SlideDrawer>
  );
}
