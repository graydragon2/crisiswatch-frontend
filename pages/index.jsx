import { useState, useEffect } from 'react';
import FeedList from '@/components/FeedList';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchThreats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/threats');
      const json = await res.json();
      setData(json.items || []);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats(); // fetch on first load
    const interval = setInterval(fetchThreats, 5 * 60 * 1000); // every 5 minutes
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Threat Feed</h1>

      <FeedList /> {/* ✅ Displays active RSS feeds */}

      {loading && <p>Loading threats...</p>}
      {!loading && data.length === 0 && <p>No threats found.</p>}

      <ul className="space-y-2 mt-4">
        {data.map((item, idx) => (
          <li key={idx} className="border-b pb-2">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
