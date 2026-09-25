import { useState } from 'react';
import { Reorder, AnimatePresence, motion } from 'framer-motion';
import {
  CalendarDays,
  ChevronDown,
  CircleDot,
  CircleHelp,
  FileCheck2,
  GripVertical,
  Hash,
  ListChecks,
  Mail,
  Pencil,
  Phone,
  Plus,
  SquareCheck,
  ToggleLeft,
  Trash2,
  Type,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { FieldError, FieldLabel, inputClassName } from './WizardFormField';
import {
  EVENT_QUESTION_TYPE_ORDER,
  EVENT_QUESTION_TYPES,
  buildEventQuestionFromDraft,
  createEmptyEventQuestionDraft,
  validateEventQuestionDraft,
} from './campaignsData';

const TYPE_META = {
  multipleChoice: { icon: SquareCheck, accent: 'bg-[#EDE8F8] text-primary' },
  singleChoice: { icon: CircleDot, accent: 'bg-[#E8F4FC] text-[#2E7DAD]' },
  dropdown: { icon: ChevronDown, accent: 'bg-[#F0F2F7] text-[#0B1354]' },
  yesNo: { icon: ToggleLeft, accent: 'bg-[#E8F8EF] text-[#1F9D55]' },
  shortText: { icon: Type, accent: 'bg-[#E8F4FC] text-[#2E7DAD]' },
  freeText: { icon: Type, accent: 'bg-[#E8F8EF] text-[#1F9D55]' },
  email: { icon: Mail, accent: 'bg-[#EDE8F8] text-primary' },
  phone: { icon: Phone, accent: 'bg-[#FFF4E8] text-[#E67E22]' },
  number: { icon: Hash, accent: 'bg-[#F0F2F7] text-[#0B1354]' },
  date: { icon: CalendarDays, accent: 'bg-[#E8F4FC] text-[#2E7DAD]' },
  terms: { icon: FileCheck2, accent: 'bg-[#FFF4E8] text-[#E67E22]' },
};

const CHOICE_TYPES = new Set(['multipleChoice', 'singleChoice', 'dropdown']);
const PLACEHOLDER_TYPES = new Set(['shortText', 'freeText', 'email', 'phone', 'number']);

function QuestionTypePicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Answer type">
      {EVENT_QUESTION_TYPE_ORDER.map((type) => {
        const meta = EVENT_QUESTION_TYPES[type];
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
              'flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2.5 text-left transition-colors',
              selected
                ? 'border-primary bg-[#F7F8FF] ring-2 ring-primary/10'
                : 'border-[#E4E8EF] bg-white hover:border-primary/25',
            )}
          >
            <span className={clsx('flex h-8 w-8 shrink-0 items-center justify-center rounded-md', selected ? 'bg-primary text-white' : style.accent)}>
              <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold leading-tight text-[#0B1354]">{meta.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function QuestionListItem({ item, index, onEdit, onRemove }) {
  const meta = EVENT_QUESTION_TYPES[item.type];
  const style = TYPE_META[item.type];
  const Icon = style.icon;

  return (
    <Reorder.Item value={item} as="div" className="list-none" whileDrag={{ scale: 1.01 }}>
      <div className="group flex items-start gap-3 rounded-lg border border-[#E4E8EF] bg-white p-3.5">
        <span className="mt-1 flex h-6 w-6 shrink-0 cursor-grab items-center justify-center text-[#C8CDD8] active:cursor-grabbing">
          <GripVertical className="h-4 w-4" strokeWidth={2} />
        </span>
        <span className={clsx('flex h-8 w-8 shrink-0 items-center justify-center rounded-md', style.accent)}>
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#9AA0B0]">
            {index + 1} · {meta.shortLabel}
            {item.required ? ' · Required' : ' · Optional'}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-[#0B1354]">
            {item.type === 'terms' ? item.checkboxLabel : item.question}
          </p>
          {item.options?.length ? (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {item.options.map((option) => (
                <span key={option} className="rounded-full bg-[#F0F2F7] px-2 py-0.5 text-[10px] font-medium text-[#545454]">
                  {option}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[#717171] hover:bg-[#F7F8FF] hover:text-primary"
            aria-label={`Edit question ${index + 1}`}
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-[#717171] hover:bg-[#FFF5F5] hover:text-[#E5484D]"
            aria-label={`Remove question ${index + 1}`}
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
}

function RegistrationPreview({ title, questions }) {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border-[6px] border-[#0B1354] bg-[#F4F5F8] shadow-[0_18px_40px_rgba(11,19,84,0.16)]">
      <div className="bg-gradient-to-br from-primary to-[#6B4FE0] px-4 py-5 text-white">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75">Registration</p>
        <h4 className="mt-1 text-sm font-bold">{title || 'Event registration'}</h4>
      </div>
      <div className="max-h-[28rem] space-y-2.5 overflow-y-auto px-3 py-3">
        {questions.length === 0 ? (
          <p className="px-2 py-8 text-center text-[11px] leading-relaxed text-[#9AA0B0]">
            Questions you add will appear here in the order guests will answer them.
          </p>
        ) : (
          questions.map((item, index) => (
            <div key={item.id} className="rounded-lg bg-white px-3 py-2.5">
              {item.type === 'terms' ? (
                <p className="text-[11px] text-[#545454]">
                  {item.checkboxLabel}
                  {item.required ? <span className="text-[#E5484D]"> *</span> : null}
                </p>
              ) : (
                <p className="text-[11px] font-semibold text-[#0B1354]">
                  {index + 1}. {item.question}
                  {item.required ? <span className="text-[#E5484D]"> *</span> : null}
                </p>
              )}
              {PLACEHOLDER_TYPES.has(item.type) ? (
                <div
                  className={clsx(
                    'mt-1.5 rounded-md border border-[#E4E4E7] px-2 py-1.5 text-[10px] text-[#9AA0B0]',
                    item.type === 'freeText' && 'min-h-[3.25rem]',
                  )}
                >
                  {item.placeholder || EVENT_QUESTION_TYPES[item.type].examplePlaceholder}
                </div>
              ) : null}
              {item.type === 'date' ? (
                <div className="mt-1.5 rounded-md border border-[#E4E4E7] px-2 py-1.5 text-[10px] text-[#9AA0B0]">
                  Select a date
                </div>
              ) : null}
              {item.type === 'yesNo' ? (
                <p className="mt-1.5 text-[10px] text-[#717171]">Yes · No</p>
              ) : null}
              {CHOICE_TYPES.has(item.type) ? (
                <p className="mt-1.5 text-[10px] text-[#717171]">{item.options.join(' · ')}</p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function EventQuestionReviewList({ questions }) {
  if (!questions?.length) {
    return (
      <p className="rounded-lg border border-dashed border-[#E4E8EF] bg-[#FAFBFC] px-4 py-6 text-center text-sm text-[#717171]">
        No registration form. Guests will receive the event message only.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {questions.map((item, index) => {
        const meta = EVENT_QUESTION_TYPES[item.type];
        const style = TYPE_META[item.type];
        const Icon = style.icon;
        return (
          <div key={item.id} className="flex items-start gap-3 rounded-lg border border-[#EEF0F4] bg-[#FAFBFC] px-3.5 py-3">
            <span className={clsx('flex h-8 w-8 shrink-0 items-center justify-center rounded-md', style.accent)}>
              <Icon className="h-4 w-4" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#9AA0B0]">
                {index + 1} · {meta?.shortLabel}
                {item.required ? ' · Required' : ' · Optional'}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[#0B1354]">
                {item.type === 'terms' ? item.checkboxLabel : item.question}
                {item.required ? <span className="text-[#E5484D]"> *</span> : null}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function EventRegistrationFormStep({
  questions,
  formTitle,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
  onReorderQuestions,
}) {
  const [draft, setDraft] = useState(() => createEmptyEventQuestionDraft());
  const [draftErrors, setDraftErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const isEditing = Boolean(editingId);
  const isChoice = CHOICE_TYPES.has(draft.type);
  const isTerms = draft.type === 'terms';

  const setType = (type) => {
    setDraft((prev) => ({
      ...createEmptyEventQuestionDraft(type),
      question: prev.question,
    }));
    setDraftErrors({});
  };

  const updateOption = (index, value) => {
    setDraft((prev) => ({
      ...prev,
      options: prev.options.map((option, optionIndex) => (optionIndex === index ? value : option)),
    }));
  };

  const resetDraft = () => {
    setDraft(createEmptyEventQuestionDraft());
    setDraftErrors({});
    setEditingId(null);
  };

  const handleSubmit = () => {
    const validationErrors = validateEventQuestionDraft(draft);
    if (Object.keys(validationErrors).length > 0) {
      setDraftErrors(validationErrors);
      return;
    }

    const question = buildEventQuestionFromDraft(draft, editingId || undefined);
    if (isEditing) onUpdateQuestion(editingId, question);
    else onAddQuestion(question);
    resetDraft();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setDraft({
      type: item.type,
      question: item.type === 'terms' ? '' : item.question,
      options: item.options?.length && CHOICE_TYPES.has(item.type) ? item.options : CHOICE_TYPES.has(item.type) ? ['', ''] : [],
      placeholder: item.placeholder || '',
      required: item.required !== false,
      termsText: item.termsText || '',
      checkboxLabel: item.checkboxLabel || 'I agree to the event terms',
    });
    setDraftErrors({});
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-bold text-primary">Customize Event Registration Forms</h2>
          <span className="rounded-full bg-[#F7F8FF] px-2 py-0.5 text-[11px] font-semibold text-primary">
            Optional
          </span>
        </div>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#717171]">
          Build the form guests complete after they open your campaign. You can continue without one.
          Drag questions to change the order.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem]">
        <div className="space-y-5">
          <div className="space-y-4 rounded-xl border border-[#EEF0F4] bg-white p-4 sm:p-5">
            <div>
              <FieldLabel>Answer Type</FieldLabel>
              <p className="mb-2 text-xs text-[#717171]">{EVENT_QUESTION_TYPES[draft.type].description}</p>
              <QuestionTypePicker value={draft.type} onChange={setType} />
            </div>

            {!isTerms ? (
              <div>
                <FieldLabel htmlFor="event-question-text">Question</FieldLabel>
                <input
                  id="event-question-text"
                  value={draft.question}
                  onChange={(event) => setDraft((prev) => ({ ...prev, question: event.target.value }))}
                  placeholder={EVENT_QUESTION_TYPES[draft.type].questionHint || 'Will you attend in person?'}
                  className={inputClassName(draftErrors.question)}
                />
                <FieldError message={draftErrors.question} />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <FieldLabel htmlFor="event-terms-text">Terms & Conditions</FieldLabel>
                  <textarea
                    id="event-terms-text"
                    rows={3}
                    value={draft.termsText}
                    onChange={(event) => setDraft((prev) => ({ ...prev, termsText: event.target.value }))}
                    placeholder="Describe what guests are agreeing to..."
                    className={clsx(inputClassName(draftErrors.termsText), 'resize-none')}
                  />
                  <FieldError message={draftErrors.termsText} />
                </div>
                <div>
                  <FieldLabel htmlFor="event-terms-label">Checkbox label</FieldLabel>
                  <input
                    id="event-terms-label"
                    value={draft.checkboxLabel}
                    onChange={(event) => setDraft((prev) => ({ ...prev, checkboxLabel: event.target.value }))}
                    className={inputClassName()}
                  />
                </div>
              </div>
            )}

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
                          onClick={() =>
                            setDraft((prev) => ({
                              ...prev,
                              options: prev.options.filter((_, optionIndex) => optionIndex !== index),
                            }))
                          }
                          className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] text-[#9AA0B0] hover:text-[#E5484D]"
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
                  onClick={() => setDraft((prev) => ({ ...prev, options: [...prev.options, ''] }))}
                  className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold text-primary"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Add
                </button>
                <FieldError message={draftErrors.options} />
              </div>
            ) : null}

            {PLACEHOLDER_TYPES.has(draft.type) ? (
              <div>
                <FieldLabel htmlFor="event-question-placeholder">Placeholder</FieldLabel>
                {draft.type === 'freeText' ? (
                  <textarea
                    id="event-question-placeholder"
                    rows={3}
                    value={draft.placeholder}
                    onChange={(event) => setDraft((prev) => ({ ...prev, placeholder: event.target.value }))}
                    placeholder={EVENT_QUESTION_TYPES[draft.type].examplePlaceholder}
                    className={clsx(inputClassName(), 'resize-none')}
                  />
                ) : (
                  <input
                    id="event-question-placeholder"
                    value={draft.placeholder}
                    onChange={(event) => setDraft((prev) => ({ ...prev, placeholder: event.target.value }))}
                    placeholder={EVENT_QUESTION_TYPES[draft.type].examplePlaceholder}
                    className={inputClassName()}
                  />
                )}
                <p className="mt-1.5 text-xs text-[#9AA0B0]">
                  Guests see this hint inside the field. Leave it blank to use “
                  {EVENT_QUESTION_TYPES[draft.type].examplePlaceholder}”.
                </p>
              </div>
            ) : null}

            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-[#0B1354]">Is this field required?</legend>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: true, label: 'Required', hint: 'Guests must answer' },
                  { value: false, label: 'Optional', hint: 'Guests can skip it' },
                ].map((option) => {
                  const selected = draft.required === option.value;
                  return (
                    <button
                      key={option.label}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setDraft((prev) => ({ ...prev, required: option.value }))}
                      className={clsx(
                        'cursor-pointer rounded-lg border px-3 py-2.5 text-left transition-colors',
                        selected
                          ? 'border-primary bg-[#F7F8FF] ring-2 ring-primary/10'
                          : 'border-[#E4E8EF] bg-white hover:border-primary/25',
                      )}
                    >
                      <span className="block text-sm font-semibold text-[#0B1354]">
                        {option.label}
                        {option.value ? <span className="text-[#E5484D]"> *</span> : null}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#717171]">{option.hint}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] hover:bg-[#320EB8]"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                {isEditing ? 'Update Question' : 'Add Question'}
              </button>
              {isEditing ? (
                <button
                  type="button"
                  onClick={resetDraft}
                  className="cursor-pointer rounded-lg border border-[#E4E4E7] px-4 py-2.5 text-sm font-semibold text-[#717171]"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <p className="text-sm font-bold text-[#0B1354]">Questions</p>
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] font-semibold text-primary">
                <ListChecks className="h-3 w-3" strokeWidth={2.5} />
                {questions.length}
              </span>
            </div>

            {questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-[#E4E8EF] px-6 py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F5F8] text-[#C8CDD8]">
                  <CircleHelp className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <p className="mt-3 text-sm font-semibold text-[#717171]">No Questions Added yet</p>
                <p className="mt-1 text-xs text-[#9AA0B0]">Start adding questions using the form above</p>
              </div>
            ) : (
              <Reorder.Group axis="y" values={questions} onReorder={onReorderQuestions} className="space-y-2">
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
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <p className="mb-3 text-center text-sm font-semibold text-[#0B1354]">Guest preview</p>
          <RegistrationPreview title={formTitle} questions={questions} />
        </aside>
      </div>
    </div>
  );
}
