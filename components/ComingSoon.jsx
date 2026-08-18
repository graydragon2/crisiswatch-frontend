import { Construction } from 'lucide-react';

/**
 * Explicit "not built yet" state for spec'd features with no real
 * implementation behind them. Per the product spec, a card must never
 * look functional if it isn't — this replaces what used to be a
 * hardcoded-mock-data chart that looked like real analytics.
 */
export default function ComingSoon({ note }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 gap-2">
      <Construction size={22} className="text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Coming soon — not built yet.</p>
      {note && <p className="text-xs text-muted-foreground max-w-xs">{note}</p>}
    </div>
  );
}
