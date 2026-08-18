'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BAND_BADGE_CLASS } from '@/lib/severity';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

function DeltaText({ value }) {
  if (value === null || value === undefined) return null;
  const up = value > 0;
  const flat = value === 0;
  return (
    <span className={`text-xs font-medium ${flat ? 'text-muted-foreground' : up ? 'text-critical' : 'text-low'}`}>
      {flat ? '±0' : `${up ? '+' : ''}${value}`} vs previous period
    </span>
  );
}

/**
 * Compact Threat Score summary for the dashboard — first priority item
 * per the dashboard element order in the product spec. Links through to
 * the full breakdown on /threat-score.
 */
export default function ThreatScoreCard() {
  const [summary, setSummary] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND}/api/threat-score`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setReady(true));
  }, []);

  return (
    <Link href="/threat-score" className="block rounded-2xl bg-card ring-1 ring-border p-4 hover:ring-primary/40 transition-colors">
      {!ready ? (
        <p className="text-sm text-muted-foreground">Loading Threat Score…</p>
      ) : !summary ? (
        <p className="text-sm text-muted-foreground">No Threat Score history yet — check back after the first monitoring cycle.</p>
      ) : (
        <div className="flex items-center gap-4">
          <div>
            <p className="text-4xl font-bold text-foreground leading-none">{summary.overall.score}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Threat Score / 100</p>
          </div>
          <div className="flex flex-col gap-1">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ring-1 w-fit ${BAND_BADGE_CLASS[summary.overall.band] || BAND_BADGE_CLASS.Informational}`}>
              {summary.overall.band}
            </span>
            <DeltaText value={summary.overall.delta24h} />
          </div>
        </div>
      )}
    </Link>
  );
}
