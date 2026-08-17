'use client'

import AppShell from '@/components/AppShell';
import DarkWebChecker from '@/components/DarkWebChecker'

export default function DarkWebPage() {
  return (
    <AppShell>
      <div className="xl:container xl:mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Dark Web Monitor</h1>
        <DarkWebChecker />
      </div>
    </AppShell>
  )
}
