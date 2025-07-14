import { useState } from 'react';

export default function ThreatScorer() {
  const [headline, setHeadline] = useState('');
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScore = async () => {
    if (!headline.trim()) return;

    setLoading(true);
    setScore(null);
    setError('');

    try {
      const res = await fetch(`https://crisiswatch-api-production.up.railway.app`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: headline }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Scoring failed');
      } else if (typeof data.score === 'number') {
        setScore(data.score);
      } else {
        setError('Invalid score returned from API');
      }
    } catch (err) {
      console.error('ThreatScorer error:', err);
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold text-black dark:text-white mb-2">AI Threat Scoring</h2>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Paste headline or alert text"
          className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
        />
        <button
          onClick={handleScore}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Score
        </button>
      </div>
      {loading && <p className="text-sm text-gray-400">Scoring...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {typeof score === 'number' && (
        <p className="text-sm text-green-500">
          ✅ AI Threat Score: <strong>{score}</strong>/10
        </p>
      )}
    </div>
  );
}
