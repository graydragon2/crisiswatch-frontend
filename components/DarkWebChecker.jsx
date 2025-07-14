'use client';

import { useState } from 'react';
import { BACKEND_URL } from '@/lib/api';

export default function DarkWebChecker() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkDarkWeb = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/darkweb?email=${encodeURIComponent(email.trim())}`
      );
      const json = await res.json();
      setResult(json);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Lookup failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        />
        <button
          onClick={checkDarkWeb}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Checking…' : 'Check Now'}
        </button>
      </div>
      {result?.error && <p className="text-red-500 text-sm">{result.error}</p>}
      {result?.found === true && (
        <p className="text-red-500 text-sm">
          ⚠️ Compromised credentials found
        </p>
      )}
      {result?.found === false && (
        <p className="text-green-500 text-sm">✅ No compromises found</p>
      )}
    </div>
  );
}