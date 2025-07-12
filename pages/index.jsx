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
    <div className="p-4 space-y-6">
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

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <FeedList />
      </div>
    </div>
  );
}
