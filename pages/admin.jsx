'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import EmailAlertsSettings from '@/components/EmailAlertsSettings';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

function StatusBadge({ ok, label }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${ok ? 'text-low' : 'text-critical'}`}>
      <span className={`h-2 w-2 rounded-full ${ok ? 'bg-low' : 'bg-critical'}`} />
      {label}
    </span>
  );
}

export default function AdminPage() {
  const [backendUp, setBackendUp] = useState(null);
  const [status, setStatus] = useState(null);
  const [feeds, setFeeds] = useState(null);
  const [loading, setLoading] = useState(true);

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    Promise.all([
      fetch(`${backend}/`).then((r) => setBackendUp(r.ok)).catch(() => setBackendUp(false)),
      fetch(`${backend}/api/status`).then((r) => r.json()).then(setStatus).catch(() => setStatus(null)),
      fetch(`${backend}/api/feeds`).then((r) => r.json()).then((d) => setFeeds(d.feeds || [])).catch(() => setFeeds([]))
    ]).finally(() => setLoading(false));
  }, []);

  const failingFeeds = (feeds || []).filter((f) => f.ok === false);

  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-2 text-foreground">🛠️ Admin Panel</h1>

        {loading ? (
          <p className="text-muted-foreground">Checking system status…</p>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Backend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <StatusBadge ok={backendUp} label={backendUp ? 'Reachable' : 'Unreachable'} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI / API Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {status ? (
                  <>
                    <div>
                      <StatusBadge
                        ok={status.anthropicConfigured}
                        label={status.anthropicConfigured ? 'ANTHROPIC_API_KEY configured' : 'ANTHROPIC_API_KEY missing — AI scoring, geolocation, and Threat Scorer disabled'}
                      />
                    </div>
                    <div>
                      <StatusBadge
                        ok={status.leakcheckConfigured}
                        label={status.leakcheckConfigured ? 'LEAKCHECK_API_KEY configured' : 'LEAKCHECK_API_KEY missing — Dark Web check disabled'}
                      />
                    </div>
                    <div>
                      <StatusBadge
                        ok={status.mailerConfigured}
                        label={status.mailerConfigured ? 'SMTP_USER/SMTP_PASS configured' : 'SMTP_USER/SMTP_PASS missing — email alerts disabled'}
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-critical text-sm">Could not reach /api/status.</p>
                )}
              </CardContent>
            </Card>

            <EmailAlertsSettings />

            <Card>
              <CardHeader>
                <CardTitle>Feeds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {feeds && (
                  <p className="text-sm text-muted-foreground">
                    {feeds.length - failingFeeds.length} / {feeds.length} feeds fetching successfully
                    {status && ` · ${status.keywordCount} keyword${status.keywordCount === 1 ? '' : 's'} watched`}
                  </p>
                )}
                {failingFeeds.length > 0 && (
                  <ul className="text-sm text-critical list-disc ml-5">
                    {failingFeeds.map((f) => (
                      <li key={f.url}>
                        {f.title} — {f.error}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>More Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="/settings" className="text-sm text-primary hover:underline">
                  Manual Threat Scorer →
                </Link>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}
