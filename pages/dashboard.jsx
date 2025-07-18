// File: app/dashboard/page.jsx
'use client';

import ThreatFeed from '@/components/ThreatFeed';
import FeedList from '@/components/FeedList';
import { PhishingChart } from '@/components/PhishingChart';
import { PropagationMap } from '@/components/PropagationMap';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
        <h1 className="text-xl font-bold mb-4 text-black dark:text-white">Threat Feed</h1>
        <ThreatFeed />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Live News Feeds</h2>
        <FeedList />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Phishing Detection</h2>
        <PhishingChart />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Global Threat Activity</h2>
        <PropagationMap />
      </div>
    </div>
  );
}



