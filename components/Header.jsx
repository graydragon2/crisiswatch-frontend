// src/components/Header.jsx
export default function Header() {
  return (
    <header className="bg-gray-950 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold">CrisisWatch</h1>
      <nav className="space-x-4">
        <a href="#" className="hover:text-purple-400">Dashboard</a>
        <a href="#" className="hover:text-purple-400">Settings</a>
        <a href="#" className="hover:text-purple-400">Logout</a>
      </nav>
    </header>
  );
}
