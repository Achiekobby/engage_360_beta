import { useEffect, useRef } from 'react';
import SlideDrawer from '../SlideDrawer';
import ExcelUploader from './ExcelUploader';
import ValidationSummary from './ValidationSummary';
import ValidationIssuesTable from './ValidationIssuesTable';
import ImportActions from './ImportActions';
import { useContactImportWorkflow } from '../../../../hooks/useContactImportWorkflow';
import { downloadContactsExcelTemplate } from '../../../../services/customer-engagement/contactImport';
import { IMPORT_STATUSES } from '../../../../utils/contact-import/constants';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { notifyError, notifySuccess } from '../../../../utils/toast';

export default function BulkImportDrawer({
  isOpen,
  onClose,
  collection,
  onImported,
}) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.user?.token);
  const tokenType = useAppSelector((state) => state.auth.user?.tokenType) || 'Bearer';
  const bodyRef = useRef(null);
  const resultsRef = useRef(null);

  const workflow = useContactImportWorkflow({
    collectionId: collection?.id,
    token,
    tokenType,
  });

  useEffect(() => {
    if (isOpen) return undefined;
    workflow.reset();
    return undefined;
    // Reset only when the drawer closes so the next open starts clean.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const shouldScrollToResults =
      Boolean(workflow.fileMeta || workflow.error || workflow.validation) &&
      (workflow.status === IMPORT_STATUSES.PARSING ||
        workflow.status === IMPORT_STATUSES.VALIDATING ||
        workflow.status === IMPORT_STATUSES.NEEDS_ATTENTION ||
        workflow.status === IMPORT_STATUSES.READY_TO_UPLOAD ||
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
    workflow.status === IMPORT_STATUSES.UPLOADING;

  const handleClose = () => {
    if (busy) return;
    onClose?.();
  };

  const showResults = Boolean(workflow.fileMeta || workflow.error || workflow.validation);

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
          canImport={workflow.canImport}
          validation={workflow.validation}
          fileSelected={Boolean(workflow.fileMeta)}
          busy={busy}
          onDownloadTemplate={() => {
            downloadContactsExcelTemplate();
            dispatch(
              notifySuccess('Template downloaded. Add contacts and keep the phone_number column.', {
                title: 'Template ready',
              }),
            );
          }}
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
            try {
              const result = await workflow.importContacts();
              dispatch(
                notifySuccess(result?.message || 'Contacts imported successfully.', {
                  title: 'Import complete',
                }),
              );
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
            <h3 className="text-sm font-bold text-[#0B1354]">1. Download template</h3>
            <p className="mt-1 text-sm text-[#717171]">
              Start from the Engage360 template. You may add custom columns;{' '}
              <span className="font-semibold text-[#0B1354]">phone_number</span> is required.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0B1354]">2. Upload Excel file</h3>
            <p className="mt-1 mb-3 text-sm text-[#717171]">
              Files are validated before anything is imported into this collection.
            </p>
            <ExcelUploader
              disabled={busy}
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
