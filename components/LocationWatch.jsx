'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getSeverityBand, BAND_DOT_CLASS } from '@/lib/severity';
import { apiFetch } from '@/lib/api';

const FETCH_TIMEOUT_MS = 30000;

// NWS alert severities (Extreme/Severe/Moderate) are a different scale
// than the 1-10 threat score, so they get their own literal-class map
// rather than reusing lib/severity.js's score bands.
const NWS_SEVERITY_COLOR = {
  Extreme: 'bg-critical/20 text-critical border-critical/40',
  Severe: 'bg-high/20 text-high border-high/40',
  Moderate: 'bg-medium/20 text-medium border-medium/40'
};

export default function LocationWatch() {
  const [newZip, setNewZip] = useState('');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchLocations = () => {
    setLoading(true);
    setError(false);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    apiFetch('/api/locations', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setLocations(data.locations || []))
      .catch(() => setError(true))
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  };

  useEffect(fetchLocations, []);

  const addZip = async () => {
    if (!newZip.trim()) return;
    try {
      await apiFetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zip: newZip.trim() })
      });
      setNewZip('');
      fetchLocations();
    } catch {
      // no-op; list stays unchanged on failure
    }
  };

  const removeZip = async (zip) => {
    try {
      await apiFetch('/api/locations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zip })
      });
      setLocations((prev) => prev.filter((l) => l.zip !== zip));
    } catch {
      // no-op
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={newZip}
          onChange={(e) => setNewZip(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addZip()}
          placeholder="Watch a zip code (e.g. 31560)"
          className="flex-1 p-2 rounded bg-white/5 text-card-foreground text-sm placeholder-muted-foreground border border-border"
        />
        <button onClick={addZip} className="px-3 py-2 bg-primary text-white text-sm rounded hover:opacity-90">
          Watch
        </button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-critical">Failed to load watched locations. Try refreshing.</p>}

      {!loading && !error && locations.length === 0 && (
        <p className="text-sm text-muted-foreground">No locations watched yet.</p>
      )}

      <div className="space-y-4">
        {locations.map((loc) => (
          <div key={loc.zip} className="border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">
                {loc.city ? `${loc.city}, ${loc.state}` : loc.zip}
                <span className="text-muted-foreground ml-1">({loc.zip})</span>
              </span>
              <button onClick={() => removeZip(loc.zip)} aria-label={`Stop watching ${loc.zip}`} className="text-muted-foreground hover:text-critical">
                <X size={14} />
              </button>
            </div>

            {loc.error && <p className="text-xs text-critical">{loc.error}</p>}

            {loc.alerts?.length > 0 && (
              <ul className="space-y-1 mb-2">
                {loc.alerts.map((a, i) => (
                  <li
                    key={i}
                    className={`text-xs px-2 py-1 rounded border ${NWS_SEVERITY_COLOR[a.severity] || 'bg-white/5 text-gray-300 border-white/10'}`}
                    title={a.description}
                  >
                    ⚠️ {a.title}
                  </li>
                ))}
              </ul>
            )}

            {loc.news?.length > 0 ? (
              <ul className="space-y-1">
                {loc.news.slice(0, 5).map((n, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    {typeof n.score === 'number' && (
                      <span
                        className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${BAND_DOT_CLASS[getSeverityBand(n.score).name]}`}
                        title={`${getSeverityBand(n.score).name} — severity ${n.score}/10`}
                      />
                    )}
                    <a href={n.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {n.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              !loc.error && !loc.alerts?.length && <p className="text-xs text-muted-foreground">Nothing to report right now.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
