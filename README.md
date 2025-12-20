# GARY — Maquette (Vite + React + Tailwind)

**DEMO — aucune donnée n’est collectée. Formulaires désactivés.**

## Prérequis
- Node.js LTS (version 18+ ou 20+). Vérifie avec `node -v` et `npm -v`.

## Installer & lancer
```bash
npm install
npm run dev
```
Ouvre ensuite l'URL affichée (souvent `http://localhost:5173`).

## Scripts utiles
- `npm run dev` — démarre le serveur de dev
- `npm run build` — construit le site (dossier `dist/`)
- `npm run preview` — prévisualise le build

## Pages
- Accueil — `/`
- Acheter (liste) — `/acheter`
- Détail — `/annonce/CH-0001`
- Vendre — `/vendre`
- Estimer — `/estimer`
- À propos — `/a-propos`
- Contact (désactivé) — `/contact`

## Notes
- Données de démo : `src/data/listings.json`
- Palette & typos : `tailwind.config.js` + Google Fonts dans `index.html`.
- Aucun cookie/analytics, aucune API.
