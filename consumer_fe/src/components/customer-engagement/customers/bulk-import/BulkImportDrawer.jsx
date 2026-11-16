import { useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, Download, Loader2, Save } from 'lucide-react';
import SlideDrawer from '../SlideDrawer';
import ExcelUploader from './ExcelUploader';
import ValidationSummary from './ValidationSummary';
import ValidationIssuesTable from './ValidationIssuesTable';
import ImportActions from './ImportActions';
import TemplateFieldPicker from './TemplateFieldPicker';
import HeadingPreview from './HeadingPreview';
import { useContactImportWorkflow } from '../../../../hooks/useContactImportWorkflow';
import { useContactFields } from '../../../../hooks/useContactFields';
import {
  createCustomContactField,
  rememberContactField,
  saveContactFieldsConfiguration,
} from '../../../../services/customer-engagement/contactFields';
import { downloadContactsExcelTemplate } from '../../../../services/customer-engagement/contactImport';
import { IMPORT_STATUSES, normalizeHeaderName } from '../../../../utils/contact-import/constants';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { notifyError, notifySuccess } from '../../../../utils/toast';

function selectionSignature(columns = []) {
  return columns
    .map((field) => field.key)
    .filter(Boolean)
    .sort()
    .join('|');
}

export default function BulkImportDrawer({
  isOpen,
  onClose,
  collection,
  onImported,
}) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const token = useAppSelector((state) => state.auth.user?.token);
  const tokenType = useAppSelector((state) => state.auth.user?.tokenType) || 'Bearer';
  const bodyRef = useRef(null);
  const resultsRef = useRef(null);

  const workflow = useContactImportWorkflow({
    collectionId: collection?.id,
    token,
    tokenType,
  });
  const contactFields = useContactFields(isOpen);
  const [selectedKeys, setSelectedKeys] = useState(() => new Set());
  const [addedCustom, setAddedCustom] = useState([]);
  const [customDraft, setCustomDraft] = useState('');
  const [customError, setCustomError] = useState('');
  const [addingCustom, setAddingCustom] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [savedSignature, setSavedSignature] = useState('');

  const templateColumns = useMemo(() => {
    const optional = [...contactFields.recommended, ...contactFields.custom, ...addedCustom].filter(
      (field) => selectedKeys.has(field.key),
    );
    const seen = new Set(contactFields.standard.map((field) => field.key));
    return [
      ...contactFields.standard,
      ...optional.filter((field) => {
        if (seen.has(field.key)) return false;
        seen.add(field.key);
        return true;
      }),
    ];
  }, [addedCustom, contactFields.custom, contactFields.recommended, contactFields.standard, selectedKeys]);

  const currentSignature = selectionSignature(templateColumns);
  const configurationSaved = Boolean(savedSignature) && savedSignature === currentSignature;
  const missingFieldIds = templateColumns.filter((field) => !field.id);
  const canSaveConfiguration =
    templateColumns.length > 0 && missingFieldIds.length === 0 && !configurationSaved;

  useEffect(() => {
    if (isOpen) return undefined;
    workflow.reset();
    setSelectedKeys(new Set());
    setAddedCustom([]);
    setCustomDraft('');
    setCustomError('');
    setAddingCustom(false);
    setSavingConfig(false);
    setSavedSignature('');
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    const shouldScrollToResults =
      Boolean(workflow.fileMeta || workflow.error || workflow.validation) &&
      (workflow.status === IMPORT_STATUSES.PARSING ||
        workflow.status === IMPORT_STATUSES.VALIDATING ||
        workflow.status === IMPORT_STATUSES.NEEDS_ATTENTION ||
        workflow.status === IMPORT_STATUSES.READY_TO_UPLOAD ||
        workflow.status === IMPORT_STATUSES.UPLOADING ||
        workflow.status === IMPORT_STATUSES.PROCESSING ||
        workflow.status === IMPORT_STATUSES.FAILED ||
        workflow.status === IMPORT_STATUSES.COMPLETE);

    if (!shouldScrollToResults || !resultsRef.current) return undefined;

    const frame = window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [
    workflow.status,
    workflow.fileMeta,
    workflow.error,
    workflow.validation,
    workflow.fixSummary,
  ]);

  const busy =
    workflow.status === IMPORT_STATUSES.PARSING ||
    workflow.status === IMPORT_STATUSES.VALIDATING ||
    workflow.status === IMPORT_STATUSES.FIXING ||
    workflow.status === IMPORT_STATUSES.UPLOADING ||
    workflow.status === IMPORT_STATUSES.PROCESSING ||
    addingCustom ||
    savingConfig;

  const handleClose = () => {
    if (busy) return;
    onClose?.();
  };

  const showResults = Boolean(workflow.fileMeta || workflow.error || workflow.validation);

  const toggleField = (field) => {
    setSelectedKeys((current) => {
      const next = new Set(current);
      if (next.has(field.key)) {
        next.delete(field.key);
        return next;
      }
      next.add(field.key);
      if (field.exclusiveWith) next.delete(field.exclusiveWith);
      return next;
    });
  };

  const addCustomColumn = async () => {
    const label = customDraft.trim();
    const key = normalizeHeaderName(label);
    const known = new Set([
      ...contactFields.standard.map((field) => field.key),
      ...contactFields.recommended.map((field) => field.key),
      ...contactFields.custom.map((field) => field.key),
      ...addedCustom.map((field) => field.key),
    ]);

    if (!key) {
      setCustomError('Enter a column name to save.');
      return;
    }
    if (known.has(key)) {
      setCustomError('That column is already available.');
      return;
    }
    if (!token) {
      setCustomError('Sign in to save a custom column.');
      return;
    }

    setAddingCustom(true);
    setCustomError('');
    try {
      const field = await createCustomContactField(
        { key, label, type: 'string' },
        { token, tokenType },
      );
      setAddedCustom((current) =>
        current.some((item) => item.key === field.key) ? current : [...current, field],
      );
      setSelectedKeys((current) => new Set(current).add(field.key));
      setCustomDraft('');
      rememberContactField(field);
      queryClient.setQueryData(['contact-fields', token || 'guest'], (current) => {
        if (!current) return current;
        const custom = current.custom || [];
        if (custom.some((item) => item.key === field.key)) return current;
        return { ...current, custom: [...custom, field] };
      });
      dispatch(
        notifySuccess(`“${field.label}” was saved and included in this file.`, {
          title: 'Column saved',
        }),
      );
    } catch (error) {
      setCustomError(error?.message || 'Could not save that column.');
    } finally {
      setAddingCustom(false);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!canSaveConfiguration || savingConfig) return;
    if (!token) {
      dispatch(notifyError('Sign in to save the column configuration.', { title: 'Save failed' }));
      return;
    }

    setSavingConfig(true);
    try {
      await saveContactFieldsConfiguration(
        templateColumns.map((field) => field.id),
        { token, tokenType },
      );
      const hadFile = Boolean(workflow.fileMeta);
      setSavedSignature(currentSignature);
      if (hadFile) {
        await workflow.reset();
      }
      dispatch(
        notifySuccess(
          hadFile
            ? 'Column configuration saved. The previous file was removed. Upload a new file that includes these columns.'
            : 'Column configuration saved. You can download the template or upload a file.',
          { title: 'Configuration saved' },
        ),
      );
    } catch (error) {
      dispatch(
        notifyError(error?.message || 'Could not save the column configuration.', {
          title: 'Save failed',
        }),
      );
    } finally {
      setSavingConfig(false);
    }
  };

  const handleDownloadTemplate = () => {
    if (!templateColumns.length) return;
    downloadContactsExcelTemplate(templateColumns);
    dispatch(
      notifySuccess('Template downloaded with the columns you selected.', {
        title: 'Template ready',
      }),
    );
  };

  return (
    <SlideDrawer
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-7xl"
      bodyRef={bodyRef}
      title="Bulk upload contacts"
      subtitle={
        collection?.name
          ? `Import an Excel file into ${collection.name}. Phone numbers must start with 233 and be 12 digits.`
          : 'Import contacts from an Excel template. Phone number is required.'
      }
      footer={
        <ImportActions
          status={workflow.status}
          canAutoFix={workflow.canAutoFix}
          canImport={configurationSaved && workflow.canImport}
          validation={workflow.validation}
          fileSelected={Boolean(workflow.fileMeta)}
          busy={busy}
          onAutoFix={async () => {
            try {
              await workflow.autoFix();
              dispatch(
                notifySuccess('Safe fixes applied. Review any remaining issues.', {
                  title: 'Automatic fix complete',
                }),
              );
            } catch (error) {
              dispatch(
                notifyError(error?.message || 'Could not apply automatic fixes.', {
                  title: 'Fix failed',
                }),
              );
            }
          }}
          onDownloadCleaned={async () => {
            try {
              await workflow.downloadCleanedExcel();
              dispatch(
                notifySuccess('Cleaned Excel file downloaded.', {
                  title: 'Download ready',
                }),
              );
            } catch (error) {
              dispatch(
                notifyError(error?.message || 'Could not export cleaned Excel.', {
                  title: 'Download failed',
                }),
              );
            }
          }}
          onReupload={async () => {
            await workflow.reset();
            bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onImport={async () => {
            if (!configurationSaved) {
              dispatch(
                notifyError('Save the column configuration before uploading.', {
                  title: 'Configuration required',
                }),
              );
              return;
            }
            try {
              const result = await workflow.importContacts({
                configuredKeys: templateColumns.map((field) => field.key),
              });
              if (!result) return;

              const uploadStatus = String(result?.data?.status || 'completed').toLowerCase();
              if (uploadStatus === 'partial') {
                dispatch(
                  notifySuccess(
                    result?.message || 'Some contacts imported. Review the upload for failures.',
                    { title: 'Import partial' },
                  ),
                );
              } else {
                dispatch(
                  notifySuccess(result?.message || 'All contacts were imported successfully.', {
                    title: 'Import complete',
                  }),
                );
              }
              onImported?.(result, workflow.validation);
              onClose?.();
            } catch (error) {
              dispatch(
                notifyError(error?.message || 'Could not import contacts.', {
                  title: 'Import failed',
                }),
              );
            }
          }}
        />
      }
    >
      <div className="space-y-5">
        <section className="rounded-sm border border-[#EEF0F4] bg-white p-4 sm:p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#0B1354]">1. Choose columns</h3>
            <p className="mt-1 text-sm text-[#717171]">
              Required columns stay in place. Select recommended columns, or type a custom column
              and save it for the company.
            </p>
          </div>
          <TemplateFieldPicker
            columns={templateColumns}
            standard={contactFields.standard}
            recommended={contactFields.recommended}
            custom={[
              ...contactFields.custom,
              ...addedCustom.filter(
                (field) => !contactFields.custom.some((item) => item.key === field.key),
              ),
            ]}
            selectedKeys={selectedKeys}
            onToggle={toggleField}
            addedCustom={addedCustom}
            customDraft={customDraft}
            onCustomDraft={(value) => {
              setCustomDraft(value);
              setCustomError('');
            }}
            onAddCustom={addCustomColumn}
            addingCustom={addingCustom}
            onRemoveAdded={(key) => {
              setAddedCustom((current) => current.filter((field) => field.key !== key));
              setSelectedKeys((current) => {
                const next = new Set(current);
                next.delete(key);
                return next;
              });
            }}
            customError={customError}
            isLoading={contactFields.isLoading}
            loadError={contactFields.error}
            onRetry={() => contactFields.refetch()}
          />

          <div className="mt-6 border-t border-[#F0F2F7] pt-5">
            <h3 className="text-sm font-bold text-[#0B1354]">2. Save configuration</h3>
            <p className="mt-1 text-sm text-[#717171]">
              Save these columns for the company before upload becomes available.
            </p>
            {missingFieldIds.length ? (
              <p className="mt-2 text-sm text-[#717171]">
                Save needs a server id for every selected column
                {missingFieldIds.length
                  ? ` (${missingFieldIds.map((field) => field.label || field.key).join(', ')})`
                  : ''}
                . Retry loading the field list, then try again.
              </p>
            ) : null}
            {configurationSaved ? (
              <div className="mt-3 flex gap-2.5 rounded-sm border border-[#A7F3D0] bg-[#ECFDF5] px-3.5 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#047857]" strokeWidth={2} aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-[#047857]">Configuration saved</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#065F46]">
                    Download the template or upload a file whose headings match these columns.
                  </p>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSaveConfiguration}
                disabled={!canSaveConfiguration || savingConfig}
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#320EB8] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
              >
                {savingConfig ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                ) : (
                  <Save className="h-4 w-4" strokeWidth={2.5} />
                )}
                {savingConfig ? 'Saving…' : 'Save configuration'}
              </button>
            )}
            {!configurationSaved && savedSignature && savedSignature !== currentSignature ? (
              <p className="mt-2 text-sm text-[#854D0E]">
                Column choices changed. Save the configuration again before uploading.
              </p>
            ) : null}
          </div>

          <div className="mt-6 border-t border-[#F0F2F7] pt-5">
            <h3 className="text-sm font-bold text-[#0B1354]">3. Download template</h3>
            <p className="mt-1 text-sm text-[#717171]">
              The spreadsheet contains only the columns you configured above.
            </p>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              disabled={templateColumns.length === 0}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(58,16,205,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#320EB8] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
            >
              <Download className="h-4 w-4" strokeWidth={2.5} />
              Download template
            </button>
            <div className="mt-3 flex gap-2.5 rounded-sm border border-[#FACC15] bg-[#FEF9C3] px-3.5 py-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#A16207]" strokeWidth={2} aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-[#854D0E]">Using your own file</p>
                <p className="mt-1 text-sm leading-relaxed text-[#713F12]">
                  Columns you did not configure in step 1 are discarded. If your spreadsheet already
                  has extra columns, add them above and save again before you upload.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-[#F0F2F7] pt-5">
            <h3 className="text-sm font-bold text-[#0B1354]">4. Upload Excel file</h3>
            <p className="mt-1 mb-3 text-sm text-[#717171]">
              {configurationSaved
                ? 'Upload the template or your own file. Headings should match the configured columns. The file is validated, then uploaded with column mapping.'
                : 'Save the column configuration in step 2 before upload is available.'}
            </p>
            <ExcelUploader
              disabled={busy || !configurationSaved}
              fileMeta={workflow.fileMeta}
              onFileSelected={workflow.validateFile}
              onRemoveFile={async () => {
                await workflow.reset();
                bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onRejected={(message) =>
                dispatch(notifyError(message, { title: 'Unsupported file' }))
              }
            />
          </div>
        </section>

        {showResults ? (
          <div ref={resultsRef} className="space-y-5 scroll-mt-2">
            {workflow.validation?.headingPreview ? (
              <HeadingPreview preview={workflow.validation.headingPreview} />
            ) : null}
            <ValidationSummary
              status={workflow.status}
              progress={workflow.progress}
              progressMessage={workflow.progressMessage}
              validation={workflow.validation}
              fileMeta={workflow.fileMeta}
              error={workflow.error}
              fixSummary={workflow.fixSummary}
            />

            {workflow.validation ? (
              <ValidationIssuesTable
                issues={workflow.issues}
                issueCounts={workflow.issueCounts}
                disabled={busy}
                onRemoveRows={workflow.removeIssueRows}
                onUpdateRow={workflow.updateIssueRow}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </SlideDrawer>
  );
}
