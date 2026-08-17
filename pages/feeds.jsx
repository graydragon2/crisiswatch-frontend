'use client';

import AppShell from '@/components/AppShell';
import FeedList from '../components/FeedList';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

export default function FeedsPage() {
  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-6 text-foreground">📡 RSS Feeds</h1>
      <Card>
        <CardHeader>
          <CardTitle>Manage RSS Feeds</CardTitle>
        </CardHeader>
        <CardContent>
          <FeedList />
        </CardContent>
      </Card>
    </AppShell>
  );
}
