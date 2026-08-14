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

  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [savingAlerts, setSavingAlerts] = useState(false);
  const [alertsMessage, setAlertsMessage] = useState(null);
  const [testSending, setTestSending] = useState(false);

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    Promise.all([
      fetch(`${backend}/`).then((r) => setBackendUp(r.ok)).catch(() => setBackendUp(false)),
      fetch(`${backend}/api/status`).then((r) => r.json()).then(setStatus).catch(() => setStatus(null)),
      fetch(`${backend}/api/feeds`).then((r) => r.json()).then((d) => setFeeds(d.feeds || [])).catch(() => setFeeds([])),
      fetch(`${backend}/api/alerts/settings`)
        .then((r) => r.json())
        .then((d) => {
          setAlertsEnabled(Boolean(d.enabled));
          setRecipient(d.recipient || '');
        })
        .catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  const saveAlertSettings = async () => {
    setSavingAlerts(true);
    setAlertsMessage(null);
    try {
      const res = await fetch(`${backend}/api/alerts/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: alertsEnabled, recipient })
      });
      if (!res.ok) throw new Error();
      setAlertsMessage({ type: 'success', text: 'Saved.' });
    } catch {
      setAlertsMessage({ type: 'error', text: 'Failed to save settings.' });
    } finally {
      setSavingAlerts(false);
    }
  };

  const sendTestEmail = async () => {
    setTestSending(true);
    setAlertsMessage(null);
    try {
      const res = await fetch(`${backend}/api/alerts/test`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send test email');
      setAlertsMessage({ type: 'success', text: 'Test email sent — check your inbox.' });
    } catch (err) {
      setAlertsMessage({ type: 'error', text: err.message || 'Failed to send test email.' });
    } finally {
      setTestSending(false);
    }
  };

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
                    <div>
                      <StatusBadge
                        ok={status.mailerConfigured}
                        label={status.mailerConfigured ? 'SMTP_USER/SMTP_PASS configured' : 'SMTP_USER/SMTP_PASS missing — email alerts disabled'}
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
                <CardTitle>Email Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={alertsEnabled}
                    onChange={(e) => setAlertsEnabled(e.target.checked)}
                  />
                  Enabled — email me when something high-severity shows up
                </label>
                <input
                  type="email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full max-w-sm p-2 rounded bg-gray-800 text-white text-sm placeholder-gray-500 border border-white/10"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveAlertSettings}
                    disabled={savingAlerts}
                    className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {savingAlerts ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={sendTestEmail}
                    disabled={testSending || !status?.mailerConfigured}
                    className="px-3 py-2 bg-white/10 text-white text-sm rounded hover:bg-white/20 disabled:opacity-50"
                    title={!status?.mailerConfigured ? 'SMTP_USER/SMTP_PASS not configured on the server' : ''}
                  >
                    {testSending ? 'Sending…' : 'Send test email'}
                  </button>
                </div>
                {alertsMessage && (
                  <p className={`text-sm ${alertsMessage.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                    {alertsMessage.text}
                  </p>
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
