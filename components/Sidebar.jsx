import Link from 'next/link';
import { LayoutDashboard, Rss, AlertTriangle, Eye, Settings, Shield } from 'lucide-react';

const LINKS = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/feeds', label: 'Feeds', Icon: Rss },
  { href: '/threats', label: 'Threats', Icon: AlertTriangle },
  { href: '/darkweb', label: 'Dark Web', Icon: Eye },
  { href: '/settings', label: 'Settings', Icon: Settings },
  { href: '/admin', label: 'Admin Panel', Icon: Shield },
];

export function Sidebar() {
  return (
    <aside className="w-full md:w-64 md:h-screen md:fixed md:top-0 md:left-0 bg-gray-900 text-white flex flex-col">
      <div className="p-4 md:p-6 text-xl md:text-2xl font-bold border-b border-gray-700">
        CrisisWatch
      </div>
      <nav className="p-4">
        <ul className="flex flex-wrap gap-2 md:flex-col md:gap-0 md:space-y-4">
          {LINKS.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link href={href} className="flex items-center gap-2 hover:text-blue-400">
                <Icon size={18} /> {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
