'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AppShell from '@/components/AppShell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BAND_BADGE_CLASS } from '@/lib/severity';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;
const RANGES = ['24h', '7d', '30d', '90d'];

function DeltaBadge({ value }) {
  if (value === null || value === undefined) return <span className="text-xs text-muted-foreground">—</span>;
  const up = value > 0;
  const flat = value === 0;
  return (
    <span className={`text-xs font-medium ${flat ? 'text-muted-foreground' : up ? 'text-critical' : 'text-low'}`}>
      {flat ? '±0' : `${up ? '+' : ''}${value}`}
    </span>
  );
}

function formatTick(iso, range) {
  const d = new Date(iso);
  return range === '24h' ? d.toLocaleTimeString([], { hour: 'numeric' }) : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ThreatScorePage() {
  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState(false);
  const [range, setRange] = useState('7d');
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND}/api/threat-score`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setSummary)
      .catch(() => setSummaryError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setHistory(null);
    fetch(`${BACKEND}/api/threat-score/history?range=${range}`)
      .then((r) => r.json())
      .then(setHistory)
      .catch(() => setHistory({ points: [], insights: null }));
  }, [range]);

  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-6 text-foreground">Threat Score</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : summaryError || !summary ? (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            No Threat Score history yet — check back after the first monitoring cycle completes.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="py-6">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-5xl font-bold text-foreground">{summary.overall.score}</p>
                  <p className="text-xs text-muted-foreground">out of 100</p>
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ring-1 ${BAND_BADGE_CLASS[summary.overall.band] || BAND_BADGE_CLASS.Informational}`}>
                  {summary.overall.band}
                </span>
                <div className="flex gap-4 ml-auto text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">24h</p>
                    <DeltaBadge value={summary.overall.delta24h} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">7d</p>
                    <DeltaBadge value={summary.overall.delta7d} />
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Critical alerts</p>
                  <p className="text-foreground font-medium">{summary.criticalCount} <span className="text-xs text-muted-foreground">({summary.newCriticalToday} new today)</span></p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">High severity</p>
                  <p className="text-foreground font-medium">{summary.highCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Breaking (24h)</p>
                  <p className="text-foreground font-medium">{summary.breakingCount24h}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(summary.categories).map(([name, cat]) => (
                <div key={name} className="flex items-center justify-between text-sm">
                  <span className="text-card-foreground">{name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${Math.min(100, cat.score)}%` }} />
                    </div>
                    <span className="text-muted-foreground w-8 text-right">{cat.score}</span>
                    <DeltaBadge value={cat.delta24h} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Threat Trend</CardTitle>
                <div className="flex gap-1">
                  {RANGES.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={`text-xs px-2 py-1 rounded ${range === r ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground hover:text-card-foreground'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!history ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : history.points.length === 0 ? (
                <p className="text-sm text-muted-foreground">Not enough history yet for this range.</p>
              ) : (
                <>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={history.points}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                        <XAxis dataKey="timestamp" tickFormatter={(v) => formatTick(v, range)} stroke="#94a3b8" fontSize={11} />
                        <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                        <Tooltip labelFormatter={(v) => new Date(v).toLocaleString()} contentStyle={{ background: '#131b2e', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 8 }} />
                        <Line type="monotone" dataKey="overallScore" stroke="#3b82f6" dot={false} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {history.insights && (
                    <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Peak day</p>
                        <p className="text-foreground font-medium">{history.insights.peakDay}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Busiest period</p>
                        <p className="text-foreground font-medium">{history.insights.busiestTime}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">% change</p>
                        <DeltaBadge value={history.insights.percentChange} />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Trend</p>
                        <p className="text-foreground font-medium capitalize">{history.insights.trend}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
