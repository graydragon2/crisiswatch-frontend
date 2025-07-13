import { useState, useEffect } from 'react';
import FeedList from '@/components/FeedList';

export default function DashboardPage() {
  const [threats, setThreats] = useState([]);
  const [threatsLoading, setThreatsLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const fetchThreats = async () => {
      setThreatsLoading(true);
      try {
        const res = await fetch('/api/threats');
        const json = await res.json();
        setThreats(json.items || []);
      } catch (err) {
        console.error('Failed to fetch threats:', err);
      } finally {
        setThreatsLoading(false);
      }
    };

    fetchThreats();
    const interval = setInterval(fetchThreats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkDarkWeb = async () => {
    if (!query.trim()) return;
    setChecking(true);
    setResult(null);
    try {
      const res = await fetch(`/api/darkweb?email=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Error checking breach' });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {/* Threat Feed */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 col-span-1 md:col-span-2 xl:col-span-3">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Threat Feed</h1>
        {threatsLoading ? (
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

      {/* Threat Scoring AI */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-2">Threat Scoring AI</h2>
        {threatsLoading ? (
          <p className="text-sm text-gray-400">Scoring threats...</p>
        ) : threats.length === 0 ? (
          <p className="text-sm text-gray-400">No threats to score.</p>
        ) : (
          <ul className="space-y-2">
            {threats.map((item, idx) => (
              <li key={idx} className="border-b border-gray-300 dark:border-gray-700 pb-2">
                <p className="text-sm text-black dark:text-white font-medium">{item.title}</p>
                {item.score !== undefined && (
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    AI Threat Score: <span className="font-semibold">{item.score}/10</span>
                  </p>
                )}
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

      {/* Phishing Detection */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">Phishing Detection</h2>
        <p className="text-gray-500 dark:text-gray-400">Coming soon: real-time graph of phishing attempts.</p>
      </div>

      {/* Dark Web Monitoring */}
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
            className="px-