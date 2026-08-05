'use client';

import { useEffect, useState } from 'react';

export default function Header() {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/`);
        setApiStatus(res.ok ? 'online' : 'offline');
      } catch {
        setApiStatus('offline');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">CrisisWatch</h1>
        <p className="text-sm text-gray-400">AI-Powered Security Threat Monitoring</p>
      </div>
      <span
        className={`text-xs font-semibold px-3 py-1 rounded-full ${
          apiStatus === 'online'
            ? 'bg-green-600/20 text-green-400 ring-1 ring-green-500/40'
            : apiStatus === 'offline'
            ? 'bg-red-600/20 text-red-400 ring-1 ring-red-500/40'
            : 'bg-gray-600/20 text-gray-400 ring-1 ring-gray-500/40'
        }`}
      >
        {apiStatus === 'online' ? '● API Online' : apiStatus === 'offline' ? '● API Offline' : 'Checking…'}
      </span>
    </header>
  );
}
