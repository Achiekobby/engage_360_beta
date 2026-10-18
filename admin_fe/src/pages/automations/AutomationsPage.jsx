import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import AutomationsFilterDrawer from '../../components/automations/AutomationsFilterDrawer';
import AutomationsListSection from '../../components/automations/AutomationsListSection';
import AutomationsPageHeader from '../../components/automations/AutomationsPageHeader';
import AutomationsToolbar from '../../components/automations/AutomationsToolbar';
import AnniversaryReportsSection from '../../components/automations/AnniversaryReportsSection';
import BirthdayReportsSection from '../../components/automations/BirthdayReportsSection';
import DeleteConfirmModal from '../../components/automations/DeleteConfirmModal';
import HolidayReportsSection from '../../components/automations/HolidayReportsSection';
import WelcomeReportsSection from '../../components/automations/WelcomeReportsSection';
import {
  AUTOMATION_FILTER_DEFAULTS,
  AUTOMATION_ITEMS,
  AUTOMATIONS_PAGE_SIZE,
  countActiveAutomationFilters,
  filterAutomationItems,
  getAutomationKindMeta,
} from '../../components/automations/automationsData';

const SECTION_TABS = [
  { id: 'automations', label: 'Automations' },
  { id: 'reports', label: 'Platform Reports' },
];

const REPORT_KINDS = new Set(['birthday', 'welcome', 'anniversary', 'holidays']);

function ReportsSectionForKind({ kindId }) {
  if (kindId === 'welcome') return <WelcomeReportsSection />;
  if (kindId === 'anniversary') return <AnniversaryReportsSection />;
  if (kindId === 'holidays') return <HolidayReportsSection />;
  return <BirthdayReportsSection />;
}

export default function AutomationsPage() {
  const { kindId = 'birthday' } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const kindMeta = useMemo(() => getAutomationKindMeta(kindId), [kindId]);
  const showReports = REPORT_KINDS.has(kindMeta.id);
  const sectionFromUrl = searchParams.get('section');
  const activeSection =
    showReports && sectionFromUrl === 'reports' ? 'reports' : 'automations';

  const [activeView, setActiveView] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(AUTOMATION_FILTER_DEFAULTS);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [removedIds, setRemovedIds] = useState(() => new Set());
  const [deleteTarget, setDeleteTarget] = useState(null);

  const sourceItems = useMemo(
    () => AUTOMATION_ITEMS.filter((item) => !removedIds.has(item.id)),
    [removedIds],
  );

  const filteredItems = useMemo(
    () =>
      filterAutomationItems({
        items: sourceItems,
        kind: kindMeta.id,
        view: activeView,
        searchQuery,
        filters,
      }),
    [sourceItems, kindMeta.id, activeView, searchQuery, filters],
  );

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / AUTOMATIONS_PAGE_SIZE));
  const activeFilterCount = countActiveAutomationFilters(filters);

  const pageItems = useMemo(() => {
    const start = (page - 1) * AUTOMATIONS_PAGE_SIZE;
    return filteredItems.slice(start, start + AUTOMATIONS_PAGE_SIZE);
  }, [filteredItems, page]);

  useEffect(() => {
    setActiveView('upcoming');
    setSearchQuery('');
    setFilters(AUTOMATION_FILTER_DEFAULTS);
    setSelectedIds(new Set());
    setRemovedIds(new Set());
    setPage(1);
    setDeleteTarget(null);
    if (!REPORT_KINDS.has(kindMeta.id)) {
      setSearchParams({}, { replace: true });
    }
  }, [kindMeta.id, setSearchParams]);

  const handleSectionChange = (sectionId) => {
    if (sectionId === 'reports') {
      setSearchParams({ section: 'reports' }, { replace: true });
      return;
    }
    setSearchParams({}, { replace: true });
  };

  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [activeView, searchQuery, filters]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) => {
      const pageIds = pageItems.map((item) => item.id);
      const allSelected = pageIds.every((id) => prev.has(id));
      const next = new Set(prev);

      if (allSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }

      return next;
    });
  };

  const removeItems = (ids) => {
    const idSet = ids instanceof Set ? ids : new Set(ids);
    setRemovedIds((prev) => {
      const next = new Set(prev);
      idSet.forEach((id) => next.add(id));
      return next;
    });
    setSelectedIds((prev) => {
      const next = new Set(prev);
      idSet.forEach((id) => next.delete(id));
      return next;
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size < 1) return;
    setDeleteTarget({
      mode: 'bulk',
      ids: [...selectedIds],
      count: selectedIds.size,
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.mode === 'bulk') {
      removeItems(deleteTarget.ids);
    } else if (deleteTarget.item) {
      removeItems([deleteTarget.item.id]);
    }
    setDeleteTarget(null);
  };

  const changePage = (nextPage) => {
    setPage(nextPage);
    const scroller = document.querySelector('[data-admin-scroll]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller?.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const deleteCount = deleteTarget?.mode === 'bulk' ? deleteTarget.count : 1;
  const deleteLabel =
    deleteTarget?.mode === 'single'
      ? `${deleteTarget.item?.business || 'Business'} · ${deleteTarget.item?.timingLabel || 'automation'}`
      : undefined;

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <AutomationsPageHeader
        kindMeta={kindMeta}
        activeSection={activeSection}
        sectionTabs={showReports ? SECTION_TABS : []}
        onSectionChange={handleSectionChange}
        showAnalyticsCta
      />

      {activeSection === 'reports' ? (
        <div className="mt-6">
          <ReportsSectionForKind kindId={kindMeta.id} />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <AutomationsToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRefresh={() => {
              setRemovedIds(new Set());
              setSelectedIds(new Set());
            }}
            onOpenFilters={() => setFilterDrawerOpen(true)}
            onDeleteSelected={handleBulkDelete}
            selectedCount={selectedIds.size}
            activeFilterCount={activeFilterCount}
          />

          <AutomationsListSection
            activeView={activeView}
            onViewChange={setActiveView}
            items={pageItems}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onViewItem={() => navigate(`/automations/${kindMeta.id}/analytics`)}
            onDeleteItem={(item) =>
              setDeleteTarget({
                mode: 'single',
                item,
                count: 1,
              })
            }
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={AUTOMATIONS_PAGE_SIZE}
            onPageChange={changePage}
          />
        </div>
      )}

      <AutomationsFilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApply={setFilters}
      />

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        count={deleteCount}
        itemLabel={deleteLabel}
      />
    </div>
  );
}
