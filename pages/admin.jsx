'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

function StatusBadge({ ok, label }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${ok ? 'text-green-400' : 'text-red-400'}`}>
      <span className={`h-2 w-2 rounded-full ${ok ? 'bg-green-400' : 'bg-red-400'}`} />
      {label}
    </span>
  );
}

export default function AdminPage() {
  const [backendUp, setBackendUp] = useState(null);
  const [status, setStatus] = useState(null);
  const [feeds, setFeeds] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

    Promise.all([
      fetch(`${backend}/`).then((r) => setBackendUp(r.ok)).catch(() => setBackendUp(false)),
      fetch(`${backend}/api/status`).then((r) => r.json()).then(setStatus).catch(() => setStatus(null)),
      fetch(`${backend}/api/feeds`).then((r) => r.json()).then((d) => setFeeds(d.feeds || [])).catch(() => setFeeds([]))
    ]).finally(() => setLoading(false));
  }, []);

  const failingFeeds = (feeds || []).filter((f) => f.ok === false);

  return (
    <div className="flex flex-col md:block min-h-screen bg-gray-950 text-white">
      <Sidebar />
      <main className="md:ml-64 flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-2">🛠️ Admin Panel</h1>

        {loading ? (
          <p className="text-gray-400">Checking system status…</p>
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
                  </>
                ) : (
                  <p className="text-red-400 text-sm">Could not reach /api/status.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feeds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {feeds && (
                  <p className="text-sm text-gray-300">
                    {feeds.length - failingFeeds.length} / {feeds.length} feeds fetching successfully
                    {status && ` · ${status.keywordCount} keyword${status.keywordCount === 1 ? '' : 's'} watched`}
                  </p>
                )}
                {failingFeeds.length > 0 && (
                  <ul className="text-sm text-red-400 list-disc ml-5">
                    {failingFeeds.map((f) => (
                      <li key={f.url}>
                        {f.title} — {f.error}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
