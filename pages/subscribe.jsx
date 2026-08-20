'use client';

import AppShell from '@/components/AppShell';
import BillingStatus from '@/components/BillingStatus';

export default function SubscribePage() {
  return (
    <AppShell>
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Subscription</h1>
        <BillingStatus />
      </div>
    </AppShell>
  );
}
