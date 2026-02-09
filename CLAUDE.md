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

## 📋 Tâches à venir (Next Tasks)

### Actualités - Scraping complet
**Contexte :** Actuellement, seulement 4 articles ont été scrapés depuis gary.ch et ajoutés dans `/src/data/actualites.json`. Les pages de détail fonctionnent (route dynamique `/actualites/:id`).

**À faire :**
1. Scraper **TOUTES** les actualités restantes depuis https://gary.ch/actualites/
   - Utiliser l'API WordPress REST : `https://gary.ch/wp-json/wp/v2/posts?per_page=100&_embed`
   - Pour chaque article, extraire :
     - `title.rendered` (titre)
     - `excerpt.rendered` (description, nettoyer le HTML)
     - `date` (formater en "DD mois YYYY" en français)
     - `_embedded['wp:featuredmedia'][0].source_url` (image)
     - Catégorie (Article/Podcast/Video selon les tags/catégories)
     - `link` (URL originale)
   - Scraper le contenu complet de chaque article via l'API (slug)
2. Mettre à jour `/src/data/actualites.json` avec tous les articles
3. Assigner des IDs séquentiels (1, 2, 3, ...)
4. Tester que toutes les pages de détail fonctionnent

**Méthode optimale :**
- Faire un seul appel API pour récupérer tous les posts
- Ensuite, pour chaque post, faire un appel avec le slug pour obtenir le contenu complet
- Parser le contenu en markdown-style (## pour titres, etc.)

### API Leads - Vérification
**Contexte :** L'API leads existe dans `/api/leads.js` mais n'a pas été testée en production.

**À faire (avec Gary présent) :**
1. Vérifier que les leads arrivent correctement dans Realforce
2. Tester les différents formulaires (contact, estimation, vente)
3. Valider le honeypot anti-spam
4. Vérifier les messages d'erreur en cas de problème API

### Page Acheter
✅ **TERMINÉE** - Le carousel est fluide sur mobile, les animations hover fonctionnent correctement.
