import { useState, useEffect } from 'react';
import FeedList from '@/components/FeedList';

export default function DashboardPage() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

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

  const checkDarkWeb = async () => {
    if (!query.trim()) {
      setResult({ error: 'Missing email or API key' });
      return;
    }
    setChecking(true);
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
    <div className="p-4 space-y-6">
      {/* Threat Feed */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <h1 className="text-xl font-bold mb-2 text-black dark:text-white">Threat Feed</h1>
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

      {/* Feed List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <FeedList />
      </div>

      {/* Phishing Detection */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">Phishing Detection</h2>
        <p className="text-gray-500 dark:text-gray-400">Coming soon: real-time graph of phishing attempts.</p>
      </div>

      {/* Dark Web Monitoring */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">Dark Web Monitoring</h2>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your email"
            className="w-full sm:w-auto flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
          />
          <button
            onClick={checkDarkWeb}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={checking}
          >
            {checking ? 'Checking...' : 'Check'}
          </button>
        </div>
        {result && result.error && (
          <p className="text-red-500 mt-2">{result.error}</p>
        )}
        {result && result.breaches && result.breaches.length > 0 && (
          <ul className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {result.breaches.map((breach, i) => (
              <li key={i}>🛑 {breach}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Threat Scoring (Coming Soon) */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">Threat Scoring AI</h2>
        <p className="text-gray-500 dark:text-gray-400">Coming soon: AI scoring for threat relevance and severity.</p>
      </div>

      {/* Keywords Alert */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">Keywords Alert</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          <li>malware</li>
          <li>ransomware</li>
          <li>data breach</li>
        </ul>
      </div>

      {/* VOACAP Propagation */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">Propagation Overlay</h2>
        <p className="text-gray-500 dark:text-gray-400">Map coming soon with VOACAP propagation data.</p>
      </div>
    </div>
  );
}