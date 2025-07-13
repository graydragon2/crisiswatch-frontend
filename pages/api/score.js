export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!text || !apiKey) {
    return res.status(400).json({ error: 'Missing input text or API key' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content:
              'You are a cybersecurity analyst. Score the threat level of this message on a scale from 1 (very low) to 10 (extreme threat). Return only the number.',
          },
          { role: 'user', content: text },
        ],
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content.trim();

    const score = parseInt(result, 10);

    if (isNaN(score)) {
      throw new Error('Invalid score returned from AI');
    }

    res.status(200).json({ score });
  } catch (error) {
    console.error('AI scoring error:', error);
    res.status(500).json({ error: 'Failed to score threat' });
  }
}