'use client';

import { useState } from 'react';
import { BACKEND_URL } from '@/lib/api';

export default function ThreatScorer() {
  const [text, setText] = useState('');
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const runScoring = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setScore(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });
      const json = await res.json();
      setScore(json.score ?? json.error);
    } catch (err) {
      console.error(err);
      setScore('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste headline or alert text"
          className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        />
        <button
          onClick={runScoring}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          {loading ? 'Scoring…' : 'Score'}
        </button>
      </div>
      {score !== null && (
        <p className="text-sm text-green-500">
          {typeof score === 'number'
            ? `✅ AI Threat Score: ${score}/10`
            : `⚠️ ${score}`}
        </p>
      )}
    </div>
  );
}