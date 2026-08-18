'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Compact 7-day Threat Score trend — fifth priority item per the
 * dashboard element order in the product spec. Reuses the same
 * /api/threat-score/history endpoint as the full Threat Score page; this
 * is a minimal sparkline-style version with a link through to the full
 * range-selectable chart + insights.
 */
export default function ThreatTrendCard() {
  const [points, setPoints] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND}/api/threat-score/history?range=7d`)
      .then((r) => r.json())
      .then((data) => setPoints(data.points || []))
      .catch(() => setPoints([]));
  }, []);

  return (
    <div className="rounded-2xl bg-card ring-1 ring-border p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-card-foreground">Threat Trend (7d)</p>
        <Link href="/threat-score" className="text-xs text-primary hover:underline">
          View full →
        </Link>
      </div>
      {!points ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : points.length < 2 ? (
        <p className="text-sm text-muted-foreground">Not enough history yet.</p>
      ) : (
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <YAxis domain={[0, 100]} hide />
              <Line type="monotone" dataKey="overallScore" stroke="#3b82f6" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
