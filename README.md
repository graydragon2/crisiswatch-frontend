# Contingency Brief

AI-assisted crisis intelligence and situational-awareness platform: a single dashboard for global and local threat monitoring, watched locations, phishing risk, dark-web breach exposure, and real-time alerts. This repository is the Next.js frontend for [crisiswatch-api](https://github.com/graydragon2/crisiswatch-api), the Express/PostgreSQL backend that does the actual aggregation, AI scoring, and persistence.

> **Naming note:** this project began as a personal tool called **CrisisWatch**. The repositories keep that original name (`crisiswatch-frontend` / `crisiswatch-api`), but the product has since been rebuilt into a subscription product under the name **Contingency Brief** — that's the name used throughout the UI and in this README.

## Why I Built It

Threat and situational-awareness information is scattered across a dozen disconnected feeds and services: news RSS, government weather alerts, breach-notification lookups, phishing analysis tools. Getting a real picture means checking all of them separately. Contingency Brief consolidates that into one operational interface — a single authenticated dashboard that aggregates the feeds, applies consistent AI-assisted severity scoring, and surfaces only what crosses a meaningful threshold, instead of requiring several open tabs and manual triage.

## What It Does

- **Global & local crisis monitoring** — curated RSS feed aggregation (backend), rendered as a live threat feed with keyword/source filtering (frontend, `/threats`).
- **AI-assisted severity scoring & categorization** — each threat item is scored 1–10 and classified into a category (Cybersecurity, Geopolitical, Conflict, Public Safety, Infrastructure, Natural Disaster, Other) by Claude on the backend; the frontend renders the resulting score, band, and category badges.
- **AI-assisted geolocation & propagation visualization** — scored items carry inferred coordinates (backend); the frontend plots them on a world map (`components/PropagationMap.jsx`, `/dashboard`).
- **Watched locations** — track specific zip codes for active NWS weather/emergency alerts and location-scoped local news, optionally AI-scored (backend does the geocoding/NWS/news lookups; frontend manages the watch list and displays results).
- **Keyword watchlists** — per-user keywords that drive the dashboard's "Keywords Alert" widget.
- **Dark-web / breach exposure checks** — on-demand email lookups against known credential leaks, plus persistent per-user monitoring that rechecks automatically (`/darkweb`).
- **Phishing analysis** — submit an email, message, URL, or screenshot for AI-assisted phishing-risk scoring (`components/PhishingAnalyzer.jsx`).
- **Manual threat scoring** — score arbitrary text 1–10 on demand (`/settings`).
- **Composite Threat Score & history** — a global score (0–100) with per-category breakdown and historical trend charts over 24h/7d/30d/90d (`/threat-score`).
- **Notifications & email alerts** — an in-app notification center plus opt-in email alerts when something crosses a severity threshold, configurable per user (`/profile`).
- **Authentication** — passwordless magic-link sign-in; every personalized page is gated behind a verified session.
- **Subscription & billing** — Stripe-backed subscription management (checkout, billing portal, live status) surfaced on `/subscribe`.
- **Admin panel** — basic backend health/feed-status view for operators (`/admin`).

## Architecture

```
Browser / Next.js Frontend (this repo)
        |
        v
Contingency Brief API (crisiswatch-api, Express + PostgreSQL)
        |
        +-- RSS / external news feeds
        +-- Anthropic Claude — severity scoring, categorization, geolocation, phishing analysis
        +-- National Weather Service — location-based alerts
        +-- LeakCheck — dark-web / breach exposure data
        +-- PostgreSQL (via Prisma) — users, per-user data, subscriptions
        +-- Resend — transactional email (magic links, alert emails)
        +-- Stripe — subscription billing
```

The frontend never talks to Claude, NWS, LeakCheck, Stripe, or Postgres directly — it only calls the backend's REST API (`NEXT_PUBLIC_BACKEND_URL`) with a bearer token.

## Engineering Highlights

- **Frontend/backend split with a bearer-token API boundary.** The frontend (Vercel) and API (Railway) are separate deployments on separate origins; auth uses an `Authorization: Bearer <token>` header rather than cookies specifically to avoid cross-origin cookie/CORS-credential complexity.
- **Authenticated, per-user data.** Keywords, watched locations, monitored emails, alert settings, and notifications are all scoped by `userId` in Postgres and require a valid session — the frontend's `useRequireAuth()` hook (`lib/auth.js`) gates every dashboard page and redirects unauthenticated visitors to `/login`.
- **Deterministic logic kept separate from AI-assisted analysis.** The composite Threat Score is a documented, deterministic formula (severity average scaled to 0–100, boosted by critical-band item count) — not an AI output — while per-item severity, category, and location come from Claude. The two are never conflated.
- **Cost-aware AI architecture.** The backend's AI-scoring routes are cached per exact query with a single-flight guard, so concurrent requests for the same data share one Claude call instead of paying for their own (`utils/threatsCache.js`, `utils/locationsCache.js` in the backend).
- **No AI calls on a fixed clock.** The backend's background monitoring tick never triggers its own Claude scoring pass — it only reuses whatever a real dashboard visit already cached, so idle periods cost nothing.
- **Graceful degradation.** If AI scoring is unavailable or fails, the threat feed and location pages still render — just without score/category/location fields — instead of failing the whole page. The Propagation Map simply shows no pins when AI geolocation isn't available.
- **Security boundaries around metered endpoints.** Expensive or paid-API-backed routes (AI scoring, phishing analysis, dark-web lookups) are gated behind authentication on the backend, since they'd otherwise be an open, unbounded-cost proxy onto a third-party API.
- **Subscription/account architecture.** Passwordless magic-link auth (hashed, single-use, short-lived tokens) and Stripe subscription state that's only ever written by a verified webhook — checkout and billing-portal flows redirect to Stripe and wait for that webhook rather than trusting the client-side redirect result.

## Tech Stack

- **Next.js 15** (Pages Router) + **React 18**
- **Tailwind CSS**, `next-themes` (dark/light toggle on `/profile`)
- **Recharts** and **Chart.js** (`react-chartjs-2`) for trend/history charts
- **react-simple-maps** for the threat propagation map
- **lucide-react** for icons
- Deployed on **Vercel**

Backend (separate repo): Node.js, Express, PostgreSQL, Prisma, the Anthropic API (Claude), Stripe, Resend — see [crisiswatch-api](https://github.com/graydragon2/crisiswatch-api) for details.

## Frontend Areas

- `/` — public marketing/landing page.
- `/login`, `/auth/verify` — passwordless magic-link sign-in flow.
- `/dashboard` — main authenticated overview: RSS highlights, Keywords Alert widget, phishing detection chart, the Propagation Map, and Watched Locations.
- `/threats` — full threat feed with keyword/source filters.
- `/threat-score` — composite Threat Score gauge, per-category breakdown, and historical trend chart (24h/7d/30d/90d).
- `/feeds` — manage tracked RSS feed sources.
- `/darkweb` — on-demand and persistent dark-web/breach exposure checks.
- `/settings` — ad-hoc manual text threat scoring.
- `/profile` — theme, email alert settings, and links to monitoring tools, subscription, and admin.
- `/subscribe` — subscription status and Stripe billing management.
- `/admin` — backend health and feed-status panel.

## Backend

The API — RSS aggregation, AI scoring/categorization/geolocation, authentication, per-user persistence, monitoring, alerting, dark-web checks, phishing analysis, and Stripe billing — lives in a separate repository:

**→ [github.com/graydragon2/crisiswatch-api](https://github.com/graydragon2/crisiswatch-api)**

## Running Locally

```bash
npm install
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:3001" > .env.local   # point at your backend
npm run dev
```

You'll need a running instance of [crisiswatch-api](https://github.com/graydragon2/crisiswatch-api) (locally or deployed) for anything beyond the static landing page to work — see that repo's README for its own setup.

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_BACKEND_URL` | Yes | Base URL of the crisiswatch-api deployment (no trailing slash) |

No secrets live in this repo — the only frontend env var is a public backend URL. All API keys (Anthropic, Stripe, Resend, LeakCheck) are configured on the backend only.

## Project Status

This project started as **CrisisWatch**, a single-user personal tool. It has since been converted into a multi-tenant subscription product, **Contingency Brief**: magic-link authentication, per-user data (keywords, watched locations, monitored emails, notifications), and Stripe subscription billing (a single $9/mo tier — no free tier yet) are all implemented end-to-end across both repos. Pre-migration data from the original single-user tool required a one-off manual migration script on the backend rather than an automatic import. There is no automated test suite yet.

## Security / Design Notes

- Every page that touches personalized data is gated behind a verified session (`useRequireAuth`); the backend independently enforces the same on every relevant route.
- The frontend never handles API keys or database access directly — it only calls the backend over HTTPS with a bearer token.
- Phishing URL analysis never causes the backend to fetch the submitted URL itself (avoiding SSRF) — only the URL string's structure is analyzed.
- Stripe subscription state is only ever updated by a signature-verified webhook on the backend, not by trusting a client-side redirect after checkout.
- AI-scoring failures degrade gracefully (missing scores/categories) rather than breaking the page or exposing errors to the user.

## Disclaimer

Contingency Brief's severity scores, categorizations, phishing-risk assessments, and breach-exposure summaries are AI-assisted and heuristic decision-support signals, not authoritative determinations. They are not a substitute for official emergency management guidance, professional cybersecurity or threat-intelligence analysis, or financial/legal advice. Always verify anything safety-critical through official sources.
