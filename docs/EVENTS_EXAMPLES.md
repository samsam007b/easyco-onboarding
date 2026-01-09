# 🎨 Events Feature - Visual Examples

Ce document présente des exemples visuels des différents types d'events et leurs cas d'usage.

---

## 📋 Sommaire

1. [Types d'Events](#types-devents)
2. [Cas d'Usage par Persona](#cas-dusage-par-persona)
3. [Exemples de Scénarios](#exemples-de-scénarios)
4. [Partenariats & Monétisation](#partenariats--monétisation)
5. [Features Sociales](#features-sociales)

---

## 1. Types d'Events

### 🌍 Public Events

**Définition** : Events ouverts à tous les utilisateurs Izzico (Residents + Searchers)

**Exemples dans les mocks** :
- Brussels Jazz Marathon (Festival gratuit)
- Escape Room (Activité payante)
- Expo Van Gogh (Musée)
- Running Session (Sport gratuit)
- After-Work Bar (Networking)
- Yoga (Wellness)
- Cinéma Plein Air (Culture)
- Food Tour (Culinaire)

**Sources possibles** :
- APIs externes (Eventbrite, Meetup, OpenAgenda)
- Ajout manuel par admins Izzico
- Partenariats directs

**Visibilité** : Tous les users peuvent voir et RSVP

**Badge UI** : Aucun badge spécial (ou "Public" si on veut clarifier)

---

### 🏠 Property Events

**Définition** : Events créés par/pour les résidents d'un co-living spécifique

**Exemples dans les mocks** :
- Pizza Party - Maison Izzico (Soirée conviviale)

**Autres exemples possibles** :
- BBQ sur la terrasse
- Soirée jeux de société
- Nettoyage collectif de la maison
- Apéro d'accueil pour nouveau résident
- Atelier cuisine collective
- Karaoké night

**Créateurs** :
- N'importe quel résident de la property
- Owner de la property (pour events officiels)

**Visibilité** : Uniquement les membres de la property (RLS policy)

**Badge UI** : Badge "Co-living" 🏠

**Particularité** :
- Champ `max_attendees` (limiter le nombre de participants)
- Affiche les avatars des colocataires qui y vont
- Favorise le team building

---

### 💫 Community Events

**Définition** : Events organisés directement par Izzico pour sa communauté

**Exemples dans les mocks** :
- Izzico Community Meetup (Networking exclusif membres)

**Autres exemples possibles** :
- Soirée de lancement Izzico (nouvelle ville)
- After-Work Izzico (tous les 1ers jeudis du mois)
- Workshop "Comment bien vivre en coloc ?"
- Apéro networking Residents × Searchers
- Concours photo "Ma meilleure expérience co-living"
- Charity event Izzico (course solidaire)

**Créateurs** : Admins Izzico uniquement

**Visibilité** : Tous les membres Izzico d'une ville

**Badge UI** : Badge "Izzico Community" 💫 (ou logo Izzico)

**Objectifs stratégiques** :
- Renforcer la brand identity
- Créer du lien entre utilisateurs
- Générer du contenu (photos, stories Instagram)
- Fidéliser les users

---

## 2. Cas d'Usage par Persona

### 👤 Sarah - Expatriée française à Bruxelles (Searcher)

**Profil** :
- 24 ans, vient d'arriver à Bruxelles pour un stage
- Ne connaît personne dans la ville
- Cherche un logement ET des activités

**Besoin** : Découvrir la ville + se faire des amis

**Events pertinents** :
1. **Brussels Jazz Marathon** (Public, gratuit)
   - Découvrir la ville en musique
   - Ambiance friendly pour expatriés

2. **Izzico Community Meetup** (Community)
   - Rencontrer d'autres nouveaux arrivants
   - Network avec futurs colocataires potentiels

3. **Food Tour** (Public, payant)
   - Découvrir la culture belge
   - Activité guidée (rassurant quand on est seul)

**Parcours dans Izzico** :
```
1. Sarah s'inscrit sur Izzico comme Searcher
2. Elle voit un widget "Events près de chez toi" sur son dashboard
3. Elle clique → découvre le Brussels Jazz Marathon
4. Elle RSVP "J'y vais" → rencontre 3 autres Searchers lors du festival
5. Elle matche avec une property via Izzico
6. Elle devient Resident → continue d'utiliser Events pour socialiser
```

**Impact business** :
- Events = outil d'acquisition (attire Searchers)
- Events = outil de conversion (Searchers → Residents via network)
- Events = outil de rétention (Residents actifs)

---

### 👨 Thomas - Résident depuis 6 mois (Resident)

**Profil** :
- 28 ans, developer, habite dans un co-living de 8 personnes
- A déjà quelques amis à Bruxelles
- Cherche à renforcer les liens avec ses colocataires

**Besoin** : Team building + nouvelles activités

**Events pertinents** :
1. **Pizza Party - Maison Izzico** (Property)
   - Créé par lui-même pour souder le groupe
   - 8 participants confirmés

2. **Escape Room** (Public, partnership)
   - Activité ludique à faire avec colocataires
   - Promo -20% avec code IZZICO → accessible

3. **Running Session** (Public, gratuit)
   - Sport matinal avant le boulot
   - Rencontre d'autres runners de la communauté

**Parcours dans Izzico** :
```
1. Thomas voit que 3 colocataires sont intéressés par l'Escape Room
2. Il propose dans le chat de groupe d'y aller ensemble
3. Il crée un Property Event "Soirée Escape Room" pour organiser
4. 6 colocataires confirment → il réserve via le lien affilié Izzico
5. Izzico gagne €12 de commission (6 × €25 × 15% - 20% promo)
6. Thomas gagne 50 Izzico Miles pour avoir créé l'event
```

**Impact business** :
- Events = outil de rétention (residents engagés restent)
- Property Events = création de contenu (photos, stories)
- Affiliations = revenus directs

---

### 🏢 Marie - Propriétaire de 3 co-livings (Owner)

**Profil** :
- 35 ans, gère 3 properties à Bruxelles
- Veut créer une atmosphère communautaire
- Cherche à différencier ses properties

**Besoin** : Animer ses properties + fidéliser residents

**Events pertinents** :
1. **Welcome Drinks** (Property, tous les 1ers du mois)
   - Event récurrent pour accueillir nouveaux arrivants
   - Créé par elle, obligatoire dans ses 3 properties

2. **Izzico Community Meetup** (Community)
   - Y emmène ses residents pour network
   - Valorise le "lifestyle Izzico" auprès de prospects

3. **Food Tour** (Public, partnership)
   - Offre un ticket gratuit au "Resident du mois"
   - Incentive pour bon comportement / engagement

**Parcours dans Izzico** :
```
1. Marie crée un Property Event mensuel "Welcome Drinks"
2. Elle définit max_attendees = 15 (capacité salon)
3. Notification automatique à tous les residents
4. 12 participants confirmés → success rate 80%
5. Elle partage photos sur Instagram → marketing gratuit
6. Nouveaux prospects voient "On organise des events !" → différenciation
```

**Impact business** :
- Events = outil de différenciation pour owners
- Events = marketing organique (UGC sur social media)
- Events = fidélisation residents (moins de turnover)

---

## 3. Exemples de Scénarios

### 📅 Scénario 1 : Weekend d'un Résident

**Vendredi 18h00** - After-Work Networking
```
Type: Public
Lieu: Delirium Café
Prix: Gratuit (Happy Hour)
RSVP: 45 going, dont 2 colocataires

→ Thomas y va avec ses 2 colocataires
→ Ils rencontrent 5 autres users Izzico
→ Network + socialisation
```

**Samedi 10h00** - Yoga au Parc
```
Type: Public
Lieu: Parc Royal
Prix: Gratuit + petit-déj offert
RSVP: 56 going

→ Thomas invite 1 colocataire "intéressé" via l'app
→ Ils y vont ensemble
→ Thomas gagne 20 Izzico Miles (invite confirmée)
```

**Samedi 19h00** - Pizza Party Co-living
```
Type: Property
Lieu: Maison Izzico
Prix: Gratuit
RSVP: 8/8 colocataires

→ Event créé par Thomas
→ Tout le monde participe
→ Photos partagées sur Instagram #IzzicoLiving
```

**Dimanche 20h00** - Cinéma Plein Air
```
Type: Public
Lieu: Place Flagey
Prix: Gratuit
RSVP: 178 going, dont 4 colocataires

→ Toute la coloc y va ensemble
→ Renforcement du lien groupe
→ Expérience mémorable
```

**Résultat** :
- 4 events en 1 weekend
- 100% gratuit
- Mix activités sociales + bien-être + culture
- Engagement maximal avec l'app Izzico

---

### 📅 Scénario 2 : Newcomer Discovery (Searcher)

**Lundi (J+1 inscription)** - Notification Welcome
```
Email: "Hello Sarah ! Découvre 12 events près de chez toi cette semaine"

→ Sarah ouvre l'email
→ Clique sur "Brussels Jazz Marathon"
→ RSVP "Intéressée"
```

**Mercredi** - Recommandation Personnalisée
```
Notif push: "🎉 L'Izzico Community Meetup est dans 3 jours !"

→ Sarah clique
→ Voit que 94 personnes y vont
→ Lit description : "Exclusif membres Izzico"
→ Se sent partie d'une communauté
→ RSVP "J'y vais"
```

**Samedi** - Attendance Jazz Marathon
```
Sarah va au festival (RSVP confirmé)

→ Rencontre 3 autres Searchers Izzico
→ Échange contacts WhatsApp
→ Ils se revoient pour le Food Tour ensemble

→ Sarah laisse un avis 5★ : "Super ambiance !"
→ Gagne 15 Izzico Miles
```

**Dimanche** - Post-Event Email
```
Email: "Comment était le Brussels Jazz Marathon ?"

→ Sarah confirme sa participation
→ Son statut passe "interested" → "attended"
→ Suggestion : "Ces 3 events pourraient te plaire"
```

**Résultat J+7** :
- Sarah a assisté à 2 events
- Rencontré 5 personnes
- Se sent intégrée à Bruxelles
- Toujours active sur Izzico (retention++)
- Proche de matcher avec une property

---

### 📅 Scénario 3 : Monetization via Partnership

**Context** :
Izzico signe un partenariat avec **Escape Hunt Brussels**

**Deal** :
- 15% commission sur chaque réservation via Izzico
- Code promo exclusif : IZZICO20 (-20% pour users)
- Featured placement sur page Events (€100/mois)

**Implémentation dans la DB** :
```sql
INSERT INTO events (
  event_type: 'public',
  title: 'The Mystery House - Escape Room',
  price_min: 20,
  is_partner_event: true,
  partner_name: 'Escape Hunt Brussels',
  promo_code: 'IZZICO20',
  promo_description: '-20% avec le code IZZICO20',
  affiliate_url: 'https://escapehunt.com/brussels?ref=izzico',
  commission_rate: 15.00,
  is_featured: true
)
```

**Mois 1 - Résultats** :
- 150 vues de l'event
- 45 clics sur le lien affilié
- 12 réservations confirmées (conversion 26%)
- 12 × 4 personnes = 48 tickets vendus
- Prix moyen : €22.50 (après -20%)
- Revenue Escape Hunt : 48 × €22.50 = €1,080
- Commission Izzico : €1,080 × 15% = **€162**
- Featured placement : **€100**
- **Total Izzico : €262/mois**

**Win-Win** :
- Escape Hunt : 48 nouveaux clients (acquisition)
- Users Izzico : -20% de réduction
- Izzico : €262 de revenus + contenu pour l'app

**Projection 10 partenaires** :
€262 × 10 = **€2,620/mois** = **€31,440/an**

---

## 4. Partenariats & Monétisation

### 🤝 Types de Partenariats

#### **A. Activités Ludiques**
- Escape Rooms (3-5 à Bruxelles)
- Bowling
- Laser Game
- Karting indoor
- VR Centers

**Commission** : 10-15% par réservation
**Promo user** : -15 à -25%
**Volume** : Groupes de 4-8 personnes (co-livings)

#### **B. Restaurants & Bars**
- Restaurants pour groupes
- Bars avec privatisation
- Brunch spots
- Food trucks

**Commission** : €5/personne OU 10% addition totale
**Promo user** : -10% ou cocktail offert
**Volume** : 20-30 sorties/mois

#### **C. Culture & Loisirs**
- Musées
- Théâtres
- Cinémas
- Expos temporaires

**Commission** : 8-12% par ticket
**Promo user** : -10 à -20%
**Volume** : 50-100 tickets/mois

#### **D. Wellness & Sport**
- Salles de sport (pass découverte)
- Studios yoga
- Spas
- Cours de danse

**Commission** : 15-20% sur abonnements découverte
**Promo user** : 1 mois offert ou -50% premier mois
**Volume** : 10-20 conversions/mois

---

### 💰 Modèles de Revenus

#### **1. Commission Directe**
```
User clique lien affilié Izzico
→ Achète ticket/réservation
→ Partenaire track via URL ou code promo
→ Partenaire verse commission à Izzico

Exemple:
- Food Tour €45
- Commission 12%
- Izzico gagne: €5.40/vente
- 30 ventes/mois = €162
```

#### **2. Featured Placement**
```
Partenaire paye pour être en haut du feed
→ Position "Featured" pendant 1 mois
→ Badge ✨ + Ring coloré
→ 3× plus de visibilité

Prix: €50-200/mois selon taille partenaire
```

#### **3. Push Notifications Ciblées**
```
Partenaire paye pour notif push
→ Envoyée aux users matchés (catégorie + géoloc)
→ 1 notif = €100 (reach ~500 users)
→ 2-3 par mois max (éviter spam)

Exemple:
"🎭 Nouveau : Expo Van Gogh ! -15% avec IZZICO15"
→ Envoyée aux users intéressés par "Culture"
→ Open rate 40% = 200 users
→ Conversion 10% = 20 ventes
→ 20 × €18 × 12% commission = €43.20
→ Total partenaire: €100 (notif) + €43 (commission) = €143
```

#### **4. Email Digest Sponsorisé**
```
Digest hebdomadaire "Events de la semaine"
→ 1 slot sponsorisé en haut
→ €150/semaine = €600/mois

Format:
"🌟 Event sponsorisé : Brussels Food Tour"
[Image + Description + CTA]
```

---

### 📊 Projection Revenus 12 Mois

**Hypothèses** :
- 1000 Residents actifs
- 500 Searchers actifs
- 30% utilisent Events (450 users actifs/mois)

| Source | Calcul | Mois 1-3 | Mois 4-6 | Mois 7-12 |
|--------|--------|----------|----------|-----------|
| **Commissions tickets** | 30% × 1 event × €3 | €200 | €405 | €810 |
| **Commissions activités** | 15% × 1 activité × €10 | €150 | €225 | €450 |
| **Restaurants groupes** | 10 sorties × 8 × €5 | €400 | €600 | €1,200 |
| **Featured placements** | 2 partenaires × €100 | €200 | €500 | €1,000 |
| **Push notifications** | 1/mois × €100 | €100 | €200 | €400 |
| **Email digest** | 1 slot × €150/sem | €0 | €600 | €600 |
| **TOTAL/MOIS** | | **€1,050** | **€2,530** | **€4,460** |

**Total An 1** : €1,050×3 + €2,530×3 + €4,460×6 = **€37,500**

**Projection An 2** (3000 users actifs) : **€120,000**

---

## 5. Features Sociales

### 💬 Invitations Entre Users

**Flow** :
```
1. Sarah voit "Escape Room" et veut inviter Thomas
2. Elle clique "Inviter des amis"
3. Liste des colocataires + contacts Izzico
4. Elle sélectionne Thomas
5. Thomas reçoit notif : "Sarah t'invite à Escape Room"
6. Thomas clique "Accepter"
7. Thomas RSVP automatiquement "Going"
8. Sarah gagne 20 Izzico Miles (invitation acceptée)
```

**Base de données** :
```sql
event_invitations
- invited_by: Sarah
- invited_user_id: Thomas
- event_id: escape-room-evt
- status: accepted
```

---

### 📸 Social Sharing

**Bouton "Partager"** sur chaque event :
- Instagram Stories (template branded Izzico)
- WhatsApp (lien direct event)
- Facebook
- Copy link

**Template Instagram Story** :
```
┌─────────────────────────┐
│  [Photo de l'event]     │
│                         │
│  🎉 Brussels Jazz       │
│  Marathon               │
│                         │
│  Ven 18 Jan • Gratuit   │
│                         │
│  [Logo Izzico]          │
│  izzico.com/events      │
└─────────────────────────┘

Swipe up → Lien event
```

**Impact** :
- Viralité organique
- Acquisition nouveaux users
- Brand awareness

---

### 🏆 Gamification : Izzico Miles

**Actions récompensées** :

| Action | Miles | Explication |
|--------|-------|-------------|
| Créer un Property Event | +50 | Encourage team building |
| Participer à un Public Event | +10 | Encourage découverte ville |
| Inviter colocataire (accepte) | +20 | Viralité interne |
| Laisser un avis après event | +15 | Génère du contenu |
| Participer à 5 events/mois | +100 | Badge "Explorateur" |
| Organiser event avec 10+ participants | +75 | Badge "Organisateur" |
| Participer à Izzico Community Event | +30 | Encourage engagement brand |

**Conversion Miles** :
- 500 Miles = 1 mois Premium gratuit (€9.99 valeur)
- 200 Miles = €10 réduction event partenaire
- 1000 Miles = Invitation VIP Izzico Event
- 2000 Miles = €50 Zalando voucher

**Objectif** : Créer une boucle d'engagement
```
Participe à events
→ Gagne Miles
→ Débloque rewards
→ Reste actif sur Izzico
→ Participe à plus d'events
```

---

### ⭐ Reviews & Ratings

**Après un event** (status = "attended") :
```
Email J+1:
"Comment était le Brussels Jazz Marathon ?"

[⭐⭐⭐⭐⭐] Note l'event
[Textarea] Ajoute un commentaire

[Envoyer] → Gagne 15 Izzico Miles
```

**Modération** :
- Reviews en attente de validation (admin)
- Auto-approval si user a 3+ reviews approuvées
- Signalement possible

**Affichage** :
```
⭐ 4.7/5 (156 avis)

┌─────────────────────────────────┐
│ Sophie • ⭐⭐⭐⭐⭐               │
│ "Super ambiance, je recommande!"│
│ Il y a 2 jours                  │
└─────────────────────────────────┘
```

**Impact** :
- Aide à la décision (social proof)
- Génère du contenu
- Améliore qualité events (feedback loop)

---

## ✨ Conclusion

La feature Events transforme Izzico en **lifestyle platform** :

✅ **Pour les Users** :
- Découverte de la ville simplifiée
- Rencontre d'autres membres communauté
- Réductions exclusives via partenariats
- Team building co-living facilité

✅ **Pour Izzico** :
- Nouvelle revenue stream (€37k An 1)
- Différenciation vs concurrents
- Viralité organique (social sharing)
- Retention++ (users actifs restent)

✅ **Pour les Partenaires** :
- Acquisition clients qualifiés (jeunes, urbains)
- Marketing ciblé (géoloc + catégories)
- Win-win (users ont promos, partenaires ont volume)

**Next Level** : IA pour recommandations ultra-personnalisées basées sur historique + preferences + comportement réseau social (qui y va).
