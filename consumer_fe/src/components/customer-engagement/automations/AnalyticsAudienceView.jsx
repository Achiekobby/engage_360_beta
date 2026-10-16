import { useEffect, useMemo, useState } from 'react';
import AnalyticsAudienceStats from './AnalyticsAudienceStats';
import AnalyticsAudienceTable from './AnalyticsAudienceTable';
import AutomationsPagination from './AutomationsPagination';
import {
  ANALYTICS_AUDIENCE_PAGE_SIZE,
  ANALYTICS_AUDIENCE_ROWS,
} from './analyticsData';

export default function AnalyticsAudienceView({ rows = ANALYTICS_AUDIENCE_ROWS }) {
  const [page, setPage] = useState(1);
  const pageSize = ANALYTICS_AUDIENCE_PAGE_SIZE;
  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  return (
    <div className="space-y-6">
      <AnalyticsAudienceStats />
      <AnalyticsAudienceTable rows={pageRows} />
      <AutomationsPagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setPage}
        itemLabel="contacts"
      />
    </div>
  );
}
