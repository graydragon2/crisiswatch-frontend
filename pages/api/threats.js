import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';

const feedsFile = path.resolve('./pages/api/data/feeds.json');
const parser = new Parser();

export default async function handler(req, res) {
  let feeds = [];

  // Load saved feed URLs
  if (fs.existsSync(feedsFile)) {
    feeds = JSON.parse(fs.readFileSync(feedsFile, 'utf8'));
  }

  if (!feeds.length) {
    return res.status(400).json({ error: 'No feeds available' });
  }

  // OpenAI threat scoring function
  const scoreThreat = async (text) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Rate this news item for threat level from 0 (safe) to 10 (extreme). Return just the number.',
            },
            {
              role: 'user',
              content: text,
            },
          ],
        }),
      });

      const data = await response.json();
      const score = parseFloat(data.choices?.[0]?.message?.content || '0');
      return isNaN(score) ? 0 : score;
    } catch (err) {
      console.error('AI scoring failed:', err);
      return 0;
    }
  };

  const items = [];

  for (const feedUrl of feeds) {
    try {
      const feed = await parser.parseURL(feedUrl);
      for (const entry of feed.items.slice(0, 5)) {
        const text = entry.title + ' ' + (entry.contentSnippet || '');
        const score = await scoreThreat(text);
        items.push({ title: entry.title, link: entry.link, score });
      }
    } catch (err) {
      console.error(`Error parsing feed ${feedUrl}:`, err);
    }
  }

  res.status(200).json({ items });
}