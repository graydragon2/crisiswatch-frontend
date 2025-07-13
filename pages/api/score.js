// /pages/api/score.js
export default async function handler(req, res) {
  const { text } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!text || !apiKey) {
    return res.status(400).json({ error: 'Missing text or API key' });
  }

  try {
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a cybersecurity AI that scores threats from 1 (low) to 10 (high) based on severity and urgency.',
          },
          {
            role: 'user',
            content: `Score this alert for threat level (1–10): "${text}"`,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await completion.json();
    const responseText = data.choices?.[0]?.message?.content || '';
    const match = responseText.match(/(\d+)/); // Extract score
    const score = match ? parseInt(match[1]) : null;

    if (!score) {
      return res.status(422).json({ error: 'Unable to extract score' });
    }

    res.status(200).json({ score });
  } catch (error) {
    console.error('AI scoring error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}