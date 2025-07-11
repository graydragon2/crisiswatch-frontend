'use client';
import { useState } from 'react';

export default function ThreatScorer() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScore = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, location })
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Failed to score threat' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Threat Scoring Tool</h2>
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 border rounded dark:bg-black dark:text-white"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className="w-full p-2 border rounded dark:bg-black dark:text-white"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Location (ZIP or City)"
        className="w-full p-2 border rounded dark:bg-black dark:text-white"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleScore}
        disabled={loading}
      >
        {loading ? 'Scoring...' : 'Score Threat'}
      </button>

      {result && (
        <div className="mt-4 p-4 rounded border dark:border-gray-700 dark:bg-gray-900">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <>
              <p><strong>Score:</strong> {result.score}</p>
              <p><strong>Reason:</strong> {result.reason}</p>
              {result.ai && <p className="text-xs text-green-500">AI-enhanced</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
