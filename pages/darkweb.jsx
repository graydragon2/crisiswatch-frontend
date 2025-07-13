import { useState } from 'react';

export default function DarkWebMonitor() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/darkweb?email=`;

  const checkBreach = async () => {
    if (!email) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${apiUrl}${encodeURIComponent(email)}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Fetch failed:', err);
      setResult({ error: 'Failed to contact server. Try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">🕵️ Dark Web Monitor</h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          placeholder="Enter email address"
          className="flex-1 px-4 py-2 border rounded shadow"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={checkBreach}
          disabled={loading || !email}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? 'Checking...' : 'Check Now'}
        </button>
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 border rounded p-4 shadow text-gray-800 dark:text-gray-100">
          {result.error ? (
            <p className="text-red-600 dark:text-red-400 font-medium">⚠️ {result.error}</p>
          ) : result.success ? (
            <>
              <p className="text-emerald-700 dark:text-emerald-300 font-semibold">
                ✅ <strong>{email}</strong> was found in {result.found} breaches.
              </p>
              {result.fields && (
                <p className="mt-2"><strong>Fields exposed:</strong> {result.fields.join(', ')}</p>
              )}
              {result.sources?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Sources (first 15 shown):</h3>
                  <ul className="list-disc pl-5 max-h-64 overflow-auto text-sm">
                    {result.sources.slice(0, 15).map((src, idx) => (
                      <li key={idx}>
                        {src.name} {src.date ? `(${src.date})` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="text-yellow-600 dark:text-yellow-400 font-medium">No breaches found for this email.</p>
          )}
        </div>
      )}
    </div>
  );
}
