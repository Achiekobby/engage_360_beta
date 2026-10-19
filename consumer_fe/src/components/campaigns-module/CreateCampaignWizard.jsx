import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Mail,
  MessageSquare,
  Plus,
  Smartphone,
} from 'lucide-react';
import { clsx } from 'clsx';
import CampaignWizardStepper from './CampaignWizardStepper';
import CampaignMobilePreview from './CampaignMobilePreview';
import CustomerTargetingStep from './CustomerTargetingStep';
import CustomerScanningStep, { CustomerListPreviewModal } from './CustomerScanningStep';
import CampaignReviewStage from './CampaignReviewStage';
import PromoVisualPicker from './PromoVisualPicker';
import LeadGenerationFormStep from './LeadGenerationFormStep';
import SalesConversionMessageStep from './SalesConversionMessageStep';
import SalesConversionAttachmentStep from './SalesConversionAttachmentStep';
import ServiceAlertsMessageStep from './ServiceAlertsMessageStep';
import ServiceAlertsAttachmentStep from './ServiceAlertsAttachmentStep';
import EventsActivationMessageStep from './EventsActivationMessageStep';
import EventsActivationCombinedStep from './EventsActivationCombinedStep';
import {
  FieldError,
  FieldLabel,
  FileUploadZone,
  inputClassName,
} from './WizardFormField';
import {
  CAMPAIGN_CHANNELS,
  CAMPAIGN_OBJECTIVES,
  CAMPAIGNS_BASE,
  createCampaignFromForm,
  createDefaultSegmentFilters,
  createEmptyBanner,
  createEmptyEventDetails,
  computeCustomerScanStats,
  detectPromoVisualFromFile,
  getDefaultObjectiveForCategory,
  getTemplateById,
  getWizardSteps,
  SAMPLE_SCAN_CUSTOMERS,
  SEGMENTATION_FILTER_TYPES,
  validateEventDetails,
  validateLeadQuestions,
} from './campaignsData';

function createEmptyAttachment(id) {
  return {
    id,
    promoVisual: 'image',
    file: null,
    fileName: '',
    previewUrl: '',
    fileMimeType: '',
    price: '',
    voucherCode: '',
    promoExpiryDate: '',
    discountedPrice: '',
  };
}

function revokePreviewUrl(url) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}

const CHANNEL_ICONS = {
  sms: MessageSquare,
  email: Mail,
  whatsapp: Smartphone,
  push: Bell,
};

const EMPTY_FORM = {
  name: '',
  objective: '',
  channel: 'sms',
  headline: '',
  body: '',
  description: '',
  cta: '',
  banner: createEmptyBanner(),
  attachments: [createEmptyAttachment('attachment-1')],
  supportContact: '',
  leadQuestions: [],
  event: createEmptyEventDetails(),
  registrationQuestions: [],
  customerSource: 'internal',
  customerCategory: '',
  collection: '',
  externalListFile: null,
  externalListFileName: '',
  externalListValidation: null,
  segmentFilters: createDefaultSegmentFilters(),
  reachMode: 'all',
  preferredReach: '',
  scheduleType: 'now',
  scheduleDate: '',
  scheduleTime: '',
};

const FIELD_HELP = {
  name: 'A clear internal name so your team can find this campaign later.',
  objective: 'Pick the goal that best matches what you want this campaign to achieve.',
  channel: 'Choose how customers will receive this message.',
  body: 'The main message your audience will read. Keep it concise and action-oriented.',
  headline: 'A short, attention-grabbing title shown with your message.',
  cta: 'The button or link text that prompts the customer to act.',
  description: 'Supporting details that give more context about your offer or announcement.',
  promoVisual: 'Choose the type of visual asset for this promo attachment.',
  price: 'The original price before any discount is applied.',
  voucherCode: 'Optional code customers can enter to redeem this offer.',
  promoExpiryDate: 'The date this promotional offer stops being valid.',
  discountedPrice: 'The reduced price customers will pay after the discount.',
  attachment: 'Upload an image or video for this promo. The preview will appear here once uploaded.',
  formTitle: 'The title customers see at the top of your lead capture form.',
  formIntro: 'A short message inviting customers to fill out the form. Sent alongside the form link.',
  customerSource:
    'Choose internal customers from your CRM or upload an external contact list.',
  customerCategory: 'Filter customers by the category they belong to in your system.',
  collection: 'Pick a saved collection or list of customers to target.',
  externalList: 'Upload a spreadsheet with customer contact details for this campaign.',
};

function wizardKind(step) {
  return ['message', 'attachment', 'targeting', 'scan'][step - 1];
}

