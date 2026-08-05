'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RssHighlights() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/feeds`)
      .then((res) => res.json())
      .then((data) => {
        const all = (data.feeds || []).flatMap((f) => f.items || []);
        all.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));
        setItems(all.slice(0, 4));
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-3">
      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">No recent items.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-gray-300">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
      <Link href="/feeds" className="text-sm text-blue-400 hover:underline">
        View details →
      </Link>
    </div>
  );
}
