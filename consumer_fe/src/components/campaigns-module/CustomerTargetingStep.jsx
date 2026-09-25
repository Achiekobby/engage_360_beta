import { Download } from 'lucide-react';
import { clsx } from 'clsx';
import { FieldError, FieldLabel, inputClassName } from './WizardFormField';
import CustomerListUploadZone from './CustomerListUploadZone';
import CustomerSegmentationSection from './CustomerSegmentationSection';
import {
  CUSTOMER_CATEGORIES,
  CUSTOMER_COLLECTIONS,
} from './campaignsData';

function SectionTitle({ children }) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-primary">{children}</h3>
      <div className="mt-2 h-px bg-gradient-to-r from-[#8B8B3D]/50 via-[#8B8B3D]/25 to-transparent" />
    </div>
  );
}

const FIELD_HELP = {
  customerSource:
    'Choose internal customers from your CRM or upload an external contact list.',
  customerCategory: 'Filter customers by the category they belong to in your system.',
  collection: 'Pick a saved collection or list of customers to target.',
  externalList: 'Upload an Excel file (.xlsx or .xls) with your customer contacts. It is validated instantly on a background thread.',
  segmentFilter: 'Narrow your audience further using demographic or location filters.',
};

const SOURCE_OPTIONS = [
  {
    id: 'internal',
    label: 'Customer Management (Internal)',
    description: 'Target customers already saved in your CRM categories and collections.',
  },
  {
    id: 'external',
    label: 'External',
    description: 'Upload an Excel sheet with your own customer contact list.',
  },
];

export default function CustomerTargetingStep({
  targeting,
  errors,
  onUpdate,
  onSegmentValueChange,
  onRemoveSegment,
  onAddSegment,
  onExternalFileChange,
  onExternalValidationChange,
  onToggleSegmentCustom,
  pendingSegmentType,
  onPendingSegmentChange,
  availableSegmentTypes,
}) {
  const isInternal = targeting.customerSource === 'internal';
  const regionValue = targeting.segmentFilters.find((filter) => filter.type === 'region')?.value || '';

  return (
    <div className="space-y-8">
      <section>
        <SectionTitle>Customer Source</SectionTitle>

        <div className="grid gap-5 lg:grid-cols-[2fr_3fr] lg:items-stretch">
          <div className="flex flex-col gap-3">
            {SOURCE_OPTIONS.map((option) => {
              const selected = targeting.customerSource === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onUpdate('customerSource', option.id)}
                  className={clsx(
                    'flex w-full items-start gap-3 rounded-sm border-2 px-4 py-3.5 text-left transition-all duration-200',
                    selected
                      ? 'border-primary bg-[#F7F8FF] shadow-[0_4px_14px_rgba(58,16,205,0.12)] ring-2 ring-primary/15'
                      : 'border-[#B8BECD] bg-[#FAFBFC] shadow-sm hover:border-primary/40 hover:bg-[#F5F7FF]',
                  )}
                >
                  <span
                    className={clsx(
                      'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                      selected ? 'border-primary' : 'border-[#C8CDD8]',
                    )}
                  >
                    {selected ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={clsx(
                        'block text-sm font-semibold',
                        selected ? 'text-primary' : 'text-[#0B1354]',
                      )}
                    >
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-[#717171]">
                      {option.description}
                    </span>
                  </span>
                </button>
              );
            })}

            {!isInternal ? (
              <a
                href="#"
                onClick={(event) => event.preventDefault()}
                className="mt-auto inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary underline-offset-2 hover:underline"
              >
                <Download className="h-3.5 w-3.5" strokeWidth={2.25} />
                Download Template
              </a>
            ) : null}
          </div>

          <div
            className={clsx(
              'flex flex-col rounded-sm border-2 p-4',
              isInternal ? 'border-[#C8CDD8] bg-[#FAFBFC]' : 'border-[#B8BECD] bg-[#F5F7FA]',
            )}
          >
            {isInternal ? (
              <div className="flex flex-col gap-4">
                <div>
                  <FieldLabel htmlFor="customerCategory" help={FIELD_HELP.customerCategory}>
                    Customer Category
                  </FieldLabel>
                  <select
                    id="customerCategory"
                    value={targeting.customerCategory}
                    onChange={(event) => onUpdate('customerCategory', event.target.value)}
                    className={clsx(inputClassName(errors.customerCategory), 'cursor-pointer')}
                    aria-invalid={Boolean(errors.customerCategory)}
                  >
                    <option value="">Select</option>
                    {CUSTOMER_CATEGORIES.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.customerCategory} />
                </div>

                <div>
                  <FieldLabel htmlFor="collection" help={FIELD_HELP.collection}>
                    Collection
                  </FieldLabel>
                  <select
                    id="collection"
                    value={targeting.collection}
                    onChange={(event) => onUpdate('collection', event.target.value)}
                    className={clsx(inputClassName(errors.collection), 'cursor-pointer')}
                    aria-invalid={Boolean(errors.collection)}
                  >
                    <option value="">Select</option>
                    {CUSTOMER_COLLECTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.collection} />
                </div>
              </div>
            ) : (
              <CustomerListUploadZone
                id="external-customer-list"
                file={targeting.externalListFile}
                fileName={targeting.externalListFileName}
                onFileSelect={onExternalFileChange}
                onValidationChange={onExternalValidationChange}
                error={errors.externalList}
                help={FIELD_HELP.externalList}
              />
            )}
          </div>
        </div>
      </section>

      <CustomerSegmentationSection
        segmentFilters={targeting.segmentFilters}
        errors={errors}
        regionValue={regionValue}
        availableSegmentTypes={availableSegmentTypes}
        pendingSegmentType={pendingSegmentType}
        onPendingSegmentChange={onPendingSegmentChange}
        onAddSegment={onAddSegment}
        onValueChange={onSegmentValueChange}
        onRemove={onRemoveSegment}
        onToggleCustom={onToggleSegmentCustom}
      />
    </div>
  );
}
