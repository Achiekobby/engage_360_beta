import { useEffect, useMemo, useState } from 'react';
import { Reveal } from '../../components/motion';
import {
  AUTOMATION_FILTER_DEFAULTS,
  AUTOMATION_ITEMS,
  AUTOMATIONS_PAGE_SIZE,
  AutomationsFilterDrawer,
  AutomationsKindChips,
  AutomationsListSection,
  AutomationsPageHeader,
  AutomationsToolbar,
  AutomationsTypeTabs,
  countActiveAutomationFilters,
  getKindMeta,
  getKindsForType,
} from '../../components/customer-engagement/automations';

function filterAutomationItems({
  items,
  type,
  kind,
  view,
  searchQuery = '',
  filters = AUTOMATION_FILTER_DEFAULTS,
}) {
  const query = searchQuery.trim().toLowerCase();
  const timingLimit =
    filters.timingWindow && filters.timingWindow !== 'any'
      ? Number(filters.timingWindow)
      : null;

  return items.filter((item) => {
    if (item.type !== type || item.kind !== kind || item.view !== view) return false;
    if (filters.channels?.length && !filters.channels.includes(item.channel)) return false;
    if (filters.approvals?.length && !filters.approvals.includes(item.approval)) return false;
    if (filters.statuses?.length && !filters.statuses.includes(item.status)) return false;
    if (timingLimit != null) {
      if (item.daysUntil == null || item.daysUntil > timingLimit) return false;
    }
    if (!query) return true;

    return (
      item.channel.toLowerCase().includes(query) ||
      item.timingLabel.toLowerCase().includes(query) ||
      item.approval.toLowerCase().includes(query) ||
      item.statusLabel.toLowerCase().includes(query)
    );
  });
}

export default function CustomerEngagementAutomationsPage() {
  const [activeType, setActiveType] = useState('customers');
  const [activeKind, setActiveKind] = useState('birthday');
  const [activeView, setActiveView] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(AUTOMATION_FILTER_DEFAULTS);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [removedIds, setRemovedIds] = useState(() => new Set());

  const kinds = useMemo(() => getKindsForType(activeType), [activeType]);
  const resolvedKind = useMemo(() => {
    if (kinds.some((kind) => kind.id === activeKind)) return activeKind;
    return kinds[0]?.id || '';
  }, [kinds, activeKind]);
  const kindMeta = useMemo(
    () => getKindMeta(activeType, resolvedKind),
    [activeType, resolvedKind],
  );

  const sourceItems = useMemo(
    () => AUTOMATION_ITEMS.filter((item) => !removedIds.has(item.id)),
    [removedIds],
  );

  const filteredItems = useMemo(
    () =>
      filterAutomationItems({
        items: sourceItems,
        type: activeType,
        kind: resolvedKind,
        view: activeView,
        searchQuery,
        filters,
      }),
    [sourceItems, activeType, resolvedKind, activeView, searchQuery, filters],
  );

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / AUTOMATIONS_PAGE_SIZE));
  const activeFilterCount = countActiveAutomationFilters(filters);

  const pageItems = useMemo(() => {
    const start = (page - 1) * AUTOMATIONS_PAGE_SIZE;
    return filteredItems.slice(start, start + AUTOMATIONS_PAGE_SIZE);
  }, [filteredItems, page]);

  useEffect(() => {
    if (resolvedKind && resolvedKind !== activeKind) {
      setActiveKind(resolvedKind);
    }
  }, [resolvedKind, activeKind]);

  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [activeType, resolvedKind, activeView, searchQuery, filters]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleTypeChange = (typeId) => {
    const nextKinds = getKindsForType(typeId);
    setActiveType(typeId);
    setActiveKind(nextKinds[0]?.id ?? '');
    setActiveView('upcoming');
    setSearchQuery('');
    setFilters(AUTOMATION_FILTER_DEFAULTS);
    setRemovedIds(new Set());
    setSelectedIds(new Set());
    setPage(1);
  };

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
    if (selectedIds.size < 2) return;
    removeItems(selectedIds);
  };

  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <Reveal when="load" variant="fadeUp" delay={0.04}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <AutomationsTypeTabs activeType={activeType} onTypeChange={handleTypeChange} />
          {kinds.length > 1 ? (
            <AutomationsKindChips
              kinds={kinds}
              activeKind={resolvedKind}
              onKindChange={(kindId) => {
                setActiveKind(kindId);
                setSearchQuery('');
              }}
            />
          ) : null}
        </div>
      </Reveal>

      <Reveal
        key={`header-${activeType}-${resolvedKind}`}
        when="load"
        variant="fadeUp"
        delay={0.08}
        className="mt-8"
      >
        <AutomationsPageHeader kind={kindMeta} />
      </Reveal>

      <Reveal
        key={`toolbar-${activeType}-${resolvedKind}`}
        when="load"
        variant="fadeUp"
        delay={0.12}
        className="mt-6"
      >
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
      </Reveal>

      <Reveal
        key={`list-${activeType}-${resolvedKind}-${activeView}`}
        when="load"
        variant="fadeUp"
        delay={0.16}
        className="mt-8"
      >
        <AutomationsListSection
          activeView={activeView}
          activeKind={resolvedKind}
          activeType={activeType}
          onViewChange={setActiveView}
          items={pageItems}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onViewItem={() => undefined}
          onDeleteItem={(item) => removeItems([item.id])}
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={AUTOMATIONS_PAGE_SIZE}
          onPageChange={setPage}
        />
      </Reveal>

      <AutomationsFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApply={setFilters}
      />
    </main>
  );
}
