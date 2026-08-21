'use client';

import { useEffect, useMemo, useState } from 'react';
import AppShell from '@/components/AppShell';
import ThreatCard from '@/components/ThreatCard';
import { THREAT_CATEGORIES } from '@/lib/categories';
import { apiFetch } from '@/lib/api';

export default function ThreatsPage() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [sources, setSources] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategories, setActiveCategories] = useState(new Set());
  const [sortBy, setSortBy] = useState('severity');

  const fetchThreats = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keywords.trim()) params.set('keywords', keywords.trim());
      if (sources.trim()) params.set('sources', sources.trim());

      const res = await apiFetch(`/api/threats?${params}`);
      const data = await res.json();
      setThreats(data.threats || []);
    } catch (err) {
      console.error('Failed to fetch threats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
    const interval = setInterval(fetchThreats, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  const toggleCategory = (cat) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const visibleThreats = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = threats.filter((t) => {
      if (activeCategories.size > 0 && !activeCategories.has(t.category)) return false;
      if (q && !`${t.title} ${t.summary || ''}`.toLowerCase().includes(q)) return false;
      return true;
    });
    result = [...result].sort((a, b) =>
      sortBy === 'severity'
        ? (b.score ?? -1) - (a.score ?? -1)
        : new Date(b.pubDate || 0) - new Date(a.pubDate || 0)
    );
    return result;
  }, [threats, search, activeCategories, sortBy]);

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Threats</h1>

        <div className="space-y-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search loaded threats…"
            className="w-full p-2 rounded bg-white/5 text-card-foreground text-sm placeholder-muted-foreground border border-border"
          />

          <div className="flex flex-wrap gap-1.5">
            {THREAT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-full ring-1 transition-colors ${
                  activeCategories.has(cat)
                    ? 'bg-primary text-white ring-primary'
                    : 'bg-white/5 text-muted-foreground ring-border hover:text-card-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground hover:text-card-foreground">Advanced filters (keywords, sources)</summary>
            <div className="mt-3 space-y-2 max-w-md">
              <label className="block">
                <span className="text-xs text-muted-foreground">Keywords (comma-separated)</span>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="attack, power outage"
                  className="mt-1 p-2 w-full rounded bg-white/5 text-card-foreground text-sm placeholder-muted-foreground border border-border"
                />
              </label>
              <label className="block">
                <span className="text-xs text-muted-foreground">Sources (comma-separated, matches feed name)</span>
                <input
                  type="text"
                  value={sources}
                  onChange={(e) => setSources(e.target.value)}
                  placeholder="BBC, Al Jazeera"
                  className="mt-1 p-2 w-full rounded bg-white/5 text-card-foreground text-sm placeholder-muted-foreground border border-border"
                />
              </label>
              <button
                onClick={fetchThreats}
                className="px-3 py-2 bg-primary text-white text-sm rounded hover:opacity-90"
              >
                Refresh Feed
              </button>
            </div>
          </details>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{visibleThreats.length} of {threats.length} threats</p>
            <div className="flex gap-1">
              {[
                { key: 'severity', label: 'Severity' },
                { key: 'newest', label: 'Newest' }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key)}
                  className={`text-xs px-2 py-1 rounded ${sortBy === opt.key ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground hover:text-card-foreground'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!loading && visibleThreats.length === 0 && <p className="text-sm text-muted-foreground">No threats match the current filters.</p>}

        <div className="space-y-3">
          {visibleThreats.map((item, idx) => (
            <ThreatCard key={item.link || idx} item={item} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
