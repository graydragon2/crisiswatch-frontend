'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';

export default function ThreatsPage() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [sources, setSources] = useState('');

  const fetchThreats = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keywords.trim()) params.set('keywords', keywords.trim());
      if (sources.trim()) params.set('sources', sources.trim());

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/threats?${params}`);
      const data = await res.json();
      setThreats(data.threats || []);
    } catch (err) {
      console.error('Failed to fetch threats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
    const interval = setInterval(fetchThreats, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:block min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="md:ml-64 flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Threat Feed</h1>

        <div className="mb-4 space-y-2 max-w-xl">
          <label className="block">
            <span className="font-medium">Keywords (comma-separated)</span>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="attack, power outage"
              className="mt-1 p-2 w-full border rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
            />
          </label>

          <label className="block">
            <span className="font-medium">Sources (comma-separated, matches feed name)</span>
            <input
              type="text"
              value={sources}
              onChange={(e) => setSources(e.target.value)}
              placeholder="BBC, Reuters"
              className="mt-1 p-2 w-full border rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
            />
          </label>

          <button
            onClick={fetchThreats}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Refresh Feed
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {!loading && threats.length === 0 && <p>No threats found.</p>}

        <ul className="space-y-4">
          {threats.map((item, idx) => (
            <li key={idx} className="border-b pb-2">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-400 hover:underline">
                {item.title}
              </a>
              <p className="text-sm text-gray-400">{item.source}</p>
              <p>{item.summary}</p>
              {typeof item.score === 'number' && (
                <p className="text-sm mt-1">
                  <span className="text-yellow-400">Score:</span> {item.score}/10
                </p>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
