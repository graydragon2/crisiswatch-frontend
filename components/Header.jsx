import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b dark:border-gray-800">
      <h1 className="text-xl font-bold">CrisisWatch</h1>
      <ThemeToggle />
    </header>
  );
}
