'use client';
import { useEffect, useState } from 'react';
import '../styles/globals.css';
import Sidebar from '@/components/Sidebar';

export default function App({ Component, pageProps }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [dark]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-foreground transition-colors">

      <Sidebar />
      
      <main className="flex-1 p-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDark(!dark)}
            className="px-3 py-1 border rounded-md text-xs"
          >
            Toggle {dark ? 'Light' : 'Dark'}
          </button>
        </div>
        <Component {...pageProps} />
      </main>
    </div>
  );
}
