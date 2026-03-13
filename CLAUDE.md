# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow Git — Synchronisation au démarrage

**OBLIGATOIRE — À faire au début de chaque session avant de coder :**

Ce repo est collaboratif. Deux développeurs travaillent dessus, chacun sur sa propre branche :

| Développeur | GitHub        | Branche de travail |
|-------------|---------------|--------------------|
| Massi       | TrigznOva     | `dev`              |
| Tom         | TrigzV        | sa branche perso   |

**Procédure au lancement :**

1. Identifier la branche courante (`git branch --show-current`)
2. `git fetch origin main` — récupérer les derniers commits de `main`
3. `git merge origin/main` — fusionner `main` dans la branche courante
4. **Préserver les fichiers en cours** — si l'utilisateur a des modifications locales non commitées, les sauvegarder avant le merge et les restaurer après (demander quels fichiers garder)

**Règles :**
- **Ne jamais push sur `main`** — chacun push uniquement sur sa branche
- **Ne jamais modifier `main` directement** — `main` est la branche de référence commune
- **Remote :** `origin` → `https://github.com/TrigznOva/SiteGARY.git`
- **Modifications de code** : pas besoin de demander confirmation, modifier librement
- **Actions git (push, commit, etc.)** : toujours demander confirmation avant

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
- ✅ **Landing /estimer — Refonte visuelle GARY** (branche `feature/landing-estimation`) :
  - Header du site GARY affiché (supprimé LandingNav custom)
  - Hero : vidéo fixe + tuile glassmorphique (gauche) + formulaire (droite), titre 3 lignes
  - Toutes les sections passées en fond clair (comparison, CTA final, footer, sticky mobile)
  - Couleurs : uniquement orange GARY (#FF4A3E), blanc, neutres — plus de gold/sombre
  - Fonts : Inter + Playfair Display via variables CSS du site
  - Trust bar : style TrustStrip (150+, Genève, 48h, 4.9★)
  - Parallax désactivé sur mobile, Lenis smooth scroll actif
  - Fichiers modifiés : `App.jsx`, `EstimationLanding.jsx`, `HeroSection.jsx`, `TrustSection.jsx`, `icons.jsx`, `ConfirmationPage.jsx`, `landing-estimation.css`
  - Fichier supprimé : `LandingNav.jsx`

---

### 🔴 EN COURS — Intégration ProjetNeufDetail (page détail)

**Problème identifié :** Le normalizer `normalizePromotionDetail()` dans `src/hooks/usePromotions.js` s'attend à ce que `description` soit un objet `{ fr: { promotion_description, location_description } }`, mais l'API renvoie une **string HTML** directe.

**Exemple de réponse API `/api/promotion?id=XXX` :**
```json
{
  "id": "670fd3b905865-...",
  "name": "Villas Pleiades",
  "reference": "PLEIADES",
  "status": "Actuelle",
  "location": "Vandoeuvres",
  "description": "<b>Introduction<br></b>Située au cœur d'un quartier...",
  "apt_available": 3,
  "apt_sold": 2,
  "apt_active": 1,
  "price": 3990000,
  "currency": "CHF",
  "min_surface": 194, "max_surface": 194,
  "min_rooms": 7, "max_rooms": 8,
  "min_bedrooms": 3, "max_bedrooms": 4,
  "photos": [
    { "url": "https://images.realforce.ch/...", "title": "", "is_plan": false, "tags": "" }
  ],
  "property_ids": ["670fb3185c44d-..."]
}
```

**À faire :**
1. Lire `src/pages/ProjetNeufDetail.jsx` pour comprendre quels champs la page attend
2. Appeler `/api/promotion?id=XXX` pour voir la réponse complète du détail (peut différer de la liste)
3. Corriger `normalizePromotionDetail()` dans `src/hooks/usePromotions.js` — notamment :
   - `description` : string HTML → parser directement au lieu de `p.description?.fr?.promotion_description`
   - `apt_sold` existe dans l'API mais `apt_reserved` non (le normalizer utilise `apt_reserved`)
   - Vérifier les champs `properties` (lots), `contacts`, `plans`
4. Ajuster le design de la page si nécessaire

**Fichiers clés :**
- `src/pages/ProjetNeufDetail.jsx` (393 lignes) — page détail
- `src/hooks/usePromotions.js` — hooks + normalizers (à corriger)
- `api/promotion.js` — proxy API détail
- `src/styles/projet.css` — CSS partagé (nettoyé)

---

### Vidéos hero
- Remplacer par de vraies vidéos optimisées
- Travailler la compression, le lazy loading et les formats (WebM/MP4)

### Nettoyage du code / organisation des composants
- ✅ CSS projet.css nettoyé
- Reste à faire : ranger les composants dans les bons dossiers, alléger les pages lourdes (extraire sous-composants)
- **About.jsx** — pris en charge par Massi, NE PAS TOUCHER
- Fichiers les plus lourds restants : FiltersBarCompact.jsx (891), FiltersBar.jsx (807), CTAFuturaGlow.jsx (594), ListingCard.jsx (534)

### Performances du site
- ✅ **Lighthouse 96/100/96/100** (13 mars 2026) — LCP passé de 6.3s à 1.1s
- ✅ Images converties en WebP (81 MB → 7 MB)
- ✅ Google Fonts réduit de 10 à 3 familles, rendu non-bloquant
- ✅ Failles de sécurité corrigées (`npm audit fix` — 6/8 résolues)
- ✅ Dépendances mineures mises à jour (framer-motion, lenis, postcss, autoprefixer)
- **Règle : toute nouvelle image doit être en WebP** (convertir avec sharp)

### 🔴 Migrations majeures à planifier (breaking changes)
**À faire quand on aura du temps — chaque migration peut casser des choses, tester à fond après.**

| Package | Actuel | Cible | Difficulté | Notes |
|---------|--------|-------|------------|-------|
| **Vite** | 5.4 | 8.0 | Élevée | Corrige les 2 failles restantes (esbuild). Revoir config + plugins |
| **React** | 18.3 | 19.x | Élevée | Nouvelles APIs, changements Suspense, hooks modifiés |
| **Tailwind CSS** | 3.4 | 4.x | Moyenne | Nouvelle syntaxe config, utility classes renommées |
| **react-router-dom** | 6.30 | 7.x | Moyenne | Nouvelle API loaders/actions, changements de routing |

**Ordre recommandé :** Vite → Tailwind → react-router-dom → React (du moins au plus risqué)
**Méthode :** une migration à la fois, sur une branche dédiée, build + test complet avant merge

### Filtres des biens immobiliers
- Faire fonctionner correctement les filtres sur la page acheter/catalogue
- Vérifier concrètement les données retournées par l'API Realforce (quels champs sont disponibles)
- Adapter les filtres aux données réelles de la BDD

### Intégration Projets Neufs + API
- Connecter la page `/projets-neufs` à l'API Realforce (promotions)
- Faire le mapping entre les données de l'API et les données attendues par nos composants
- Vérifier l'affichage des détails `/projets-neufs/:id`

### Page Vendre
- **En attente** : Gary donnera ses demandes directement sur la page
- Il y a déjà des instructions existantes à relire avant de commencer

### Page Estimer (landing /estimer)
- ✅ Refonte visuelle complète — intégrée au design GARY (branche `feature/landing-estimation`)
- **Reste à faire :**
  - Intégrer le widget Google Reviews (avis en direct) — nécessite API Google Places ou service tiers (Elfsight)
  - Connecter le formulaire à l'API Leads Realforce (envoi réel)
  - Page de confirmation : adapter au fond clair (actuellement encore en fond sombre `var(--ink)`)
  - eBook modal : adapter au fond clair (même remarque)
  - Merger `feature/landing-estimation` dans `dev` ou `main` quand validé par Gary
- **Bloqué par** : accord de Gary pour tester les leads en production

### Formulaire "Contactez Gary" / API Leads
- **En attente de l'accord de Gary** pour faire des tests en production
- Vérifier que les leads arrivent correctement dans Realforce
- Tester les différents formulaires (contact, estimation, vente)
- Valider le honeypot anti-spam
- Vérifier les messages d'erreur en cas de problème API

### Page "Qui est Gary" (À propos)
- Retravailler entièrement la page, le rendu actuel n'est pas satisfaisant

### Mentions légales + Politique de confidentialité
- Créer la page mentions légales
- Créer la page politique de confidentialité
- Ajouter les liens dans le footer

### Cookies
- Vérifier quels cookies sont utilisés par le site
- Déterminer si un bandeau cookies est nécessaire (RGPD)
- À clarifier : qui est responsable de cette partie

### Intégration Instagram
- Afficher les vidéos Instagram de Gary en bas de certaines pages
- Intégrer le feed ou des posts spécifiques

### Avis Google
- Relier les avis Google en direct sur le site
- Afficher les avis de manière dynamique
