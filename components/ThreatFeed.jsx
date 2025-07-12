import { useEffect, useState } from 'react';

export default function ThreatFeed() {
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    fetch('/api/threats')
      .then(res => res.json())
      .then(data => setThreats(data.items || []));
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">🧠 Threat Feed</h2>
      <ul className="space-y-4">
        {threats.map((item, idx) => (
          <li key={idx} className="border rounded-md p-4 shadow-sm bg-muted">
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
                <span className="text-xs text-muted-foreground">
                  {new Date(item.pubDate).toLocaleString()}
                </span>
              )}
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}