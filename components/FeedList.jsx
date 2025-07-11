'use client';
import { useEffect, useState } from 'react';

export default function FeedList() {
  const [feeds, setFeeds] = useState([]);
  const [presets, setPresets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const res = await fetch('https://crisiswatch-api.onrender.com/api/feeds');
        const json = await res.json();
        setFeeds(data.feeds || []);
        if (json.feeds) setFeeds(json.feeds);
        else throw new Error('Missing feeds array');
      } catch (err) {
        console.error('Feed load error:', err);
        setError('Failed to load feeds');
      }
    };

    const fetchPresets = async () => {
      try {
        const res = await fetch('/api/data/presets.json');
        const json = await res.json();
        setPresets(json);
      } catch (err) {
        console.warn('Presets not found or invalid format. Using empty.');
        setPresets([]);
      }
    };

    fetchFeeds();
    fetchPresets();
  }, []);

  const getFeedName = (url) => {
    const match = presets.find((p) => p.url === url);
    return match ? match.name : 'Unknown Feed';
  };

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">📡 Active RSS Feeds</h2>
      {error && <p className="text-red-400">{error}</p>}
      {!error && feeds.length === 0 && <p className="text-gray-400">No feeds found.</p>}
      <ul className="space-y-1">
        {feeds.map((url, idx) => (
          <li key={idx} className="text-sm border-b border-gray-700 pb-1">
            <span className="font-medium text-white">{getFeedName(url)}</span>
            <br />
            <a href={url} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
