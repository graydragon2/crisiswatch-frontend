'use client';

import Header from '@/components/Header';
import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';

/**
 * Shared page shell: header (logo/status/notifications), the desktop top
 * nav, page content, and the mobile bottom nav. Replaces the old left
 * Sidebar — every page mounts this instead of assembling its own layout.
 */
export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <TopNav />
      {/* pb-24 clears the fixed mobile bottom nav so content isn't hidden behind it */}
      <main className="p-4 md:p-6 pb-24 md:pb-6">{children}</main>
      <BottomNav />
    </div>
  );
}
