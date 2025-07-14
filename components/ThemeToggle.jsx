// components/ThemeToggle.jsx
'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      aria-label="Toggle Dark Mode"
      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-gray-800" />
      )}
    </button>
  )
}