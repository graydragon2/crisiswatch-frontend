'use client';

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
    if (!newFeed.trim()) return;
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
      setError('Failed to add feed.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter feed URL"
          value={newFeed}
          onChange={(e) => setNewFeed(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md bg-background text-foreground border-border"
        />
        <button
          onClick={addFeed}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {feeds.length === 0 ? (
        <p className="text-muted-foreground">No active RSS feeds.</p>
      ) : (
        <ul className="space-y-2">
          {feeds.map((feed, idx) => (
            <li key={idx} className="text-sm">
              📡 <a href={feed.link} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-400">{feed.title}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
