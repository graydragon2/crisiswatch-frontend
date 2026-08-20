'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import AppShell from '@/components/AppShell';
import EmailAlertsSettings from '@/components/EmailAlertsSettings';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const LINKS = [
  { href: '/dashboard#keywords', label: 'Monitored Keywords' },
  { href: '/dashboard#locations', label: 'Watched Locations' },
  { href: '/darkweb', label: 'Dark Web Monitoring' },
  { href: '/settings', label: 'Manual Threat Scorer' },
  { href: '/subscribe', label: 'Subscription & Billing' },
  { href: '/admin', label: 'Admin Panel' },
];

/**
 * Mobile bottom-nav destination that replaces Admin on small screens.
 */
export default function ProfilePage() {
  const { theme, setTheme } = useTheme();

  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-6 text-foreground">Profile</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-card-foreground">Theme</span>
              <div className="flex gap-1 rounded-lg bg-white/5 p-1">
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs ${theme === 'dark' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
                >
                  <Moon size={14} /> Dark
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs ${theme === 'light' ? 'bg-primary text-white' : 'text-muted-foreground'}`}
                >
                  <Sun size={14} /> Light
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <EmailAlertsSettings />

        <Card>
          <CardHeader>
            <CardTitle>Monitoring & Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-primary hover:underline">
                    {l.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
