import Link from 'next/link';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  const isActive = (href) => router.pathname === href;

  return (
    <aside className="w-full md:w-64 md:h-screen md:fixed md:top-0 md:left-0 bg-gray-900 text-white flex flex-col border-r border-white/10">
      <div className="p-4 md:p-6 text-xl md:text-2xl font-bold border-b border-white/10">
        CrisisWatch
      </div>
      <nav className="p-4">
        <ul className="flex flex-wrap gap-1 md:flex-col md:gap-1">
          {LINKS.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive(href)
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} /> {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