function validateStep(step, form, options = false) {
  const flags = typeof options === 'boolean' ? { isLeadGeneration: options } : options;
  const isLeadGeneration = Boolean(flags.isLeadGeneration);
  const isEventActivation = Boolean(flags.isEventActivation);
  const isSalesConversion = Boolean(flags.isSalesConversion);
  const isServiceAlerts = Boolean(flags.isServiceAlerts);
  const kind = wizardKind(step);
  const errors = {};
  const skipsNameObjective = isSalesConversion || isEventActivation || isServiceAlerts;

  if (kind === 'message') {
    if (!skipsNameObjective) {
      if (!form.name.trim()) {
        errors.name = 'Enter a campaign name so you can identify it later.';
      }
      if (!form.objective) {
        errors.objective = 'Choose an objective that matches your goal.';
      }
    }
    if (!form.channel) {
      errors.channel = 'Select a channel to send this campaign.';
    }
    if (!form.body.trim()) {
      errors.body = isLeadGeneration
        ? 'Write the invitation message your audience will receive.'
        : isEventActivation
          ? 'Write the invite message your guests will receive.'
          : isServiceAlerts
            ? 'Write the service alert message your audience will receive.'
            : 'Write the message your audience will receive.';
    }
    if (!form.headline.trim()) {
      errors.headline = isLeadGeneration
        ? 'Add a title for your lead capture form.'
        : isSalesConversion
          ? 'Add a clear offer title for this campaign.'
          : isEventActivation
            ? 'Add an event title guests will recognize.'
            : isServiceAlerts
              ? 'Add a short alert title — e.g. Downtime or Maintenance.'
              : 'Add a short title for this message.';
    }

    if (isLeadGeneration) {
      const questionsError = validateLeadQuestions(form.leadQuestions);
      if (questionsError) {
        errors.leadQuestions = questionsError;
      }
    }
  }

  if (kind === 'attachment' && isEventActivation) {
    Object.assign(errors, validateEventDetails(form.event, form.attachments[0]));
  }

  if (kind === 'targeting') {
    if (form.customerSource === 'internal') {
      if (!form.customerCategory) {
        errors.customerCategory = 'Select a customer category to continue.';
      }
      if (!form.collection) {
        errors.collection = 'Select a collection to target.';
      }
    } else if (!form.externalListFileName) {
      errors.externalList = 'Upload a customer list file to continue.';
    } else if (form.externalListValidation?.status === 'error') {
      errors.externalList =
        form.externalListValidation.message || 'Fix the errors in your uploaded file to continue.';
    } else if (form.externalListValidation?.status !== 'success') {
      errors.externalList = 'Please wait for the file to finish validating.';
    } else if (form.externalListValidation.validRows === 0) {
      errors.externalList = 'No valid customer rows were found in this file.';
    }
  }

  if (kind === 'scan') {
    const stats = computeCustomerScanStats(form);

    if (form.reachMode === 'custom') {
      const reachValue = Number(form.preferredReach);

      if (!form.preferredReach.trim() || Number.isNaN(reachValue) || reachValue <= 0) {
        errors.preferredReach = 'Enter a valid number of customers to reach.';
      } else if (reachValue > stats.estimatedReach) {
        errors.preferredReach = `Cannot exceed the estimated reach of ${stats.estimatedReach.toLocaleString()}.`;
      }
    }
  }

  return errors;
}

const WIZARD_STAGE_CLASS = 'mx-auto w-full max-w-6xl';

