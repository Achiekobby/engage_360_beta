import { useEffect, useMemo, useRef, useState } from 'react';
import { Form, Formik, useFormikContext } from 'formik';
import { clsx } from 'clsx';
import {
  Award,
  Bell,
  CalendarDays,
  Eye,
  Gift,
  MessageSquare,
  Pencil,
  Plus,
  Wallet,
} from 'lucide-react';
import {
  ALERT_DAY_OPTIONS,
  ANNIVERSARY_TIME_OPTIONS,
  APPROVAL_OPTIONS,
  ATTACHMENT_SIZE_GUIDES,
  CHANNEL_OPTIONS,
  CTA_OPTIONS,
  DEFAULT_AUTOMATION_SETTINGS,
  OFFER_SETUP_OPTIONS,
  OFFER_VISUAL_OPTIONS,
  SENDING_TIME_OPTIONS,
  applyEnabledDefaults,
  getPopulatedAutomationSettings,
  getSettingsUiCopy,
} from './settingsData';
import { getAutomationSettingsSchema } from './settingsValidation';
import { SettingsKindProvider, useSettingsKindCopy } from './settingsKindContext';
import AttachmentOnlySetup from './AttachmentOnlySetup';
import AutomationCustomerPreview from './AutomationCustomerPreview';
import MediaTypeCards from './MediaTypeCards';
import MessageTemplateDrawer from './MessageTemplateDrawer';
import SlideDrawer from '../customers/SlideDrawer';
import {
  SettingsSection,
  SettingsSelectField,
  SettingsTextArea,
  SettingsTextField,
  SettingsUploadField,
  ToolbarSelect,
} from './AutomationSettingsFields';

const KIND_ICONS = {
  gift: Gift,
  message: MessageSquare,
  award: Award,
  calendar: CalendarDays,
  bell: Bell,
  wallet: Wallet,
};

function ChannelToolbar({ onOpenTemplates, activeTemplateName, onChannelChange }) {
  const { values, setFieldValue, errors, touched } = useFormikContext();

  return (
    <>
      <ToolbarSelect
        value={values.channel}
        onChange={(event) => {
          const next = event.target.value;
          setFieldValue('channel', next);
          onChannelChange?.(next);
        }}
        options={CHANNEL_OPTIONS}
        ariaLabel="Select channel"
        hasError={Boolean(touched.channel && errors.channel)}
        minWidthClass="min-w-[9.5rem]"
      />
      <button
        type="button"
        onClick={onOpenTemplates}
        className="cursor-pointer rounded-full border border-[#E4E4E7] bg-white px-4 py-2 text-sm font-semibold text-[#0B1354] transition-colors hover:border-primary/30 hover:bg-[#F7F8FF]"
      >
        {activeTemplateName ? 'Change Template' : 'Choose Template'}
      </button>
    </>
  );
}

function OfferSetupToolbar() {
  const { values, setFieldValue } = useFormikContext();

  return (
    <ToolbarSelect
      value={values.offerSetup}
      onChange={(event) => {
        const next = event.target.value;
        setFieldValue('offerSetup', next);
        if (next === 'attachment-only') {
          setFieldValue('attachmentType', 'image');
        }
      }}
      options={OFFER_SETUP_OPTIONS}
      ariaLabel="Offer set-up"
      minWidthClass="min-w-[11.5rem]"
    />
  );
}

function ExtraAttachments() {
  const { values, setFieldValue } = useFormikContext();

  return (
    <button
      type="button"
      onClick={() =>
        setFieldValue('extraAttachments', [
          ...values.extraAttachments,
          `Attachment ${values.extraAttachments.length + 2}`,
        ])
      }
      className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
    >
      <Plus className="h-4 w-4" strokeWidth={2.5} />
      Another attachment
      {values.extraAttachments.length > 0 ? (
        <span className="text-[#717171]">({values.extraAttachments.length} added)</span>
      ) : null}
    </button>
  );
}

