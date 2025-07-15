
'use client';

import { useState } from 'react';

export default function DarkWebChecker() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const check = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/darkweb?email=${encodeURIComponent(
          query
        )}`
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      setResult(json);
    } catch (err) {
      console.error(err);
      setError('Failed to contact server. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Enter your email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
      />
      <button
        onClick={check}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? 'Checking…' : 'Check Now'}
      </button>

      {error && <div className="text-red-400">{error}</div>}
      {result && result.found === false && (
        <div className="text-green-400">✅ No compromised credentials found.</div>
      )}
      {result && result.found === true && (
        <div className="text-red-400">
          ⚠️ Compromised credentials:
          <ul className="list-disc ml-5">
            {result.entries?.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
