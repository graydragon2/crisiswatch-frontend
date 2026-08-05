'use client';

import { Sidebar } from '@/components/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

export default function AdminPage() {
  return (
    <div className="flex flex-col md:block min-h-screen bg-gray-950 text-white">
      <Sidebar />
      <main className="md:ml-64 flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">🛠️ Admin Panel</h1>
        <Card>
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>Coming soon…</CardContent>
        </Card>
      </main>
    </div>
  );
}
