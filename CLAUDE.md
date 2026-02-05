# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Production build → dist/
npm run preview      # Preview production build
```

No test suite is defined.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend:** Serverless API functions (Vercel-compatible) in `/api/`
- **External API:** Realforce real estate API (listings, promotions, leads)

## Architecture Overview

### Frontend Structure (`/src/`)
- **Entry:** `main.jsx` → `App.jsx` (routes) wrapped by `PasswordGate.jsx` (auth: "gary2025")
- **Pages:** `/src/pages/` - Route components (Home, Listings, ListingDetail, Sell, etc.)
- **Components:** `/src/components/` - Reusable UI, organized by domain:
  - `listing/` - Property detail components
  - `sell/` - Sell page components
  - `cards/` - Card variants
  - `brand/` - Branding components
- **Data:** `/src/data/` - Demo JSON data (listings, projects, team)

### API Functions (`/api/`)
- `properties.js` - Proxies Realforce listings API with 2-hour caching
- `leads.js` - Lead form submission with honeypot spam protection
- `promotion.js` / `promotions.js` - Promotion details and lists

### Routes (French URLs)
- `/` → Home
- `/acheter` → BuyIntro, `/acheter/catalogue` → Listings
- `/annonce/:id` → ListingDetail
- `/vendre` → Sell
- `/estimer` → Estimate
- `/a-propos` → About
- `/projets-neufs` → ProjetsNeufs, `/projets-neufs/:id` → ProjetNeufDetail
- `/equipe/:slug` → TeamMemberDetail

## Theme System

The app uses data attributes on `<html>` for theming:
- `data-font` - Controls font pairing (5 combinations: classic, moderne, etc.)
- `data-bg` - Controls background variant (warm1-3, neutral, cool, dark, etc.)

Use `DesignSwitcher.jsx` component for live theme testing during development.

## Environment Variables

Required in `.env.local`:
```
REALFORCE_PUBLIC_API_KEY=...
REALFORCE_PUBLIC_BASE_URL=https://listings.realforce.ch
REALFORCE_PROMOTIONS_BASE_URL=https://promotions.realforce.ch
REALFORCE_LEADS_BASE_URL=https://leads.realforce.ch
REALFORCE_PUBLIC_DEFAULT_LOCALE=fr
```

## Key Patterns

- **Animations:** Framer Motion for complex animations; CSS keyframes in `index.css` for simpler effects
- **3D Gallery:** Uses OGL library (not Three.js) for WebGL components
- **Mobile detection:** Uses `matchMedia` hook pattern, not window resize listeners
- **Styling:** Tailwind utilities + inline styles for dynamic calculations
- **All UI text is in French**
