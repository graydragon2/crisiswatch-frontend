import { useEffect, useState } from 'react';

export default function FeedList() {
  const [feeds, setFeeds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const res = await fetch('/api/feeds');
        const data = await res.json();
        setFeeds(data.feeds || []);
      } catch (err) {
        setError('Failed to load feeds');
      }
    };
    fetchFeeds();
  }, []);

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-2">📡 Active RSS Feeds</h2>
      {error && <p className="text-red-400">{error}</p>}
      <ul className="list-disc pl-5 space-y-1">
        {feeds.length > 0 ? (
          feeds.map((url, idx) => <li key={idx}>{url}</li>)
        ) : (
          <li className="text-gray-400">No feeds found.</li>
        )}
      </ul>
    </div>
  );
}
