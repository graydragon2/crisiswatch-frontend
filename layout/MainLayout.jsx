'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SourceToggle from '@/components/SourceToggle';

export default function MainLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
      <header className="bg-white dark:bg-gray-900 shadow-md px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-black dark:text-white">CrisisWatch</h1>
          <button
            className="md:hidden text-black dark:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
          <nav className="hidden md:flex gap-4 text-sm text-black dark:text-white">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/settings">Settings</Link>
            <Link href="/darkweb">Dark Web</Link>
            <SourceToggle />
            <button onClick={toggleDarkMode}>Light Mode</button>
            <button onClick={handleLogout}>Logout</button>
          </nav>
        </div>