function OfferSetupFields() {
  const { values, setFieldValue } = useFormikContext();
  const { help, placeholders } = useSettingsKindCopy();

  return (
    <div className="space-y-5">
      <SettingsTextArea
        id="description"
        name="description"
        label="Description"
        placeholder={placeholders.description}
        rows={5}
        help={help.description}
      />

      <SettingsUploadField
        id="bannerName"
        name="bannerName"
        label="Banner"
        optional
        help={help.bannerName}
        previewKey="bannerPreviewUrl"
        sizeKey="bannerFileSize"
        bytesKey="bannerFileBytes"
        sizeGuide={ATTACHMENT_SIZE_GUIDES.image}
        attachmentType="image"
      />

      <MediaTypeCards
        label="Offer Visual"
        help={help.offerVisual}
        options={OFFER_VISUAL_OPTIONS}
        value={values.offerVisual || 'image'}
        onChange={(next) => setFieldValue('offerVisual', next)}
        errorName="offerVisual"
        centered
      />

      <div>
        <SettingsUploadField
          id="attachmentName"
          name="attachmentName"
          label="Attachment"
          optional
          help={help.attachmentName}
          previewKey="attachmentPreviewUrl"
          sizeKey="attachmentFileSize"
          bytesKey="attachmentFileBytes"
          mimeKey="attachmentMimeType"
          sizeGuide={ATTACHMENT_SIZE_GUIDES.image}
          attachmentType="image"
        />
        <ExtraAttachments />
      </div>

      <SettingsTextField
        id="voucherCode"
        name="voucherCode"
        label="Voucher / Offer Code"
        placeholder={placeholders.voucherCode}
        optional
        help={help.voucherCode}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <SettingsTextField
          id="offerExpiryDate"
          name="offerExpiryDate"
          label="Offer Expiry Date"
          placeholder="Select"
          type="date"
          help={help.offerExpiryDate}
        />
        <SettingsTextField
          id="price"
          name="price"
          label="Price"
          placeholder="Enter price"
          help={help.price}
        />
        <SettingsTextField
          id="discountedPrice"
          name="discountedPrice"
          label="Discounted Price"
          placeholder="Enter discounted price"
          help={help.discountedPrice}
        />
      </div>
    </div>
  );
}

function AdditionalSetupBody() {
  const { values } = useFormikContext();

  if (values.offerSetup === 'message-only') return null;
  if (values.offerSetup === 'attachment-only') return <AttachmentOnlySetup />;
  return <OfferSetupFields />;
}

function CtaFieldEffects() {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (values.callToAction !== 'other' && values.customCtaLabel) {
      setFieldValue('customCtaLabel', '');
    }
  }, [values.callToAction, values.customCtaLabel, setFieldValue]);

  useEffect(() => {
    if (!values.callToAction && values.ctaLink) {
      setFieldValue('ctaLink', '');
    }
  }, [values.callToAction, values.ctaLink, setFieldValue]);

  return null;
}

function EnabledDefaultsEffect({ kindId }) {
  const { values, setValues } = useFormikContext();
  const wasEnabledRef = useRef(values.enabled);
  const valuesRef = useRef(values);
  valuesRef.current = values;

  useEffect(() => {
    const justEnabled = values.enabled && !wasEnabledRef.current;
    wasEnabledRef.current = values.enabled;

    if (!justEnabled) return;

    setValues(
      applyEnabledDefaults(valuesRef.current, getPopulatedAutomationSettings(kindId)),
      false,
    );
  }, [values.enabled, setValues, kindId]);

  return null;
}

