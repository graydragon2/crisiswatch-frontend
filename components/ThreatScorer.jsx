'use client';

import { useState } from 'react';

export default function ThreatScorer() {
  const [text, setText]       = useState('');
  const [score, setScore]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const runScore = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setScore(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/score`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ text }),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { score } = await res.json();
      setScore(score);
    } catch (err) {
      console.error('score error ▶', err);
      setError('Error scoring threat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Paste headline or alert text"
        className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={runScore}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        {loading ? 'Scoring…' : 'Score'}
      </button>

      {error && <div className="text-red-400">{error}</div>}
      {score != null && (
        <div className="text-green-400">
          ✅ AI Threat Score: <strong>{score}</strong>/10
        </div>
      )}
    </div>
  );
}
