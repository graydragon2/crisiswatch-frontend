// components/PropagationMap.jsx
'use client';

import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl =
  'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

function severityColor(score) {
  if (score >= 8) return '#ef4444'; // red
  if (score >= 4) return '#facc15'; // yellow
  return '#22c55e'; // green
}

export function PropagationMap() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/threats?useAI=true`)
      .then((res) => res.json())
      .then((data) => {
        const threats = data.threats || [];
        // Group by location so multiple stories in the same country become
        // one marker (sized/colored by the highest severity seen there).
        const byLocation = new Map();
        for (const t of threats) {
          if (!t.coordinates) continue;
          const key = t.location;
          const existing = byLocation.get(key);
          if (!existing || t.score > existing.score) {
            byLocation.set(key, { location: t.location, coordinates: t.coordinates, score: t.score, title: t.title });
          }
        }
        setPoints([...byLocation.values()]);
      })
      .catch(() => setPoints([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: '#2d3748', outline: 'none' },
                  hover: { fill: '#4a5568', outline: 'none' },
                  pressed: { fill: '#2b6cb0', outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
        {points.map((p, i) => (
          <Marker key={i} coordinates={p.coordinates}>
            <circle r={5} fill={severityColor(p.score)} stroke="#0f172a" strokeWidth={1.5}>
              <title>{`${p.location}: ${p.title} (severity ${p.score}/10)`}</title>
            </circle>
          </Marker>
        ))}
      </ComposableMap>
      {!loading && points.length === 0 && (
        <p className="text-sm text-gray-500 mt-2">No geo-tagged threats to display right now.</p>
      )}
    </div>
  );
}
