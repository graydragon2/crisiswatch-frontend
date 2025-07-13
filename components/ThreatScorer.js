'use client';

import { useState } from 'react';

export default function ThreatScorer() {
  const [headline, setHeadline] = useState('');
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getScore = async () => {
    if (!headline.trim()) return;
    setLoading(true);
    setScore(null);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/threats`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline })
      });

      const data = await res.json();
      if (res.ok) {
        setScore(data.score);
      } else {
        setError(data.error || 'Error scoring');
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-lg border border-border bg-card space-y-4">
      <h3 className="text-lg font-semibold">Threat Scorer</h3>
      <input
        type="text"
        value={headline}
        onChange={(e) => setHeadline(e.target.value)}
        placeholder="Enter a headline"
        className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
      />
      <button
        onClick={getScore}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Score
      </button>

      {loading && <p>Scoring...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {score !== null && (
        <p className={`text-lg font-bold ${score > 60 ? 'text-red-500' : score > 30 ? 'text-yellow-500' : 'text-green-500'}`}>
          Score: {score}/100
        </p>
      )}
    </div>
  );
}
