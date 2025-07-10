import express from 'express';
import fetch from 'node-fetch'; // or global fetch in Node 18+

const router = express.Router();

router.get('/darkweb', async (req, res) => {
  const email = req.query.email;
  const apiKey = process.env.LEAKCHECK_API_KEY;

  if (!email || !apiKey) {
    return res.status(400).json({ error: 'Missing email or API key' });
  }

  const url = `https://leakcheck.net/api/public?key=${apiKey}&check=${encodeURIComponent(email)}&type=email`;

  try {
    const leakRes = await fetch(url);
    const json = await leakRes.json();

 if (!leakRes.ok) {
  console.error('LeakCheck HTTP error:', leakRes.status, json);
  return res.status(502).json({ error: 'LeakCheck API returned bad status', status: leakRes.status, details: json });
}

if (json.error) {
  console.error('LeakCheck logical error:', json.error);
  return res.status(200).json({ success: false, error: json.error }); // not a server error
}


    res.json(json);
  } catch (err) {
    console.error('Fetch failed:', err);
    res.status(500).json({ error: 'Internal server error', debug: err.message });
  }
});

export default router;

