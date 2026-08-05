'use client';

import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import Header from '@/components/Header';
import RssHighlights from '@/components/RssHighlights';
import KeywordAlerts from '@/components/KeywordAlerts';
import { PhishingChart } from '@/components/PhishingChart';
import { PropagationMap } from '@/components/PropagationMap';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="flex flex-col md:block">
      <Sidebar />
      <div className="md:ml-64 min-h-screen bg-gray-950">
        <Header />
        <main className="p-6">
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
                  <p className="text-sm text-gray-400">
                    Check an email address for exposure in known credential leaks.
                  </p>
                  <Link href="/darkweb" className="text-sm text-blue-400 hover:underline">
                    Check now →
                  </Link>
                </CardContent>
              </Card>

              <Card>
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
