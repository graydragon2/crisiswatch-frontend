'use client';

import { Shield, LogOut } from 'lucide-react';
import StatusPanel from '@/components/StatusPanel';
import NotificationBell from '@/components/NotificationBell';

export default function Header({ user, onLogout }) {
  return (
    <header className="border-b border-border px-4 md:px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5 min-w-0">
        <Shield size={26} className="text-primary flex-shrink-0" />
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-card-foreground leading-tight truncate">CrisisWatch</h1>
          <p className="text-xs md:text-sm text-muted-foreground truncate">AI-Powered Security Threat Monitoring</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <StatusPanel />
        <NotificationBell />
        {user && (
          <button
            onClick={onLogout}
            title={`Signed in as ${user.email} — sign out`}
            className="p-2 rounded hover:bg-white/10 text-muted-foreground hover:text-card-foreground"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );
}
