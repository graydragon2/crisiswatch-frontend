import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [feeds, setFeeds] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [customFeed, setCustomFeed] = useState('');

  useEffect(() => {
    fetch('/api/preferences')
      .then(res => res.json())
      .then(data => {
        setFeeds(data.feeds || []);
        setKeywords(data.keywords || '');
      });
  }, []);

  const handleToggleFeed = (url) => {
    setFeeds(prev =>
      prev.map(feed =>
        feed.url === url ? { ...feed, active: !feed.active } : feed
      )
    );
  };

  const handleAddFeed = () => {
    if (customFeed && !feeds.some(f => f.url === customFeed)) {
      setFeeds([...feeds, { url: customFeed, active: true }]);
      setCustomFeed('');
    }
  };

  const savePreferences = () => {
    fetch('/api/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feeds, keywords })
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">RSS Feed Preferences</h1>

      <div className="mb-4">
        <label className="block font-medium">Keyword Filters (comma separated)</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Active Feeds</label>
        {feeds.map(feed => (
          <div key={feed.url} className="flex items-center justify-between">
            <span className="text-sm break-all">{feed.url}</span>
            <input
              type="checkbox"
              checked={feed.active}
              onChange={() => handleToggleFeed(feed.url)}
            />
          </div>
        ))}
        <div className="flex mt-2">
          <input
            className="flex-1 border px-2 py-1 rounded-l"
            value={customFeed}
            onChange={e => setCustomFeed(e.target.value)}
            placeholder="Add feed URL"
          />
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded-r"
            onClick={handleAddFeed}
          >Add</button>
        </div>
      </div>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={savePreferences}
      >Save Preferences</button>
    </div>
  );
}
