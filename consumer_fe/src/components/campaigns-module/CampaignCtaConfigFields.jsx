import { Link2, MessageCircle, Phone } from 'lucide-react';
import { clsx } from 'clsx';
import { FieldError, FieldLabel, inputClassName } from './WizardFormField';
import { CTA_DESTINATION_TYPES, getCtaDestinationType } from './campaignsData';

const TYPE_ICONS = {
  url: Link2,
  phone: Phone,
  whatsapp: MessageCircle,
};

const DEFAULT_HELP = {
  cta: 'The button or link text customers see — e.g. Learn More, Order Now, Call Now.',
  ctaType:
    'Payments are not processed on Engage 360. Choose how the CTA connects customers off-platform.',
  ctaValue: 'The destination linked to this call to action.',
};

/**
 * CTA label + off-platform destination (URL / phone / WhatsApp).
 * Used by Promotions, Advertisement, Service Alerts, Sales, and Events.
 */
export default function CampaignCtaConfigFields({
  cta,
  ctaType = 'url',
  ctaValue = '',
  errors = {},
  onUpdate,
  ctaPlaceholder = 'Learn More',
  ctaLabel = 'Call to Action',
  idPrefix = 'cta',
  layout = 'stacked',
  help = DEFAULT_HELP,
}) {
  const destination = getCtaDestinationType(ctaType);
  const isSplit = layout === 'split';

  const labelField = (
    <div>
      <FieldLabel htmlFor={`${idPrefix}-label`} help={help.cta}>
        {ctaLabel}
      </FieldLabel>
      <input
        id={`${idPrefix}-label`}
        value={cta}
        onChange={(event) => onUpdate('cta', event.target.value)}
        placeholder={ctaPlaceholder}
        className={inputClassName(errors.cta)}
        aria-invalid={Boolean(errors.cta)}
      />
      <FieldError message={errors.cta} />
    </div>
  );

  const destinationBlock = (
    <div className="space-y-4">
      <div>
        <FieldLabel help={help.ctaType}>CTA Destination</FieldLabel>
        <div
          className={clsx(
            'grid gap-2 rounded-sm border p-2 sm:grid-cols-3',
            errors.ctaType ? 'border-[#E5484D] bg-[#FFF5F5]' : 'border-[#EEF0F4] bg-[#FAFBFC]',
          )}
          role="radiogroup"
          aria-label="CTA destination type"
        >
          {CTA_DESTINATION_TYPES.map((option) => {
            const Icon = TYPE_ICONS[option.id];
            const selected = ctaType === option.id;

            return (
              <label
                key={option.id}
                className={clsx(
                  'flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors',
                  selected
                    ? 'bg-white text-primary shadow-sm ring-1 ring-primary/25'
                    : 'text-[#545454] hover:bg-white hover:text-[#0B1354]',
                )}
              >
                <input
                  type="radio"
                  name={`${idPrefix}-destination-type`}
                  className="sr-only"
                  checked={selected}
                  onChange={() => {
                    onUpdate('ctaType', option.id);
                    if (ctaType !== option.id) onUpdate('ctaValue', '');
                  }}
                />
                <span
                  className={clsx(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2',
                    selected ? 'border-primary' : 'border-[#C8CDD8]',
                  )}
                >
                  {selected ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                </span>
                <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
                <span className="leading-tight">{option.label}</span>
              </label>
            );
          })}
        </div>
        <FieldError message={errors.ctaType} />
      </div>

      <div>
        <FieldLabel
          htmlFor={`${idPrefix}-destination-value`}
          help={destination.help || help.ctaValue}
        >
          {destination.label}
        </FieldLabel>
        <input
          id={`${idPrefix}-destination-value`}
          type={destination.inputType}
          value={ctaValue}
          onChange={(event) => onUpdate('ctaValue', event.target.value)}
          placeholder={destination.placeholder}
          className={inputClassName(errors.ctaValue)}
          aria-invalid={Boolean(errors.ctaValue)}
          autoComplete={ctaType === 'url' ? 'url' : 'tel'}
        />
        <FieldError message={errors.ctaValue} />
      </div>
    </div>
  );

  if (isSplit) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
        {labelField}
        {destinationBlock}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {labelField}
      {destinationBlock}
    </div>
  );
}
