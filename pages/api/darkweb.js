// pages/api/darkweb.js

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const apiKey = process.env.LEAKCHECK_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing API key in environment variables' });
  }

  try {
    const response = await fetch(
      `https://leakcheck.io/api?key=${apiKey}&check=${encodeURIComponent(email)}&type=email`
    );

    const data = await response.json();

    if (!data.success) {
      return res.status(500).json({ error: data.message || 'API error' });
    }

    return res.status(200).json({ breaches: data.result });
  } catch (error) {
    console.error('LeakCheck API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
