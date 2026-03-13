# Migration Next.js — Plan detaille

> Document de reference pour la migration du site GARY de React + Vite vers Next.js.
> Derniere mise a jour : 13 mars 2026

---

## 1. Pourquoi migrer vers Next.js ?

### Le probleme actuel

Le site GARY tourne sur **React + Vite** en mode SPA (Single Page Application). Concretement, quand un utilisateur ou Google accede a une page :

1. Le serveur envoie un fichier HTML **vide** (juste `<div id="root"></div>`)
2. Le navigateur telecharge tout le JavaScript (~595 kB)
3. Le JS s'execute et **genere** le contenu de la page

Cela pose 3 problemes :

| Probleme | Impact |
|----------|--------|
| **SEO limite** | Google doit executer le JS pour voir le contenu. C'est plus lent et moins fiable que du HTML natif. Les titres, descriptions et contenus des annonces ne sont pas immediatement visibles. |
| **Performance** | L'utilisateur voit un ecran blanc le temps que le JS charge et s'execute. Sur mobile avec une connexion moyenne, ca peut prendre plusieurs secondes. |
| **Version anglaise impossible proprement** | Le routing multilingue (fr/en) necessite une gestion serveur pour les redirections, les balises `hreflang`, et le sitemap. En SPA c'est du bricolage. |

### Ce que Next.js resout

| Avantage | Detail |
|----------|--------|
| **SSR / SSG** | Le HTML est genere cote serveur. Google recoit une page complete immediatement. L'utilisateur voit le contenu sans attendre le JS. |
| **i18n natif** | Routing multilingue integre : `/acheter` (FR) et `/en/buy` (EN) avec un fichier de config. Balises `hreflang` automatiques. |
| **Optimisation images** | Le composant `next/image` gere automatiquement le lazy loading, le redimensionnement, et les formats modernes (WebP/AVIF). |
| **Code splitting automatique** | Chaque page ne charge que le JS dont elle a besoin, au lieu de tout charger d'un coup. |
| **API routes identiques** | Les fonctions `/api/` restent quasi identiques. On est deja sur Vercel, zero config supplementaire. |

### En resume

Le site reste **visuellement identique**. Meme design, memes animations, memes fonctionnalites. Ce qui change c'est le moteur sous le capot : plus rapide, mieux reference, pret pour le multilingue.

---

## 2. Etat actuel du site (ce qu'on a)

### Stack actuelle
- **React 18** + **Vite 5** + **Tailwind CSS 3**
- **React Router v6** (routing client-side)
- **Framer Motion** (animations)
- **Lenis** (smooth scroll)
- **OGL** (WebGL pour la galerie 3D)
- **9 API routes** serverless sur Vercel (`/api/`)
- **17 pages**, **76 composants**, **7 hooks**

### Chiffres cles

| Element | Quantite | Commentaire |
|---------|----------|-------------|
| Pages | 17 | 5 avec routes dynamiques (`:id`, `:slug`) |
| Composants | 76 | Dont 5 > 500 lignes |
| Hooks | 7 | Data fetching, SMS, animations |
| API routes | 9 | Properties, leads, promotions, labels, SMS, ebook |
| CSS | ~2750 lignes | 3 fichiers + Tailwind |
| Assets statiques | ~240 MB | Dont 1 video hero de 87 MB |
| References `window`/`document` | 70+ | Incompatibles SSR, a wrapper |

---

## 3. Ce qui doit changer concretement

### 3.1 Structure des fichiers

**Avant (Vite) :**
```
src/
  pages/
    Home.jsx
    Listings.jsx
    ListingDetail.jsx
    ...
  components/
  hooks/
  App.jsx          ← routing React Router
  main.jsx         ← point d'entree
index.html         ← HTML statique
vite.config.js
```

**Apres (Next.js) :**
```
app/
  layout.jsx         ← layout global (Header, Footer, providers)
  page.jsx           ← Home (/)
  acheter/
    page.jsx         ← BuyIntro (/acheter)
  annonce/
    [id]/
      page.jsx       ← ListingDetail (/annonce/:id)
  vendre/
    page.jsx         ← Sell (/vendre)
  estimer/
    page.jsx         ← EstimationLanding (/estimer)
  a-propos/
    page.jsx         ← About (/a-propos)
  contact/
    page.jsx         ← Contact (/contact)
  projets-neufs/
    page.jsx         ← ProjetsNeufs (/projets-neufs)
    [id]/
      page.jsx       ← ProjetNeufDetail (/projets-neufs/:id)
  actualites/
    page.jsx         ← Actualite (/actualites)
    [id]/
      page.jsx       ← ActualiteDetail (/actualites/:id)
  equipe/
    [slug]/
      page.jsx       ← TeamMemberDetail (/equipe/:slug)
  presse/
    page.jsx
  ressources/
    page.jsx
  not-found.jsx      ← page 404
components/          ← reste identique
hooks/               ← reste identique (avec adaptations)
api/                 ← reste dans /api ou /app/api
public/              ← reste identique
next.config.js       ← remplace vite.config.js
```

