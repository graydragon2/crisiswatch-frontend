'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSeverityBand, BAND_DOT_CLASS } from '@/lib/severity';
import { apiFetch } from '@/lib/api';

const DISPLAY_LIMIT = 8;

const FETCH_TIMEOUT_MS = 30000;

export default function RssHighlights() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scored, setScored] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    apiFetch('/api/threats?useAI=true', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        const all = data.threats || [];
        const hasScores = all.some((t) => typeof t.score === 'number');
        setScored(hasScores);
        // Highest severity first; when scores aren't available (AI not
        // configured, or the scoring call failed) fall back to most recent.
        all.sort((a, b) =>
          hasScores
            ? (b.score ?? 0) - (a.score ?? 0)
            : new Date(b.pubDate || 0) - new Date(a.pubDate || 0)
        );
        setItems(all.slice(0, DISPLAY_LIMIT));
      })
      .catch(() => {
        setItems([]);
        setError(true);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return (
    <div className="space-y-3">
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="text-sm text-critical">Failed to load feed items. Try refreshing.</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recent items.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => {
            const band = scored ? getSeverityBand(item.score) : null;
            return (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                {band && (
                  <span
                    className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${BAND_DOT_CLASS[band.name]}`}
                    title={`${band.name} — severity ${item.score}/10`}
                  />
                )}
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      )}
      <Link href="/threats" className="text-sm text-primary hover:underline">
        View details →
      </Link>
    </div>
  );
}
