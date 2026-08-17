'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Tag, MapPin, Mail, ScanSearch, Flag, Sparkles, X } from 'lucide-react';

// Two kinds of quick actions: ones that route to real, already-working
// functionality, and ones for features that don't exist yet. The spec is
// explicit that a button must never *pretend* to work — so the
// not-yet-built ones show a clearly labeled "coming soon" note in place
// instead of navigating anywhere.
const ACTIONS = [
  { key: 'keyword', label: 'Add Keyword', Icon: Tag, href: '/dashboard#keywords' },
  { key: 'location', label: 'Watch Location', Icon: MapPin, href: '/dashboard#locations' },
  { key: 'email', label: 'Check Email', Icon: Mail, href: '/darkweb' },
  { key: 'phishing', label: 'Analyze Phishing', Icon: ScanSearch, comingSoon: true },
  { key: 'report', label: 'Report Threat', Icon: Flag, comingSoon: true },
  { key: 'ai', label: 'Ask AI', Icon: Sparkles, comingSoon: true },
];

export default function QuickActionMenu({ onClose }) {
  const router = useRouter();
  const [comingSoonKey, setComingSoonKey] = useState(null);

  const handleClick = (action) => {
    if (action.comingSoon) {
      setComingSoonKey((prev) => (prev === action.key ? null : action.key));
      return;
    }
    onClose();
    router.push(action.href);
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-card ring-1 ring-border p-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-card-foreground">Quick Actions</p>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-card-foreground">
            <X size={18} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {ACTIONS.map((action) => (
            <div key={action.key} className="flex flex-col items-center">
              <button
                onClick={() => handleClick(action)}
                className="w-full flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <action.Icon size={20} className="text-primary" />
                <span className="text-xs text-card-foreground text-center leading-tight">{action.label}</span>
              </button>
              {comingSoonKey === action.key && (
                <p className="mt-1 text-[11px] text-muted-foreground text-center">Coming soon — not built yet.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