### 3.2 Composants : `"use client"`

Next.js distingue deux types de composants :
- **Server Components** (par defaut) : rendus cote serveur, pas d'acces a `window`, `useState`, `useEffect`, etc.
- **Client Components** : marquees avec `"use client"` en premiere ligne, fonctionnent comme du React classique.

**Ce qui devient `"use client"` :**
- Tous les composants avec `useState`, `useEffect`, `useCallback`
- Tous les composants avec animations (Framer Motion)
- Tous les composants qui accedent a `window`, `document`, `localStorage`
- En pratique : **~50 composants sur 76**

**Ce qui peut rester Server Component :**
- Les pages qui font juste du layout et passent des props
- Les composants purement visuels sans interactivite

### 3.3 Compatibilite SSR (70+ corrections)

Chaque acces a `window` ou `document` doit etre protege :

```jsx
// AVANT (crash en SSR)
const isMobile = window.innerWidth < 768;

// APRES
const [isMobile, setIsMobile] = useState(false);
useEffect(() => {
  setIsMobile(window.innerWidth < 768);
}, []);
```

**Zones les plus impactees :**
| Fichier | Refs browser | Difficulte |
|---------|-------------|------------|
| About.jsx (1776 lignes) | requestAnimationFrame, scroll, DOM | Elevee |
| CircularGallery.jsx (488 lignes) | WebGL, canvas, classe React | Elevee |
| FiltersBar.jsx (1189 lignes) | Event listeners multiples | Moyenne |
| Header.jsx (393 lignes) | Scroll, matchMedia | Moyenne |
| DrawerNav.jsx (298 lignes) | body.overflow, matchMedia | Moyenne |
| ListingCard.jsx (516 lignes) | Interval, hover detection | Faible |

### 3.4 Data fetching

**Avant :** hooks custom avec `fetch` dans `useEffect` + cache module-level
**Apres :** plusieurs options

- **Option A (recommandee) :** Garder les hooks `"use client"` tels quels pour le moment, ca fonctionne.
- **Option B (optimale a terme) :** Migrer vers les Server Components avec `fetch` natif Next.js (cache HTTP integre) ou utiliser TanStack Query / SWR.

Pour la migration initiale, on garde l'Option A. On optimisera apres.

### 3.5 API routes

Changements minimes :

```js
// AVANT (Vercel serverless)
export default async function handler(req, res) {
  res.status(200).json({ data });
}

// APRES (Next.js Route Handlers)
export async function GET(request) {
  return Response.json({ data });
}
```

La logique interne (Realforce API, cache, rate limiting) reste identique.

### 3.6 Ce qui ne change PAS

- Design / UI / CSS / Tailwind
- Animations Framer Motion (juste `"use client"`)
- Assets statiques (`/public/`)
- Variables d'environnement serveur (pas de prefix `VITE_` utilise)
- Deploiement Vercel (detection automatique Next.js)

---

## 4. Methodologie de migration

### Principe : supervision + agents specialises

La migration sera executee par **Claude Code** en mode superviseur + sous-agents autonomes.

#### Comment ca fonctionne

```
  Claude Code (superviseur)
       |
       |── Definit les patterns et les regles
       |── Execute le setup initial (Phase 1)
       |── Verifie chaque livraison d'agent
       |── Corrige les incoherences
       |── Execute l'integration finale (Phase 3)
       |
       |── Agent 1 ── migre Page X ──┐
       |── Agent 2 ── migre Page Y ──|── en parallele
       |── Agent 3 ── migre Page Z ──┘
       |── Agent 4 ── migre Composants A, B, C
       ...
```

**Pourquoi cette methode :**
- Les sous-agents travaillent en **parallele** sur des fichiers independants = plus rapide
- Le superviseur garde un **contexte leger** = moins de risque d'erreur
- Chaque agent recoit les **patterns etablis** en Phase 1 comme reference = coherence

#### Fonctionnement d'un sous-agent

1. Le superviseur decrit la tache precise (ex: "migre ListingDetail.jsx en suivant ce pattern")
2. L'agent recoit le pattern de reference + les regles + le contexte necessaire
3. L'agent travaille de facon autonome (lit le code, cree/modifie les fichiers)
4. L'agent retourne son resultat
5. Le superviseur verifie, corrige si besoin, et integre

---

## 5. Les 3 phases de migration

