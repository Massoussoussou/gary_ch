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

### Terminées
- ✅ **Actualités - Scraping complet** - 17 articles scrapés depuis gary.ch, routes `/actualites/:id` fonctionnelles.
- ✅ **Page Acheter** - Carousel fluide sur mobile, animations hover OK.
- ✅ **Menu hamburger** - Doublon Actualités supprimé. Nav principale : Acheter, Vendre, Estimer, Projets Neufs. Sous-menu À propos (accordéon) : Qui est GARY, Actualités, Presse, Ressources. Fichier : `src/components/layout/DrawerNav.jsx`.
- ✅ **Header desktop** - Supprimé les offsets manuels. Grille CSS `auto 1fr auto` centre naturellement. Fichier : `src/components/layout/Header.jsx`.
- ✅ **Nettoyage CSS projet.css** - Consolidé de 1869 → 1037 lignes (-44%). Supprimé : 3x `@keyframes reveal-left` dupliqués, 5x itérations specs-aside/grid/chip, classes mortes (coming-*, btn-contact, btn-cta-animated, detail-specs--overlay, proj-veil-intro). CSS bundle : 128 kB → 121 kB.
- ✅ **Intégration Projets Neufs (liste)** - Le mapping dans `src/hooks/usePromotions.js` → `normalizePromotionsList()` est correct. L'API `/api/promotions` renvoie les données, la page `/projets-neufs` les affiche.
- ✅ **ProjetNeufDetail (page détail)** - Normalizer corrigé (`extractDescriptions` gère string HTML + objet localisé). Description hero retirée (seule la 2e description reste). Specs agrégées depuis les lots (`aggregateRange`). Mobile responsive : hero flex column à 860px, galerie stack à 768px, specs aside margin fix à 980px.
- ✅ **Performances — Code-splitting** - Bundle passé de 596 kB (1 chunk) → chunk principal 25 kB. Routes lazy-loadées via `React.lazy()` + `Suspense`. Vendor chunks séparés : react (141 kB), framer-motion (124 kB), router (22 kB). Warning Vite > 500 kB éliminé. Fichiers : `src/App.jsx`, `vite.config.js`.

---

### Vidéos hero
- Remplacer par de vraies vidéos optimisées
- Travailler la compression, le lazy loading et les formats (WebM/MP4)

### Nettoyage du code / organisation des composants
- ✅ CSS projet.css nettoyé
- Reste à faire : ranger les composants dans les bons dossiers, alléger les pages lourdes (extraire sous-composants)
- **About.jsx** (1101 lignes) — pris en charge par un collègue, NE PAS TOUCHER
- Fichiers les plus lourds restants : FiltersBarCompact.jsx (891), FiltersBar.jsx (807), CTAFuturaGlow.jsx (594), ListingCard.jsx (534)

### Performances du site
- ✅ Code-splitting fait (React.lazy + Suspense + manualChunks)
- Reste à faire : optimiser les images, les vidéos, audit Lighthouse

### Filtres des biens immobiliers
- ✅ Système complet : 5 filtres principaux (Ville, Type, Budget, Chambres & SDB, Surface) + modal Avancés (Canton, Dispo, Terrain, Meublé, 8 Atouts, Équipements). API vérifié : 11 biens avec données complètes (6 types, 8 villes, 2 cantons).

### Page Vendre
- **En attente** : Gary donnera ses demandes directement sur la page

### Page Estimer
- Rendre la page plus solide et professionnelle
- Implémenter une vraie fonctionnalité d'envoi des infos (leads)
- **Bloqué par** : accord de Gary pour tester les leads en production

### Formulaire "Contactez Gary" / API Leads
- **En attente de l'accord de Gary** pour faire des tests en production
- Vérifier que les leads arrivent correctement dans Realforce
- Tester les différents formulaires (contact, estimation, vente)
- Valider le honeypot anti-spam

### Page "Qui est Gary" (À propos)
- Retravailler entièrement la page, le rendu actuel n'est pas satisfaisant

### Mentions légales + Politique de confidentialité
- Créer les pages + ajouter les liens dans le footer

### Cookies
- Vérifier quels cookies sont utilisés par le site
- Déterminer si un bandeau cookies est nécessaire (RGPD)

### Intégration Instagram
- Afficher les vidéos Instagram de Gary en bas de certaines pages

### Avis Google
- Relier les avis Google en direct sur le site
