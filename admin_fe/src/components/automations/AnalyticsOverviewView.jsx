import { useMemo, useState } from 'react';
import {
  Award,
  Building2,
  Eye,
  Gift,
  MessageSquare,
  Wallet,
} from 'lucide-react';
import SlideOver from '../businesses/SlideOver';
import AutomationCustomerPreview from './AutomationCustomerPreview';
import {
  OverviewBadge,
  OverviewMediaField,
  OverviewSection,
  OverviewSelectField,
  OverviewStatusToggle,
  OverviewTextField,
} from './OverviewSettingsFields';
import {
  ALERT_DAY_OPTIONS,
  ANNIVERSARY_TIME_OPTIONS,
  APPROVAL_OPTIONS,
  CTA_OPTIONS,
  OFFER_VISUAL_OPTIONS,
  SENDING_TIME_OPTIONS,
  formatDisplayDate,
  getChannelLabel,
  getOfferSetupLabel,
  getOptionLabel,
  getOverviewCopy,
  getOverviewSettings,
} from './overviewSettingsData';

const KIND_ICONS = {
  gift: Gift,
  message: MessageSquare,
  award: Award,
  wallet: Wallet,
};

export default function AnalyticsOverviewView({
  kindId = 'birthday',
  onClose,
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const copy = useMemo(() => getOverviewCopy(kindId), [kindId]);
  const settings = useMemo(() => getOverviewSettings(kindId), [kindId]);
  const HeaderIcon = KIND_ICONS[copy.headerIcon] ?? Gift;
  const showOfferBody = settings.offerSetup !== 'message-only';

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <HeaderIcon className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-[#0B1354] sm:text-[1.75rem]">
              {copy.title}
            </h1>
            <p className="mt-1 text-sm text-[#717171] sm:text-base">{copy.subtitle}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#EDE8F8] bg-[#F7F8FF] px-3 py-1.5 text-xs font-semibold text-[#0B1354]">
              <Building2 className="h-3.5 w-3.5 text-primary" strokeWidth={2.25} />
              {settings.businessName}
              <span className="font-medium text-[#717171]">· read only</span>
            </div>
          </div>
        </div>

        <OverviewStatusToggle enabled={settings.enabled} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-6 lg:gap-8">
        <div className="min-w-0 space-y-5 sm:space-y-6 lg:col-span-4">
          <OverviewSection title="Basic Settings">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              <OverviewSelectField
                label={copy.labels.approvalOption}
                value={getOptionLabel(APPROVAL_OPTIONS, settings.approvalOption)}
              />
              <OverviewSelectField
                label={copy.labels.alertDays}
                value={getOptionLabel(ALERT_DAY_OPTIONS, settings.alertDays)}
              />
              <OverviewSelectField
                label={copy.labels.sendingTime}
                value={getOptionLabel(SENDING_TIME_OPTIONS, settings.sendingTime)}
              />
              {kindId === 'anniversary' ? (
                <OverviewSelectField
                  label={copy.labels.anniversaryTime}
                  value={getOptionLabel(ANNIVERSARY_TIME_OPTIONS, settings.anniversaryTime)}
                />
              ) : null}
            </div>
          </OverviewSection>

          <OverviewSection
            title="Channel & Message"
            actions={<OverviewBadge>{getChannelLabel(settings.channel)}</OverviewBadge>}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              <OverviewTextField label={copy.labels.title} value={settings.title} />
              <OverviewSelectField
                label={copy.labels.callToAction}
                value={getOptionLabel(CTA_OPTIONS, settings.callToAction)}
              />
              <div className="md:col-span-2">
                <OverviewTextField
                  label={copy.labels.message}
                  value={settings.message}
                  multiline
                  rows={5}
                />
              </div>
            </div>
          </OverviewSection>

          <OverviewSection
            title="Additional Set-Up"
            actions={<OverviewBadge>{getOfferSetupLabel(settings.offerSetup)}</OverviewBadge>}
            showBody={showOfferBody}
          >
            {settings.offerSetup === 'attachment-only' ? (
              <OverviewMediaField
                label={copy.labels.attachmentName}
                previewUrl={settings.attachmentPreviewUrl}
                fileName={settings.attachmentName}
                optional
              />
            ) : (
              <div className="space-y-5">
                <OverviewTextField
                  label={copy.labels.description}
                  value={settings.description}
                  multiline
                  rows={5}
                />

                <OverviewMediaField
                  label={copy.labels.bannerName}
                  previewUrl={settings.bannerPreviewUrl}
                  fileName={settings.bannerName}
                  optional
                />

                <OverviewSelectField
                  label={copy.labels.offerVisual}
                  value={getOptionLabel(OFFER_VISUAL_OPTIONS, settings.offerVisual)}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                  <OverviewTextField
                    label={copy.labels.voucherCode}
                    value={settings.voucherCode}
                    optional
                  />
                  <OverviewMediaField
                    label={copy.labels.attachmentName}
                    previewUrl={settings.attachmentPreviewUrl}
                    fileName={settings.attachmentName}
                    optional
                  />
                  <OverviewTextField
                    label={copy.labels.offerExpiryDate}
                    value={formatDisplayDate(settings.offerExpiryDate)}
                  />
                  <OverviewTextField label={copy.labels.price} value={settings.price} />
                  <OverviewTextField
                    label={copy.labels.discountedPrice}
                    value={settings.discountedPrice}
                  />
                </div>
              </div>
            )}
          </OverviewSection>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-primary bg-white px-8 py-3 text-sm font-semibold text-primary transition-colors hover:bg-[#F7F8FF]"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#F0F2F7] px-6 py-3 text-sm font-semibold text-[#0B1354] transition-colors hover:bg-[#E8EAF2] lg:hidden"
            >
              <Eye className="h-4 w-4" strokeWidth={2} />
              Customer view
            </button>
          </div>
        </div>

        <div className="relative hidden min-w-0 lg:col-span-2 lg:block">
          <AutomationCustomerPreview values={settings} variant="panel" />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPreviewOpen(true)}
        className="fixed bottom-5 right-4 z-[200] inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(58,16,205,0.35)] transition-colors hover:bg-[#320EB8] lg:hidden"
      >
        <Eye className="h-4 w-4" strokeWidth={2} />
        Customer view
      </button>

      <SlideOver
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Customer preview"
      >
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <p className="mb-5 text-sm text-[#717171]">
            Live phone view for the selected channel.
          </p>
          <AutomationCustomerPreview values={settings} variant="drawer" />
        </div>
      </SlideOver>
    </div>
  );
}
