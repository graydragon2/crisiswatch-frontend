
'use client'

import { Sidebar } from '@/components/Sidebar';
import DarkWebChecker from '@/components/DarkWebChecker'

export default function DarkWebPage() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 xl:container xl:mx-auto">
        <h1 className="text-2xl font-bold mb-4">Dark Web Monitor</h1>
        <DarkWebChecker />
      </main>
    </div>
  )
}
