// components/Sidebar.jsx

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // Optional if using class merging

const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Feeds', href: '/feeds' },
  { name: 'Settings', href: '/settings' },
  { name: 'Dark Web', href: '/darkweb' },
  { name: 'Admin Panel', href: '/admin' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-64 bg-muted p-6 border-r border-border">
      <div className="text-2xl font-bold mb-8 text-foreground">CrisisWatch</div>
      <nav className="space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'block px-3 py-2 rounded-md hover:bg-muted-foreground/10 transition',
              pathname === item.href ? 'text-primary font-semibold' : 'text-muted-foreground'
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}