export default function CreateCampaignWizard({
  route = 'direct',
  templateId = null,
  seedTemplate = null,
  categoryId = null,
  categoryLabel = null,
  onComplete,
}) {
  const navigate = useNavigate();
  const template = seedTemplate || getTemplateById(templateId);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    channel: seedTemplate?.channel || EMPTY_FORM.channel,
  }));
  const [errors, setErrors] = useState({});
  const [pendingSegmentType, setPendingSegmentType] = useState('');
  const [listPreviewType, setListPreviewType] = useState(null);

  const isLeadGeneration = categoryId === 'lead-generation';
  const isEventActivation = categoryId === 'events-activation';
  const isSalesConversion = categoryId === 'sales-conversion';
  const isServiceAlerts = categoryId === 'service-alerts';
  const wizardSteps = getWizardSteps(categoryId);
  const scanStep = wizardSteps.length;
  const reviewStep = scanStep + 1;
  const stepFlags = {
    isLeadGeneration,
    isEventActivation,
    isSalesConversion,
    isServiceAlerts,
  };

  const scanStats = computeCustomerScanStats(form);

  const availableSegmentTypes = Object.keys(SEGMENTATION_FILTER_TYPES).filter(
    (type) => !form.segmentFilters.some((filter) => filter.type === type),
  );

  const templateMode = route === 'template' && Boolean(template);
  const showPreview = step === 1 && !isLeadGeneration;
  const attachmentsRef = useRef(form.attachments);
  attachmentsRef.current = form.attachments;
  const bannerRef = useRef(form.banner);
  bannerRef.current = form.banner;
  const messageLabel =
    form.channel === 'email'
      ? 'Email Message'
      : form.channel === 'whatsapp'
        ? 'WhatsApp Message'
        : form.channel === 'push'
          ? 'Push Notification'
          : 'SMS Message';

  useEffect(() => {
    if (!template && !categoryLabel) return; 

    // Both routes share this effect. On the template route it also seeds
    // the message/questions from the chosen template; on the direct route
    // `template` is null so only the category-implied objective is applied
    // and everything else (name, message, questions, etc.) stays blank for
    // the user to fill in themselves.
    setForm((prev) => ({
      ...prev,
      headline: template?.headline || prev.headline,
      body: template?.body || prev.body,
      description: template?.description || prev.description,
      cta: template?.cta || prev.cta,
      name: prev.name || template?.name || '',
      objective:
        prev.objective || (categoryId ? getDefaultObjectiveForCategory(categoryId) : 'Promote Product'),
      channel: prev.channel || template?.channel || 'sms',
      leadQuestions:
        prev.leadQuestions.length > 0 ? prev.leadQuestions : template?.leadQuestions || [],
      registrationQuestions:
        prev.registrationQuestions.length > 0
          ? prev.registrationQuestions
          : template?.registrationQuestions || [],
    }));
  }, [template, categoryLabel, categoryId, templateMode]);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const updateAttachment = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));

    const errorKey = `attachments.${index}.${key}`;
    setErrors((prev) => {
      if (!prev[errorKey]) return prev;
      const next = { ...prev };
      delete next[errorKey];
      return next;
    });
  };

  const handleAttachmentFileChange = (index, file) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        revokePreviewUrl(item.previewUrl);

        return {
          ...item,
          file,
          fileName: file?.name || '',
          previewUrl: file ? URL.createObjectURL(file) : '',
          fileMimeType: file?.type || '',
        };
      }),
    }));

    const errorKey = `attachments.${index}.file`;
    setErrors((prev) => {
      if (!prev[errorKey]) return prev;
      const next = { ...prev };
      delete next[errorKey];
      return next;
    });
  };

  const addAnotherAttachment = () => {
    setForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, createEmptyAttachment(`attachment-${Date.now()}`)],
    }));
  };

  const removeAttachment = (index) => {
    setForm((prev) => {
      const attachment = prev.attachments[index];
      revokePreviewUrl(attachment?.previewUrl);

      return {
        ...prev,
        attachments: prev.attachments.filter((_, itemIndex) => itemIndex !== index),
      };
    });
  };

  useEffect(
    () => () => {
      attachmentsRef.current.forEach((attachment) => revokePreviewUrl(attachment.previewUrl));
      revokePreviewUrl(bannerRef.current?.previewUrl);
    },
    [],
  );

  const handleBannerChange = (file) => {
    setForm((prev) => {
      revokePreviewUrl(prev.banner?.previewUrl);

      const detected = detectPromoVisualFromFile(file);

      return {
        ...prev,
        banner: {
          file,
          fileName: file?.name || '',
          previewUrl: file ? URL.createObjectURL(file) : '',
          fileMimeType: file?.type || '',
          promoVisual: detected || prev.banner?.promoVisual || 'image',
        },
      };
    });

    setErrors((prev) => {
      if (!prev.banner) return prev;
      const next = { ...prev };
      delete next.banner;
      return next;
    });
  };

  const updateSegmentValue = (filterId, value) => {
    setForm((prev) => {
      const changedFilter = prev.segmentFilters.find((filter) => filter.id === filterId);
      const isRegionChange = changedFilter?.type === 'region';

      return {
        ...prev,
        segmentFilters: prev.segmentFilters.map((filter) => {
          if (filter.id === filterId) return { ...filter, value };
          if (isRegionChange && filter.type === 'location') {
            return { ...filter, value: '' };
          }
          return filter;
        }),
      };
    });

    const errorKey = `segmentFilters.${filterId}`;
    setErrors((prev) => {
      if (!prev[errorKey]) return prev;
      const next = { ...prev };
      delete next[errorKey];
      return next;
    });
  };

  const toggleSegmentCustom = (filterId) => {
    setForm((prev) => ({
      ...prev,
      segmentFilters: prev.segmentFilters.map((filter) =>
        filter.id === filterId ? { ...filter, custom: !filter.custom, value: '' } : filter,
      ),
    }));
    const errorKey = `segmentFilters.${filterId}`;
    setErrors((prev) => {
      if (!prev[errorKey]) return prev;
      const next = { ...prev };
      delete next[errorKey];
      return next;
    });
  };

  const removeSegmentFilter = (filterId) => {
    setForm((prev) => ({
      ...prev,
      segmentFilters: prev.segmentFilters.filter((filter) => filter.id !== filterId),
    }));
    setPendingSegmentType('');
  };

  const addSegmentFilter = (typeOverride) => {
    const segmentType = typeOverride || pendingSegmentType;

    if (!segmentType) {
      setErrors((prev) => ({
        ...prev,
        pendingSegment: 'Select a segmentation option before adding.',
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      segmentFilters: [
        ...prev.segmentFilters,
        { id: `${segmentType}-${Date.now()}`, type: segmentType, value: '' },
      ],
    }));
    setPendingSegmentType('');
    setErrors((prev) => {
      if (!prev.pendingSegment) return prev;
      const next = { ...prev };
      delete next.pendingSegment;
      return next;
    });
  };

  const handleExternalFileChange = (file) => {
    setForm((prev) => ({
      ...prev,
      externalListFile: file,
      externalListFileName: file?.name || '',
      externalListValidation: null,
    }));
    setErrors((prev) => {
      if (!prev.externalList) return prev;
      const next = { ...prev };
      delete next.externalList;
      return next;
    });
  };

  const handleExternalValidationChange = (validation) => {
    setForm((prev) => ({ ...prev, externalListValidation: validation }));
  };

  const addLeadQuestion = (question) => {
    setForm((prev) => ({ ...prev, leadQuestions: [...prev.leadQuestions, question] }));
    setErrors((prev) => {
      if (!prev.leadQuestions) return prev;
      const next = { ...prev };
      delete next.leadQuestions;
      return next;
    });
  };

  const updateLeadQuestion = (id, question) => {
    setForm((prev) => ({
      ...prev,
      leadQuestions: prev.leadQuestions.map((item) => (item.id === id ? question : item)),
    }));
  };

  const removeLeadQuestion = (id) => {
    setForm((prev) => ({
      ...prev,
      leadQuestions: prev.leadQuestions.filter((item) => item.id !== id),
    }));
  };

  const reorderLeadQuestions = (nextOrder) => {
    setForm((prev) => ({ ...prev, leadQuestions: nextOrder }));
  };

  const updateEvent = (patch) => {
    setForm((prev) => ({ ...prev, event: { ...prev.event, ...patch } }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((key) => {
        delete next[`event.${key}`];
      });
      if (patch.tickets) delete next['event.tickets'];
      return next;
    });
  };

  const addEventTicket = (ticket) => {
    setForm((prev) => ({
      ...prev,
      event: { ...prev.event, tickets: [...prev.event.tickets, ticket] },
    }));
    setErrors((prev) => {
      if (!prev['event.tickets']) return prev;
      const next = { ...prev };
      delete next['event.tickets'];
      return next;
    });
  };

  const removeEventTicket = (ticketId) => {
    setForm((prev) => ({
      ...prev,
      event: {
        ...prev.event,
        tickets: prev.event.tickets.filter((ticket) => ticket.id !== ticketId),
      },
    }));
  };

  const handleEventFileChange = (file) => {
    if (file && !detectPromoVisualFromFile(file)) {
      setErrors((prev) => ({
        ...prev,
        'attachments.0.file': 'Use an image, GIF, or video file.',
      }));
      return;
    }

    const detected = detectPromoVisualFromFile(file);
    handleAttachmentFileChange(0, file);
    if (detected) updateAttachment(0, 'promoVisual', detected);
  };

  const handleEventVisualChange = (nextVisual) => {
    const current = form.attachments[0];
    const detected = detectPromoVisualFromFile(
      current?.file || (current?.fileName ? { type: current.fileMimeType, name: current.fileName } : null),
    );
    if (current?.previewUrl && detected && detected !== nextVisual) {
      handleAttachmentFileChange(0, null);
    }
    updateAttachment(0, 'promoVisual', nextVisual);
  };

  const addRegistrationQuestion = (question) => {
    setForm((prev) => ({
      ...prev,
      registrationQuestions: [...prev.registrationQuestions, question],
    }));
  };

  const updateRegistrationQuestion = (id, question) => {
    setForm((prev) => ({
      ...prev,
      registrationQuestions: prev.registrationQuestions.map((item) =>
        item.id === id ? question : item,
      ),
    }));
  };

  const removeRegistrationQuestion = (id) => {
    setForm((prev) => ({
      ...prev,
      registrationQuestions: prev.registrationQuestions.filter((item) => item.id !== id),
    }));
  };

  const reorderRegistrationQuestions = (nextOrder) => {
    setForm((prev) => ({ ...prev, registrationQuestions: nextOrder }));
  };

  const handleNext = () => {
    const stepErrors = validateStep(step, form, stepFlags);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});

    if ((isSalesConversion || isEventActivation || isServiceAlerts) && step === 1) {
      setForm((prev) => ({
        ...prev,
        name: prev.name.trim() || prev.headline.trim(),
        objective: prev.objective || getDefaultObjectiveForCategory(categoryId),
      }));
    }

    if (step < scanStep) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePreview = () => {
    const stepErrors = validateStep(scanStep, form, stepFlags);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    setStep(reviewStep);
  };

  const handleCreateCampaign = () => {
    onComplete?.(createCampaignFromForm(form, route, templateId, categoryId));
  };

  const handleReachModeChange = (mode) => {
    setForm((prev) => ({
      ...prev,
      reachMode: mode,
      preferredReach: mode === 'all' ? '' : prev.preferredReach,
    }));
    setErrors((prev) => {
      if (!prev.preferredReach) return prev;
      const next = { ...prev };
      delete next.preferredReach;
      return next;
    });
  };

  const handlePreferredReachChange = (value) => {
    setForm((prev) => ({
      ...prev,
      preferredReach: value,
      reachMode: value ? 'custom' : prev.reachMode,
    }));
    setErrors((prev) => {
      if (!prev.preferredReach) return prev;
      const next = { ...prev };
      delete next.preferredReach;
      return next;
    });
  };

  const handleBack = () => {
    setErrors({});
    if (step === 1) {
      navigate(templateMode ? CAMPAIGNS_BASE : `${CAMPAIGNS_BASE}/management`);
      return;
    }
    setStep((prev) => prev - 1);
  };

  if (step === reviewStep) {
    return (
      <div className={WIZARD_STAGE_CLASS}>
        <CampaignReviewStage
          form={form}
          scanStats={scanStats}
          template={template}
          templateMode={templateMode}
          isLeadGeneration={isLeadGeneration}
          isEventActivation={isEventActivation}
          isSalesConversion={isSalesConversion}
          isServiceAlerts={isServiceAlerts}
          onBack={() => setStep(scanStep)}
          onEdit={() => setStep(1)}
          onProceed={handleCreateCampaign}
        />

        <CustomerListPreviewModal
          isOpen={Boolean(listPreviewType)}
          title={listPreviewType === 'valid' ? 'Valid Customers' : 'Invalid Customers'}
          customers={SAMPLE_SCAN_CUSTOMERS[listPreviewType] || []}
          onClose={() => setListPreviewType(null)}
        />
      </div>
    );
  }

  return (
    <div className={WIZARD_STAGE_CLASS}>
      <div className="mb-6 flex items-center gap-3">
        <Link
          to={templateMode ? CAMPAIGNS_BASE : `${CAMPAIGNS_BASE}/management`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[#EEF0F4] bg-white text-[#717171] transition-colors hover:border-primary/20 hover:bg-[#F7F8FF] hover:text-primary"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {isSalesConversion
              ? 'Sales Conversion'
              : isEventActivation
                ? 'Events & Activation'
                : isServiceAlerts
                  ? 'Service Alerts'
                  : templateMode
                    ? 'From a template'
                    : 'From scratch'}
          </p>
          <h1 className="text-xl font-bold text-[#0B1354] sm:text-2xl">
            {isSalesConversion
              ? 'Create Sales Campaign'
              : isEventActivation
                ? 'Create Event Campaign'
                : isServiceAlerts
                  ? 'Create Service Alert'
                  : 'Create Campaign'}
          </h1>
        </div>
      </div>

      <div className="rounded-sm border border-[#EEF0F4] bg-white shadow-[0_4px_24px_rgba(11,19,84,0.06)]">
        <div className="border-b border-[#F0F2F7] bg-[#FAFBFC] px-5 py-5 sm:px-8">
          <CampaignWizardStepper currentStep={step} steps={wizardSteps} />
        </div>

        <div
          className={clsx(
            'grid gap-8 overflow-visible p-5 sm:p-8',
            showPreview ? 'lg:grid-cols-[minmax(0,1fr)_18rem]' : '',
          )}
        >
          <div className="min-w-0">
            {step === 1 ? (
              <div className="space-y-6">
                {templateMode ? (
                  <div className="rounded-sm border border-primary/15 bg-[#F7F8FF] px-4 py-3 text-sm text-[#717171]">
                    Using template:{' '}
                    <span className="font-semibold text-[#0B1354]">{template.name}</span>. Edit the
                    content — the live preview updates as you type.
                  </div>
                ) : null}

                {isSalesConversion ? (
                  <SalesConversionMessageStep
                    form={form}
                    errors={errors}
                    onUpdate={update}
                    onBannerChange={handleBannerChange}
                  />
                ) : isServiceAlerts ? (
                  <ServiceAlertsMessageStep form={form} errors={errors} onUpdate={update} />
                ) : isEventActivation ? (
                  <EventsActivationMessageStep form={form} errors={errors} onUpdate={update} />
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <FieldLabel htmlFor="campaignName" help={FIELD_HELP.name}>
                          Campaign Name
                        </FieldLabel>
                        <input
                          id="campaignName"
                          value={form.name}
                          onChange={(event) => update('name', event.target.value)}
                          placeholder="Enter campaign name"
                          className={inputClassName(errors.name)}
                          aria-invalid={Boolean(errors.name)}
                        />
                        <FieldError message={errors.name} />
                      </div>

                      <div>
                        <FieldLabel htmlFor="objective" help={FIELD_HELP.objective}>
                          Campaign Objective
                        </FieldLabel>
                        <select
                          id="objective"
                          value={form.objective}
                          onChange={(event) => update('objective', event.target.value)}
                          className={clsx(inputClassName(errors.objective), 'cursor-pointer')}
                          aria-invalid={Boolean(errors.objective)}
                        >
                          <option value="">Select objective</option>
                          {CAMPAIGN_OBJECTIVES.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <FieldError message={errors.objective} />
                      </div>
                    </div>

                    <div>
                      <FieldLabel help={FIELD_HELP.channel}>Campaign Channel</FieldLabel>
                      <div
                        className={clsx(
                          'flex flex-wrap gap-x-6 gap-y-3 rounded-sm border px-4 py-3.5',
                          errors.channel
                            ? 'border-[#E5484D] bg-[#FFF5F5]'
                            : 'border-[#EEF0F4] bg-white',
                        )}
                      >
                        {CAMPAIGN_CHANNELS.map(({ id, label }) => {
                          const Icon = CHANNEL_ICONS[id];
                          const selected = form.channel === id;

                          return (
                            <label
                              key={id}
                              className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-[#0B1354]"
                            >
                              <input
                                type="radio"
                                name="channel"
                                className="sr-only"
                                checked={selected}
                                onChange={() => update('channel', id)}
                              />
                              <span
                                className={clsx(
                                  'flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors',
                                  selected ? 'border-primary' : 'border-[#C8CDD8]',
                                )}
                              >
                                {selected ? (
                                  <span className="h-2 w-2 rounded-full bg-primary" />
                                ) : null}
                              </span>
                              <Icon className="h-4 w-4 text-primary" strokeWidth={2} />
                              {label}
                            </label>
                          );
                        })}
                      </div>
                      <FieldError message={errors.channel} />
                    </div>

                    {isLeadGeneration ? (
                      <>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <FieldLabel htmlFor="headline" help={FIELD_HELP.formTitle}>
                              Form Title
                            </FieldLabel>
                            <input
                              id="headline"
                              value={form.headline}
                              onChange={(event) => update('headline', event.target.value)}
                              placeholder="Get Your Free Guide"
                              className={inputClassName(errors.headline)}
                              aria-invalid={Boolean(errors.headline)}
                            />
                            <FieldError message={errors.headline} />
                          </div>

                          <div>
                            <FieldLabel htmlFor="body" help={FIELD_HELP.formIntro}>
                              Invitation Message
                            </FieldLabel>
                            <input
                              id="body"
                              value={form.body}
                              onChange={(event) => update('body', event.target.value)}
                              placeholder="Tell us a bit about yourself to get started."
                              className={inputClassName(errors.body)}
                              aria-invalid={Boolean(errors.body)}
                            />
                            <FieldError message={errors.body} />
                          </div>
                        </div>

                        <div className="border-t border-[#F0F2F7] pt-6">
                          <p className="mb-4 text-sm font-bold text-[#0B1354]">
                            Build Your Lead Capture Form
                          </p>
                          <LeadGenerationFormStep
                            questions={form.leadQuestions}
                            onAddQuestion={addLeadQuestion}
                            onUpdateQuestion={updateLeadQuestion}
                            onRemoveQuestion={removeLeadQuestion}
                            onReorderQuestions={reorderLeadQuestions}
                            error={errors.leadQuestions}
                            formTitle={form.headline}
                            formIntro={form.body}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <FieldLabel htmlFor="body" help={FIELD_HELP.body}>
                            {messageLabel}
                          </FieldLabel>
                          <textarea
                            id="body"
                            value={form.body}
                            onChange={(event) => update('body', event.target.value)}
                            rows={4}
                            placeholder="Write your campaign message..."
                            className={clsx(inputClassName(errors.body), 'resize-none')}
                            aria-invalid={Boolean(errors.body)}
                          />
                          <FieldError message={errors.body} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <FieldLabel htmlFor="headline" help={FIELD_HELP.headline}>
                              Title
                            </FieldLabel>
                            <input
                              id="headline"
                              value={form.headline}
                              onChange={(event) => update('headline', event.target.value)}
                              placeholder="Exclusive summer flash sales"
                              className={inputClassName(errors.headline)}
                              aria-invalid={Boolean(errors.headline)}
                            />
                            <FieldError message={errors.headline} />
                          </div>

                          <div>
                            <FieldLabel htmlFor="cta" help={FIELD_HELP.cta}>
                              Call to Action
                            </FieldLabel>
                            <input
                              id="cta"
                              value={form.cta}
                              onChange={(event) => update('cta', event.target.value)}
                              placeholder="Buy Now"
                              className={inputClassName(errors.cta)}
                            />
                          </div>
                        </div>

                        <div>
                          <FieldLabel htmlFor="description" help={FIELD_HELP.description}>
                            Description
                          </FieldLabel>
                          <textarea
                            id="description"
                            value={form.description}
                            onChange={(event) => update('description', event.target.value)}
                            rows={4}
                            placeholder="Lorem ipsum lorem ipsum lorem"
                            className={clsx(inputClassName(errors.description), 'resize-none')}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            ) : null}

            {step === 2 && isEventActivation ? (
              <EventsActivationCombinedStep
                attachment={form.attachments[0]}
                event={form.event}
                errors={errors}
                registrationQuestions={form.registrationQuestions}
                formTitle={form.headline}
                onVisualChange={handleEventVisualChange}
                onFileChange={handleEventFileChange}
                onEventChange={updateEvent}
                onAddTicket={addEventTicket}
                onRemoveTicket={removeEventTicket}
                onAddQuestion={addRegistrationQuestion}
                onUpdateQuestion={updateRegistrationQuestion}
                onRemoveQuestion={removeRegistrationQuestion}
                onReorderQuestions={reorderRegistrationQuestions}
              />
            ) : null}

            {step === 2 && isSalesConversion ? (
              <SalesConversionAttachmentStep
                attachments={form.attachments}
                errors={errors}
                onUpdateAttachment={updateAttachment}
                onFileChange={handleAttachmentFileChange}
                onAddAttachment={addAnotherAttachment}
                onRemoveAttachment={removeAttachment}
              />
            ) : null}

            {step === 2 && isServiceAlerts ? (
              <ServiceAlertsAttachmentStep
                attachment={form.attachments[0]}
                supportContact={form.supportContact}
                errors={errors}
                onUpdateAttachment={updateAttachment}
                onFileChange={handleAttachmentFileChange}
                onSupportContactChange={(value) => update('supportContact', value)}
              />
            ) : null}

            {step === 2 && !isEventActivation && !isSalesConversion && !isServiceAlerts ? (
              <div className="space-y-8">
                {form.attachments.map((attachment, index) => (
                  <div key={attachment.id} className="space-y-5">
                    {form.attachments.length > 1 ? (
                      <div className="flex items-center justify-between border-b border-[#EEF0F4] pb-3">
                        <p className="text-sm font-semibold text-[#0B1354]">
                          Attachment {index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="cursor-pointer text-xs font-semibold text-[#E5484D] hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : null}

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-5">
                        <PromoVisualPicker
                          name={`promoVisual-${attachment.id}`}
                          value={attachment.promoVisual}
                          onChange={(nextValue) => updateAttachment(index, 'promoVisual', nextValue)}
                          help={FIELD_HELP.promoVisual}
                          error={errors[`attachments.${index}.promoVisual`]}
                        />

                        <FileUploadZone
                          id={`attachment-file-${attachment.id}`}
                          label="Attachment"
                          fileName={attachment.fileName}
                          previewUrl={attachment.previewUrl}
                          promoVisual={attachment.promoVisual}
                          fileMimeType={attachment.fileMimeType}
                          onChange={(file) => handleAttachmentFileChange(index, file)}
                          error={errors[`attachments.${index}.file`]}
                          help={FIELD_HELP.attachment}
                          compact
                        />
                      </div>

                      <div className="space-y-5">
                        <div>
                          <FieldLabel
                            htmlFor={`voucherCode-${attachment.id}`}
                            help={FIELD_HELP.voucherCode}
                          >
                            Voucher / Promo Code (Optional)
                          </FieldLabel>
                          <input
                            id={`voucherCode-${attachment.id}`}
                            value={attachment.voucherCode}
                            onChange={(event) =>
                              updateAttachment(index, 'voucherCode', event.target.value)
                            }
                            placeholder="GH58599"
                            className={inputClassName()}
                          />
                        </div>

                        <div>
                          <FieldLabel
                            htmlFor={`promoExpiryDate-${attachment.id}`}
                            help={FIELD_HELP.promoExpiryDate}
                          >
                            Promo Expiry Date
                          </FieldLabel>
                          <input
                            id={`promoExpiryDate-${attachment.id}`}
                            type="date"
                            value={attachment.promoExpiryDate}
                            onChange={(event) =>
                              updateAttachment(index, 'promoExpiryDate', event.target.value)
                            }
                            placeholder="25-06-2026"
                            className={inputClassName(errors[`attachments.${index}.promoExpiryDate`])}
                          />
                          <FieldError message={errors[`attachments.${index}.promoExpiryDate`]} />
                        </div>

                        <div>
                          <FieldLabel htmlFor={`price-${attachment.id}`} help={FIELD_HELP.price}>
                            Price
                          </FieldLabel>
                          <input
                            id={`price-${attachment.id}`}
                            value={attachment.price}
                            onChange={(event) => updateAttachment(index, 'price', event.target.value)}
                            placeholder="GH58599"
                            className={inputClassName(errors[`attachments.${index}.price`])}
                          />
                          <FieldError message={errors[`attachments.${index}.price`]} />
                        </div>

                        <div>
                          <FieldLabel
                            htmlFor={`discountedPrice-${attachment.id}`}
                            help={FIELD_HELP.discountedPrice}
                          >
                            Discounted Price
                          </FieldLabel>
                          <input
                            id={`discountedPrice-${attachment.id}`}
                            value={attachment.discountedPrice}
                            onChange={(event) =>
                              updateAttachment(index, 'discountedPrice', event.target.value)
                            }
                            placeholder="GH58599"
                            className={inputClassName(errors[`attachments.${index}.discountedPrice`])}
                          />
                          <FieldError message={errors[`attachments.${index}.discountedPrice`]} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={addAnotherAttachment}
                    className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#717171] transition-colors hover:text-primary"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    Another attachment
                  </button>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <CustomerTargetingStep
                targeting={{
                  customerSource: form.customerSource,
                  customerCategory: form.customerCategory,
                  collection: form.collection,
                  externalListFile: form.externalListFile,
                  externalListFileName: form.externalListFileName,
                  segmentFilters: form.segmentFilters,
                }}
                errors={errors}
                onUpdate={update}
                onExternalFileChange={handleExternalFileChange}
                onExternalValidationChange={handleExternalValidationChange}
                onSegmentValueChange={updateSegmentValue}
                onRemoveSegment={removeSegmentFilter}
                onAddSegment={addSegmentFilter}
                onToggleSegmentCustom={toggleSegmentCustom}
                pendingSegmentType={pendingSegmentType}
                onPendingSegmentChange={setPendingSegmentType}
                availableSegmentTypes={availableSegmentTypes}
              />
            ) : null}

            {step === 4 ? (
              <CustomerScanningStep
                stats={scanStats}
                reachMode={form.reachMode}
                preferredReach={form.preferredReach}
                errors={errors}
                onReachModeChange={handleReachModeChange}
                onPreferredReachChange={handlePreferredReachChange}
                onViewValid={() => setListPreviewType('valid')}
                onViewInvalid={() => setListPreviewType('invalid')}
              />
            ) : null}
          </div>

          {showPreview ? (
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-sm border border-[#EEF0F4] bg-[#FAFBFC] p-4 sm:p-5">
                <p className="mb-4 text-center text-sm font-semibold text-[#0B1354]">
                  Live Preview
                </p>
                <CampaignMobilePreview
                  channel={form.channel}
                  headline={form.headline}
                  body={form.body}
                  cta={form.cta}
                  templateMode={templateMode}
                  accent={template?.accent}
                  products={template?.products}
                />
              </div>
            </aside>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-[#F0F2F7] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <button
            type="button"
            onClick={handleBack}
            className="cursor-pointer rounded-sm border border-primary px-8 py-3 text-sm font-semibold text-primary transition-colors hover:bg-[#F7F8FF]"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          {step === scanStep ? (
            <button
              type="button"
              onClick={handlePreview}
              className="cursor-pointer rounded-sm bg-primary px-8 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all hover:bg-[#320EB8] sm:ml-auto"
            >
              Preview
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="cursor-pointer rounded-sm bg-primary px-8 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all hover:bg-[#320EB8] sm:ml-auto"
            >
              Continue
            </button>
          )}
        </div>
      </div>

      <CustomerListPreviewModal
        isOpen={Boolean(listPreviewType)}
        title={listPreviewType === 'valid' ? 'Valid Customers' : 'Invalid Customers'}
        customers={SAMPLE_SCAN_CUSTOMERS[listPreviewType] || []}
        onClose={() => setListPreviewType(null)}
      />
    </div>
  );
}
