
'use client';

import { Sidebar } from '@/components/Sidebar';
import FeedList from '../components/FeedList';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

export default function FeedsPage() {
  return (
    <div className="flex flex-col md:block min-h-screen bg-gray-950 text-white">
      <Sidebar />
      <main className="md:ml-64 flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">📡 RSS Feeds</h1>
        <Card>
          <CardHeader>
            <CardTitle>Manage RSS Feeds</CardTitle>
          </CardHeader>
          <CardContent>
            <FeedList />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
