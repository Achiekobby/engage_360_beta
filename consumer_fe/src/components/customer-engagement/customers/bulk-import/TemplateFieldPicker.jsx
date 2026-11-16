import { Check, Loader2, X } from 'lucide-react';
import { clsx } from 'clsx';
import { normalizeHeaderName } from '../../../../utils/contact-import/constants';

function FieldSection({ title, description, children }) {
  return (
    <section className="overflow-hidden rounded-sm border border-[#E4E4E7]">
      <header className="border-b border-[#E4E4E7] border-l-4 border-l-[#0B1354] bg-[#F4F5F7] px-3.5 py-3">
        <h4 className="text-sm font-bold text-[#0B1354]">{title}</h4>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-[#52525B]">{description}</p>
        ) : null}
      </header>
      <div className="bg-white p-3">{children}</div>
    </section>
  );
}

function ChoiceTile({ field, checked, blockedBy, onToggle }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      disabled={Boolean(blockedBy)}
      onClick={() => onToggle(field)}
      className={clsx(
        'flex w-full flex-col items-start rounded-sm border px-3 py-2.5 text-left transition-colors',
        checked
          ? 'border-primary/35 bg-[#F7F8FF]'
          : 'border-[#EEF0F4] bg-white hover:border-[#D4D4D8]',
        blockedBy && 'cursor-not-allowed bg-[#FAFBFC] opacity-70 hover:border-[#EEF0F4]',
      )}
    >
      <span className="flex w-full items-center justify-between gap-3">
        <span className="text-sm font-medium text-[#0B1354]">{field.label}</span>
        <span
          className={clsx(
            'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border',
            checked ? 'border-primary bg-primary text-white' : 'border-[#D4D4D8] bg-white',
          )}
          aria-hidden="true"
        >
          {checked ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
        </span>
      </span>
      <span className="mt-0.5 font-mono text-[11px] text-[#717171]">{field.key}</span>
      {blockedBy ? (
        <span className="mt-1.5 text-xs leading-relaxed text-[#717171]">
          Remove {blockedBy} to include this column.
        </span>
      ) : null}
      {field.sensitive && checked ? (
        <span className="mt-1.5 text-xs leading-relaxed text-[#717171]">
          Include religion only when you have a lawful reason to store it.
        </span>
      ) : null}
    </button>
  );
}

export default function TemplateFieldPicker({
  columns,
  standard,
  recommended,
  custom,
  selectedKeys,
  onToggle,
  addedCustom,
  customDraft,
  onCustomDraft,
  onAddCustom,
  addingCustom = false,
  onRemoveAdded,
  customError,
  isLoading,
  loadError,
  onRetry,
}) {
  const headingPreview = normalizeHeaderName(customDraft);
  const includedOptional = Math.max(columns.length - standard.length, 0);
  const labels = new Map(
    [...standard, ...recommended, ...custom, ...addedCustom].map((field) => [field.key, field.label]),
  );

  const removeColumn = (field) => {
    if (addedCustom.some((item) => item.key === field.key)) onRemoveAdded(field.key);
    else onToggle(field);
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <h4 className="text-sm font-semibold text-[#0B1354]">Columns in this file</h4>
          <p className="text-xs text-[#717171]">
            {columns.length} column{columns.length === 1 ? '' : 's'}
            {includedOptional ? ` · ${includedOptional} added` : ''}
          </p>
        </div>
        <div className="overflow-x-auto rounded-sm border border-[#EEF0F4]">
          <div className="flex min-w-max divide-x divide-[#EEF0F4]">
            {columns.map((field) => (
              <div key={field.key} className="w-40 shrink-0">
                <div className="flex items-center justify-between gap-2 bg-[#FAFBFC] px-2.5 py-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[#717171]">
                    {field.required ? 'Required' : field.group === 'custom' ? 'Custom' : 'Included'}
                  </span>
                  {field.required ? null : (
                    <button
                      type="button"
                      onClick={() => removeColumn(field)}
                      className="text-[#717171] hover:text-[#0B1354]"
                      aria-label={`Remove ${field.label}`}
                    >
                      <X className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  )}
                </div>
                <div className="px-2.5 py-2">
                  <p className="truncate text-sm font-medium text-[#0B1354]">{field.label}</p>
                  <p className="truncate font-mono text-[11px] text-[#717171]">{field.key}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FieldSection
        title="Always included"
        description="These three columns are required for every contact."
      >
        <ul className="grid gap-2 sm:grid-cols-3">
          {standard.map((field) => (
            <li key={field.key} className="rounded-sm border border-[#EEF0F4] bg-[#FAFBFC] px-3 py-2.5">
              <p className="text-sm font-medium text-[#0B1354]">{field.label}</p>
              <p className="mt-0.5 font-mono text-[11px] text-[#717171]">{field.key}</p>
            </li>
          ))}
        </ul>
      </FieldSection>

      <FieldSection
        title="Recommended"
        description="Select the extra columns you want in this dataset. Date of birth and age range cannot both be included."
      >
        {isLoading ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-sm bg-[#F4F4F5]" />
            ))}
          </div>
        ) : (
          <>
            {loadError ? (
              <p className="mb-3 text-sm text-[#52525B]">
                The latest field list could not be loaded.{' '}
                <button type="button" onClick={onRetry} className="font-semibold text-primary">
                  Try again
                </button>
              </p>
            ) : null}
            <div className="grid gap-2 sm:grid-cols-2">
              {recommended.map((field) => {
                const checked = selectedKeys.has(field.key);
                const partnerKey = !checked && field.exclusiveWith && selectedKeys.has(field.exclusiveWith)
                  ? field.exclusiveWith
                  : null;
                return (
                  <ChoiceTile
                    key={field.key}
                    field={field}
                    checked={checked}
                    blockedBy={partnerKey ? labels.get(partnerKey) || partnerKey : null}
                    onToggle={onToggle}
                  />
                );
              })}
            </div>
          </>
        )}
      </FieldSection>

      <FieldSection
        title="Your own columns"
        description="Select an existing company column, or type a new one and save it. Saving stores that column for the company, then includes it in this file."
      >
        {custom.length ? (
          <div className="mb-3 grid gap-2 sm:grid-cols-2">
            {custom.map((field) => (
              <ChoiceTile
                key={field.key}
                field={field}
                checked={selectedKeys.has(field.key)}
                onToggle={onToggle}
              />
            ))}
          </div>
        ) : null}
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            if (!addingCustom) onAddCustom();
          }}
        >
          <label className="min-w-0 flex-1">
            <span className="sr-only">Custom column name</span>
            <input
              value={customDraft}
              onChange={(event) => onCustomDraft(event.target.value)}
              placeholder="Column name, for example Loyalty ID"
              disabled={addingCustom}
              className="w-full rounded-sm border border-[#E4E4E7] bg-white px-3 py-2.5 text-sm text-[#0B1354] outline-none placeholder:text-[#A1A1AA] focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
          <button
            type="submit"
            disabled={addingCustom || !String(customDraft || '').trim()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-primary px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {addingCustom ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} /> : null}
            {addingCustom ? 'Saving…' : 'Save column'}
          </button>
        </form>
        {headingPreview ? (
          <p className="mt-1.5 text-xs text-[#717171]">
            Heading saved as: <span className="font-mono text-[#0B1354]">{headingPreview}</span>
          </p>
        ) : null}
        {customError ? <p className="mt-1.5 text-xs text-destructive">{customError}</p> : null}
      </FieldSection>
    </div>
  );
}
