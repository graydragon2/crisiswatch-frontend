
'use client';

import Sidebar from '../components/Sidebar';
import FeedList from '../components/FeedList';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

export default function FeedsPage() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6">
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
