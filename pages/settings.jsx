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
    // Add logic to persist preferences to backend here
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow