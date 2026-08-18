// components/PropagationMap.jsx
'use client';

import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { getSeverityBand } from '@/lib/severity';

// jsDelivr-hosted world-atlas package — the source react-simple-maps itself
// recommends, and far more reliable than pointing at a random GitHub user's
// raw file (which is what this pointed at before and was failing to load).
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

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
                  default: { fill: '#1e293b', outline: 'none' },
                  hover: { fill: '#293548', outline: 'none' },
                  pressed: { fill: '#3b82f6', outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
        {points.map((p, i) => (
          <Marker key={i} coordinates={p.coordinates}>
            <circle r={5} fill={getSeverityBand(p.score).hex} stroke="#0b1220" strokeWidth={1.5}>
              <title>{`${p.location}: ${p.title} (severity ${p.score}/10)`}</title>
            </circle>
          </Marker>
        ))}
      </ComposableMap>
      {!loading && points.length === 0 && (
        <p className="text-sm text-muted-foreground mt-2">No geo-tagged threats to display right now.</p>
      )}
    </div>
  );
}
