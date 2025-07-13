// /components/FeedList.jsx
import { useState, useEffect } from 'react';

export default function FeedList() {
  const [feeds, setFeeds] = useState([]);
  const [newFeed, setNewFeed] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    try {
      const res = await fetch('/api/feeds');
      const json = await res.json();
      setFeeds(json.feeds || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load feeds.');
    }
  };

  const addFeed = async () => {
    if (!newFeed) return;
    try {
      const res = await fetch('/api/feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newFeed })
      });
      if (!res.ok) throw new Error('Failed to add feed');
      setNewFeed('');
      fetchFeeds();
    } catch (err) {
      console.error(err);
      setError('Could not add feed.');
    }
  };

  const removeFeed = async (url) => {
    try {
      const res = await fetch('/api/feeds', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (!res.ok) throw new Error('Failed to delete feed');
      fetchFeeds();
    } catch (err) {
      console.error(err);
      setError('Could not remove feed.');
    }
  };

  return (
    <div>
      <ul className="list-disc ml-4 mb-2 text-sm text-gray-800 dark:text-gray-200">
        {feeds.map((feed, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <span className="break-all">{feed}</span>
            <button
              onClick={() => removeFeed(feed)}
              className="ml-2 text-red-600 hover:text-red-800 text-xs"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add new RSS feed URL"
          value={newFeed}
          onChange={(e) => setNewFeed(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        />
        <button
          onClick={addFeed}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}