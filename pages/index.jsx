// pages/index.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Shield, Newspaper, MapPin, Eye, Mail, Check } from 'lucide-react';
import { getStoredToken } from '@/lib/api';

const FEATURES = [
  {
    Icon: Newspaper,
    title: 'AI-scored threat feed',
    body: 'Curated global RSS sources, aggregated and scored 1-10 for severity by Claude — sort by what actually matters, not just what\'s loudest.'
  },
  {
    Icon: MapPin,
    title: 'Watched locations',
    body: 'Track specific zip codes for NWS weather/emergency alerts and location-scoped local news — the stuff national coverage skips.'
  },
  {
    Icon: Eye,
    title: 'Dark-web exposure monitoring',
    body: 'Persistent, automatic checks for your monitored email addresses against known credential breaches.'
  },
  {
    Icon: Mail,
    title: 'High-severity email alerts',
    body: 'Get emailed the moment something crosses your threshold — you don\'t have to keep the dashboard open.'
  }
];

const PLAN_FEATURES = [
  'AI-scored threat feed across curated global sources',
  'Watched locations — weather alerts + local news per zip',
  'Persistent dark-web exposure monitoring',
  'Email alerts for high-severity items'
];

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Already signed in — no reason to show the marketing page.
    if (getStoredToken()) router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-4 md:px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5">
          <Shield size={24} className="text-primary" />
          <span className="text-lg font-bold text-foreground">Contingency Brief</span>
        </div>
        <Link href="/login" className="text-sm font-medium text-primary hover:underline">
          Sign in
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6">
        <section className="py-16 md:py-24 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            Know what's happening before it's on the news.
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground">
            AI-scored global threat monitoring, local weather and news for the places you care about, and
            persistent dark-web exposure checks — built for preppers, OSINT-adjacent researchers, and
            geopolitical-risk watchers.
          </p>
          <div className="mt-8">
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Get started — $9/mo
            </Link>
          </div>
        </section>

        <section className="py-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map(({ Icon, title, body }) => (
            <div key={title} className="rounded-2xl bg-card ring-1 ring-border p-5">
              <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center mb-3">
                <Icon size={18} className="text-primary" />
              </div>
              <h3 className="text-base font-semibold text-card-foreground mb-1.5">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-sm mx-auto rounded-2xl bg-card ring-1 ring-border p-6 text-center">
            <h2 className="text-lg font-semibold text-card-foreground mb-1">Contingency Brief</h2>
            <p className="text-4xl font-bold text-card-foreground mb-4">
              $9<span className="text-base font-normal text-muted-foreground">/mo</span>
            </p>
            <ul className="space-y-2 text-left mb-6">
              {PLAN_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check size={14} className="text-low mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/login"
              className="block w-full px-3 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Get started
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Contingency Brief
      </footer>
    </div>
  );
}
