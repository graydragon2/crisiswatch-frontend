'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Rss,
  Settings,
  Lock,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/', icon: <LayoutDashboard size={18} /> },
  { name: 'Feeds',     href: '/feeds',  icon: <Rss size={18} /> },
  { name: 'Settings',  href: '/settings', icon: <Settings size={18} /> },
  { name: 'Dark Web',  href: '/darkweb', icon: <Lock size={18} /> },
  { name: 'Admin',     href: '/admin',     icon: <ShieldCheck size={18} /> },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <aside className="fixed inset-y-0 left-0 w-full md:w-64 bg-muted p-6 border-r border-border z-50">
      <div className="flex items-center justify-between md:justify-center mb-8">
        <h2 className="text-xl font-bold text-foreground">CrisisWatch</h2>
        <button
          className="md:hidden"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted-foreground/10 transition',
              pathname === item.href
                ? 'text-primary font-semibold'
                : 'text-muted-foreground'
            )}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      {/* desktop toggle */}
      <div className="hidden md:flex justify-center mt-8">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </aside>
  )
}
