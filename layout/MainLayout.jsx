'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

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
    // Placeholder for real auth logic
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 shadow-md gap-2 sm:gap-4">
        <h1 className="text-2xl font-bold">CrisisWatch</h1>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/settings" className="hover:underline">Settings</Link>
          <Link href="/darkweb" className="hover:underline">Dark Web</Link>
          <select
            className="bg-transparent border border-gray-400 dark:border-gray-600 rounded px-2 py-1 text-black dark:text-white dark:bg-gray-800"
            defaultValue="Hybrid"
          >
            <option>Hybrid</option>
          </select>
          <button onClick={toggleDarkMode} className="hover:underline">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        </nav>
      </header>

      <main className="p-8 max-w-7xl mx-auto">{children