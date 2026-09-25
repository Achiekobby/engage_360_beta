import PasswordField from '../PasswordField';
import FormFieldLegend from '../FormFieldLegend';

export default function StepPasswordSetup() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[#0B1354]">Password Setup</h3>
        <p className="mt-1 text-sm text-[#717171]">Create a password</p>
      </div>

      <FormFieldLegend />

      <PasswordField label="Password" name="password" placeholder="Create a password" required />
      <PasswordField
        label="Confirm Password"
        name="confirmPassword"
        placeholder="Confirm your password"
        required
      />
    </div>
  );
}
