'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SourceToggle from '@/components/SourceToggle';

export default function MainLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const enabled = !darkMode;
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-black dark:text-white transition-colors">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">CrisisWatch</h1>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/settings" className="hover:underline">
              Settings
            </Link>
            <Link href="/darkweb" className="hover:underline">
              Dark Web
            </Link>
            <SourceToggle />
            <button
              onClick={toggleDarkMode}
              className="px-2 py-1 rounded border border-gray-500 dark:border-gray-300 text-xs"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button onClick={handleLogout} className="text-red-500 hover:underline">
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="px-6 py-8 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}