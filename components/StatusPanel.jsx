'use client';

import { useEffect, useRef, useState } from 'react';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

function Row({ ok, label }) {
  return (
    <div className="flex items-center gap-2 text-sm text-card-foreground">
      <span className={`h-2 w-2 rounded-full flex-shrink-0 ${ok ? 'bg-low' : 'bg-critical'}`} />
      <span className={ok ? '' : 'text-muted-foreground'}>{label}</span>
    </div>
  );
}

/**
 * The header's clickable "API Online" pill — opens a small panel with an
 * at-a-glance system health view (same underlying /api/status data the
 * Admin Panel shows in more detail).
 */
export default function StatusPanel() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [status, setStatus] = useState(null);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const check = async () => {
      try {
        const [healthRes, statusRes] = await Promise.all([
          fetch(`${BACKEND}/`).catch(() => null),
          fetch(`${BACKEND}/api/status`).then((r) => r.json()).catch(() => null)
        ]);
        setApiStatus(healthRes?.ok ? 'online' : 'offline');
        setStatus(statusRes);
      } catch {
        setApiStatus('offline');
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClickAway = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`text-xs font-semibold px-3 py-1 rounded-full ring-1 transition-colors ${
          apiStatus === 'online'
            ? 'bg-low/10 text-low ring-low/30'
            : apiStatus === 'offline'
            ? 'bg-critical/10 text-critical ring-critical/30'
            : 'bg-muted text-muted-foreground ring-border'
        }`}
      >
        {apiStatus === 'online' ? '● API Online' : apiStatus === 'offline' ? '● API Offline' : 'Checking…'}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl bg-card ring-1 ring-border p-4 space-y-2 z-50">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">System status</p>
          <Row ok={apiStatus === 'online'} label={apiStatus === 'online' ? 'Backend reachable' : 'Backend unreachable'} />
          {status ? (
            <>
              <Row ok={status.anthropicConfigured} label="AI scoring & geolocation" />
              <Row ok={status.leakcheckConfigured} label="Dark web checks" />
              <Row ok={status.mailerConfigured} label="Email alerts" />
              <div className="pt-2 mt-2 border-t border-border text-xs text-muted-foreground">
                {status.feedCount} feed{status.feedCount === 1 ? '' : 's'} watched
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Could not reach /api/status.</p>
          )}
        </div>
      )}
    </div>
  );
}
