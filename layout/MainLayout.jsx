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
      <<header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 shadow-md">
  <h1 className="text-xl font-bold text-black dark:text-white">CrisisWatch</h1>

  <nav className="flex items-center space-x-4 text-sm text-black dark:text-white">
    <a href="/dashboard">Dashboard</a>
    <a href="/settings">Settings</a>
    <a href="/darkweb">Dark Web</a>
    <select className="bg-transparent dark:bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white">
      <option>Hybrid</option>
    </select>
    <button onClick={toggleTheme}>Light Mode</button>
    <a href="/logout">Logout</a>
  </nav>
</header>

      <main className="p-4">{children}</main>
    </div>
  );
}

