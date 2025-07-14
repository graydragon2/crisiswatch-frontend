import { useState, useEffect } from 'react';


const BACKEND_URL = 'crisiswatch-api-production.up.railway.app';


export default function FeedList() {
  const [feeds, setFeeds] = useState([]);
  const [newFeed, setNewFeed] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    try {
      const res = await fetch(`https://crisiswatch-api-production.up.railway.app`);
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
      const res = await fetch(`https://crisiswatch-api-production.up.railway.app`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newFeed }),
      });
      if (!res.ok) throw new Error('Failed to add feed');
      setNewFeed('');
      fetchFeeds();
    } catch (err) {
      console.error(err);
      setError('Error adding feed.');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={newFeed}
          onChange={(e) => setNewFeed(e.target.value)}
          placeholder="Add new RSS feed URL"
          className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        />
        <button
          onClick={addFeed}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <ul className="list-disc ml-5 text-sm text-black dark:text-white">
  {feeds.map((feed, idx) => (
    <li key={idx}>{feed.title || feed}</li>
  ))}
</ul>

    </div>
  );
}
