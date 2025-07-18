'use client';

import { Sidebar } from '@/components/Sidebar';
import ThreatFeed from '@/components/ThreatFeed';
import FeedList from '@/components/FeedList';
import { PhishingChart } from '@/components/PhishingChart';
import { PropagationMap } from '@/components/PropagationMap';

export default function DashboardPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-6 space-y-6 bg-gray-950 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-white mb-2">Threat Feed</h2>
            <ThreatFeed />
          </div>

          <div className="bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-white mb-2">Live News Feeds</h2>
            <FeedList />
          </div>

          <div className="bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-white mb-2">Phishing Detection</h2>
            <PhishingChart />
          </div>

          <div className="bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-white mb-2">Global Threat Activity</h2>
            <PropagationMap />
          </div>
        </div>
      </main>
    </div>
  );
}




