import Parser from 'rss-parser';

let feedDB = [
  "https://feeds.bbci.co.uk/news/rss.xml",
  "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
];

const parser = new Parser();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const feedResults = await Promise.all(
        feedDB.map(async (url) => {
          const feed = await parser.parseURL(url);
          return {
            url,
            items: feed.items.slice(0, 5).map(item => ({
              title: item.title,
              link: item.link
            }))
          };
        })
      );
      res.status(200).json({ feeds: feedResults.flatMap(f => f.items) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch feeds' });
    }
  } else if (req.method === 'POST') {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') return res.status(400).json({ error: 'Invalid URL' });
      if (!feedDB.includes(url)) feedDB.push(url);
      res.status(200).json({ message: 'Feed added', url });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add feed' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
