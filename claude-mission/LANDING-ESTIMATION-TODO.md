# Landing Page /estimer — Tâches restantes

> Fichier de suivi pour la page d'estimation. On décortique chaque tâche une par une.
> Dernière mise à jour : 18 février 2026

---

## LÉGENDE

- 🔴 **CRITIQUE** — La page ne fonctionne pas correctement sans ça
- 🟠 **IMPORTANT** — Nécessaire avant la mise en production Google Ads
- 🟡 **AMÉLIORATION** — Pas bloquant mais améliore l'expérience
- 🟢 **BONUS** — Nice to have, peut attendre

---

## 🔴 CRITIQUE — À faire en premier

### 1. Tester l'envoi de lead vers Realforce
**Quoi :** Quand quelqu'un remplit le formulaire et clique "Recevoir mon estimation gratuite", les données sont envoyées à l'API Realforce via `/api/leads`. Il faut vérifier que le lead arrive bien dans le back-office Realforce.

**Comment tester :**
- Remplir le formulaire avec de vraies données (ton nom, ton tel)
- Soumettre
- Aller vérifier dans le dashboard Realforce si le lead est apparu
- Vérifier le contenu du message (type de bien, adresse, etc.)

**Problèmes possibles :**
- Le champ `property_reference: "ESTIMATION-LANDING"` n'existe peut-être pas dans Realforce → le lead pourrait être rejeté
- L'API key n'est peut-être pas configurée en local (fichier `.env.local`)
- Le honeypot pourrait bloquer si mal configuré

**Fichiers concernés :**
- `src/components/landing-estimation/EstimationForm.jsx` (ligne ~80, construction du payload)
- `src/hooks/useSendLead.js` (envoi vers `/api/leads`)
- `api/leads.js` (proxy vers Realforce)

**Statut :** ⬜ À tester

---

### 2. Vérifier le `.env.local` en local
**Quoi :** Le fichier `.env.local` doit contenir les clés API Realforce pour que les leads fonctionnent.

**Vérifier que ces variables existent :**
```
REALFORCE_PUBLIC_API_KEY=...
REALFORCE_PUBLIC_BASE_URL=https://listings.realforce.ch
REALFORCE_LEADS_BASE_URL=https://leads.realforce.ch
```

**Si le fichier n'existe pas ou est incomplet :** demander les clés à Gary ou les récupérer depuis le dashboard Vercel (Settings > Environment Variables).

**Statut :** ⬜ À vérifier

---

### 3. Vérifier le déploiement Vercel
**Quoi :** La page doit fonctionner sur l'URL de production/preview Vercel, pas seulement en local.

**À vérifier :**
- Pusher le code sur ta branche
- Vérifier que Vercel déploie automatiquement
- Tester `/estimer` sur l'URL Vercel
- Vérifier que le formulaire soumet bien (les API functions doivent marcher sur Vercel)

**Statut :** ⬜ À faire après le push

---

## 🟠 IMPORTANT — Avant la mise en prod Google Ads

### 4. Lien Calendly réel
**Quoi :** Sur la page de confirmation, le bouton "Choisir un créneau" pointe vers `https://calendly.com/gary-immobilier`. C'est un placeholder.

**Ce qu'il faut :**
- Demander à Gary son vrai lien Calendly (ex: `https://calendly.com/gary-geneve/estimation-30min`)
- Si Gary n'a pas de Calendly, en créer un ou retirer le bouton

**Fichier à modifier :**
- `src/components/landing-estimation/ConfirmationPage.jsx` (ligne 92, `href="https://calendly.com/gary-immobilier"`)

**Statut :** ⬜ En attente de Gary

---

### 5. Google Tag Manager (GTM)
**Quoi :** Les événements GTM sont déjà codés dans la page (dataLayer.push). Mais le script GTM lui-même n'est pas chargé. Sans ça, Google Ads ne peut pas tracker les conversions.

