import { useState } from 'react';

export default function DarkWebChecker() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkBreach = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://crisiswatch-api-production.up.railway.app/api/darkweb?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setResult({ error: 'Check failed. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <input
        className="w-full border px-3 py-2 rounded mb-4"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={checkBreach}
        disabled={loading || !email}
      >
        {loading ? 'Checking...' : 'Check Now'}
      </button>

      {result && (
        <div className="mt-4 bg-gray-100 p-4 rounded text-sm">
          {result.error || result.success === false ? (
            <p className="text-red-600">{result.error || 'No breaches found.'}</p>
          ) : (
            <>
              <p className="font-semibold text-red-600">
                Breaches Found: {result.sources?.length || 0}
              </p>

              <p className="text-gray-700 mt-2">Exposed Fields: {result.fields?.join(', ')}</p>

              <ul className="mt-2 list-disc ml-5 max-h-40 overflow-auto">
                {result.sources?.map((src, i) => (
                  <li key={i}>
                    <strong>{src.name}</strong> — {src.date || 'Date unknown'}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}