### Phase 1 — Fondations (superviseur direct)

Le superviseur fait tout lui-meme car c'est la base sur laquelle tout repose.

**Taches :**
- [ ] Installer Next.js, adapter `package.json`, `next.config.js`
- [ ] Configurer Tailwind + PostCSS pour Next.js
- [ ] Creer le layout global (`app/layout.jsx`) : Header, Footer, meta tags, fonts
- [ ] Configurer Lenis (smooth scroll) en tant que client provider
- [ ] Migrer le PasswordGate vers un middleware Next.js
- [ ] Migrer 2-3 pages simples (Home, Presse, Ressources) pour etablir le **pattern de reference**
- [ ] Migrer les API routes (`/api/`) vers le format Next.js
- [ ] Verifier que le build passe et que les pages de reference fonctionnent

**Livrable :** un pattern de migration documente + un site qui tourne avec 2-3 pages.

### Phase 2 — Volume (sous-agents en parallele)

Le gros du travail : migrer les pages et composants restants.

**Lots d'agents :**

| Agent | Tache | Fichiers |
|-------|-------|----------|
| Agent A | Pages statiques | Sell, Contact, Estimate, About |
| Agent B | Pages listings | BuyIntro, Listings + FiltersBar |
| Agent C | Pages dynamiques | ListingDetail, ProjetNeufDetail, ActualiteDetail, TeamMemberDetail |
| Agent D | Pages projets/actus | ProjetsNeufs, Actualite |
| Agent E | Composants partages | Cards, CTA, Brand, Common |
| Agent F | Hooks + data fetching | useProperties, usePromotions, useSendLead, etc. |
| Agent G | Compatibilite SSR | Wrapper les 70+ refs window/document sur tout le code |

Chaque agent recoit :
- Le pattern de reference de Phase 1
- La liste precise des fichiers a migrer
- Les regles de `"use client"`, SSR, naming

Le superviseur review chaque lot avant de passer au suivant.

### Phase 3 — Integration et verification (superviseur direct)

**Taches :**
- [ ] Verifier la coherence globale (imports, routing, layouts)
- [ ] Corriger les conflits et incoherences entre agents
- [ ] Tester chaque page : navigation, animations, formulaires, galerie WebGL
- [ ] Lancer un build production (`next build`) et corriger les erreurs
- [ ] Comparer visuellement avec le site actuel (aucune difference attendue)
- [ ] Audit Lighthouse sur le nouveau build
- [ ] Nettoyer les fichiers Vite inutiles (`vite.config.js`, `index.html`, `main.jsx`)

**Livrable :** site fonctionnel sur Next.js, pret a deployer.

---

## 6. Gestion du risque

| Risque | Mitigation |
|--------|------------|
| Regression visuelle | Migration sur branche isolee `feature/nextjs-migration`, site actuel inchange |
| Bug en production | Branche pas mergee tant que tout n'est pas valide. Vercel permet le rollback en 1 clic |
| Perte de fonctionnalite | Test page par page avant merge. Checklist de verification |
| Conflit avec travail en cours | Branche independante, merge a la fin quand tout est stable |
| Composant incompatible SSR | Fallback `"use client"` + dynamic import `{ ssr: false }` pour les cas extremes (WebGL) |

---

## 7. Apres la migration : version anglaise

Une fois sur Next.js, la version anglaise se met en place facilement :

### Configuration i18n (next.config.js)
```js
module.exports = {
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
  },
};
```

### Fichiers de traduction
```
locales/
  fr.json    ← { "buy.title": "Acheter", "sell.title": "Vendre", ... }
  en.json    ← { "buy.title": "Buy", "sell.title": "Sell", ... }
```

### Routing automatique
- `gary.ch/acheter` → version francaise
- `gary.ch/en/acheter` → version anglaise
- Balises `hreflang` generees automatiquement
- Sitemap multilingue

### Donnees API
L'API Realforce supporte les locales — il suffira de passer `locale=en` dans les appels pour recuperer les descriptions en anglais (a confirmer avec la doc Realforce).

---

## 8. Estimation du scope

| Element | Quantite | Action |
|---------|----------|--------|
| Setup Next.js | 1 | Config, layout, providers |
| Pages a migrer | 17 | Restructurer en App Router |
| Composants a marquer `"use client"` | ~50 | Ajouter la directive |
| Refs browser a wrapper | 70+ | Protection SSR |
| API routes a adapter | 9 | Nouveau format Response |
| Hooks a adapter | 7 | Context ou garder tel quel |
| CSS a adapter | 0 | Compatible tel quel |
| Tests a executer | 17 | 1 par page minimum |

---

*Document redige le 13 mars 2026 — GARY Real Estate*
