'use client';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add('dark') : root.classList.remove('dark');
  }, [dark]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <button
        onClick={() => setDark(!dark)}
        className="absolute top-4 right-4 p-2 text-xs border rounded"
      >
        Toggle {dark ? 'Light' : 'Dark'}
      </button>
      <Component {...pageProps} />
    </div>
  );
}
