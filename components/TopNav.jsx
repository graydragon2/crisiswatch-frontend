'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Rss, AlertTriangle, Eye, Gauge, Shield as ShieldIcon } from 'lucide-react';

const LINKS = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/feeds', label: 'Feeds', Icon: Rss },
  { href: '/threats', label: 'Threats', Icon: AlertTriangle },
  { href: '/darkweb', label: 'Dark Web', Icon: Eye },
  { href: '/threat-score', label: 'Threat Score', Icon: Gauge },
  { href: '/admin', label: 'Admin', Icon: ShieldIcon },
];

/** Desktop-only horizontal nav bar, per the CrisisWatch nav spec. */
export default function TopNav() {
  const router = useRouter();
  const isActive = (href) => router.pathname === href;

  return (
    <nav className="hidden md:block border-b border-border px-6">
      <ul className="flex items-center gap-1">
        {LINKS.map(({ href, label, Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={`flex items-center gap-2 px-3 py-3 text-sm border-b-2 transition-colors ${
                isActive(href)
                  ? 'border-primary text-card-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-card-foreground'
              }`}
            >
              <Icon size={16} /> {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
