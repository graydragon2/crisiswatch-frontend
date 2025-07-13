import FeedList from '@/components/FeedList';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [threats, setThreats] = useState([]);
  const [loadingThreats, setLoadingThreats] = useState(true); // ✅ FIXED NAME

  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false); // ✅ FIXED NAME

  useEffect(() => {
    const fetchThreats = async () => {
      setLoadingThreats(true);
      try {
        const res = await fetch('/api/threats');
        const json = await res.json();
        setThreats(json.items || []);
      } catch (err) {
        console.error('Failed to fetch threats:', err);
      } finally {
        setLoadingThreats(false);
      }
    };

    fetchThreats();
    const interval = setInterval(fetchThreats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkDarkWeb = async () => {
    if (!query.trim()) return;
    setChecking(true);
    setResult(null);

    try {
      const res = await fetch(`/api/darkweb?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Error