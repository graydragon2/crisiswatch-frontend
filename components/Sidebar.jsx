'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Rss,
  Settings,
  ShieldCheck,
  Lock,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { name: 'Feeds', href: '/feeds', icon: <Rss size={18} /> },
  { name: 'Settings', href: '/settings', icon: <Settings size={18} /> },
  { name: 'Dark Web', href: '/darkweb', icon: <Lock size={18} /> },
  { name: 'Admin Panel', href: '/admin', icon: <ShieldCheck size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden p-4 flex justify-between items-center bg-muted border-b border-border">
        <div className="text-xl font-bold text-foreground">CrisisWatch</div>
        <button onClick={() => setOpen(!open)} aria-label="Toggle Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar itself */}
      <aside
        className={cn(
          // full-screen off-canvas on small, fixed width on md+
          'fixed inset-y-0 left-0 w-full md:w-64 bg-muted p-6 border-r border-border z-50 transition-transform duration-300 md:static',
          // slide in/out on mobile
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="hidden md:block text-2xl font-bold mb-8 text-foreground">
          CrisisWatch
        </div>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted-foreground/10 transition',
                pathname === item.href
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground'
              )}
              onClick={() => setOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}