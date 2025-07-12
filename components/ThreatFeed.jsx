import { useState, useEffect } from 'react';

export default function ThreatFeed() {
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/threats`);
        const json = await res.json();
        setThreats(json.items || []);
      } catch (err) {
        console.error('Failed to fetch threats:', err);
      }
    };
    fetchThreats();
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">⚠️ Parsed Threat Headlines</h2>
      {threats.length === 0 && <p>No threats found.</p>}
      <ul className="list-disc ml-5">
        {threats.map((item, idx) => (
          <li key={idx}>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
