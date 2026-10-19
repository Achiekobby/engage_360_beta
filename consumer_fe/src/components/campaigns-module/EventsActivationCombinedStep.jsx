import { motion } from 'framer-motion';
import EventActivationAttachmentStep from './EventActivationAttachmentStep';
import EventRegistrationFormStep from './EventRegistrationFormStep';

function SectionIntro({ title, description }) {
  return (
    <div className="mb-5 border-b border-[#F0F2F7] pb-4">
      <h2 className="text-base font-bold text-[#0B1354]">{title}</h2>
      {description ? <p className="mt-1 text-sm leading-relaxed text-[#717171]">{description}</p> : null}
    </div>
  );
}

/**
 * Mockup "Attachment" step: event logistics + tickets + registration form
 * in one scrollable, progressive layout.
 */
export default function EventsActivationCombinedStep({
  attachment,
  event,
  errors,
  registrationQuestions,
  formTitle,
  onVisualChange,
  onFileChange,
  onEventChange,
  onAddTicket,
  onRemoveTicket,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
  onReorderQuestions,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-10"
    >
      <section>
        <SectionIntro
          title="Event logistics"
          description="Add a visual, set the schedule and venue, then configure RSVP and entry options."
        />
        <EventActivationAttachmentStep
          attachment={attachment}
          event={event}
          errors={errors}
          onVisualChange={onVisualChange}
          onFileChange={onFileChange}
          onEventChange={onEventChange}
          onAddTicket={onAddTicket}
          onRemoveTicket={onRemoveTicket}
          hideIntro
        />
      </section>

      <section className="rounded-sm border border-[#EEF0F4] bg-[#FAFBFC] p-4 sm:p-6">
        <SectionIntro
          title="Customize event registration"
          description="Build the questions guests answer when they register. Keep it short — name and phone are usually enough."
        />
        <EventRegistrationFormStep
          questions={registrationQuestions}
          formTitle={formTitle}
          onAddQuestion={onAddQuestion}
          onUpdateQuestion={onUpdateQuestion}
          onRemoveQuestion={onRemoveQuestion}
          onReorderQuestions={onReorderQuestions}
        />
      </section>
    </motion.div>
  );
}
