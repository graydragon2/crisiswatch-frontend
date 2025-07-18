import { useEffect, useState } from 'react';

export default function ThreatFeed() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/threats`);
        const data = await res.json();
        setThreats(data.items || []);
      } catch (err) {
        console.error('Failed to fetch threats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold text-black dark:text-white mb-2">🧠 Threat Feed</h2>

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        <ul className="space-y-4">
          {threats.map((item, idx) => (
            <li key={idx} className="border rounded-md p-4 shadow-sm bg-gray-100 dark:bg-gray-800">
              <div className="flex flex-col gap-2">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline"
                >
                  {item.title}
                </a>

                {item.pubDate && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.pubDate).toLocaleString()}
                  </span>
                )}

                {item.summary && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {item.summary}
                  </p>
                )}

                {typeof item.score === 'number' && (
                  <>
                    <span
                      className={`w-fit text-xs font-bold px-2 py-1 rounded ${
                        item.score >= 8
                          ? 'bg-red-600 text-white'
                          : item.score >= 4
                          ? 'bg-yellow-400 text-black'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      Threat Score: {item.score}
                    </span>

                    {item.score >= 8 && (
                      <div className="text-red-600 font-bold text-xs">
                        🚨 Critical Threat!
                      </div>
                    )}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}