'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SourceToggle from '@/components/SourceToggle';

export default function MainLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mode, setMode] = useState('Hybrid');
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
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
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white transition-colors">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4 bg-white dark:bg-gray-900 shadow-md gap-2">
  <h1 className="text-2xl font-bold text-black dark:text-white">CrisisWatch</h1>

  <nav className="flex flex-wrap items-center gap-4 text-sm text-black dark:text-white">
    <Link href="/dashboard" className="hover:underline">Dashboard</Link>
    <Link href="/settings" className="hover:underline">Settings</Link>
    <Link href="/darkweb" className="hover:underline">Dark Web</Link>

    <select
      value={mode}
      onChange={(e) => setMode(e.target.value)}
      className="bg-transparent border border-gray-600 dark:bg-gray-800 rounded px-2 py-1"
    >
      <option>Hybrid</option>
      <option>RSS Only</option>
      <option>AI Only</option>
    </select>

    <button
      onClick={toggleDarkMode}
      className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm"
    >
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>

    <button
      onClick={handleLogout}
      className="text-red-500 hover:underline"
    >
      Logout
    </button>
  </nav>
</header>

      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </div>
  );
}