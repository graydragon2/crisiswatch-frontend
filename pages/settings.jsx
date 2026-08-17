'use client';

import AppShell from '@/components/AppShell';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import ThreatScorer from '@/components/ThreatScorer';

export default function SettingsPage() {
  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-6 text-foreground">📟 Manual Threat Scorer</h1>
      <Card>
        <CardHeader>
          <CardTitle>Score arbitrary text</CardTitle>
        </CardHeader>
        <CardContent>
          <ThreatScorer />
        </CardContent>
      </Card>
    </AppShell>
  );
}
