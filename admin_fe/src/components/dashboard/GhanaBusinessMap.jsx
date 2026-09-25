import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const GEO_URL = '/maps/ghana-regions.geojson?v=2';

const REGION_TO_ROW = {
  'Greater Accra Region': 'Greater Accra',
  'Northern Region': 'Northern Region',
  'Central Region': 'Central Region',
  'Western Region': 'Western Region',
  'Ashanti Region': 'Ashanti Region',
  'Bono Region': 'Bono-Ahafo Region',
  'Ahafo Region': 'Bono-Ahafo Region',
};

export default function GhanaBusinessMap({ rows, formatCount }) {
  const [hovered, setHovered] = useState(null);
  const byLabel = Object.fromEntries(rows.map((row) => [row.label, row]));
  const maxValue = Math.max(...rows.map((row) => row.value), 1);
  const leader = rows.reduce((highest, row) => (row.value > highest.value ? row : highest), rows[0]);

  return (
    <div className="relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [-1.2, 7.95], scale: 2500 }}
        width={260}
        height={320}
        className="h-56 w-full"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const row = byLabel[REGION_TO_ROW[geo.properties.name]];
              const intensity = row ? row.value / maxValue : 0;
              const isLeader = Boolean(row) && row.label === leader?.label && row.value === maxValue;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    if (row) setHovered(row);
                  }}
                  onMouseLeave={() => setHovered(null)}
                  fill={
                    isLeader
                      ? '#2563EB'
                      : row
                        ? `rgba(37, 99, 235, ${0.12 + intensity * 0.28})`
                        : '#F1F5F9'
                  }
                  stroke="#FFFFFF"
                  strokeWidth={0.8}
                  style={{ outline: 'none', cursor: row ? 'pointer' : 'default', transition: 'fill 180ms ease' }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {hovered ? (
        <div className="pointer-events-none absolute left-1 top-1 rounded-xl border border-[#EEF0F4] bg-white px-3 py-2 shadow-lg">
          <p className="text-xs font-semibold text-[#0B1354]">{hovered.label}</p>
          <p className="text-[11px] text-[#717171]">{formatCount(hovered.value).replace('k', 'K')} businesses</p>
        </div>
      ) : null}
    </div>
  );
}
