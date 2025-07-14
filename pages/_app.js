// pages/_app.js
'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-background text-foreground transition-colors">
        <div className="p-4 flex justify-end">
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