'use client';

import { useState, useEffect } from 'react';

const BACKEND = 'https://crisiswatch-api-production.up.railway.app';

export default function FeedList() {
  const [feeds, setFeeds] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${BACKEND}/api/feeds`)
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(data => setFeeds(data.feeds || []))
      .catch(err => setError(`Failed to load feeds: ${err.message}`));
  }, []);

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      {feeds.map(({ url, title, items }) => (
        <div
          key={url}
          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow"
        >
          <h3 className="font-semibold">
            {title || url}
          </h3>

          {items.length > 0 ? (
            <ul className="mt-2 list-disc list-inside text-sm">
              {items.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-gray-500">
              No articles available.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}