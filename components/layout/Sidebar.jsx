import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-60 h-screen bg-gray-800 text-white p-4 space-y-4">
      <h2 className="text-xl font-bold">CrisisWatch</h2>
      <nav className="space-y-2">
        <Link href="/dashboard" className="block hover:underline">Dashboard</Link>
        <Link href="/feeds" className="block hover:underline">Feeds</Link>
        <Link href="/settings" className="block hover:underline">Settings</Link>
        <Link href="/darkweb" className="block hover:underline">Dark Web</Link>
        <Link href="/admin" className="block hover:underline">Admin Panel</Link>
      </nav>
    </aside>
  );
}
