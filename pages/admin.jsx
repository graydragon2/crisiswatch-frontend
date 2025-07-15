'use client'

import Sidebar from '@/components/Sidebar'

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 xl:container xl:mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <p>Restricted access…</p>
      </main>
    </div>
  )
}
