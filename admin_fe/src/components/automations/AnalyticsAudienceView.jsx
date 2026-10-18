import { useEffect, useMemo, useState } from 'react';
import BusinessesPagination from '../businesses/BusinessesPagination';
import AnalyticsAudienceStats from './AnalyticsAudienceStats';
import AnalyticsAudienceTable from './AnalyticsAudienceTable';
import AudienceFilterDrawer from './AudienceFilterDrawer';
import AudienceToolbar from './AudienceToolbar';
import {
  ANALYTICS_AUDIENCE_PAGE_SIZE,
  ANALYTICS_AUDIENCE_ROWS,
  AUDIENCE_FILTER_DEFAULTS,
  buildAudienceStats,
  countActiveAudienceFilters,
  filterAudienceRows,
} from './analyticsData';

export default function AnalyticsAudienceView({ rows = ANALYTICS_AUDIENCE_ROWS }) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(AUDIENCE_FILTER_DEFAULTS);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const pageSize = ANALYTICS_AUDIENCE_PAGE_SIZE;
  const activeFilterCount = countActiveAudienceFilters(filters);

  const filteredRows = useMemo(
    () =>
      filterAudienceRows({
        rows,
        searchQuery,
        filters,
      }),
    [rows, searchQuery, filters],
  );

  const stats = useMemo(() => buildAudienceStats(filteredRows), [filteredRows]);
  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filters]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const changePage = (nextPage) => {
    setPage(nextPage);
    const scroller = document.querySelector('[data-admin-scroll]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller?.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <div className="space-y-6">
      <AnalyticsAudienceStats stats={stats} />

      <AudienceToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={() => {
          setSearchQuery('');
          setFilters(AUDIENCE_FILTER_DEFAULTS);
          setPage(1);
        }}
        onOpenFilters={() => setFilterDrawerOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      <AnalyticsAudienceTable rows={pageRows} />

      <BusinessesPagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={changePage}
        label="Audience pages"
      />

      <AudienceFilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApply={setFilters}
      />
    </div>
  );
}
