# MISSION : Intégrer la landing page Estimation GARY

## Objectif
Transformer le prototype HTML fourni (`gary-landing-page.html`) en une page fonctionnelle intégrée à notre stack [Next.js/React/Astro].

## Livrables attendus

### 1. PAGE FRONTEND
- [ ] Créer `/src/pages/estimation.jsx` (ou équivalent selon notre stack)
- [ ] Adapter le HTML fourni en composants React/Astro
- [ ] Conserver TOUT le design et les animations du prototype
- [ ] S'assurer que le responsive fonctionne (mobile/tablet/desktop)
- [ ] Remplacer les placeholders par les vraies valeurs (voir section Contenu ci-dessous)

### 2. BACKEND API

#### Endpoint 1 : Soumission du formulaire
```
POST /api/lead
Body: {
  bienType, pieces, surface, adresse, npa, localite,
  projet, dejaEnVente, dejaEnVenteDetails,
  nom, prenom, telephone, email
}
Response: { success: true, leadId: "..." }
```
**Actions:**
- Valider les données
- Stocker dans la base de données (table `leads`)
- Envoyer email de notification à gary@gary.ch
- Envoyer email de confirmation au prospect

#### Endpoint 2 : Envoi SMS vérification
```
POST /api/sms/send
Body: { phone: "+41799999999" }
Response: { success: true, codeSent: true }
```
**Actions:**
- Générer code 4 chiffres aléatoire
- Stocker dans Redis/DB avec expiration 10min
- Envoyer via Twilio/MessageBird
- Logger l'envoi

#### Endpoint 3 : Vérification SMS
```
POST /api/sms/verify
Body: { phone: "+41799999999", code: "1234" }
Response: { success: true, valid: true/false }
```
**Actions:**
- Vérifier le code stocké
- Invalider après 3 tentatives ratées
- Retourner le statut

#### Endpoint 4 : Envoi eBook
```
POST /api/ebook/send
Body: { email: "prospect@example.com" }
Response: { success: true, sent: true }
```
**Actions:**
- Envoyer le PDF par email via Resend/SendGrid
- Logger l'envoi

### 3. INTÉGRATIONS

#### Google Tag Manager
- Ajouter le snippet GTM dans le <head>
- Configurer les événements de conversion:
  - `form_submit` quand formulaire validé
  - `sms_verified` quand SMS vérifié
  - `calendly_click` quand clic sur "Choisir un créneau"
  - `ebook_request` quand demande eBook
  - `phone_click` quand clic tel

#### Base de données
Créer la table `leads` (Supabase/PostgreSQL):
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Bien
  bien_type VARCHAR(100),
  pieces VARCHAR(50),
  surface VARCHAR(50),
  adresse TEXT,
  npa VARCHAR(10),
  localite VARCHAR(100),
  
  -- Projet
  projet VARCHAR(200),
  deja_en_vente BOOLEAN,
  deja_en_vente_duree VARCHAR(50),
  deja_en_vente_portails TEXT[],
  prix_baisse VARCHAR(50),
  
  -- Contact
  nom VARCHAR(100),
  prenom VARCHAR(100),
  telephone VARCHAR(20),
  email VARCHAR(255),
  
  -- Meta
  utm_source VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_medium VARCHAR(100),
  
  -- Status
  phone_verified BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'nouveau'
);
```

### 4. CONFIGURATION

#### Variables d'environnement (.env)
```bash
# Email
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=gary@gary.ch
EMAIL_NOTIFY=gary@gary.ch

# SMS
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+41xx

# Database
DATABASE_URL=postgresql://...

# GTM
NEXT_PUBLIC_GTM_ID=GTM-XXXXX

# eBook
EBOOK_PDF_URL=https://gary.ch/assets/ebook.pdf
```

### 5. CONTENU À REMPLACER

Dans le HTML fourni, remplacer:

**Liens:**
- Calendly: `https://calendly.com/gary-immobilier` → [demander le vrai lien à Gary]
- Footer "Nos biens": `#` → `https://gary.ch/acheter/`
- Footer "Notre méthode": `#` → [URL à confirmer]
- Footer "Nos courtiers": `#` → [URL à confirmer]
- Footer "Contact": `#` → [URL à confirmer]
- Footer "Mentions légales": `#` → [URL à confirmer]

**Meta tags:**
- OG URL: `https://gary-immobilier.ch/estimation` → [domaine final]
- OG Image: créer une image 1200×630px et l'ajouter

**Témoignages:** (section `.testimonials`)
- Remplacer les 4 témoignages fictifs par de vrais avis clients
- OU supprimer cette section si pas encore de témoignages

**Chiffres:** (section `.trust-numbers`)
- Vérifier/ajuster: "150+ biens vendus", "4.9★ avis Google"
- Mettre les chiffres réels de Gary

## Contraintes techniques

### À RESPECTER ABSOLUMENT
- ✅ Conserver le design exact du prototype HTML
- ✅ Garder toutes les animations CSS
- ✅ Responsive doit fonctionner parfaitement
- ✅ Accessibilité (alt tags, labels, ARIA)
- ✅ Performance (Lighthouse score > 90)

### Sécurité
- Valider TOUS les inputs côté backend
- Sanitizer les données avant stockage
- Rate limiting sur les endpoints SMS (max 3/minute/IP)
- Protection CSRF sur les formulaires

### UX
- Messages d'erreur clairs en français
- Loading states sur tous les boutons
- Feedback immédiat après chaque action
- Pas de reload de page (tout en AJAX)

## Tests à effectuer

- [ ] Formulaire complet sur desktop
- [ ] Formulaire complet sur mobile (iPhone Safari + Android Chrome)
- [ ] Flow SMS complet
- [ ] Envoi emails (lead + confirmation + eBook)
- [ ] Tracking GTM (vérifier dans Google Tag Manager Preview)
- [ ] Autocomplete adresse (teste plusieurs villes suisses)
- [ ] Sticky CTA mobile (scroll behavior)
- [ ] Tous les liens fonctionnent
- [ ] Performance (Lighthouse)

## Ordre de développement recommandé

1. **Setup base** (1h)
   - Créer la page `/estimation`
   - Adapter la structure HTML en composants
   
2. **Formulaire frontend** (2h)
   - Multi-steps avec validation
   - Autocomplete adresse
   - États de chargement
   
3. **Backend API** (4h)
   - Endpoint lead (avec validation)
   - Endpoint SMS send
   - Endpoint SMS verify
   - Endpoint eBook
   
4. **Intégrations** (2h)
   - Setup Twilio/MessageBird
   - Setup Resend/SendGrid
   - Connection base de données
   
5. **Tracking** (1h)
   - GTM snippet
   - Événements de conversion
   
6. **Polish** (2h)
   - Remplacer placeholders
   - Tests sur tous devices
   - Corrections bugs

---

## Questions à clarifier AVANT de commencer

1. Quel service SMS voulez-vous utiliser ? (Twilio / MessageBird / autre)
2. Quel service email ? (Resend / SendGrid / autre)
3. Le PDF eBook est-il prêt ? Où est-il hébergé ?
4. Avez-vous un compte GTM configuré ? Quel est l'ID ?
5. Calendly : quel est le vrai lien de booking ?

---

## Ressources

- Prototype HTML: voir `gary-landing-page.html`
- Checklist Gary: voir `checklist-deploiement.md`
- Contexte projet: voir `PROJECT_CONTEXT.md`
- Code existant: voir dossier `existing-code/`