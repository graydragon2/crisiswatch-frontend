// lib/severity.js
//
// Score-to-band mapping for the frontend. Mirrors crisiswatch-api's
// utils/severity.js exactly (same thresholds, same colors) — keep them in
// sync. `hex` is for contexts that can't use Tailwind classes (inline SVG
// fill, chart libraries).
//
// The *_CLASS maps below use full literal class strings rather than
// building them with template literals (e.g. `bg-${band}`) — Tailwind's
// build-time scanner only picks up classes that appear as literal
// substrings in source, so an interpolated class name silently produces
// no CSS.
export const SEVERITY_BANDS = [
  { name: 'Critical', min: 9, hex: '#ef4444' },
  { name: 'High', min: 7, hex: '#f97316' },
  { name: 'Medium', min: 4, hex: '#eab308' },
  { name: 'Low', min: 2, hex: '#22c55e' },
  { name: 'Informational', min: 0, hex: '#3b82f6' }
];

export function getSeverityBand(score) {
  return SEVERITY_BANDS.find((b) => score >= b.min) || SEVERITY_BANDS[SEVERITY_BANDS.length - 1];
}

export const BAND_DOT_CLASS = {
  Critical: 'bg-critical',
  High: 'bg-high',
  Medium: 'bg-medium',
  Low: 'bg-low',
  Informational: 'bg-informational'
};

export const BAND_BADGE_CLASS = {
  Critical: 'bg-critical/10 text-critical ring-critical/30',
  High: 'bg-high/10 text-high ring-high/30',
  Medium: 'bg-medium/10 text-medium ring-medium/30',
  Low: 'bg-low/10 text-low ring-low/30',
  Informational: 'bg-informational/10 text-informational ring-informational/30'
};
