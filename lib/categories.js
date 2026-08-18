// lib/categories.js
//
// Mirrors crisiswatch-api's utils/threatScorer.js THREAT_CATEGORIES
// exactly — keep in sync. Attached to threat items server-side only when
// useAI=true (it's classified by the same Claude call that scores them).
export const THREAT_CATEGORIES = [
  'Cybersecurity',
  'Geopolitical',
  'Conflict',
  'Public Safety',
  'Infrastructure',
  'Natural Disaster',
  'Other'
];
