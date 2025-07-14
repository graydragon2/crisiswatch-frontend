// pages/dashboard.jsx
'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import FeedList from '@/components/FeedList';
import DarkWebChecker from '@/components/DarkWebChecker';
import ThreatScorer from '@/components/ThreatScorer';
import PhishingChart from '@/components/PhishingChart';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

export default function Dashboard() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/feeds`
        );
        const json = await res.json();
        setFeeds(json.feeds || []);
      } catch (err) {
        console.error('Failed to load feeds:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
    const interval = setInterval(fetchFeeds, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* center + max width */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">CrisisWatch Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Threat Feed */}
            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>🛡️ Threat Feed</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading feeds…</p>
                ) : feeds.length === 0 ? (
                  <p className="text-muted-foreground">No feeds found.</p>
                ) : (
                  <ul className="space-y-2">
                    {feeds.flatMap((feed) =>
                      feed.items.slice(0, 5).map((item, i) => (
                        <li
                          key={`${feed.url}-${i}`}
                          className="border-b border-border pb-2 break-words"
                        >
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                          >
                            {item.title}
                          </a>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* RSS Manager */}
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

            {/* AI Scoring */}
            <Card>
              <CardHeader>
                <CardTitle>🤖 Threat Scoring AI</CardTitle>
              </CardHeader>
              <CardContent>
                <ThreatScorer />
              </CardContent>
            </Card>

            {/* Propagation Overlay */}
            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>🗺️ Propagation Overlay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                  [Map Placeholder]
                </div>
              </CardContent>
            </Card>

            {/* Phishing Detection */}
            <Card className="sm:col-span-2">
              <CardHeader>
                <CardTitle>🎯 Phishing Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Check for phishing indicators across monitored feeds.
                </p>
                <PhishingChart />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}