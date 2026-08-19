'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Shield } from 'lucide-react';
import { BACKEND_URL } from '@/lib/api';
import { setStoredToken } from '@/lib/auth';

export default function VerifyPage() {
  const router = useRouter();
  const [status, setStatus] = useState('verifying'); // verifying | error
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;
    const { token } = router.query;
    if (!token) {
      setStatus('error');
      setError('Missing sign-in token.');
      return;
    }
    fetch(`${BACKEND_URL}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'That sign-in link is invalid or has expired.');
        setStoredToken(data.token);
        router.replace('/dashboard');
      })
      .catch((err) => {
        setStatus('error');
        setError(err.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.token]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center space-y-4">
        <div className="flex items-center gap-2.5 justify-center">
          <Shield size={28} className="text-primary" />
          <h1 className="text-2xl font-bold">Contingency Brief</h1>
        </div>
        {status === 'verifying' ? (
          <p className="text-sm text-muted-foreground">Signing you in…</p>
        ) : (
          <div className="rounded-2xl bg-card ring-1 ring-border p-6 space-y-3">
            <p className="text-card-foreground font-medium">Sign-in failed</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <a href="/login" className="inline-block text-sm text-primary hover:underline">
              Request a new link
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
