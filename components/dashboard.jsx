

'use client'

import Sidebar from '@/components/Sidebar'
import FeedList from '@/components/FeedList'
import DarkWebChecker from '@/components/DarkWebChecker'
import ThreatScorer from '@/components/ThreatScorer'
import PhishingChart from '@/components/PhishingChart'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [feeds, setFeeds] = useState([])
  const [loadingFeeds, setLoadingFeeds] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/feeds`)
        const json = await res.json()
        setFeeds(json.feeds || [])
      } catch {
      } finally {
        setLoadingFeeds(false)
      }
    }
    load()
  }, [])

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 p-6 xl:container xl:mx-auto">
        <h1 className="text-2xl font-bold mb-6">CrisisWatch Dashboard</h1>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Threat Feed */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>🛡️ Threat Feed</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingFeeds ? (
                <p>Loading…</p>
              ) : feeds.length === 0 ? (
                <p>No feeds.</p>
              ) : (
                <ul className="space-y-2">
                  {feeds.flatMap((f) =>
                    f.items.slice(0, 5).map((i, idx) => (
                      <li key={`${f.url}-${idx}`} className="border-b border-border pb-2">
                        <a
                          href={i.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {i.title}
                        </a>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* RSS */}
          <Card>
            <CardHeader>
              <CardTitle>📡 Manage RSS Feeds</CardTitle>
            </CardHeader>
            <CardContent>
              <FeedList />
            </CardContent>
          </Card>

          {/* Dark Web */}
          <Card>
            <CardHeader>
              <CardTitle>🌐 Dark Web Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <DarkWebChecker />
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle>🔍 Keywords Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>malware</li>
                <li>ransomware</li>
                <li>data breach</li>
              </ul>
            </CardContent>
          </Card>

          {/* Threat Scoring */}
          <Card>
            <CardHeader>
              <CardTitle>🤖 Threat Scoring AI</CardTitle>
            </CardHeader>
            <CardContent>
              <ThreatScorer />
            </CardContent>
          </Card>

          {/* Propagation */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>🗺️ Propagation Overlay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                [Map Placeholder]
              </div>
            </CardContent>
          </Card>

          {/* Phishing */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>🎯 Phishing Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <PhishingChart />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
