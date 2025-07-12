import Parser from 'rss-parser';
const parser = new Parser();

let feedDB = ["https://feeds.bbci.co.uk/news/rss.xml"];

export default async function handler(req, res) {
  console.log("Incoming request to /api/feeds:", req.method);

  if (req.method === 'GET') {
    try {
      const feed = await parser.parseURL(feedDB[0]);
      const items = feed.items.slice(0, 5).map(item => ({
        title: item.title,
        link: item.link
      }));
      console.log("Fetched items:", items.length);
      res.status(200).json({ feeds: items });
    } catch (err) {
      console.error("RSS parse failed:", err);
      res.status(500).json({ error: 'RSS parse failed' });
    }
  } else if (req.method === 'POST') {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'No URL provided' });
    feedDB.push(url);
    res.status(200).json({ message: 'Feed added' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