**Ce qu'il faut :**
1. Créer un compte GTM (https://tagmanager.google.com) ou récupérer l'ID container existant de Gary (format: `GTM-XXXXXXX`)
2. Ajouter le snippet GTM dans `index.html` (dans le `<head>`)
3. Dans GTM, créer les tags de conversion Google Ads qui écoutent les événements :
   - `form_submit` → conversion principale
   - `form_step_complete` → micro-conversions
   - `calendly_click`, `phone_click` → conversions secondaires

**Ce qui est déjà prêt côté code :**
- Tous les `window.dataLayer.push()` sont en place
- Les UTM params sont capturés et envoyés avec le lead

**Statut :** ⬜ En attente de l'ID GTM

---

### 6. Vérification SMS — Décider si on l'active ou pas
**Quoi :** Le bouton "Vérifier" existe sur le champ téléphone. Actuellement c'est un stub (simulation). La soumission du formulaire fonctionne SANS vérification SMS.

**Options :**
- **Option A — Garder en simulation** : le bouton "Vérifier" est là mais pas obligatoire. Les gens peuvent soumettre sans vérifier. C'est l'état actuel.
- **Option B — Activer avec Twilio** : coût ~0.07 CHF/SMS. Nécessite un compte Twilio + stockage temporaire des codes.
- **Option C — Retirer le bouton** : simplifier le formulaire, pas de vérification.

**Si on choisit l'option B (Twilio), il faut :**
1. Créer un compte Twilio (https://twilio.com)
2. Acheter un numéro suisse ou utiliser un sender ID
3. Récupérer les credentials : `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
4. Les ajouter dans les variables d'environnement Vercel
5. Mettre en place un stockage temporaire pour les codes (Vercel KV ou Upstash Redis)
6. Modifier `api/sms-send.js` et `api/sms-verify.js`

**Coût estimé :** ~5-20 CHF/mois selon le volume de leads

**Statut :** ⬜ Décision à prendre

---

### 7. Envoi d'email — Notification + eBook
**Quoi :** Deux fonctionnalités email sont prévues :
1. **Notification à gary@gary.ch** quand un lead arrive (en plus de Realforce)
2. **Envoi de l'eBook** quand quelqu'un clique "Recevoir le guide par email"

**Service recommandé : Resend** (https://resend.com)
- Gratuit jusqu'à 3 000 emails/mois
- Simple à configurer
- Supporte les pièces jointes (pour l'eBook PDF)

**Ce qu'il faut :**
1. Créer un compte Resend
2. Configurer le domaine `gary.ch` (ajouter des records DNS pour le domaine d'envoi)
3. Récupérer la clé API : `RESEND_API_KEY`
4. L'ajouter dans les variables d'environnement Vercel
5. Modifier `api/ebook-send.js` pour envoyer le PDF
6. Ajouter un appel de notification dans `api/leads.js` (ou créer un nouveau endpoint)

**Prérequis :**
- Avoir le fichier PDF de l'eBook (à créer ou récupérer auprès de Gary)
- Avoir accès au DNS de gary.ch pour configurer le domaine d'envoi

**Statut :** ⬜ En attente

---

### 8. Test responsive mobile complet
**Quoi :** Vérifier visuellement que la page est bien sur mobile (< 900px).

**Points à vérifier :**
- [ ] Hero : titre lisible, formulaire en dessous du texte
- [ ] Formulaire : inputs pleine largeur, toggle en colonne
- [ ] Nav : logo + bouton CTA, pas de numéro de tel
- [ ] Sections : cartes en 1 colonne
- [ ] Confirmation : timeline verticale, bouton Calendly pleine largeur
- [ ] CTA sticky : visible quand on scroll après le formulaire
- [ ] Modal eBook : bien centrée, scrollable si nécessaire

**Comment tester :**
- Chrome DevTools → mode responsive (Ctrl+Shift+I → icône mobile)
- Tester sur 375px (iPhone SE), 390px (iPhone 14), 768px (tablette)

**Statut :** ⬜ À faire

---

## 🟡 AMÉLIORATION — Après la mise en prod

### 9. Améliorer le message d'erreur du formulaire
**Quoi :** Actuellement si l'API Realforce rejette le lead, on affiche "Une erreur est survenue". On pourrait être plus précis.

**Fichier :** `src/components/landing-estimation/EstimationForm.jsx`

**Statut :** ⬜ À améliorer

---

### 10. Vrais logos pour les portails immobiliers
**Quoi :** La section "Portails" affiche juste les noms en texte (Homegate, ImmoScout24, etc.). Des vrais logos seraient plus pros.

**Ce qu'il faut :**
- Récupérer les logos SVG ou PNG des portails
- Les intégrer dans `PortalsSection.jsx`

**Fichier :** `src/components/landing-estimation/PortalsSection.jsx`

**Statut :** ⬜ À faire

---

### 11. SEO — Meta tags
**Quoi :** La page `/estimer` devrait avoir ses propres meta tags pour le SEO et le partage sur les réseaux sociaux.

**Ce qu'il faut :**
- Ajouter `react-helmet-async` ou utiliser `document.head` pour injecter les meta OG
- Titre : "Estimation immobilière gratuite à Genève — GARY"
- Description : "Estimez votre bien gratuitement. Méthode exclusive en 3 phases. Résultat sous 48h."
- Image OG : créer une image de partage 1200x630

**Statut :** ⬜ À faire

---

### 12. Accessibilité
**Quoi :** S'assurer que la page est accessible (navigation au clavier, lecteurs d'écran).

**À vérifier :**
- [ ] Tous les inputs ont des labels
- [ ] Les boutons ont des textes lisibles
- [ ] Le contraste des couleurs est suffisant
- [ ] La navigation au Tab fonctionne dans le formulaire
- [ ] Le focus est visible sur les éléments interactifs

**Statut :** ⬜ À vérifier

---

### 13. Animations au scroll
**Quoi :** Les sections apparaissent sans animation. On pourrait ajouter des fade-in au scroll pour un effet plus premium.

**Options :**
- CSS `@keyframes` + `IntersectionObserver` (pas de dépendance)
- Ou utiliser Framer Motion (déjà installé dans le projet)

**Statut :** ⬜ Optionnel

---

### 14. A/B testing du titre hero
**Quoi :** Tester différentes accroches pour optimiser le taux de conversion Google Ads.

**Variantes possibles :**
- "Ne mettez pas votre bien en ligne. Orchestrez sa vente."
- "Votre bien vaut plus que vous ne le pensez."
- "Estimation gratuite sous 48h par un expert de votre quartier."

**Comment :** Via GTM ou un simple paramètre URL (`?variant=b`)

**Statut :** ⬜ Après les premières données Google Ads

---

## 🟢 BONUS — Peut attendre

### 15. Intégration Calendly inline
**Quoi :** Au lieu d'un lien externe, intégrer le widget Calendly directement dans la page de confirmation.

**Statut :** ⬜ Optionnel

---

### 16. Page mentions légales
**Quoi :** Le lien "Mentions légales" dans le footer pointe vers `#`. Il faut créer une vraie page.

**Statut :** ⬜ À faire (pas spécifique à la landing)

---

### 17. Images/vidéo dans le hero
**Quoi :** Ajouter une photo ou vidéo de fond dans la section hero pour un rendu plus premium.

**Statut :** ⬜ Optionnel

---

## ORDRE DE TRAVAIL RECOMMANDÉ

```
1. Vérifier .env.local                    → 5 min
2. Tester le lead en local                → 15 min
3. Test responsive mobile                 → 20 min
4. Push + vérifier sur Vercel             → 15 min
5. Décider SMS (garder/retirer/activer)   → Décision
6. Demander lien Calendly à Gary          → En attente
7. Configurer GTM                         → 30 min (besoin ID)
8. Configurer Resend pour les emails      → 1h (besoin DNS)
9. Améliorations visuelles                → Au fil de l'eau
```
