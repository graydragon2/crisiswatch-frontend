import { useEffect, useState } from 'react';

export default function FeedList() {
  const [feeds, setFeeds] = useState([]);
  const [newFeed, setNewFeed] = useState('');
  const [error, setError] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const loadFeeds = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/feeds`);
        const data = await res.json();
        setFeeds(data.feeds || []);
      } catch (err) {
        console.error('Failed to load feeds:', err);
        setError('Failed to load feeds.');
      }
    };

    loadFeeds();
  }, []);

  const addFeed = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/feeds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newFeed }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to add feed');
        return;
      }

      setFeeds([...feeds, { url: newFeed }]);
      setNewFeed('');
      setError('');
    } catch (err) {
      console.error('Error adding feed:', err);
      setError('Error adding feed.');
    }
  };

  const removeFeed = async (url) => {
    try {
      await fetch(`${apiUrl}/api/feeds`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      setFeeds(feeds.filter(f => f.url !== url));
    } catch (err) {
      console.error('Error removing feed:', err);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Active RSS Feeds</h2>
      <ul className="space-y-2">
        {feeds.map((feed, idx) => (
          <li key={idx} className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded shadow">
            <span className="text-sm break-all">{feed.url}</span>
            <button
              onClick={() => removeFeed(feed.url)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newFeed}
          onChange={(e) => setNewFeed(e.target.value)}
          placeholder="Enter feed URL"
          className="flex-1 px-2 py-1 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
        />
        <button
          onClick={addFeed}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
