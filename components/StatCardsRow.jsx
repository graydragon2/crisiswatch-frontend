'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Newspaper, Eye } from 'lucide-react';
import { apiFetch } from '@/lib/api';

function StatCard({ Icon, badgeClass, iconClass, label, value, sub, href }) {
  return (
    <Link href={href} className="rounded-2xl bg-card ring-1 ring-border p-4 hover:ring-primary/40 transition-colors">
      <div className={`h-9 w-9 rounded-full flex items-center justify-center mb-2 ${badgeClass}`}>
        <Icon size={16} className={iconClass} />
      </div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
    </Link>
  );
}

/**
 * Critical Alerts / Breaking News / Dark Web Hits — second priority row
 * per the dashboard element order in the product spec. All from
 * crisiswatch-api's existing /api/stats endpoint; no new data source.
 * Dark Web Hits deliberately shows only counts, never which addresses or
 * what was found — the spec is explicit dashboards shouldn't surface
 * sensitive detail unnecessarily.
 */
export default function StatCardsRow() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiFetch('/api/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard
        Icon={AlertTriangle}
        badgeClass="bg-critical/15"
        iconClass="text-critical"
        label="Critical Alerts"
        value={stats ? stats.criticalAlerts.count : '—'}
        sub={stats ? `${stats.criticalAlerts.newToday} new today` : undefined}
        href="/threats"
      />
      <StatCard
        Icon={Newspaper}
        badgeClass="bg-informational/15"
        iconClass="text-informational"
        label="Breaking News"
        value={stats ? stats.breakingNews.count24h : '—'}
        sub="last 24h"
        href="/feeds"
      />
      <StatCard
        Icon={Eye}
        badgeClass="bg-accent-purple/15"
        iconClass="text-accent-purple"
        label="Dark Web Hits"
        value={stats ? stats.darkWebHits.count : '—'}
        sub={stats ? `${stats.darkWebHits.monitored} monitored` : undefined}
        href="/darkweb"
      />
    </div>
  );
}
