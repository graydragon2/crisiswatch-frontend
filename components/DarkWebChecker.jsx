import { useState } from 'react';

export default function DarkWebChecker() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkBreach = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/darkweb?email=${encodeURIComponent(email)}`);
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
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Dark Web Monitoring</h1>
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
        <div className="mt-4 bg-gray-100 p-4 rounded">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : result.breaches?.length ? (
            <>
              <p className="font-semibold text-red-600">Breaches Found: {result.breaches.length}</p>
              <ul className="mt-2 list-disc ml-5">
                {result.breaches.map((b, i) => (
                  <li key={i}><strong>{b.Name}</strong> – {b.Description}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-green-600">No breaches found 🎉</p>
          )}
        </div>
      )}
    </div>
  );
}
