# CrisisWatch Frontend

Next.js dashboard for [crisiswatch-api](https://github.com/graydragon2/crisiswatch-api) — tracks local and worldwide crises via RSS, before they hit mainstream news, with AI severity scoring, a live propagation map, a keyword watchlist, and dark-web email exposure checks.

## Setup

```bash
npm install
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:3001" > .env.local   # point at your backend
npm run dev
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_BACKEND_URL` | Yes | Base URL of the crisiswatch-api deployment (no trailing slash) |

## Pages

- `/dashboard` — main overview: RSS highlights, dark web check shortcut, Keywords Alert widget, phishing detection chart, the Propagation Overlay map, and Watched Locations (add a zip code to track its active NWS weather alerts and local news, scored by severity).
- `/threats` — full threat feed with keyword/source filters.
- `/feeds` — manage tracked RSS feed sources.
- `/darkweb` — check an email against known credential leaks.
- `/settings` — ad-hoc text threat scoring.
- `/admin` — system status (backend/API config health, feed fetch success/failure) and email alert settings (enable, set recipient, send a test email).

## Notes

- The Propagation Overlay map (`components/PropagationMap.jsx`) only plots markers when the backend's AI scoring/geolocation is available (`ANTHROPIC_API_KEY` set on crisiswatch-api) — without it, the rest of the dashboard still works, the map just shows no pins.
- No theme toggle is exposed in the UI — the app is styled dark-only, so avoid `next-themes`-driven classes (`dark:`, `bg-card`, `text-foreground`, etc.) that key off system color-scheme preference; they'll render inconsistently for users without a dark OS theme. Use fixed Tailwind dark classes instead (see `components/ui/card.jsx` for the pattern).
