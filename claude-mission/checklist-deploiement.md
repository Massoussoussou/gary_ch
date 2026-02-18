# GARY Landing Page Estimation — Checklist déploiement

## 1. BACKEND — À brancher

### Soumission du formulaire
- [ ] Créer un endpoint `POST /api/lead` qui reçoit les données du formulaire (type bien, pièces, surface, adresse, NPA, localité, projet, déjà en vente, nom, prénom, téléphone, email)
- [ ] Remplacer la fonction `showConfirmation()` par un vrai fetch vers cet endpoint avant d'afficher la confirmation
- [ ] Stocker le lead dans Supabase (table `leads`) ou webhook (Zapier/Make) selon l'archi choisie
- [ ] Envoyer une notification email à gary@gary.ch avec les détails du lead

### Vérification SMS
- [ ] Créer `POST /api/sms/send` → reçoit le numéro, génère un code 4 chiffres, envoie le SMS (Twilio, MessageBird, ou autre)
- [ ] Créer `POST /api/sms/verify` → vérifie le code, retourne `{ valid: true/false }`
- [ ] Remplacer les deux blocs `// TODO BACKEND` dans le JS (lignes ~717 et ~766) par les vrais appels fetch
- [ ] Actuellement la simulation accepte tout code à 4 chiffres — à supprimer en prod

### eBook
- [ ] Créer `POST /api/ebook/send` → envoie l'eBook par email au prospect (Resend ou autre)
- [ ] Remplacer le bloc `// TODO BACKEND` dans `confirmEbook()` (ligne ~836)
- [ ] Préparer le PDF de l'eBook


## 2. URLS & LIENS — À mettre à jour

| Élément | Valeur actuelle (placeholder) | Action |
|---------|-------------------------------|--------|
| Calendly | `https://calendly.com/gary-immobilier` | Remplacer par le vrai lien Calendly de l'équipe |
| OG URL | `https://gary-immobilier.ch/estimation` | Remplacer par l'URL finale de la landing page |
| OG Image | `https://gary-immobilier.ch/og-estimation.jpg` | Créer une image 1200×630px et uploader au bon chemin |
| Lien "Nos biens" (footer) | `#` | Pointer vers `https://gary.ch/acheter/` |
| Lien "Notre méthode" (footer) | `#` | Pointer vers la bonne page |
| Lien "Nos courtiers" (footer) | `#` | Pointer vers la bonne page |
| Lien "Contact" (footer) | `#` | Pointer vers la bonne page |
| Lien "Mentions légales" (footer) | `#` | Pointer vers la bonne page |


## 3. TRACKING — À installer

- [ ] Google Tag Manager (GTM) : ajouter le snippet dans le `<head>`
- [ ] Configurer les événements de conversion :
  - `form_submit` → quand le prospect valide le formulaire
  - `sms_verified` → quand le numéro est vérifié
  - `calendly_click` → quand le prospect clique "Choisir un créneau"
  - `ebook_request` → quand le prospect demande l'eBook
  - `phone_click` → quand le prospect clique sur le numéro de téléphone
- [ ] Lier GTM à Google Ads pour le suivi des conversions
- [ ] Optionnel : Meta Pixel si campagnes Instagram prévues


## 4. CONTENU — À personnaliser

### Témoignages (section "Ils ont vendu avec la méthode GARY")
- [ ] Remplacer les 4 témoignages fictifs par de vrais avis clients (ou supprimer la section si pas encore disponible)

### Chiffres
- [ ] Vérifier/ajuster : "150+ biens vendus", "4.9★ avis Google", zones géographiques
- [ ] Mettre les vrais chiffres à jour

### eBook modal
- [ ] Valider les 4 bullet points du contenu de l'eBook
- [ ] Ajuster le texte si le guide couvre d'autres sujets


## 5. TECHNIQUE — Vérifications avant mise en ligne

- [ ] Tester le formulaire complet sur mobile (iPhone Safari + Android Chrome)
- [ ] Tester le sticky CTA mobile (apparaît quand on scrolle, disparaît quand on revient au form)
- [ ] Tester l'autocomplete adresse (Nominatim) — vérifier que NPA + localité se remplissent
- [ ] Tester le flow SMS complet une fois le backend branché
- [ ] Tester le bouton "Copier email" (gary@gary.ch)
- [ ] Tester le `tel:` sur mobile (ouvre le dialer)
- [ ] Vérifier le rendu OG quand le lien est partagé sur WhatsApp / iMessage (après upload de l'OG image)
- [ ] Ajouter un certificat SSL (HTTPS obligatoire)
- [ ] Configurer le domaine final (DNS)


## 6. OPTIONNEL — Quick wins post-lancement

- [ ] Capturer les UTM params (utm_source, utm_campaign, utm_medium) dans des champs cachés pour mesurer le ROI Google Ads par campagne
- [ ] Ajouter le lien Instagram (`instagram.com/gary_realestate`) dans le footer
- [ ] A/B test : tester le titre "Orchestrez sa vente" vs une variante
- [ ] Heatmap (Hotjar gratuit) pour voir où les prospects abandonnent