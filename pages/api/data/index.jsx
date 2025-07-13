import FeedList from '@/components/FeedList';
import ThreatFeed from '@/components/ThreatFeed';

export default function Dashboard() {
  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🧠 CrisisWatch Dashboard</h1>
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow p-4 mb-6">
        <FeedList />
      </div>
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow p-4">
        <ThreatFeed />
      </div>
    </div>
  );
}
