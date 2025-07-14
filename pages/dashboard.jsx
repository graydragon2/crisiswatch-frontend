'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import FeedList from '@/components/FeedList';
import DarkWebChecker from '@/components/DarkWebChecker';
import ThreatScorer from '@/components/ThreatScorer';
import PhishingChart from '@/components/PhishingChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BACKEND_URL } from '@/lib/api';

export default function Dashboard() {
  const [feedsData, setFeedsData] = useState([]);
  const [loadingFeeds, setLoadingFeeds] = useState(true);

  useEffect(() => {
    const fetchFeeds = async () => {
      setLoadingFeeds(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/feeds`);
        const json = await res.json();
        setFeedsData(json.feeds || []);
      } catch (err) {
        console.error('Failed to load feeds:', err);
      } finally {
        setLoadingFeeds(false);
      }
    };

    fetchFeeds();
    const interval = setInterval(fetchFeeds, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">CrisisWatch Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Threat Feed */}
          <Card className="md:col-span-2">
            <CardHeader><CardTitle>🛡️ Threat Feed</CardTitle></CardHeader>
            <CardContent>
              {loadingFeeds ? (
                <p className="text-muted-foreground">Loading feeds…</p>
              ) : (
                <ul className="space-y-2">
                  {feedsData.flatMap((feed) =>
                    (feed.items || []).slice(0, 5).map((item, i) => (
                      <li key={`${feed.url}-${i}`} className="border-b border-border pb-2">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
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

          {/* 2. Manage RSS Feeds */}
          <Card>
            <CardHeader><CardTitle>📡 Manage RSS Feeds</CardTitle></CardHeader>
            <CardContent><FeedList /></CardContent>
          </Card>

          {/* 3. Dark Web Monitoring */}
          <Card>
            <CardHeader><CardTitle>🌐 Dark Web Monitoring</CardTitle></CardHeader>
            <CardContent><DarkWebChecker /></CardContent>
          </Card>

          {/* 4. Keywords Alert */}
          <Card>
            <CardHeader><CardTitle>🔍 Keywords Alert</CardTitle></CardHeader>
            <CardContent>
              <ul className="text-sm list-disc pl-5 text-muted-foreground space-y-1">
                <li>malware</li>
                <li>ransomware</li>
                <li>data breach</li>
              </ul>
            </CardContent>
          </Card>

          {/* 5. Threat Scoring AI */}
          <Card>
            <CardHeader><CardTitle>🤖 Threat Scoring AI</CardTitle></CardHeader>
            <CardContent><ThreatScorer /></CardContent>
          </Card>

          {/* 6. Propagation Overlay */}
          <Card className="md:col-span-2">
            <CardHeader><CardTitle>🗺️ Propagation Overlay</CardTitle></CardHeader>
            <CardContent>
              <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                [Map Placeholder]
              </div>
            </CardContent>
          </Card>

          {/* 7. Phishing Detection */}
          <Card className="md:col-span-2">
            <CardHeader><CardTitle>🎯 Phishing Detection</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Check for phishing indicators across monitored feeds.
              </p>
              <PhishingChart />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}