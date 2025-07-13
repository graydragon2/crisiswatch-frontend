'use client';
import { useEffect, useState } from 'react';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [dark]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
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
  );
}
