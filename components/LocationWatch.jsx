'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;
const FETCH_TIMEOUT_MS = 30000;

const NWS_SEVERITY_COLOR = {
  Extreme: 'bg-red-500/20 text-red-300 border-red-500/40',
  Severe: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  Moderate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
};

function newsSeverityColor(score) {
  if (score >= 8) return 'bg-red-500';
  if (score >= 4) return 'bg-yellow-400';
  return 'bg-green-500';
}

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

    fetch(`${BACKEND}/api/locations`, { signal: controller.signal })
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
      await fetch(`${BACKEND}/api/locations`, {
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
      await fetch(`${BACKEND}/api/locations`, {
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
          className="flex-1 p-2 rounded bg-gray-800 text-white text-sm placeholder-gray-500 border border-white/10"
        />
        <button onClick={addZip} className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
          Watch
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-400">Failed to load watched locations. Try refreshing.</p>}

      {!loading && !error && locations.length === 0 && (
        <p className="text-sm text-gray-500">No locations watched yet.</p>
      )}

      <div className="space-y-4">
        {locations.map((loc) => (
          <div key={loc.zip} className="border border-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">
                {loc.city ? `${loc.city}, ${loc.state}` : loc.zip}
                <span className="text-gray-500 ml-1">({loc.zip})</span>
              </span>
              <button onClick={() => removeZip(loc.zip)} aria-label={`Stop watching ${loc.zip}`} className="text-gray-500 hover:text-red-400">
                <X size={14} />
              </button>
            </div>

            {loc.error && <p className="text-xs text-red-400">{loc.error}</p>}

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
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                    {typeof n.score === 'number' && (
                      <span className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${newsSeverityColor(n.score)}`} title={`Severity ${n.score}/10`} />
                    )}
                    <a href={n.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {n.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              !loc.error && !loc.alerts?.length && <p className="text-xs text-gray-500">Nothing to report right now.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
