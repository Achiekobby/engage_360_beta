import { useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { ISSUE_TYPES } from '../../../../utils/contact-import/constants';
import CustomersPagination from '../CustomersPagination';

const FILTERS = [
  { id: 'all', label: 'All issues' },
  { id: 'missing_phone_number', label: 'Missing phones' },
  { id: 'invalid_phone', label: 'Invalid phones' },
  { id: 'empty_row', label: 'Empty rows' },
];

const PAGE_SIZE = 8;

function matchesFilter(issue, filter) {
  if (filter === 'all') return true;
  if (filter === 'missing_phone_number') {
    return issue.type === ISSUE_TYPES.MISSING_PHONE_NUMBER;
  }
  if (filter === 'invalid_phone') {
    return (
      issue.type === ISSUE_TYPES.INVALID_PHONE_PREFIX ||
      issue.type === ISSUE_TYPES.INVALID_PHONE_LENGTH ||
      issue.type === ISSUE_TYPES.INVALID_PHONE_CHARS
    );
  }
  if (filter === 'empty_row') return issue.type === ISSUE_TYPES.EMPTY_ROW;
  return true;
}

export default function ValidationIssuesTable({
  issues = [],
  issueCounts,
  onRemoveRows,
  onUpdateRow,
  disabled = false,
}) {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [editingKey, setEditingKey] = useState(null);
  const [draftPhone, setDraftPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [removingKey, setRemovingKey] = useState(null);

  const issueKey = (issue) =>
    `${issue.rowUid || 'nouid'}:${issue.rowNumber}:${issue.type}:${issue.column || 'row'}`;

  const filtered = useMemo(
    () => issues.filter((issue) => matchesFilter(issue, filter)),
    [filter, issues],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (!issues.length) {
    return (
      <div className="rounded-sm border border-[#D1FAE5] bg-[#ECFDF5] px-4 py-5 text-sm text-[#047857]">
        No blocking issues found. You can download a cleaned Excel file or import contacts.
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-sm border border-[#EEF0F4] bg-white">
      <div className="flex flex-col gap-3 border-b border-[#F0F2F7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h3 className="text-sm font-bold text-[#0B1354]">Validation issues</h3>
          <p className="mt-0.5 text-xs text-[#717171]">
            Review affected rows. Safe items can be fixed automatically.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((item) => {
            const count =
              item.id === 'all'
                ? issueCounts?.all || 0
                : issueCounts?.[item.id] || 0;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setFilter(item.id);
                  setPage(1);
                }}
                className={clsx(
                  'cursor-pointer rounded-sm px-2.5 py-1.5 text-xs font-semibold transition-colors',
                  filter === item.id
                    ? 'bg-primary text-white'
                    : 'bg-[#F7F8FF] text-[#717171] hover:text-primary',
                )}
              >
                {item.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse">
          <thead>
            <tr className="border-b border-[#EEF0F4] bg-[#FAFBFC] text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#717171]">
              <th className="whitespace-nowrap px-4 py-3">Row</th>
              <th className="whitespace-nowrap px-4 py-3">Column</th>
              <th className="whitespace-nowrap px-4 py-3">Current value</th>
              <th className="whitespace-nowrap px-4 py-3">Problem</th>
              <th className="whitespace-nowrap px-4 py-3">Auto-fix</th>
              <th className="whitespace-nowrap px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((issue) => {
              const key = issueKey(issue);
              const isEditing = editingKey === key;
              const isRemoving = removingKey === key;
              const canEditPhone =
                issue.column === 'phone_number' &&
                issue.type !== ISSUE_TYPES.EMPTY_ROW &&
                issue.type !== ISSUE_TYPES.DUPLICATE_COLUMN &&
                issue.type !== ISSUE_TYPES.MISSING_PHONE_COLUMN;

              return (
                <tr key={key} className="border-b border-[#F0F2F7] last:border-b-0">
                  <td className="px-4 py-3 text-sm font-semibold tabular-nums text-[#0B1354]">
                    <span title={issue.excelRowNumber ? `Excel sheet row ${issue.excelRowNumber}` : undefined}>
                      {issue.rowNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#717171]">{issue.column || '—'}</td>
                  <td className="px-4 py-3 text-sm text-[#0B1354]">
                    {isEditing ? (
                      <input
                        value={draftPhone}
                        onChange={(event) => setDraftPhone(event.target.value)}
                        className="w-full min-w-[10rem] rounded-sm border border-[#E4E4E7] px-2.5 py-1.5 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                        placeholder="233XXXXXXXXX"
                        disabled={disabled || saving || isRemoving}
                      />
                    ) : (
                      <span className="break-all">
                        {issue.value === '' || issue.value == null ? (
                          <span className="text-[#9AA0B0]">empty</span>
                        ) : (
                          String(issue.value)
                        )}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#717171]">{issue.message}</td>
                  <td className="px-4 py-3">
                    <span
                      className={clsx(
                        'inline-flex rounded-sm px-2 py-1 text-[11px] font-semibold',
                        issue.autoFixable
                          ? 'bg-[#E8F8EF] text-[#1F9D55]'
                          : 'bg-[#F0F2F7] text-[#717171]',
                      )}
                    >
                      {issue.autoFixable ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      {canEditPhone ? (
                        isEditing ? (
                          <>
                            <button
                              type="button"
                              disabled={disabled || saving || isRemoving}
                              onClick={async () => {
                                setSaving(true);
                                try {
                                  await onUpdateRow?.(
                                    issue.rowNumber,
                                    { phone_number: draftPhone.trim() },
                                    issue.rowUid,
                                  );
                                  setEditingKey(null);
                                } finally {
                                  setSaving(false);
                                }
                              }}
                              className="cursor-pointer rounded-sm bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-white disabled:opacity-50"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              disabled={saving || isRemoving}
                              onClick={() => setEditingKey(null)}
                              className="cursor-pointer rounded-sm border border-[#E4E4E7] px-2.5 py-1.5 text-[11px] font-semibold text-[#717171]"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            disabled={disabled || isRemoving}
                            onClick={() => {
                              setEditingKey(key);
                              setDraftPhone(
                                issue.value == null ? '' : String(issue.value),
                              );
                            }}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-sm border border-[#E4E4E7] px-2.5 py-1.5 text-[11px] font-semibold text-[#0B1354] hover:border-primary/30 hover:bg-[#F7F8FF] hover:text-primary disabled:opacity-50"
                          >
                            <Pencil className="h-3 w-3" strokeWidth={2} />
                            Edit
                          </button>
                        )
                      ) : null}
                      <button
                        type="button"
                        disabled={disabled || saving || isRemoving}
                        onClick={async () => {
                          setRemovingKey(key);
                          try {
                            await onRemoveRows?.([
                              {
                                rowNumber: issue.rowNumber,
                                rowUid: issue.rowUid,
                              },
                            ]);
                          } finally {
                            setRemovingKey(null);
                          }
                        }}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-sm border border-[#E4E4E7] px-2.5 py-1.5 text-[11px] font-semibold text-[#717171] hover:border-[#E53935]/30 hover:bg-[#FEECEC] hover:text-[#E53935] disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" strokeWidth={2} />
                        {isRemoving ? 'Removing…' : 'Remove'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <CustomersPagination
        currentPage={safePage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        itemLabel="issues"
      />
    </section>
  );
}
