import { useState } from 'react';
import { Reorder, AnimatePresence, motion } from 'framer-motion';
import {
  CircleDot,
  FileCheck2,
  GripVertical,
  ListChecks,
  ListTodo,
  Pencil,
  Plus,
  Sparkles,
  SquareCheck,
  Trash2,
  Type,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { FieldError, FieldLabel, inputClassName } from './WizardFormField';
import {
  LEAD_QUESTION_TYPE_ORDER,
  LEAD_QUESTION_TYPES,
  buildLeadQuestionFromDraft,
  createEmptyLeadQuestionDraft,
  validateLeadQuestionDraft,
} from './campaignsData';

const TYPE_META = {
  multipleChoice: {
    icon: SquareCheck,
    accent: 'bg-[#EDE8F8] text-primary',
    selectedAccent: 'bg-primary text-white',
    ring: 'border-primary bg-[#F7F8FF] ring-2 ring-primary/10',
  },
  singleChoice: {
    icon: CircleDot,
    accent: 'bg-[#E8F4FC] text-[#2E7DAD]',
    selectedAccent: 'bg-[#2E7DAD] text-white',
    ring: 'border-[#2E7DAD] bg-[#F0F9FF] ring-2 ring-[#2E7DAD]/10',
  },
  freeText: {
    icon: Type,
    accent: 'bg-[#E8F8EF] text-[#1F9D55]',
    selectedAccent: 'bg-[#1F9D55] text-white',
    ring: 'border-[#1F9D55] bg-[#F0FFF7] ring-2 ring-[#1F9D55]/10',
  },
  terms: {
    icon: FileCheck2,
    accent: 'bg-[#FFF4E8] text-[#E67E22]',
    selectedAccent: 'bg-[#E67E22] text-white',
    ring: 'border-[#E67E22] bg-[#FFFAF3] ring-2 ring-[#E67E22]/10',
  },
};

function QuestionTypePicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Question type">
      {LEAD_QUESTION_TYPE_ORDER.map((type) => {
        const meta = LEAD_QUESTION_TYPES[type];
        const style = TYPE_META[type];
        const Icon = style.icon;
        const selected = value === type;

        return (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(type)}
            className={clsx(
              'group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border px-2 py-3 text-center transition-all duration-200',
              selected ? style.ring : 'border-[#D4D8E4] bg-white hover:border-primary/25 hover:bg-[#FAFBFC]',
            )}
          >
            <span
              className={clsx(
                'flex h-9 w-9 items-center justify-center rounded-sm transition-transform duration-200 group-hover:scale-105',
                selected ? style.selectedAccent : style.accent,
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className={clsx('text-xs font-semibold leading-tight', selected ? 'text-primary' : 'text-[#0B1354]')}>
              {meta.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function QuestionBuilderCard({ draft, setDraft, errors, isEditing, onSubmit, onCancel }) {
  const isChoice = draft.type === 'multipleChoice' || draft.type === 'singleChoice';
  const isTerms = draft.type === 'terms';

  const setType = (type) => {
    setDraft((prev) => ({
      ...createEmptyLeadQuestionDraft(type),
      question: prev.question,
    }));
  };

  const updateOption = (index, value) => {
    setDraft((prev) => ({
      ...prev,
      options: prev.options.map((option, optionIndex) => (optionIndex === index ? value : option)),
    }));
  };

  const addOption = () => {
    setDraft((prev) => ({ ...prev, options: [...prev.options, ''] }));
  };

  const removeOption = (index) => {
    setDraft((prev) => ({
      ...prev,
      options: prev.options.filter((_, optionIndex) => optionIndex !== index),
    }));
  };

  return (
    <div className="rounded-lg border-2 border-[#D4D8E4] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#6B4FE0] text-white shadow-[0_6px_16px_rgba(58,16,205,0.25)]">
          <Sparkles className="h-4 w-4" strokeWidth={2.25} />
        </span>
        <div>
          <p className="text-sm font-bold text-[#0B1354]">{isEditing ? 'Edit Question' : 'Add a Question'}</p>
          <p className="text-xs text-[#9AA0B0]">Pick an answer type, then describe what to ask.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <FieldLabel>Answer Type</FieldLabel>
          <QuestionTypePicker value={draft.type} onChange={setType} />
        </div>

        {!isTerms ? (
          <div>
            <FieldLabel htmlFor="lead-question-text">Question</FieldLabel>
            <input
              id="lead-question-text"
              value={draft.question}
              onChange={(event) => setDraft((prev) => ({ ...prev, question: event.target.value }))}
              placeholder="e.g. What are you most interested in?"
              className={inputClassName(errors.question)}
              aria-invalid={Boolean(errors.question)}
            />
            <FieldError message={errors.question} />
          </div>
        ) : null}

        {isChoice ? (
          <div>
            <FieldLabel>Options</FieldLabel>
            <div className="space-y-2">
              {draft.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={option}
                    onChange={(event) => updateOption(index, event.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className={inputClassName()}
                  />
                  {draft.options.length > 2 ? (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] text-[#9AA0B0] transition-colors hover:border-[#E5484D]/40 hover:bg-[#FFF5F5] hover:text-[#E5484D]"
                      aria-label={`Remove option ${index + 1}`}
                    >
                      <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addOption}
              className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              Add option
            </button>
            <FieldError message={errors.options} />
          </div>
        ) : null}

        {draft.type === 'freeText' ? (
          <div>
            <FieldLabel htmlFor="lead-question-placeholder">Placeholder Hint (Optional)</FieldLabel>
            <input
              id="lead-question-placeholder"
              value={draft.placeholder}
              onChange={(event) => setDraft((prev) => ({ ...prev, placeholder: event.target.value }))}
              placeholder="e.g. Enter your answer here"
              className={inputClassName()}
            />
          </div>
        ) : null}

        {isTerms ? (
          <>
            <div>
              <FieldLabel htmlFor="lead-terms-text">Terms & Conditions Text</FieldLabel>
              <textarea
                id="lead-terms-text"
                value={draft.termsText}
                onChange={(event) => setDraft((prev) => ({ ...prev, termsText: event.target.value }))}
                rows={3}
                placeholder="Describe what customers are agreeing to..."
                className={clsx(inputClassName(errors.termsText), 'resize-none')}
                aria-invalid={Boolean(errors.termsText)}
              />
              <FieldError message={errors.termsText} />
            </div>
            <div>
              <FieldLabel htmlFor="lead-terms-checkbox">Checkbox Label</FieldLabel>
              <input
                id="lead-terms-checkbox"
                value={draft.checkboxLabel}
                onChange={(event) => setDraft((prev) => ({ ...prev, checkboxLabel: event.target.value }))}
                placeholder="I agree to the Terms & Conditions"
                className={inputClassName()}
              />
            </div>
          </>
        ) : null}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all hover:bg-[#320EB8]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            {isEditing ? 'Update Question' : 'Add Question'}
          </button>
          {isEditing ? (
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer rounded-sm border border-[#E4E4E7] px-4 py-2.5 text-sm font-semibold text-[#717171] transition-colors hover:bg-[#F7F8FF]"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function QuestionListItem({ item, index, onEdit, onRemove }) {
  const meta = LEAD_QUESTION_TYPES[item.type];
  const style = TYPE_META[item.type];
  const Icon = style.icon;

  return (
    <Reorder.Item
      value={item}
      as="div"
      className="list-none"
      whileDrag={{ scale: 1.02, boxShadow: '0 12px 28px rgba(11,19,84,0.16)' }}
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8, height: 0 }}
        transition={{ duration: 0.18 }}
        className="group flex items-start gap-3 rounded-lg border-2 border-[#E4E8EF] bg-white p-3.5 shadow-sm transition-colors hover:border-primary/25"
      >
        <span className="mt-1 flex h-6 w-6 shrink-0 cursor-grab items-center justify-center text-[#C8CDD8] active:cursor-grabbing">
          <GripVertical className="h-4 w-4" strokeWidth={2} />
        </span>

        <span className={clsx('flex h-8 w-8 shrink-0 items-center justify-center rounded-sm', style.accent)}>
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#9AA0B0]">
              Q{index + 1} · {meta.shortLabel}
            </span>
          </div>
          <p className="mt-0.5 truncate text-sm font-semibold text-[#0B1354]">
            {item.type === 'terms' ? item.checkboxLabel : item.question}
          </p>
          {item.type === 'multipleChoice' || item.type === 'singleChoice' ? (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {item.options.map((option) => (
                <span
                  key={option}
                  className="rounded-full bg-[#F0F2F7] px-2 py-0.5 text-[10px] font-medium text-[#545454]"
                >
                  {option}
                </span>
              ))}
            </div>
          ) : null}
          {item.type === 'terms' ? (
            <p className="mt-1 line-clamp-2 text-xs text-[#717171]">{item.termsText}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[#717171] transition-colors hover:bg-[#F7F8FF] hover:text-primary"
            aria-label={`Edit question ${index + 1}`}
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[#717171] transition-colors hover:bg-[#FFF5F5] hover:text-[#E5484D]"
            aria-label={`Remove question ${index + 1}`}
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      </motion.div>
    </Reorder.Item>
  );
}

export const LEAD_QUESTION_TYPE_META = TYPE_META;

export function FormPreview({ title, intro, questions }) {
  return (
    <div className="mx-auto w-full max-w-[17.5rem]">
      <div className="relative">
        <div
          className="pointer-events-none absolute -inset-3 rounded-[2.25rem] bg-gradient-to-br from-primary/10 via-transparent to-[#5B9FD4]/15 blur-xl"
          aria-hidden="true"
        />
        <div className="relative overflow-hidden rounded-[2rem] border-[7px] border-[#0B1354] bg-[#0B1354] shadow-[0_28px_64px_rgba(11,19,84,0.28)]">
          <div className="flex items-center justify-between bg-[#0B1354] px-5 pb-1.5 pt-2.5">
            <span className="text-[10px] font-semibold text-white/90">9:41</span>
            <div className="mx-auto h-1.5 w-16 rounded-full bg-white/25" aria-hidden="true" />
            <div className="flex items-center gap-0.5" aria-hidden="true">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              <span className="h-2 w-3 rounded-sm bg-white/70" />
            </div>
          </div>

          <div className="max-h-[30rem] min-h-[30rem] overflow-y-auto bg-[#F4F5F8]">
            <div className="bg-gradient-to-br from-primary to-[#6B4FE0] px-4 py-6 text-center text-white">
              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/80">
                Quick Form
              </p>
              <h4 className="mt-1.5 text-sm font-bold leading-snug">{title || 'Your form title'}</h4>
              {intro ? (
                <p className="mt-1.5 text-[10px] leading-relaxed text-white/85 line-clamp-3">{intro}</p>
              ) : null}
            </div>

            <div className="space-y-3.5 px-3.5 py-4">
              {questions.length === 0 ? (
                <div className="rounded-sm border border-dashed border-[#D4D8E4] bg-white px-3 py-6 text-center">
                  <ListTodo className="mx-auto h-5 w-5 text-[#C8CDD8]" strokeWidth={1.75} />
                  <p className="mt-2 text-[10px] text-[#9AA0B0]">
                    Your questions will appear here as you add them.
                  </p>
                </div>
              ) : (
                questions.map((item, index) => (
                  <div key={item.id} className="rounded-sm border border-[#EEF0F4] bg-white px-3 py-2.5">
                    {item.type !== 'terms' ? (
                      <p className="text-[10px] font-semibold leading-snug text-[#0B1354]">
                        {index + 1}. {item.question || 'Untitled question'}
                      </p>
                    ) : null}

                    {item.type === 'freeText' ? (
                      <div className="mt-1.5 rounded-sm border border-[#E4E4E7] bg-[#FAFBFC] px-2 py-1.5 text-[9px] text-[#9AA0B0]">
                        {item.placeholder || 'Type your answer...'}
                      </div>
                    ) : null}

                    {(item.type === 'singleChoice' || item.type === 'multipleChoice') ? (
                      <div className="mt-1.5 space-y-1">
                        {item.options.map((option) => (
                          <div key={option} className="flex items-center gap-1.5">
                            <span
                              className={clsx(
                                'inline-flex h-3 w-3 shrink-0 items-center justify-center border border-[#C8CDD8]',
                                item.type === 'singleChoice' ? 'rounded-full' : 'rounded-[3px]',
                              )}
                            />
                            <span className="text-[9px] text-[#545454]">{option}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {item.type === 'terms' ? (
                      <div className="flex items-start gap-1.5">
                        <span className="mt-0.5 inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-[3px] border border-[#C8CDD8]" />
                        <span className="text-[9px] leading-relaxed text-[#545454]">
                          {item.checkboxLabel}
                        </span>
                      </div>
                    ) : null}
                  </div>
                ))
              )}

              <button
                type="button"
                disabled
                className="w-full cursor-not-allowed rounded-sm bg-primary py-2.5 text-[10px] font-semibold text-white opacity-90"
              >
                Submit
              </button>
            </div>
          </div>

          <div className="flex justify-center bg-[#F4F5F8] py-2" aria-hidden="true">
            <span className="h-1 w-24 rounded-full bg-[#0B1354]/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LeadGenerationFormStep({
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
  onReorderQuestions,
  error,
  formTitle,
  formIntro,
}) {
  const [draft, setDraft] = useState(() => createEmptyLeadQuestionDraft());
  const [draftErrors, setDraftErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  const isEditing = Boolean(editingId);

  const resetDraft = () => {
    setDraft(createEmptyLeadQuestionDraft());
    setDraftErrors({});
    setEditingId(null);
  };

  const handleSubmit = () => {
    const validationErrors = validateLeadQuestionDraft(draft);
    if (Object.keys(validationErrors).length > 0) {
      setDraftErrors(validationErrors);
      return;
    }

    const question = buildLeadQuestionFromDraft(draft, editingId || undefined);

    if (isEditing) {
      onUpdateQuestion(editingId, question);
    } else {
      onAddQuestion(question);
    }

    resetDraft();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setDraft({
      type: item.type,
      question: item.question,
      options: item.options.length ? item.options : ['', ''],
      placeholder: item.placeholder,
      required: item.required,
      termsText: item.termsText,
      checkboxLabel: item.checkboxLabel,
    });
    setDraftErrors({});
  };

  const configuredCount = questions.length;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="min-w-0 space-y-5">
        <QuestionBuilderCard
          draft={draft}
          setDraft={setDraft}
          errors={draftErrors}
          isEditing={isEditing}
          onSubmit={handleSubmit}
          onCancel={resetDraft}
        />

        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-[#0B1354]">Form Questions</p>
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] font-semibold text-primary">
                <ListChecks className="h-3 w-3" strokeWidth={2.5} />
                {configuredCount}
              </span>
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#B8BECD] bg-[#FAFBFC] px-6 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDE8F8] text-primary">
                <ListTodo className="h-5 w-5" strokeWidth={2.25} />
              </span>
              <p className="mt-3 text-sm font-semibold text-[#0B1354]">No questions added yet</p>
              <p className="mt-1 max-w-sm text-xs text-[#717171]">
                Start adding questions using the form above — they'll show up here and in the live
                preview.
              </p>
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={questions}
              onReorder={onReorderQuestions}
              className="space-y-2.5"
            >
              <AnimatePresence initial={false}>
                {questions.map((item, index) => (
                  <QuestionListItem
                    key={item.id}
                    item={item}
                    index={index}
                    onEdit={handleEdit}
                    onRemove={onRemoveQuestion}
                  />
                ))}
              </AnimatePresence>
            </Reorder.Group>
          )}

          <FieldError message={error} />
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-sm border border-[#EEF0F4] bg-[#FAFBFC] p-4 sm:p-5">
          <p className="mb-4 text-center text-sm font-semibold text-[#0B1354]">Live Preview</p>
          <FormPreview title={formTitle} intro={formIntro} questions={questions} />
        </div>
      </aside>
    </div>
  );
}
