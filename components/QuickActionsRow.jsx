'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Flag, MapPin, FileText, Settings as SettingsIcon } from 'lucide-react';

// Desktop equivalent of the mobile bottom nav's "+" quick-action sheet —
// desktop has no FAB, so without this there'd be no persistent entry point
// for these actions at all. Same honesty rule as the FAB menu: routes that
// go somewhere real are links, features that don't exist yet show an
// explicit "coming soon" note instead of a dead click.
const ACTIONS = [
  { key: 'report', label: 'Report Threat', sub: 'Submit threat intel', Icon: Flag, comingSoon: true },
  { key: 'location', label: 'Watch Location', sub: 'Track by region', Icon: MapPin, href: '/dashboard#locations' },
  { key: 'export', label: 'Export Report', sub: 'Generate PDF', Icon: FileText, comingSoon: true },
  { key: 'settings', label: 'Settings', sub: 'Configure alerts', Icon: SettingsIcon, href: '/profile' }
];

export default function QuickActionsRow() {
  const router = useRouter();
  const [comingSoonKey, setComingSoonKey] = useState(null);

  const handleClick = (action) => {
    if (action.comingSoon) {
      setComingSoonKey((prev) => (prev === action.key ? null : action.key));
      return;
    }
    router.push(action.href);
  };

  return (
    <div className="hidden md:grid grid-cols-4 gap-3">
      {ACTIONS.map((action) => (
        <div key={action.key}>
          <button
            onClick={() => handleClick(action)}
            className="w-full flex items-center gap-3 rounded-2xl bg-card ring-1 ring-border p-4 hover:ring-primary/40 transition-colors text-left"
          >
            <action.Icon size={18} className="text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">{action.label}</p>
              <p className="text-xs text-muted-foreground truncate">{action.sub}</p>
            </div>
          </button>
          {comingSoonKey === action.key && (
            <p className="text-[11px] text-muted-foreground mt-1 px-1">Coming soon — not built yet.</p>
          )}
        </div>
      ))}
    </div>
  );
}
