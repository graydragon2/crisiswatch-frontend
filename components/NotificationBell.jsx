'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, X } from 'lucide-react';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;
const POLL_MS = 60000;

const CATEGORY_STYLE = {
  Critical: 'bg-critical/10 text-critical ring-critical/30',
  High: 'bg-high/10 text-high ring-high/30',
  Medium: 'bg-medium/10 text-medium ring-medium/30',
  Informational: 'bg-informational/10 text-informational ring-informational/30'
};

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/**
 * Header notification bell — backed by crisiswatch-api's in-app
 * notification center (/api/notifications). Populated from the same
 * per-tick detection pass that drives email alerts, so this fills in even
 * for users who haven't configured email.
 */
export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const load = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/notifications`);
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // leave existing state; next poll will retry
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_MS);
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

  const markRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await fetch(`${BACKEND}/api/notifications/${id}/read`, { method: 'POST' });
    } catch {
      // best-effort; next poll reconciles
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await fetch(`${BACKEND}/api/notifications/read-all`, { method: 'POST' });
    } catch {
      // best-effort; next poll reconciles
    }
  };

  const clear = async (id, e) => {
    e.stopPropagation();
    const wasUnread = notifications.find((n) => n.id === id)?.read === false;
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await fetch(`${BACKEND}/api/notifications/${id}`, { method: 'DELETE' });
    } catch {
      // best-effort; next poll reconciles
    }
  };

  const openNotification = (n) => {
    if (!n.read) markRead(n.id);
    if (n.link) window.open(n.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative p-2 rounded-full text-muted-foreground hover:text-card-foreground hover:bg-white/5 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-critical text-white text-[10px] font-semibold flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl bg-card ring-1 ring-border z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-card-foreground">Notifications</p>
            {notifications.length > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Nothing to report right now.</p>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => openNotification(n)}
                  className={`px-4 py-3 cursor-pointer hover:bg-white/5 ${n.read ? '' : 'bg-white/[0.03]'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      {!n.read && <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ring-1 ${CATEGORY_STYLE[n.category] || CATEGORY_STYLE.Informational}`}>
                            {n.category}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
                        </div>
                        <p className="text-sm text-card-foreground truncate">{n.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => clear(n.id, e)}
                      aria-label="Clear notification"
                      className="text-muted-foreground hover:text-critical flex-shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
