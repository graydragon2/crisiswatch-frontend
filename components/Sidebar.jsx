// File: components/Sidebar.jsx
export default function Sidebar() {
  return (
    <aside className="bg-gray-900 text-white h-screen w-64 p-6 hidden md:block">
      <h2 className="text-2xl font-bold mb-8">CrisisWatch</h2>
      <nav className="space-y-4">
        <a href="/dashboard" className="block text-gray-300 hover:text-white">Dashboard</a>
        <a href="/feeds" className="block text-gray-300 hover:text-white">Feeds</a>
        <a href="/settings" className="block text-gray-300 hover:text-white">Settings</a>
        <a href="/admin" className="block text-gray-300 hover:text-white">Admin Panel</a>
      </nav>
    </aside>
  );
}

