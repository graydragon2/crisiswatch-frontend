'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Rss, AlertTriangle, User, Plus } from 'lucide-react';
import QuickActionMenu from '@/components/QuickActionMenu';

const LEFT_LINKS = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/feeds', label: 'Feeds', Icon: Rss },
];
const RIGHT_LINKS = [
  { href: '/threats', label: 'Threats', Icon: AlertTriangle },
  { href: '/profile', label: 'Profile', Icon: User },
];

function NavLink({ href, label, Icon, active }) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-[11px] ${
        active ? 'text-primary' : 'text-muted-foreground'
      }`}
    >
      <Icon size={20} />
      {label}
    </Link>
  );
}

/** Mobile-only fixed bottom nav with a center "+" quick-action button. */
export default function BottomNav() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (href) => router.pathname === href;

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex items-stretch">
        {LEFT_LINKS.map((l) => (
          <NavLink key={l.href} {...l} active={isActive(l.href)} />
        ))}

        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Quick actions"
            className="w-12 h-12 -mt-6 rounded-full bg-primary text-white flex items-center justify-center ring-4 ring-background"
          >
            <Plus size={22} />
          </button>
        </div>

        {RIGHT_LINKS.map((l) => (
          <NavLink key={l.href} {...l} active={isActive(l.href)} />
        ))}
      </nav>

      {menuOpen && <QuickActionMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}
