// components/PropagationMap.jsx
'use client';

import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { getSeverityBand, getBandByName } from '@/lib/severity';
import { apiFetch } from '@/lib/api';

// jsDelivr-hosted world-atlas package — the source react-simple-maps itself
// recommends, and far more reliable than pointing at a random GitHub user's
// raw file (which is what this pointed at before and was failing to load).
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Informational-severity items aren't meaningful to distinguish as map pins
// (nothing warrants heightened awareness at that level), so the legend only
// covers the 4 bands that actually matter for a threat map.
const LEGEND_BANDS = ['Low', 'Medium', 'High', 'Critical'];

export function PropagationMap() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/threats?useAI=true')
      .then((res) => res.json())
      .then((data) => {
        const threats = data.threats || [];
        // Group by location so multiple stories in the same country become
        // one marker (sized/colored by the highest severity seen there).
        const byLocation = new Map();
        for (const t of threats) {
          // Informational-severity items (score 0-1, "no real threat, routine
          // news") aren't meaningful to plot on a threat map — skip them
          // rather than showing an undifferentiated blue dot with nothing in
          // the legend to explain it.
          if (!t.coordinates || t.score < 2) continue;
          const key = t.location;
          const existing = byLocation.get(key);
          if (!existing || t.score > existing.score) {
            byLocation.set(key, { location: t.location, coordinates: t.coordinates, score: t.score, title: t.title, link: t.link });
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
          <Marker
            key={i}
            coordinates={p.coordinates}
            onClick={() => p.link && window.open(p.link, '_blank', 'noopener,noreferrer')}
            style={{ default: { cursor: p.link ? 'pointer' : 'default' } }}
          >
            <circle r={5} fill={getSeverityBand(p.score).hex} stroke="#0b1220" strokeWidth={1.5}>
              <title>{`${p.location}: ${p.title} (severity ${p.score}/10)`}</title>
            </circle>
          </Marker>
        ))}
      </ComposableMap>
      {!loading && points.length === 0 && (
        <p className="text-sm text-muted-foreground mt-2">No geo-tagged threats to display right now.</p>
      )}
      <div className="flex flex-wrap items-center gap-3 mt-2">
        {LEGEND_BANDS.map((name) => (
          <span key={name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getBandByName(name).hex }} />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
