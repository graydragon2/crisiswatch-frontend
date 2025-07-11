import { useEffect, useState } from 'react';
import FeedList from '@/components/FeedList';

export default function DashboardPage() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchThreats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/threats');
      const json = await res.json();
      setThreats(json.items || []);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats(); // initial load
    const interval = setInterval(fetchThreats, 5 * 60 * 1000); // every 5 min
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">🛰️ CrisisWatch Dashboard</h1>

      {/* Show active feeds */}
      <FeedList />

      {/* Show parsed headlines */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">📰 Parsed Threat Headlines</h2>
        {loading && <p>Loading...</p>}
        {!loading && threats.length === 0 && <p className="text-gray-400">No threats found.</p>}
        <ul className="space-y-2">
          {threats.map((item, idx) => (
            <li key={idx} className="border-b border-gray-700 pb-2">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {item.title}
              </a>
              <p className="text-sm text-gray-400">{item.pubDate}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
