
'use client'

import Sidebar from '@/components/Sidebar'
import FeedList from '@/components/FeedList'

export default function FeedsPage() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 xl:container xl:mx-auto">
        <h1 className="text-2xl font-bold mb-4">RSS Feeds</h1>
        <FeedList />
      </main>
    </div>
  )
}
