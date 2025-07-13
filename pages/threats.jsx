import { useEffect, useState } from 'react';

export default function ThreatLog() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState('attack,power outage');
  const [sources, setSources] = useState({
    gdelt: true,
    bbc: true,
    cnn: false
  });

  const fetchThreats = async () => {
    setLoading(true);
    const activeSources = Object.entries(sources).filter(([_, v]) => v).map(([k]) => k);
    const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);

    const res = await fetch(`/api/threats?sources=${activeSources.join(',')}&keywords=${keywordList.join(',')}`);
    const data = await res.json();
    setThreats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchThreats();
    const interval = setInterval(fetchThreats, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Threat Feed</h1>

      <div className="mb-4 space-y-2">
        <label className="block">
          <span className="font-medium">Keywords (comma-separated)</span>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          />
        </label>

        <div>
          <span className="font-medium">Sources:</span>
          {Object.keys(sources).map((src) => (
            <label key={src} className="ml-4">
              <input
                type="checkbox"
                checked={sources[src]}
                onChange={() => setSources(prev => ({ ...prev, [src]: !prev[src] }))}
              /> {src.toUpperCase()}
            </label>
          ))}
        </div>

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
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-700 hover:underline">
              {item.title}
            </a>
            <p className="text-sm text-gray-600">{item.source.toUpperCase()}</p>
            <p>{item.contentSnippet}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
