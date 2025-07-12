'use client';

import MainLayout from '@/layout/MainLayout'; // ✅ make sure path is correct
import FeedList from '@/components/FeedList';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreats = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/threats');
        const json = await res.json();
        setThreats(json.items || []);
      } catch (err) {
        console.error('Failed to fetch threats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
    const interval = setInterval(fetchThreats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-10">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
            🛡️ Threat Feed
          </h2>
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          ) : threats.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No threats found.</p>
          ) : (
            <ul className="space-y-3">
              {threats.map((item, idx) => (
  <li key={idx} className="border-b border-gray-300 dark:border-gray-700 pb-2">
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-700 dark:text-blue-400 hover:underline"
    >
      {item.title}
    </a>