// /pages/api/feeds.js
import fs from 'fs';
import path from 'path';


const feedsFile = path.resolve('./pages/api/data/feeds.json');

export default function handler(req, res) {
  // Ensure the data directory exists
  const dataDir = path.dirname(feedsFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Load existing feeds
  let feeds = [];
  if (fs.existsSync(feedsFile)) {
    feeds = JSON.parse(fs.readFileSync(feedsFile));
  }

  if (req.method === 'GET') {
    return res.status(200).json({ feeds });
  }

  if (req.method === 'POST') {
    const { url } = req.body;
    if (!url || feeds.includes(url)) {
      return res.status(400).json({ error: 'Invalid or duplicate URL' });
    }
    feeds.push(url);
    fs.writeFileSync(feedsFile, JSON.stringify(feeds, null, 2));
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    const { url } = req.body;
    feeds = feeds.filter(f => f !== url);
    fs.writeFileSync(feedsFile, JSON.stringify(feeds, null, 2));
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}