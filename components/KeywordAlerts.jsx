'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function KeywordAlerts({ compact = false }) {
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchKeywords = async () => {
    try {
      const res = await apiFetch('/api/keywords');
      const json = await res.json();
      setKeywords(json.keywords || []);
    } catch {
      // leave keywords as-is; the add/remove actions will surface errors
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, []);

  useEffect(() => {
    if (!keywords.length) {
      setMatches([]);
      return;
    }
    setLoading(true);
    apiFetch(`/api/threats?keywords=${encodeURIComponent(keywords.join(','))}&useAI=false`)
      .then((res) => res.json())
      .then((data) => setMatches(data.threats || []))
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, [keywords]);

  const addKeyword = async () => {
    if (!newKeyword.trim()) return;
    try {
      const res = await apiFetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: newKeyword.trim() }),
      });
      const json = await res.json();
      setKeywords(json.keywords || []);
      setNewKeyword('');
    } catch {
      // no-op; keyword list stays unchanged on failure
    }
  };

  const removeKeyword = async (keyword) => {
    try {
      const res = await apiFetch('/api/keywords', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });
      const json = await res.json();
      setKeywords(json.keywords || []);
    } catch {
      // no-op
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
          placeholder="Add a keyword to watch"
          className="flex-1 p-2 rounded bg-white/5 text-card-foreground text-sm placeholder-muted-foreground border border-border"
        />
        <button
          onClick={addKeyword}
          className="px-3 py-2 bg-primary text-white text-sm rounded hover:opacity-90"
        >
          Add
        </button>
      </div>

      {keywords.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {keywords.map((k) => (
            <li
              key={k}
              className="flex items-center gap-1 bg-white/5 text-card-foreground text-xs px-2 py-1 rounded-full"
            >
              {k}
              <button onClick={() => removeKeyword(k)} aria-label={`Remove ${k}`} className="hover:text-critical">
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Checking recent feed items…</p>
        ) : matches.length === 0 ? (
          <p className="text-sm text-muted-foreground">No matches in recent feed items.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {matches.slice(0, compact ? 3 : 10).map((m, i) => (
              <li key={i} className="text-muted-foreground">
                <a href={m.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {m.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
