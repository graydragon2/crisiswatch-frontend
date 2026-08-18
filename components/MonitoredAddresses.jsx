'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

// Risk levels here (None/Low/Medium/High) are monitoredEmailStore's own
// exposure-count heuristic, not the 1-10 threat score scale — mapped to
// the closest severity color rather than reusing lib/severity.js's
// score-based bands.
const RISK_CLASS = {
  None: 'bg-white/5 text-muted-foreground ring-border',
  Low: 'bg-low/10 text-low ring-low/30',
  Medium: 'bg-medium/10 text-medium ring-medium/30',
  High: 'bg-critical/10 text-critical ring-critical/30',
  Unknown: 'bg-white/5 text-muted-foreground ring-border'
};

const STATUS_LABEL = {
  pending: 'Checking…',
  active: 'Active',
  error: 'Check failed'
};

function timeAgo(iso) {
  if (!iso) return 'never';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/**
 * Persistent dark-web exposure watchlist — crisiswatch-api's
 * /api/darkweb/monitored (added in PR #15) had no frontend until now.
 * Distinct from DarkWebChecker's on-demand, nothing-stored check: adding
 * an address here persists it and crisiswatch-api re-checks it
 * automatically every DARKWEB_RECHECK_HOURS. Never shows passwords or
 * other credentials — LeakCheck's public API doesn't return them, and the
 * backend only ever stores breach source names.
 */
export default function MonitoredAddresses() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    fetch(`${BACKEND}/api/darkweb/monitored`)
      .then((r) => r.json())
      .then((d) => setEmails(d.emails || []))
      .catch(() => setError('Failed to load monitored addresses.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const addEmail = async () => {
    if (!newEmail.trim() || !newEmail.includes('@')) return;
    setAdding(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND}/api/darkweb/monitored`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add');
      setEmails(data.emails || []);
      setNewEmail('');
    } catch (err) {
      setError(err.message || 'Failed to add address.');
    } finally {
      setAdding(false);
    }
  };

  const removeEmail = async (email) => {
    try {
      const res = await fetch(`${BACKEND}/api/darkweb/monitored`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setEmails(data.emails || []);
    } catch {
      // no-op; list stays unchanged on failure
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addEmail()}
          placeholder="Add an email to monitor continuously"
          className="flex-1 p-2 rounded bg-white/5 text-card-foreground text-sm placeholder-muted-foreground border border-border"
        />
        <button
          onClick={addEmail}
          disabled={adding}
          className="px-3 py-2 bg-primary text-white text-sm rounded hover:opacity-90 disabled:opacity-50"
        >
          {adding ? 'Adding…' : 'Monitor'}
        </button>
      </div>

      {error && <p className="text-sm text-critical">{error}</p>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : emails.length === 0 ? (
        <p className="text-sm text-muted-foreground">No addresses monitored yet.</p>
      ) : (
        <div className="space-y-3">
          {emails.map((e) => (
            <div key={e.email} className="border border-border rounded-lg p-3">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-sm font-medium text-card-foreground truncate">{e.email}</span>
                <button
                  onClick={() => removeEmail(e.email)}
                  aria-label={`Stop monitoring ${e.email}`}
                  className="text-muted-foreground hover:text-critical flex-shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted-foreground">{STATUS_LABEL[e.status] || e.status}</span>
                <span className="text-muted-foreground">· Last checked {timeAgo(e.lastChecked)}</span>
                {e.status === 'active' && (
                  <>
                    <span className="text-muted-foreground">· {e.exposureCount} exposure{e.exposureCount === 1 ? '' : 's'}</span>
                    <span className={`px-1.5 py-0.5 rounded ring-1 font-semibold ${RISK_CLASS[e.riskLevel] || RISK_CLASS.Unknown}`}>
                      {e.riskLevel} risk
                    </span>
                  </>
                )}
                {e.status === 'error' && <span className="text-critical">{e.error}</span>}
              </div>
              {e.status === 'active' && e.entries?.length > 0 && (
                <ul className="mt-2 text-xs text-muted-foreground list-disc ml-4">
                  {e.entries.map((source, i) => (
                    <li key={i}>{source}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
