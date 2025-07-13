import { useEffect, useState } from 'react';

export default function FeedsPage() {
  const [feeds, setFeeds] = useState([]);
  const [newFeed, setNewFeed] = useState('');
  const [loading, setLoading] = useState(false);

  // Load feeds on mount
  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    const res = await fetch('/api/feeds');
    const data = await res.json();
    setFeeds(data);
  };

  const addFeed = async () => {
    if (!newFeed.trim()) return;
    setLoading(true);
    const res = await fetch('/api/feeds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: newFeed }),
    });
    const data = await res.json();
    setFeeds(data.feeds);
    setNewFeed('');
    setLoading(false);
  };

  const removeFeed = async (url) => {
    setLoading(true);
    const res = await fetch('/api/feeds', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    setFeeds(data.feeds);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage RSS Feeds</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-grow p-2 border rounded dark:bg-gray-800 dark:text-white"
          placeholder="Enter RSS feed URL"
          value={newFeed}
          onChange={(e) => setNewFeed(e.target.value)}
        />
        <button
          onClick={addFeed}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {feeds.map((url, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded"
          >
            <span className="truncate dark:text-white">{url}</span>
            <button
              onClick={() => removeFeed(url)}
              className="text-red-500 hover:text-red-700"
              disabled={loading}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
