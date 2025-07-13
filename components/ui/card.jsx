// components/ui/card.jsx

export function Card({ children, className }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 ${className || ''}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function CardTitle({ children }) {
  return <h3 className="text-lg font-semibold text-black dark:text-white">{children}</h3>;
}

export function CardContent({ children }) {
  return <div className="text-sm text-gray-700 dark:text-gray-300">{children}</div>;
}