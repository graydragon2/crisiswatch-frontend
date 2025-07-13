'use client';
import { useEffect, useState } from 'react';
import '../styles/globals.css';
import Sidebar from '@/components/Sidebar'; // <-- Add this

export default function App({ Component, pageProps }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [dark]);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDark(!dark)}
            className="px-3 py-1 border rounded-md text-xs"
          >
            Toggle {dark ? 'Light' : 'Dark'}
          </button>
        </div>
        <Component {...pageProps} />
      </div>
    </div>
  );
}