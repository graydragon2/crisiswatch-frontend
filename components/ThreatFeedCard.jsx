import { useState } from 'react';

export default function ThreatFeedCard() {
  const [keywords, setKeywords] = useState('');
  const [useAI, setUseAI] = useState(true);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchThreats = async () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (keywords.trim()) query.append('keywords', keywords);
    query.append('useAI', useAI);

    try {
      const res = await fetch(`/api/threats?${query}`);
      const data = await res.json();
      setResults(data.threats || []);
    } catch (err) {
      console.error('Failed to fetch threats', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-lg text-white w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">🚨 Threat Feed</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter keywords (e.g., shooting,riot)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="flex-1 p-2 rounded-md text-black"
        />

        <button
          onClick={() => setUseAI(!useAI)}
          className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700"
        >
          {useAI ? 'Using AI Scoring' : 'Keyword Filter Only'}
        </button>

        <button
          onClick={fetchThreats}
          className="px-3 py-2 rounded-md bg-green-600 hover:bg-green-700"
        >
          Fetch
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-center">No threats found.</p>
      ) : (
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {results.map((item, idx) => (
            <li key={idx} className="border-b border-gray-700 pb-2">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-400">
                {item.title}
              </a>
              <p className="text-sm text-gray-300">{item.summary}</p>
              <p className="text-sm mt-1">
                <span className="text-yellow-400">Score:</span>{' '}
                {item.score !== undefined ? item.score : 'N/A'}
              </p>
              <p className="text-xs text-gray-500">{item.pubDate}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
