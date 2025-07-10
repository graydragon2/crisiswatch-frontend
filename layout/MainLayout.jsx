'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SourceToggle from '@/components/SourceToggle';

export default function MainLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mode, setMode] = useState('Hybrid');
  const router = useRouter();

  // Load dark mode preference from localStorage
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
    // Placeholder for future auth
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white transition-colors">
      <header className="bg-gray-100 dark:bg-gray-800 p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">CrisisWatch</h1>

        <nav className="space-x-4 flex items-center">
          <Link href="/" className="hover:underline">Dashboard</Link>
          <Link href="/settings" className="hover:underline">Settings</Link>
          <Link href="/darkweb" className="hover:underline">Dark Web</Link>
          <SourceToggle mode={mode} setMode={setMode} />

          <button
            onClick={toggleDarkMode}
            className="bg-purple-600 text-white px-3 py-1 rounded"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>

          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="p-4">{children}</main>
    </div>
  );
}

