// components/Sidebar.jsx
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
      {/* Mobile header: only on small screens */}
      <div className="md:hidden flex items-center justify-between p-4 bg-muted border-b border-border">
        <div className="text-xl font-bold text-foreground">CrisisWatch</div>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="text-foreground"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar itself */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-full transform overflow-y-auto bg-muted p-6 border-r border-border transition-transform duration-300 md:static md:inset-auto md:transform-none md:w-64',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Desktop header: only on md+ */}
        <div className="hidden md:block mb-8 text-2xl font-bold text-foreground">
          CrisisWatch
        </div>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted-foreground/10 transition break-words',
                pathname === item.href
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground'
              )}
              onClick={() => setOpen(false)} // close on mobile when you click a link
            >
              {item.icon}
              <span className="break-words">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}