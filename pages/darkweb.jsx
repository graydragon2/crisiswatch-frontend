'use client'

import AppShell from '@/components/AppShell';
import DarkWebChecker from '@/components/DarkWebChecker'
import MonitoredAddresses from '@/components/MonitoredAddresses'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DarkWebPage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Dark Web Monitor</h1>

        <Card>
          <CardHeader>
            <CardTitle>One-Time Check</CardTitle>
          </CardHeader>
          <CardContent>
            <DarkWebChecker />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monitored Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            <MonitoredAddresses />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
