'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { apiFetch } from '@/lib/api';

const ACTIVE_STATUSES = ['active', 'trialing'];

const FEATURES = [
  'AI-scored threat feed across curated global sources',
  'Watched locations — weather alerts + local news per zip',
  'Persistent dark-web exposure monitoring',
  'Email alerts for high-severity items'
];

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Subscription status + subscribe/manage actions — used standalone on
 * /subscribe and linked to from Profile. Nothing in the app enforces an
 * active subscription yet (Phase 3 ships checkout/webhook first, gating
 * comes once that's verified working end to end), so this is currently
 * informational/self-serve rather than a hard paywall.
 */
export default function BillingStatus() {
  const router = useRouter();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch('/api/billing/status')
      .then((res) => res.json())
      .then(setStatus)
      .catch(() => setError('Failed to load subscription status.'))
      .finally(() => setLoading(false));
  }, []);

  const goToStripe = async (path) => {
    setRedirecting(true);
    setError(null);
    try {
      const res = await apiFetch(path, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reach Stripe');
      window.location.href = data.url;
    } catch (err) {
      setError(err.message || 'Failed to reach Stripe.');
      setRedirecting(false);
    }
  };

  const isActive = status && ACTIVE_STATUSES.includes(status.status);

  return (
    <div className="space-y-4">
      {router.query.success === 'true' && (
        <div className="rounded-xl bg-low/10 ring-1 ring-low/30 p-3 text-sm text-low">
          Subscription started — thanks for subscribing to Contingency Brief.
        </div>
      )}
      {router.query.canceled === 'true' && (
        <div className="rounded-xl bg-white/5 ring-1 ring-border p-3 text-sm text-muted-foreground">
          Checkout canceled — no charge was made.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contingency Brief</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : isActive ? (
            <>
              <p className="text-sm text-card-foreground">
                You're subscribed
                {status.currentPeriodEnd && ` — renews ${formatDate(status.currentPeriodEnd)}`}.
              </p>
              <button
                onClick={() => goToStripe('/api/billing/portal')}
                disabled={redirecting}
                className="px-3 py-2 bg-white/10 text-card-foreground text-sm rounded hover:bg-white/20 disabled:opacity-50"
              >
                {redirecting ? 'Opening…' : 'Manage billing'}
              </button>
            </>
          ) : (
            <>
              <div>
                <p className="text-3xl font-bold text-card-foreground">
                  $9<span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
                {status?.status && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Subscription {status.status.replace('_', ' ')} — resubscribe below.
                  </p>
                )}
              </div>
              <ul className="space-y-1.5">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check size={14} className="text-low mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => goToStripe('/api/billing/checkout')}
                disabled={redirecting}
                className="w-full px-3 py-2.5 bg-primary text-white text-sm font-medium rounded hover:opacity-90 disabled:opacity-50"
              >
                {redirecting ? 'Redirecting…' : 'Subscribe — $9/mo'}
              </button>
            </>
          )}
          {error && <p className="text-sm text-critical">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
