'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';
import { BACKEND_URL } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to send sign-in link.');
      setStatus('sent');
    } catch (err) {
      setError(err.message || 'Failed to send sign-in link.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <Shield size={28} className="text-primary" />
          <h1 className="text-2xl font-bold">Contingency Brief</h1>
        </div>

        {status === 'sent' ? (
          <div className="rounded-2xl bg-card ring-1 ring-border p-6 text-center space-y-2">
            <p className="text-card-foreground font-medium">Check your email</p>
            <p className="text-sm text-muted-foreground">
              We sent a sign-in link to <span className="text-card-foreground">{email}</span>. It expires in 15 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="rounded-2xl bg-card ring-1 ring-border p-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-muted-foreground mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-2.5 rounded bg-white/5 text-card-foreground text-sm placeholder-muted-foreground border border-border"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full px-3 py-2.5 bg-primary text-white text-sm font-medium rounded hover:opacity-90 disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending…' : 'Send sign-in link'}
            </button>
            {error && <p className="text-sm text-critical">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
