export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { headline } = req.body;
  if (!headline) {
    return res.status(400).json({ error: 'Missing headline' });
  }

  // Simulate scoring with a random number
  const score = Math.floor(Math.random() * 100) + 1;

  res.status(200).json({
    score,
    raw: `Simulated score for "${headline}": ${score}`
  });
}
