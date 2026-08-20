'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { apiFetch } from '@/lib/api';

/**
 * Email alert notification preferences — used on both the (desktop) Admin
 * Panel and the (mobile) Profile page, since it's genuinely both an "admin"
 * concern and a per-user "notification preference." Self-contained: loads
 * its own state rather than relying on a parent's /api/status fetch, so it
 * can be dropped into either page.
 */
export default function EmailAlertsSettings() {
  const [enabled, setEnabled] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [mailerConfigured, setMailerConfigured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    apiFetch('/api/alerts/settings')
      .then((r) => r.json())
      .then((d) => {
        setEnabled(Boolean(d.enabled));
        setRecipient(d.recipient || '');
        setMailerConfigured(Boolean(d.mailerConfigured));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function persistSettings() {
    const res = await apiFetch('/api/alerts/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled, recipient })
    });
    if (!res.ok) throw new Error('Failed to save settings.');
  }

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await persistSettings();
      setMessage({ type: 'success', text: 'Saved.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  const sendTest = async () => {
    setTestSending(true);
    setMessage(null);
    try {
      // Save whatever's currently in the box first — requiring a separate
      // Save click before "Send test email" works wasn't obvious, and
      // previously just 400'd with "No recipient configured" against
      // whatever was last saved (or nothing) instead of what's typed now.
      await persistSettings();
      const res = await apiFetch('/api/alerts/test', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send test email');
      setMessage({ type: 'success', text: 'Test email sent — check your inbox.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to send test email.' });
    } finally {
      setTestSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            <label className="flex items-center gap-2 text-sm text-card-foreground">
              <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
              Enabled — email me when something high-severity shows up
            </label>
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="you@example.com"
              className="w-full max-w-sm p-2 rounded bg-white/5 text-card-foreground text-sm placeholder-muted-foreground border border-border"
            />
            <div className="flex gap-2">
              <button
                onClick={save}
                disabled={saving}
                className="px-3 py-2 bg-primary text-white text-sm rounded hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={sendTest}
                disabled={testSending || !mailerConfigured || !recipient.trim()}
                className="px-3 py-2 bg-white/10 text-card-foreground text-sm rounded hover:bg-white/20 disabled:opacity-50"
                title={
                  !mailerConfigured
                    ? 'RESEND_API_KEY not configured on the server'
                    : !recipient.trim()
                    ? 'Enter an email address first'
                    : 'Saves your current settings, then sends a test email'
                }
              >
                {testSending ? 'Sending…' : 'Send test email'}
              </button>
            </div>
            {message && (
              <p className={`text-sm ${message.type === 'error' ? 'text-critical' : 'text-low'}`}>{message.text}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
