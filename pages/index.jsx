import FeedList from '@/components/FeedList';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreats = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/threats');
        const json = await res.json();
        setThreats(json.items || []);
      } catch (err) {
        console.error('Failed to fetch threats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
    const interval = setInterval(fetchThreats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {/* Threat Feed */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 col-span-1 md:col-span-2 xl:col-span-3">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Threat Feed</h1>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        ) : threats.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No threats found.</p>
        ) : (
          <ul className="space-y-2">
            {threats.map((item, idx) => (
              <li key={idx} className="border-b border-gray-300 dark:border-gray-700 pb-2">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RSS Feed Management */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">Manage RSS Feeds</h2>
        <FeedList />
      </div>

      {/* Phishing Detection (placeholder) */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">Phishing Detection</h2>
        <p className="text-gray-500 dark:text-gray-400">Coming soon: real-time graph of phishing attempts.</p>
      </div>

      {/* Dark Web Monitoring (functional) */}
<div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
  <h2 className="text-lg font-semibold text-black dark:text-white mb-2">Dark Web Monitoring</h2>
  
  <div className="flex gap-2 mb-2">
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Enter email or username"
      className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
    />
    <button
      onClick={checkDarkWeb}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Check
    </button>
  </div>

  {loading && <p className="text-sm text-gray-400">Checking...</p>}
  {result?.error && <p className="text-sm text-red-500">{result.error}</p>}
  {result?.found === false && <p className="text-sm text-green-500">✅ No compromised credentials found.</p>}
  {result?.found === true && (
    <div className="text-sm text-red-500">
      <p>⚠️ Compromised credentials found:</p>
      <ul className="list-disc ml-5 mt-2">
        {result.entries?.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  )}
</div>

      {/* Keywords Alert */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">Keywords Alert</h2>
        <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
          <li>malware</li>
          <li>ransomware</li>
          <li>data breach</li>
        </ul>
      </div>

      {/* Propagation Overlay Map (placeholder) */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 col-span-1 md:col-span-2">
        <h2 className="text-lg font-semibold text-black dark:text-white">Propagation Overlay</h2>
        <p className="text-gray-500 dark:text-gray-400">Map coming soon with VOACAP propagation data.</p>
        <div className="mt-4 w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}