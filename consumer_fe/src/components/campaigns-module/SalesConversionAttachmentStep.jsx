import { Plus, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { FieldError, FieldLabel, FileUploadZone, inputClassName } from './WizardFormField';
import { PROMO_VISUAL_OPTIONS } from './campaignsData';

const FIELD_HELP = {
  promoVisual: 'Choose the type of visual asset for this product attachment.',
  attachment: 'Upload an image or video that showcases the product or offer.',
  price: 'The original price before any discount is applied.',
  discountedPrice: 'The reduced price customers will pay after the discount.',
  endDate: 'The date this sales offer stops being valid.',
};

export default function SalesConversionAttachmentStep({
  attachments,
  errors,
  onUpdateAttachment,
  onFileChange,
  onAddAttachment,
  onRemoveAttachment,
}) {
  return (
    <div className="space-y-8">
      <AnimatePresence initial={false} mode="popLayout">
        {attachments.map((attachment, index) => (
          <motion.div
            key={attachment.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            {attachments.length > 1 ? (
              <div className="flex items-center justify-between border-b border-[#EEF0F4] pb-3">
                <p className="text-sm font-semibold text-[#0B1354]">Attachment {index + 1}</p>
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(index)}
                  className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#E5484D] transition-colors hover:text-[#C53B3F]"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2.25} />
                  Remove
                </button>
              </div>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2 sm:items-start">
              <div className="space-y-5">
                <div>
                  <FieldLabel
                    htmlFor={`sales-promoVisual-${attachment.id}`}
                    help={FIELD_HELP.promoVisual}
                  >
                    Product Visual
                  </FieldLabel>
                  <select
                    id={`sales-promoVisual-${attachment.id}`}
                    value={attachment.promoVisual}
                    onChange={(event) =>
                      onUpdateAttachment(index, 'promoVisual', event.target.value)
                    }
                    className={clsx(
                      inputClassName(errors[`attachments.${index}.promoVisual`]),
                      'cursor-pointer',
                    )}
                    aria-invalid={Boolean(errors[`attachments.${index}.promoVisual`])}
                  >
                    {PROMO_VISUAL_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors[`attachments.${index}.promoVisual`]} />
                </div>

                <div>
                  <FieldLabel htmlFor={`sales-price-${attachment.id}`} help={FIELD_HELP.price}>
                    Price
                  </FieldLabel>
                  <input
                    id={`sales-price-${attachment.id}`}
                    value={attachment.price}
                    onChange={(event) => onUpdateAttachment(index, 'price', event.target.value)}
                    placeholder="GHS599"
                    className={inputClassName(errors[`attachments.${index}.price`])}
                    aria-invalid={Boolean(errors[`attachments.${index}.price`])}
                  />
                  <FieldError message={errors[`attachments.${index}.price`]} />
                </div>

                <div>
                  <FieldLabel
                    htmlFor={`sales-endDate-${attachment.id}`}
                    help={FIELD_HELP.endDate}
                  >
                    End Date
                  </FieldLabel>
                  <input
                    id={`sales-endDate-${attachment.id}`}
                    type="date"
                    value={attachment.promoExpiryDate}
                    onChange={(event) =>
                      onUpdateAttachment(index, 'promoExpiryDate', event.target.value)
                    }
                    className={inputClassName(errors[`attachments.${index}.promoExpiryDate`])}
                    aria-invalid={Boolean(errors[`attachments.${index}.promoExpiryDate`])}
                  />
                  <FieldError message={errors[`attachments.${index}.promoExpiryDate`]} />
                </div>
              </div>

              <div className="space-y-5">
                <FileUploadZone
                  id={`sales-attachment-file-${attachment.id}`}
                  label="Attachment"
                  fileName={attachment.fileName}
                  previewUrl={attachment.previewUrl}
                  promoVisual={attachment.promoVisual}
                  fileMimeType={attachment.fileMimeType}
                  onChange={(file) => onFileChange(index, file)}
                  error={errors[`attachments.${index}.file`]}
                  help={FIELD_HELP.attachment}
                  compact
                />

                <div>
                  <FieldLabel
                    htmlFor={`sales-discountedPrice-${attachment.id}`}
                    help={FIELD_HELP.discountedPrice}
                  >
                    Discounted Price (Optional)
                  </FieldLabel>
                  <input
                    id={`sales-discountedPrice-${attachment.id}`}
                    value={attachment.discountedPrice}
                    onChange={(event) =>
                      onUpdateAttachment(index, 'discountedPrice', event.target.value)
                    }
                    placeholder="GHS5599"
                    className={inputClassName(errors[`attachments.${index}.discountedPrice`])}
                  />
                  <FieldError message={errors[`attachments.${index}.discountedPrice`]} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={onAddAttachment}
          className="inline-flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold text-[#717171] transition-colors hover:bg-[#F7F8FF] hover:text-primary"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Another attachment
        </button>
      </div>
    </div>
  );
}
