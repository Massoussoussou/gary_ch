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

---

### Header desktop
- Mieux centrer les boutons de navigation, le logo Gary et le bouton "Contactez Gary"
- Revoir l'alignement et l'espacement global du header sur grand écran

### Vidéos hero
- Remplacer par de vraies vidéos optimisées
- Travailler la compression, le lazy loading et les formats (WebM/MP4)

### Nettoyage du code / organisation des composants
- Ranger les composants correctement dans les bons dossiers
- Alléger les pages qui contiennent trop de lignes de code (extraire en sous-composants)
- Nettoyer le fichier CSS (règles dupliquées/empilées, réduire la taille)
- Améliorer la lisibilité du code pour qu'il soit maintenable par n'importe qui

### Performances du site
- Audit général des performances (Lighthouse, bundle size)
- Optimiser le CSS, les images, les vidéos
- Vérifier le lazy loading des ressources lourdes

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

### Page Estimer
- Rendre la page plus solide et professionnelle
- Implémenter une vraie fonctionnalité d'envoi des infos (leads)
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

### Menu hamburger (mobile)
- Corriger le doublon du bouton "Actualités" dans le menu
