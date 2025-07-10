// /api/darkweb.js
import express from 'express';
import fetch from 'node-fetch'; // or global fetch in Node 18+

const router = express.Router();

router.get('/darkweb', async (req, res) => {
  const email = req.query.email;
  const apiKey = process.env.LEAKCHECK_API_KEY;

  if (!email || !apiKey) {
    return res.status(400).json({ error: 'Missing email or API key' });
  }

  try {
    const leakCheckURL = `https://leakcheck.io/api/public?key=${apiKey}&check=${encodeURIComponent(email)}&type=email`;

    const response = await fetch(leakCheckURL);
    const data = await response.json();

    if (data.success === false || !data || data.error) {
      console.error('LeakCheck API returned:', data);
      return res.status(502).json({ error: 'LeakCheck API error', details: data });
    }

    res.json(data);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
