import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';

const feedsFile = path.resolve('./pages/api/data/feeds.json');
const parser = new Parser();

export default async function handler(req, res) {
  let feeds = [];

  // Load saved RSS feed URLs
  if (fs.existsSync(feedsFile)) {
    feeds = JSON.parse(fs.readFileSync(feedsFile, 'utf-8'));
  }

  if (!feeds.length) {
    return res.status(400).json({ error: 'No feeds available' });
  }

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
              content: 'You are a security analyst. Score threat headlines from 1 (low) to 10 (critical). Return only the number.',
            },
            { role: 'user', content: text },
          ],
        }),
      });

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      const score = parseInt(content);
      return isNaN(score) ? null : score;
    } catch (error) {
      console.error('Error scoring:', error);
      return null;
    }
  };

  try {
    const results = [];

    for (const feed of feeds) {
      const parsed = await parser.parseURL(feed);
      for (const item of parsed.items.slice(0, 5)) {
        const score = await scoreThreat(item.title);
        results.push({
          title: item.title,
          link: item.link,
          score,
        });
      }
    }

    res.status(200).json({ items: results });
  } catch (err) {
    console.error('Error processing feeds:', err);
    res.status(500).json({ error: 'Failed to process feeds' });
  }
}