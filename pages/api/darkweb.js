export default async function handler(req, res) {
  const query = req.query.query; // Matches frontend ?query=...
  const apiKey = process.env.LEAKCHECK_API_KEY;

  if (!query || !apiKey) {
    return res.status(400).json({ error: 'Missing email or API key' });
  }

  try {
    const response = await fetch(
      `https://leakcheck.io/api?key=${apiKey}&check=${encodeURIComponent(query)}&type=email`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Error checking breach' });
    }

    if (data.success && data.result?.length > 0) {
      return res.status(200).json({ found: true, entries: data.result });
    } else {
      return res.status(200).json({ found: false });
    }
  } catch (error) {
    console.error('DarkWeb API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}