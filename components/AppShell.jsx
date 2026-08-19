'use client';

import { useRouter } from 'next/router';
import Header from '@/components/Header';
import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';
import { useRequireAuth, logout } from '@/lib/auth';

/**
 * Shared page shell: header (logo/status/notifications), the desktop top
 * nav, page content, and the mobile bottom nav. Replaces the old left
 * Sidebar — every page mounts this instead of assembling its own layout.
 *
 * Also gates every page that mounts it behind auth: useRequireAuth redirects
 * to /login when there's no valid session, so nothing below this renders
 * for a signed-out visitor.
 */
export default function AppShell({ children }) {
  const router = useRouter();
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header user={user} onLogout={() => logout(router)} />
      <TopNav />
      {/* pb-24 clears the fixed mobile bottom nav so content isn't hidden behind it */}
      <main className="p-4 md:p-6 pb-24 md:pb-6">{children}</main>
      <BottomNav />
    </div>
  );
}
