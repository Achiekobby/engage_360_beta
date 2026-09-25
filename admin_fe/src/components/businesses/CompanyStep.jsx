import { PhoneField, TextField } from './fields';

export default function CompanyStep() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#0B1354]">Company details</h2>
        <p className="mt-1 text-sm text-[#717171]">
          These become the business profile and the primary contact on the account.
        </p>
      </div>

      <TextField label="Company name" name="companyName" placeholder="Enter company name" required />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PhoneField label="Company phone" name="companyPhone" required />
        <TextField label="Company email" name="companyEmail" type="email" placeholder="name@company.com" required />
      </div>

      <div className="border-t border-[#F0F2F7] pt-5">
        <h3 className="text-sm font-semibold text-[#0B1354]">Primary contact</h3>
        <p className="mt-1 text-sm text-[#717171]">The person who will use this account.</p>
      </div>

      <TextField
        label="Contact person name"
        name="contactPersonName"
        placeholder="Enter contact name"
        required
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PhoneField label="Contact phone" name="contactPhone" required />
        <TextField label="Contact email" name="contactEmail" type="email" placeholder="name@company.com" required />
      </div>
    </div>
  );
}
