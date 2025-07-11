'use client';
import { useEffect, useState } from 'react';

export default function FeedManager() {
  const [feeds, setFeeds] = useState([]);
  const [newFeed, setNewFeed] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch feeds on load
  useEffect(() => {
    fetch('/api/feeds')
      .then(res => res.json())
      .then(setFeeds)
      .catch(err => setError('Failed to load feeds.'));
  }, []);

  // Add a new feed
  const addFeed = async () => {
    if (!newFeed.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newFeed.trim() }),
      });
      const data = await res.json();
      setFeeds(data.feeds);
      setNewFeed('');
    } catch {
      setError('Failed to add feed.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a feed
  const removeFeed = async (url) => {
    setLoading(true);
    try {
      const res = await fetch('/api/feeds', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setFeeds(data.feeds);
    } catch {
      setError('Failed to remove feed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">📡 Manage RSS Feeds</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-grow p-2 rounded bg-gray-100 dark:bg-gray-800"
          placeholder="https://example.com/rss"
          value={newFeed}
          onChange={(e) => setNewFeed(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={addFeed}
          disabled={loading}
        >
          Add
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <ul className="space-y-2">
        {feeds.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No feeds yet.</p>
        )}
        {feeds.map((url) => (
          <li key={url} className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <span className="truncate">{url}</span>
            <button
              onClick={() => removeFeed(url)}
              className="text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