export default function AutomationSettingsForm({
  kindId = 'birthday',
  initialValues = DEFAULT_AUTOMATION_SETTINGS,
  title,
  subtitle,
  onClose,
  onSaved,
}) {
  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(false);
  const [previewDrawerOpen, setPreviewDrawerOpen] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState('');
  const [activeTemplateName, setActiveTemplateName] = useState('');

  const uiCopy = useMemo(() => getSettingsUiCopy(kindId), [kindId]);
  const validationSchema = useMemo(() => getAutomationSettingsSchema(kindId), [kindId]);
  const HeaderIcon = KIND_ICONS[uiCopy.headerIcon] ?? Gift;
  const pageTitle = title ?? uiCopy.title;
  const pageSubtitle = subtitle ?? uiCopy.subtitle;

  return (
    <SettingsKindProvider kindId={kindId}>
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values, helpers) => {
        onSaved?.(values);
        helpers.setSubmitting(false);
      }}
    >
      {({ values, setFieldValue, isSubmitting, setFieldTouched }) => (
        <Form className="space-y-5 sm:space-y-6" noValidate>
          <CtaFieldEffects />
          <EnabledDefaultsEffect kindId={kindId} />
          <MessageTemplateDrawer
            isOpen={templateDrawerOpen}
            onClose={() => setTemplateDrawerOpen(false)}
            channel={values.channel || 'sms'}
            kindId={kindId}
            activeTemplateId={activeTemplateId}
            onUse={(template) => {
              const setup = template.offerSetup || 'message-only';

              setFieldValue('offerSetup', setup);
              setFieldValue('title', template.title);
              setFieldValue('message', template.message);
              setFieldValue('callToAction', template.callToAction);
              setFieldValue('customCtaLabel', '');
              setFieldValue('ctaLink', template.ctaLink || '');

              if (setup === 'offer-setup') {
                setFieldValue('description', template.description || '');
                setFieldValue('voucherCode', template.voucherCode || '');
                setFieldValue('offerVisual', template.offerVisual || 'image');
                setFieldValue('price', template.price || '');
                setFieldValue('discountedPrice', template.discountedPrice || '');
                setFieldValue('attachmentType', 'image');
              } else if (setup === 'attachment-only') {
                setFieldValue('attachmentType', template.attachmentType || 'image');
                setFieldValue('description', '');
                setFieldValue('voucherCode', '');
                setFieldValue('price', '');
                setFieldValue('discountedPrice', '');
              } else {
                setFieldValue('description', '');
                setFieldValue('voucherCode', '');
                setFieldValue('price', '');
                setFieldValue('discountedPrice', '');
              }

              setFieldTouched('title', false);
              setFieldTouched('message', false);
              setFieldTouched('callToAction', false);
              setFieldTouched('ctaLink', false);
              setActiveTemplateId(template.id);
              setActiveTemplateName(template.name);
              setTemplateDrawerOpen(false);
            }}
          />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                <HeaderIcon className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#0B1354] sm:text-[1.75rem]">
                  {pageTitle}
                </h1>
                <p className="mt-1 text-sm text-[#717171] sm:text-base">{pageSubtitle}</p>
              </div>
            </div>

            <div className="inline-flex self-start rounded-full bg-[#F0F2F7] p-1">
              <button
                type="button"
                onClick={() => setFieldValue('enabled', true)}
                className={clsx(
                  'cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors',
                  values.enabled
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-[#717171] hover:text-[#0B1354]',
                )}
              >
                Enable
              </button>
              <button
                type="button"
                onClick={() => setFieldValue('enabled', false)}
                className={clsx(
                  'cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors',
                  !values.enabled
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-[#717171] hover:text-[#0B1354]',
                )}
              >
                Disable
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-6 lg:gap-8">
            <div className="min-w-0 space-y-5 sm:space-y-6 lg:col-span-4">
              <SettingsSection title="Basic Settings">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                  <SettingsSelectField
                    id="approvalOption"
                    name="approvalOption"
                    label={uiCopy.labels.approvalOption}
                    placeholder={uiCopy.placeholders.approvalOption}
                    options={APPROVAL_OPTIONS}
                    help={uiCopy.help.approvalOption}
                  />
                  <SettingsSelectField
                    id="alertDays"
                    name="alertDays"
                    label={uiCopy.labels.alertDays}
                    placeholder={uiCopy.placeholders.alertDays}
                    options={ALERT_DAY_OPTIONS}
                    help={uiCopy.help.alertDays}
                  />
                  <SettingsSelectField
                    id="sendingTime"
                    name="sendingTime"
                    label={uiCopy.labels.sendingTime}
                    placeholder={uiCopy.placeholders.sendingTime}
                    options={SENDING_TIME_OPTIONS}
                    help={uiCopy.help.sendingTime}
                  />
                  {kindId === 'anniversary' ? (
                    <SettingsSelectField
                      id="anniversaryTime"
                      name="anniversaryTime"
                      label={uiCopy.labels.anniversaryTime}
                      placeholder={uiCopy.placeholders.anniversaryTime}
                      options={ANNIVERSARY_TIME_OPTIONS}
                      help={uiCopy.help.anniversaryTime}
                    />
                  ) : null}
                </div>
              </SettingsSection>

              <SettingsSection
                title="Channel & Message"
                actions={
                  <ChannelToolbar
                    onOpenTemplates={() => setTemplateDrawerOpen(true)}
                    activeTemplateName={activeTemplateName}
                    onChannelChange={() => {
                      setActiveTemplateId('');
                      setActiveTemplateName('');
                    }}
                  />
                }
              >
                {activeTemplateName ? (
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-sm border border-[#EDE8F8] bg-[#F7F8FF] px-3 py-2.5">
                    <p className="text-xs text-[#5B5F7B]">
                      Using template:{' '}
                      <span className="font-semibold text-[#0B1354]">{activeTemplateName}</span>
                      . You can edit any field below.
                    </p>
                    <button
                      type="button"
                      onClick={() => setTemplateDrawerOpen(true)}
                      className="cursor-pointer text-xs font-semibold text-primary hover:text-primary/80"
                    >
                      Browse templates
                    </button>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                  <SettingsTextField
                    id="title"
                    name="title"
                    label={uiCopy.labels.title}
                    placeholder={uiCopy.placeholders.title}
                    help={uiCopy.help.title}
                  />
                  <SettingsSelectField
                    id="callToAction"
                    name="callToAction"
                    label={uiCopy.labels.callToAction}
                    placeholder={uiCopy.placeholders.callToAction}
                    options={CTA_OPTIONS}
                    help={uiCopy.help.callToAction}
                  />
                  {values.callToAction === 'other' ? (
                    <SettingsTextField
                      id="customCtaLabel"
                      name="customCtaLabel"
                      label={uiCopy.labels.customCtaLabel}
                      placeholder={uiCopy.placeholders.customCtaLabel}
                      help={uiCopy.help.customCtaLabel}
                    />
                  ) : null}
                  {values.callToAction ? (
                    <SettingsTextField
                      id="ctaLink"
                      name="ctaLink"
                      label={uiCopy.labels.ctaLink}
                      placeholder={uiCopy.placeholders.ctaLink}
                      type="url"
                      help={uiCopy.help.ctaLink}
                    />
                  ) : null}
                  <div className="md:col-span-2">
                    <SettingsTextArea
                      id="message"
                      name="message"
                      label={uiCopy.labels.message}
                      placeholder={uiCopy.placeholders.message}
                      rows={5}
                      help={uiCopy.help.message}
                    />
                  </div>
                </div>
              </SettingsSection>

              <SettingsSection
                title="Additional Set-Up"
                actions={<OfferSetupToolbar />}
                showBody={values.offerSetup !== 'message-only'}
              >
                <AdditionalSetupBody />
              </SettingsSection>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(58,16,205,0.28)] transition-colors hover:bg-[#320EB8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Pencil className="h-4 w-4" strokeWidth={2} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex cursor-pointer items-center justify-center rounded-full border border-primary bg-white px-8 py-3 text-sm font-semibold text-primary transition-colors hover:bg-[#F7F8FF]"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="relative hidden min-w-0 lg:col-span-2 lg:block lg:h-full">
              <AutomationCustomerPreview variant="panel" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPreviewDrawerOpen(true)}
            className="fixed bottom-5 right-4 z-[200] inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(58,16,205,0.35)] transition-colors hover:bg-[#320EB8] lg:hidden"
          >
            <Eye className="h-4 w-4" strokeWidth={2} />
            Preview
          </button>

          <div className="lg:hidden">
            <SlideDrawer
              isOpen={previewDrawerOpen}
              onClose={() => setPreviewDrawerOpen(false)}
              title="Customer preview"
              subtitle="Live iPhone view for your selected channel."
              maxWidth="max-w-md"
            >
              <AutomationCustomerPreview variant="drawer" screenWidth={260} />
            </SlideDrawer>
          </div>
        </Form>
      )}
    </Formik>
    </SettingsKindProvider>
  );
}
