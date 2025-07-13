// /pages/api/darkweb.js
export default async function handler(req, res) {
  const query = req.query.query; // e.g., email or username
  const apiKey = process.env.LEAKCHECK_API_KEY;

  if (!query || !apiKey) {
    return res.status(400).json({ error: 'Missing query or API key' });
  }

  try {
    const response = await fetch(
      `https://leakcheck.io/api?key=${apiKey}&check=${encodeURIComponent(query)}&type=email`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || 'Error checking breach',
      });
    }

    // Return simplified result
    res.status(200).json({
      found: data.success && data.result.length > 0,
      entries: data.result?.map((entry) => entry.line || entry),
    });
  } catch (error) {
    console.error('Dark web check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}