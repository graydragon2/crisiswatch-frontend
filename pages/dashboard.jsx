'use client';

import Link from 'next/link';
import AppShell from '@/components/AppShell';
import RssHighlights from '@/components/RssHighlights';
import KeywordAlerts from '@/components/KeywordAlerts';
import LocationWatch from '@/components/LocationWatch';
import { PhishingChart } from '@/components/PhishingChart';
import { PropagationMap } from '@/components/PropagationMap';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>RSS Feed Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <RssHighlights />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dark Web Monitoring</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Check an email address for exposure in known credential leaks.
              </p>
              <Link href="/darkweb" className="text-sm text-primary hover:underline">
                Check now →
              </Link>
            </CardContent>
          </Card>

          <Card id="keywords">
            <CardHeader>
              <CardTitle>Keywords Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <KeywordAlerts compact />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Phishing Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <PhishingChart />
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Propagation Overlay</CardTitle>
            </CardHeader>
            <CardContent>
              <PropagationMap />
            </CardContent>
          </Card>

          <Card id="locations">
            <CardHeader>
              <CardTitle>Watched Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <LocationWatch />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
