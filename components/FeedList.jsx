import { useEffect, useState } from 'react';

export default function FeedList() {
  const [feeds, setFeeds] = useState([]);
  const [url, setUrl] = useState('');

  const fetchFeeds = async () => {
    const res = await fetch('/api/feeds');
    const data = await res.json();
    setFeeds(data.feeds || []);
  };

  const addFeed = async () => {
    if (!url) return;
    await fetch('/api/feeds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    setUrl('');
    fetchFeeds();
  };

  const removeFeed = async (urlToRemove) => {
    await fetch('/api/feeds', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlToRemove })
    });
    fetchFeeds();
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Active RSS Feeds</h2>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter RSS feed URL"
        className="border p-2 rounded text-black"
      />
      <button onClick={addFeed} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      <ul className="mt-4">
        {feeds.map((feed, idx) => (
          <li key={idx} className="flex justify-between items-center border-b py-2">
            <span>{feed.url || feed.name}</span>
            <button onClick={() => removeFeed(feed.url)} className="text-red-500">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
