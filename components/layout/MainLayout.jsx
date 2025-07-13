'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SourceToggle from '@/components/SourceToggle';

export default function MainLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Load theme from localStorage
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

  import Sidebar from './Sidebar'; // 👈 adjust path if needed

return (
  <div className="flex min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <header className="flex justify-between items-center px-8 py-4 bg-white dark:bg-gray-900 shadow-md">
        <h1 className="text-2xl font-bold">CrisisWatch</h1>
        <nav className="flex items-center gap-6 text-sm">
          <SourceToggle />
          <button
            onClick={toggleDarkMode}
            className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-100 dark:hover:bg-red-900"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="p-8 max-w-7xl mx-auto flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  </div>
);