'use client';

import { useState } from 'react';
import ThreatFeedCard from '@/components/ThreatFeedCard';
import FeedList from '@/components/FeedList';

export default function DashboardPage() {
  const [showFeeds, setShowFeeds] = useState(true);

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-8">
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">🧠 CrisisWatch Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Monitor real-time threats, RSS feeds, and AI-analyzed news for situational awareness.
        </p>

        <ThreatFeedCard />
      </section>

      {showFeeds && (
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-black dark:text-white">📰 RSS Feeds</h2>
            <button
              className="px-3 py-1 rounded-md text-sm bg-gray-800 text-white hover:bg-gray-700"
              onClick={() => setShowFeeds(false)}
            >
              Hide Feeds
            </button>
          </div>
          <FeedList />
        </section>
      )}

      {!showFeeds && (
        <div className="text-center">
          <button
            onClick={() => setShowFeeds(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Show Feeds Again
          </button>
        </div>
      )}
    </div>
  );
}

