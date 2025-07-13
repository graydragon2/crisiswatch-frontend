import Parser from 'rss-parser';
const parser = new Parser();

// Temporary in-memory list (for testing only)
let feedDB = [
  "https://feeds.bbci.co.uk/news/rss.xml",
  "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
];

export default async function handler(req, res) {
  console.log("Incoming request to /api/data/feeds:", req.method);

  if (req.method === 'GET') {
    try {
      const allFeeds = [];

      for (const url of feedDB) {
        try {
          const feed = await parser.parseURL(url);
          const items = feed.items.slice(0, 3).map(item => ({
            title: item.title,
            link: item.link
          }));
          allFeeds.push(...items);
        } catch (err) {
          console.error(`Failed to parse feed: ${url}`, err.message);
        }
      }

      res.status(200).json({ feeds: allFeeds });
    } catch (err) {
      console.error("RSS parse failed:", err);
      res.status(500).json({ error: 'RSS parse failed' });
    }
  }

  else if (req.method === 'POST') {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'No URL provided' });
    if (!feedDB.includes(url)) {
      feedDB.push(url);
    }
    res.status(200).json({ message: 'Feed added' });
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
