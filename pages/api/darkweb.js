export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  try {
    const apiKey = process.env.LEAKCHECK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing LeakCheck API Key in environment' });
    }

    const response = await fetch(
      \`https://leakcheck.io/api?key=\${apiKey}&check=\${encodeURIComponent(email)}&type=email\`
    );

    if (!response.ok) {
      throw new Error(\`LeakCheck API error: \${response.statusText}\`);
    }

    const result = await response.json();
    return res.status(200).json({ breaches: result.result || [] });
  } catch (error) {
    console.error('Dark Web API error:', error);
    return res.status(500).json({ error: 'Error checking dark web breaches' });
  }
}
