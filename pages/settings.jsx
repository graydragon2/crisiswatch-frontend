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
    // You can add saving logic here
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
          RSS Feed Preferences
        </h2>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Keyword Filters (comma separated)</label>
          <input
            type="text"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
            placeholder="e.g. unrest, protest, attack"
          />
        </