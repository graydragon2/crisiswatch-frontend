import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/threats')
      .then(res => res.json())
      .then(data => {
        setThreats(data.items || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Threat Dashboard</h1>

      {loading ? (
        <p>Loading threat data...</p>
      ) : threats.length === 0 ? (
        <p>No current threats found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {threats.map((item, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-sm opacity-75">{item.pubDate}</p>
              <p className="mt-2">{item.description || item.contentSnippet}</p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-blue-400 hover:underline"
                >
                  Read More
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
