import { clsx } from 'clsx';

export default function HeadingPreview({ preview }) {
  const headings = preview?.headings || [];
  const rows = preview?.rows || [];
  if (!headings.length) return null;

  const emptyCount = preview.emptyCount || headings.filter((heading) => heading.empty).length;
  const repeatedKeys = preview.repeatedKeys || [
    ...new Set(headings.filter((heading) => heading.repeated).map((heading) => heading.key)),
  ];

  return (
    <section className="space-y-3 rounded-sm border border-[#EEF0F4] bg-white p-4 sm:p-5">
      <div>
        <h3 className="text-sm font-bold text-[#0B1354]">File preview</h3>
        <p className="mt-1 text-sm text-[#717171]">
          The first row is the file headings. The next {rows.length || 'few'} row
          {rows.length === 1 ? '' : 's'} are a preview of the data.
        </p>
      </div>

      {emptyCount || repeatedKeys.length ? (
        <div className="rounded-sm border border-[#FACC15] bg-[#FEF9C3] px-3.5 py-3 text-sm leading-relaxed text-[#713F12]">
          {emptyCount ? (
            <p>
              {emptyCount} heading{emptyCount === 1 ? ' is' : 's are'} empty. Name or remove{' '}
              {emptyCount === 1 ? 'that column' : 'those columns'} before uploading.
            </p>
          ) : null}
          {repeatedKeys.length ? (
            <p className={emptyCount ? 'mt-1' : undefined}>
              Repeated heading{repeatedKeys.length === 1 ? '' : 's'}:{' '}
              <span className="font-mono">{repeatedKeys.join(', ')}</span>. Each column can map to
              one field only.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-sm border border-[#EEF0F4]">
        <table className="min-w-max border-collapse text-left">
          <thead>
            <tr className="border-b border-[#EEF0F4] bg-[#FAFBFC]">
              <th className="sticky left-0 z-10 bg-[#FAFBFC] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-[#717171]">
                Row
              </th>
              {headings.map((heading) => {
                const normalizedDiffers =
                  !heading.empty && heading.raw.toLowerCase() !== heading.key;
                const note = heading.empty
                  ? 'Missing key'
                  : [
                      normalizedDiffers ? heading.key : '',
                      heading.repeated ? 'repeated' : '',
                    ]
                      .filter(Boolean)
                      .join(' · ');

                return (
                  <th key={`heading-${heading.index}`} className="min-w-36 px-3 py-2 align-top">
                    <p
                      className={clsx(
                        'truncate text-sm font-semibold',
                        heading.empty || heading.repeated ? 'text-[#A16207]' : 'text-[#0B1354]',
                      )}
                      title={heading.raw || 'Empty heading'}
                    >
                      {heading.raw || 'Empty heading'}
                    </p>
                    {note ? (
                      <p className="mt-0.5 truncate font-mono text-[11px] text-[#A16207]">{note}</p>
                    ) : null}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.rowNumber} className="border-b border-[#F0F2F7] last:border-b-0">
                  <td className="sticky left-0 bg-white px-3 py-2 text-xs font-semibold text-[#717171]">
                    {row.rowNumber}
                  </td>
                  {headings.map((heading) => (
                    <td
                      key={`${row.rowNumber}-${heading.index}`}
                      className="max-w-48 truncate px-3 py-2 text-sm text-[#0B1354]"
                      title={row.values?.[heading.index] || ''}
                    >
                      {row.values?.[heading.index] || '—'}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headings.length + 1}
                  className="px-3 py-4 text-sm text-[#717171]"
                >
                  The file has headings and no data rows yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs leading-relaxed text-[#717171]">
        Headings are normalized the same way as the server: spaces become underscores and the text
        is lowercased. The server still checks the exact column match when the file is uploaded.
      </p>
    </section>
  );
}
