import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { FieldError, FieldLabel, FileUploadZone, inputClassName } from './WizardFormField';
import { PROMO_VISUAL_OPTIONS } from './campaignsData';

const FIELD_HELP = {
  promoVisual: 'Choose the type of visual asset for this service alert.',
  supportContact: 'A phone number customers can call for help related to this alert.',
  attachment: 'Upload an image or video that illustrates the alert (status graphic, map, etc.).',
};

export default function ServiceAlertsAttachmentStep({
  attachment,
  supportContact,
  errors,
  onUpdateAttachment,
  onFileChange,
  onSupportContactChange,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-5 sm:grid-cols-2 sm:items-start"
    >
      <div className="space-y-5">
        <div>
          <FieldLabel htmlFor={`alert-visual-${attachment.id}`} help={FIELD_HELP.promoVisual}>
            Visual
          </FieldLabel>
          <select
            id={`alert-visual-${attachment.id}`}
            value={attachment.promoVisual}
            onChange={(event) => onUpdateAttachment(0, 'promoVisual', event.target.value)}
            className={clsx(
              inputClassName(errors['attachments.0.promoVisual']),
              'cursor-pointer',
            )}
            aria-invalid={Boolean(errors['attachments.0.promoVisual'])}
          >
            {PROMO_VISUAL_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError message={errors['attachments.0.promoVisual']} />
        </div>

        <div>
          <FieldLabel htmlFor="alert-support-contact" help={FIELD_HELP.supportContact}>
            Support Contact
          </FieldLabel>
          <input
            id="alert-support-contact"
            type="tel"
            value={supportContact}
            onChange={(event) => onSupportContactChange(event.target.value)}
            placeholder="0545366373"
            className={inputClassName(errors.supportContact)}
            aria-invalid={Boolean(errors.supportContact)}
          />
          <FieldError message={errors.supportContact} />
        </div>
      </div>

      <FileUploadZone
        id={`alert-attachment-file-${attachment.id}`}
        label="Attachment"
        fileName={attachment.fileName}
        previewUrl={attachment.previewUrl}
        promoVisual={attachment.promoVisual}
        fileMimeType={attachment.fileMimeType}
        onChange={(file) => onFileChange(0, file)}
        error={errors['attachments.0.file']}
        help={FIELD_HELP.attachment}
        compact
      />
    </motion.div>
  );
}
