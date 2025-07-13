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

  // OpenAI scoring function
  const scoreThreat = async (text) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {