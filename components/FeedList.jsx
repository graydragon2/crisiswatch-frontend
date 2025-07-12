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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feeds`);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feeds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newFeed })
      });
      if (!res.ok) throw new Error('Failed to add feed');
      setNewFeed('');
      fetchFeeds();
    } catch (err) {
      console.error(err);
      setError('Failed to add feed.');
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">📰 Active RSS Feeds</h2>
      <input
        value={newFeed}
        onChange={(e) => setNewFeed(e.target.value)}
        placeholder="Enter feed URL"
        className="border rounded p-1 w-4/5 mr-2 text-black"
      />
      <button onClick={addFeed} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <ul className="list-disc ml-5 mt-3">
        {feeds.map((feed, idx) => (
          <li key={idx}>{feed.url || feed}</li>
        ))}
      </ul>
    </div>
  );
}
