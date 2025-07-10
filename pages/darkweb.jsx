import { useState } from 'react';

export default function DarkWebMonitor() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ⬇️ Define the external API URL
  const apiUrl = 'https://crisiswatch-api.onrender.com/api/darkweb?email=';

  const checkBreach = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}${encodeURIComponent(email)}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setResult({ error: 'Check failed. Try again.' });
    }
    setLoading(false);
  };

  return (
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

