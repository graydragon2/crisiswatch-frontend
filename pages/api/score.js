import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { headline } = req.body;
  if (!headline) return res.status(400).json({ error: 'Missing headline' });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You're a cybersecurity threat intelligence assistant. Score headlines from 0 to 100 based on threat severity to national security, personal privacy, or digital infrastructure.`
        },
        {
          role: 'user',
          content: `Headline: ${headline}`
        }
      ]
    });

    const raw = response.choices[0].message.content;
    const scoreMatch = raw.match(/\b(\d{1,3})\b/);
    const score = scoreMatch ? Math.min(parseInt(scoreMatch[1]), 100) : 0;

    res.status(200).json({ score, raw });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to score headline' });
  }
}
