'use client';

import AppShell from '@/components/AppShell';
import ThreatScoreCard from '@/components/ThreatScoreCard';
import StatCardsRow from '@/components/StatCardsRow';
import ThreatTrendCard from '@/components/ThreatTrendCard';
import LocationWatch from '@/components/LocationWatch';
import RssHighlights from '@/components/RssHighlights';
import KeywordAlerts from '@/components/KeywordAlerts';
import DarkWebChecker from '@/components/DarkWebChecker';
import ComingSoon from '@/components/ComingSoon';
import { PropagationMap } from '@/components/PropagationMap';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Section order follows the dashboard element priority in the product
// spec: Threat Score -> Critical Alerts/Breaking News/Dark Web Hits ->
// Watchlist/Local Alerts -> Latest Threats -> Threat Trend -> Threat Map
// -> Monitoring Tools.
export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        <ThreatScoreCard />
        <StatCardsRow />

        <Card id="locations">
          <CardHeader>
            <CardTitle>Watched Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <LocationWatch />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Threat Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <RssHighlights />
          </CardContent>
        </Card>

        <ThreatTrendCard />

        <Card>
          <CardHeader>
            <CardTitle>Threat Map</CardTitle>
          </CardHeader>
          <CardContent>
            <PropagationMap />
          </CardContent>
        </Card>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Monitoring Tools</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dark Web Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <DarkWebChecker />
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

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Phishing Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <ComingSoon note="Will accept an email, message, URL, or screenshot and return a risk score." />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
