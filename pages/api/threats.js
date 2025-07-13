// /pages/api/threats.js
import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';

const feedsFile = path.resolve('./pages/api/data/feeds.json');
const parser = new Parser();

export default async function handler(req, res) {
  let feeds = [];

  // Load saved RSS feed URLs
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
              content: 'You are a cybersecurity analyst AI that gives a threat score from 1 to 10 based on severity and urgency of headlines.',
            },
            {
              role: 'user',
              content: `Score the threat level of: "${text}". Only return a number from 1 to 10.`,
            },
          ],
        }),
      });

      const json = await response.json();
      const match = json.choices?.[0]?.message?.content?.match(/\d+/);
      return match ? parseInt(match[0]) : null;
    } catch (err) {
      console.error('AI scoring error:', err);
      return null;
    }
  };

  try {
    const allItems = [];

    for (const url of feeds) {
      const feed = await parser.parseURL(url);
      for (const item of feed.items.slice(0, 5)) {
        const score = await scoreThreat(item.title);
        allItems.push({ ...item, score });
      }
    }

    res.status(200).json({ items: allItems });
  } catch (err) {
    console.error('Feed error:', err);
    res.status(500).json({ error: 'Failed to load threats' });
  }
}