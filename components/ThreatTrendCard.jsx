'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

function formatTick(iso) {
  return new Date(iso).toLocaleDateString([], { weekday: 'short' });
}

// historyStore.js's getHistoryRange() returns trend as 'Increasing' |
// 'Decreasing' | 'Stable' (capitalized) — match that exactly here.
const TREND_ICON = { Increasing: TrendingUp, Decreasing: TrendingDown, Stable: Minus };
const TREND_COLOR = { Increasing: 'text-critical', Decreasing: 'text-low', Stable: 'text-muted-foreground' };

/**
 * 7-day Threat Score trend — fifth priority item per the dashboard
 * element order in the product spec. Reuses the same
 * /api/threat-score/history endpoint (and its insights) as the full
 * Threat Score page, just in a more compact layout with a link through
 * to the full range-selectable version.
 */
export default function ThreatTrendCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND}/api/threat-score/history?range=7d`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ points: [], insights: null }));
  }, []);

  const TrendIcon = data?.insights ? TREND_ICON[data.insights.trend] || Minus : null;

  return (
    <div className="rounded-2xl bg-card ring-1 ring-border p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-card-foreground">Threat Trend (7 Days)</p>
        <Link href="/threat-score" className="text-xs text-primary hover:underline">
          View full →
        </Link>
      </div>
      {!data ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : data.points.length < 2 ? (
        <p className="text-sm text-muted-foreground">Not enough history yet.</p>
      ) : (
        <>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.points}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
                <XAxis dataKey="timestamp" tickFormatter={formatTick} stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} width={28} />
                <Tooltip
                  labelFormatter={(v) => new Date(v).toLocaleString()}
                  contentStyle={{ background: '#131b2e', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 8 }}
                />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" dot={{ r: 3, fill: '#3b82f6' }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {data.insights && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="rounded-lg bg-accent-purple/10 p-2.5">
                <p className="text-[11px] text-muted-foreground">Peak Day</p>
                <p className="text-sm font-semibold text-card-foreground">{data.insights.peakDay}</p>
                <p className="text-[11px] text-accent-purple">{data.insights.peakDayAlerts} alerts</p>
              </div>
              <div className="rounded-lg bg-accent-purple/10 p-2.5">
                <p className="text-[11px] text-muted-foreground">Busiest Time</p>
                <p className="text-sm font-semibold text-card-foreground">{data.insights.busiestTime}</p>
              </div>
              <div className="rounded-lg bg-accent-purple/10 p-2.5">
                <p className="text-[11px] text-muted-foreground">Trend</p>
                <p className={`text-sm font-semibold capitalize flex items-center gap-1 ${TREND_COLOR[data.insights.trend] || ''}`}>
                  {data.insights.trend}
                  {TrendIcon && <TrendIcon size={13} />}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
