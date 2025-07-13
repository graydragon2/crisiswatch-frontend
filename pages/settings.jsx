'use client';

import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [feeds, setFeeds] = useState([]);
  const [newFeed, setNewFeed] = useState('');
  const [keywords, setKeywords] = useState('');

  const handleAddFeed = () => {
    if (newFeed.trim()) {
      setFeeds([...feeds, newFeed.trim()]);
      setNewFeed('');
    }
  };

  const handleSave = () => {
    const preferences = {
      feeds,
      keywords: keywords.split(',').map(k => k.trim()),
    };
    console.log('Saved preferences:', preferences);
    // Save logic here
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
          RSS Feed Preferences
        </h2>

        <div className="mb-4">
          <label className="block font-semibold mb-1">
            Keyword Filters (comma separated)
          </label>
          <input
            type="text"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
            placeholder="e.g. unrest, protest, attack"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Active Feeds</label>
          <ul className="list-disc ml-5 text-sm mb-2">
            {feeds.map((feed, idx) => (
              <li key={idx} className="text-blue-600 dark:text-blue-400">
                {feed}
              </li>
            ))}
          </ul>
          <div className="flex gap-3 items-center mt-2">
            <input
              type="text"
              value={newFeed}
              onChange={e => setNewFeed(e.target.value)}
              placeholder="Add feed URL"
              className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
            />
            <button
              onClick={handleAddFeed}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}