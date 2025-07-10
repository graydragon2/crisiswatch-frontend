import { useState } from 'react';

export default function DarkWebMonitor() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = 'https://crisiswatch-api.onrender.com/api/darkweb?email=';

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
    <div className="max-w-2xl mx-auto p-6 space-y-6">
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
        <div className="bg-gray-50 border rounded p-4 shadow">
          {result.error ? (
            <p className="text-red-600 font-medium">⚠️ {result.error}</p>
          ) : result.found ? (
            <div>
              <p className="text-green-700 font-semibold">
                ✅ Breaches found for <strong>{email}</strong>
              </p>
              <p className="mt-2"><strong>Total entries:</strong> {result.found}</p>
              <p><strong>Fields exposed:</strong> {result.fields?.join(', ')}</p>

              <div className="mt-4">
                <h3 className="font-bold mb-2">Sources:</h3>
                <ul className="list-disc pl-5 space-y-1 max-h-60 overflow-auto text-sm">
                  {result.sources?.map((src, idx) => (
                    <li key={idx}>
                      {src.name} {src.date ? `(${src.date})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-yellow-600 font-medium">No breaches found for this email.</p>
          )}
        </div>
      )}
    </div>
  );
}

    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Dark Web Monitor</h1>

      <input
        type="email"
        className="w-full p-2 border rounded"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        onClick={checkBreach}
        disabled={loading}
      >
        {loading ? 'Checking...' : 'Check Now'}
      </button>

      {result && (
        <div className="bg-gray-100 p-4 rounded shadow mt-4">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

