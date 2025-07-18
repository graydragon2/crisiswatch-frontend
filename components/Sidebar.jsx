import Link from 'next/link';
import { LayoutDashboard, Rss, Settings, Shield } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        CrisisWatch
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          <li><Link href="/dashboard" className="flex items-center gap-2 hover:text-blue-400"><LayoutDashboard size={18}/> Dashboard</Link></li>
          <li><Link href="/feeds" className="flex items-center gap-2 hover:text-blue-400"><Rss size={18}/> Feeds</Link></li>
          <li><Link href="/settings" className="flex items-center gap-2 hover:text-blue-400"><Settings size={18}/> Settings</Link></li>
          <li><Link href="/admin" className="flex items-center gap-2 hover:text-blue-400"><Shield size={18}/> Admin Panel</Link></li>
        </ul>
      </nav>
    </aside>
  );
}

