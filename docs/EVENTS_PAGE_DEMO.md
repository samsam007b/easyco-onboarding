# 🎉 Events Page - Demo Guide

**Statut** : ✅ Implémenté avec mock data
**URL** : http://localhost:3000/hub/events
**Fichiers créés** : 5 nouveaux fichiers

---

## 📁 Fichiers Créés

### 1. **Mock Data** - [`lib/mock-data/events.ts`](../lib/mock-data/events.ts)

✅ **10 événements mock variés** :
1. **Brussels Jazz Marathon** - Festival gratuit (Public)
2. **Escape Room** - Activité payante avec promo -20% (Public + Partnership)
3. **Expo Van Gogh Immersive** - Musée avec promo -15% (Public + Partnership)
4. **Pizza Party** - Soirée co-living (Property Event)
5. **Running Session** - Sport gratuit outdoor (Public)
6. **After-Work Networking** - Bar avec Happy Hour (Public + Partnership)
7. **Yoga au Lever du Soleil** - Wellness gratuit (Public)
8. **Cinéma en Plein Air** - Film culte gratuit (Public)
9. **Brussels Food Tour** - Tour culinaire payant avec promo (Public + Partnership)
10. **Izzico Community Meetup** - Networking exclusif (Community Event)

✅ **10 catégories** : Festivals, Musées, Sports, Soirées, Food, Gaming, Outdoor, Culture, Wellness, Networking

### 2. **Page Principale** - [`app/hub/events/discover/page.tsx`](../app/hub/events/discover/page.tsx)

✅ **Fonctionnalités implémentées** :

#### **A. Barre de Recherche**
- Recherche full-text dans titre, description, ville, tags
- Placeholder : "Rechercher un événement, une activité..."
- Icon Search à gauche

#### **B. Filtres Avancés**
- **Panneau dépliable** avec bouton "Filtres" + compteur de filtres actifs
- **Catégories** : 10 badges cliquables avec couleurs spécifiques
- **Prix** : Tous / Gratuit / Payant
- **Période** : Tous / Aujourd'hui / Cette semaine / Ce mois
- Bouton "Réinitialiser" pour clear tous les filtres

#### **C. Section Recommandations**
- Affichée uniquement quand aucun filtre actif
- Titre avec icône ✨ "Recommandé pour toi"
- 3 événements sélectionnés : Jazz Marathon, Yoga, Izzico Meetup
- Cards format `default` (grande taille)

#### **D. Tous les Événements**
- Tri par date (affichage chronologique)
- 3 vues différentes :
  - **Grille** (3 colonnes) - par défaut
  - **Liste** (compact horizontal)
  - **Timeline** (groupé par jour avec date visuelle)

#### **E. Vue Timeline** (Unique !)
- Events groupés par date
- Badge date coloré (jour + mois)
- Affichage chronologique très clair
- Cards compact avec toutes les infos

### 3. **EventCard Component** - [`components/events/EventCard.tsx`](../components/events/EventCard.tsx)

✅ **3 variants** :
- `default` : Full card avec image, description, boutons actions
- `compact` : Layout horizontal pour listes
- `featured` : Avec badge "Featured" et ring

✅ **Features** :
- Image cover (ou placeholder si pas d'image)
- Badges : Featured / Co-living / Gratuit ou Prix
- Catégorie avec couleur custom
- Date + Heure + Lieu
- Promo code (pour events partenaires)
- Nombre de participants (going + interested)
- Avatars des colocataires qui y vont
- 2 boutons actions : "M'intéresse" ❤️ / "J'y vais" ✓
- Bouton "Voir détails" pour events avec lien externe

✅ **Couleurs dynamiques** par rôle :
- **Resident** : Orange (#e05747 → #ff7c10 → #ffa000)
- **Searcher** : Yellow (#ffa000 → #ffb933 → #ffd966)
- **Owner** : Mauve (#9c5698 → #c85570 → #d15659)

✅ **Animations** (Framer Motion) :
- Fade in + slide up au chargement
- Hover : y: -4px
- Transitions smooth 0.2s

### 4. **Header Navigation** - [`components/layout/ModernResidentHeader.tsx`](../components/layout/ModernResidentHeader.tsx)

✅ **Ajout du lien "Events"** :
- Position : Entre "Résidents" et "Tâches"
- Icon : MapPin
- Label : "Events"

### 5. **Redirect Page** - [`app/hub/events/page.tsx`](../app/hub/events/page.tsx)

Redirect automatique vers `/hub/events/discover`

---

## 🎨 Design Highlights

### **Respect du Design System Izzico**

✅ **Typography** :
- Headings : **Nunito** (`font-heading`)
- Body text : **Inter** (`font-sans`)
- Tous les textes utilisent les bonnes classes

✅ **Colors** :
- Gradients rôle-spécifiques partout
- Shadows avec opacité de la couleur primaire (15% → 25% hover)
- Backgrounds pastels (`from-orange-50 to-red-50`)

✅ **Shapes** :
- `rounded-2xl` pour cards
- `rounded-xl` pour badges
- Formes arrondies partout (v3-fun style)

✅ **Voice** (selon guidelines) :
- Tutoiement : "Découvre ta ville", "J'y vais"
- Pas d'emojis dans l'UI (sauf dans le contenu des events)
- Ton casual et friendly

---

## 🚀 Comment Tester

### **1. Démarrer le serveur**

```bash
npm run dev
```

### **2. Navigation**

```
http://localhost:3000/hub/events
→ Redirect automatique vers /hub/events/discover
```

### **3. Tester les Filtres**

#### **Recherche**
- Tape "jazz" → Affiche Brussels Jazz Marathon
- Tape "escape" → Affiche The Mystery House
- Tape "gratuit" → Affiche tous les events gratuits

#### **Catégories**
- Clique "Festivals & Concerts" → Affiche Jazz Marathon
- Clique "Sport & Fitness" → Affiche Running Session + Yoga
- Multi-sélection possible !

#### **Prix**
- "Gratuit uniquement" → 6 events (jazz, pizza, running, yoga, cinéma, meetup)
- "Payant" → 4 events (escape, expo, food tour, +1)

#### **Période**
- "Cette semaine" → Events dans les 7 prochains jours
- "Ce mois" → Events dans les 30 prochains jours

### **4. Tester les Vues**

#### **Grille** (défaut)
- 3 colonnes sur desktop
- Cards grande taille avec images

#### **Liste**
- 1 colonne, cards compact
- Layout horizontal (image à gauche)

#### **Timeline** ⭐
- Events groupés par date
- Badge date visuel (jour + mois)
- Très lisible pour voir planning semaine

### **5. Tester les Interactions**

#### **RSVP**
- Clique "M'intéresse" → Badge devient orange, icône heart se remplit
- Clique "J'y vais" → Badge orange, texte change
- Clique à nouveau → Retour à l'état initial

#### **Navigation**
- Clique sur une card → (Prévu : ouvre page détail event)
- Pour l'instant : `onClick` est défini mais pas de page détail encore

---

## 📊 Events Mock - Détails

### **Diversité des Activités**

| Catégorie | Event | Prix | Type | Highlights |
|-----------|-------|------|------|------------|
| **Festivals** | Jazz Marathon | Gratuit | Public | Featured, 500 concerts, 127 going |
| **Gaming** | Escape Room | €20-25 | Public + Partner | -20% promo IZZICO20 |
| **Musées** | Expo Van Gogh | €15-22 | Public + Partner | -15% promo, 4.7★ (156 avis) |
| **Food** | Pizza Party | Gratuit | Property | 8 participants, co-living only |
| **Sports** | Running | Gratuit | Public | Morning 7h30, outdoor |
| **Nightlife** | After-Work | Gratuit | Public + Partner | Happy Hour -30% |
| **Wellness** | Yoga | Gratuit | Public | Morning 7h00, petit-déj offert |
| **Culture** | Cinéma | Gratuit | Public | Film culte, 178 going |
| **Food** | Food Tour | €45 | Public + Partner | €10 off avec IZZICO10, 4.9★ |
| **Networking** | Izzico Meetup | Gratuit | Community | Exclusif membres, 94 going |

### **Mix Parfait**
- ✅ **60% gratuit** (6/10 events)
- ✅ **40% payant** avec promos partenaires
- ✅ **50% partenariats** (potentiel monétisation)
- ✅ **10% property events** (team building co-living)
- ✅ **10% community events** (branding Izzico)

### **Timing Réaliste**
- Events espacés entre le 15/01 et le 24/01
- Mix morning (yoga, running), afternoon (food tour), evening (cinéma, networking)
- Weekdays + weekends

---

## 🎯 Prochaines Étapes

### **Phase 2 - Pages Manquantes**

1. **Page Détail Event** (`/hub/events/[id]/page.tsx`)
   - Full description
   - Map intégrée (Google Maps ou Mapbox)
   - Liste complète des participants
   - Reviews section
   - Bouton "Inviter des colocataires"
   - Bouton "Partager" (WhatsApp, Instagram Stories)

2. **Page "Mes Events"** (`/hub/events/my-events/page.tsx`)
   - Onglets : "J'y vais" / "Intéressé" / "Passés"
   - Calendar widget
   - Export to Google Calendar / iCal

3. **Page "Créer un Event"** (`/hub/events/create/page.tsx`)
   - Form pour property events
   - Upload image
   - Date/time picker
   - Invite property members

4. **Page "Events Co-living"** (`/hub/events/property-events/page.tsx`)
   - Events de la property uniquement
   - Historique
   - Stats participation

### **Phase 3 - Features Avancées**

- [ ] Connexion API Eventbrite (events publics)
- [ ] Map view (tous les events sur carte)
- [ ] Notifications (nouvel event près de toi)
- [ ] Weekly digest email
- [ ] Système Izzico Miles (gamification)
- [ ] Reviews & ratings
- [ ] Invitations entre users

---

## 🎨 Screenshots Attendus

### **Vue Grille** (Desktop)
```
┌─────────────────────────────────────────────────┐
│ 🎉 Découvre ta ville avec Izzico               │
│ 10 événements à venir près de chez toi         │
│                                                  │
│ [🔍 Rechercher...]                              │
│ [Filtres] [Gratuit] [Cette semaine]            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ✨ Recommandé pour toi                          │
│                                                  │
│ [Jazz Marathon] [Yoga Sunrise] [Izzico Meetup] │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ 📅 Tous les événements                          │
│                                                  │
│ [Event 1]  [Event 2]  [Event 3]                │
│ [Event 4]  [Event 5]  [Event 6]                │
│ [Event 7]  [Event 8]  [Event 9]                │
└─────────────────────────────────────────────────┘
```

### **Vue Timeline** (Unique Feature !)
```
┌─────────────────────────────────────────────────┐
│ ┌────┐                                          │
│ │ 15 │ Mercredi                                 │
│ │Jan │ 2 événements                             │
│ └────┘                                          │
│        ┌──────────────────────────────────────┐│
│        │ [img] Escape Room - 18h00           ││
│        └──────────────────────────────────────┘│
│        ┌──────────────────────────────────────┐│
│        │ [img] Running Session - 7h30        ││
│        └──────────────────────────────────────┘│
│                                                  │
│ ┌────┐                                          │
│ │ 16 │ Jeudi                                    │
│ │Jan │ 1 événement                              │
│ └────┘                                          │
│        ┌──────────────────────────────────────┐│
│        │ [img] After-Work Networking - 18h30 ││
│        └──────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

---

## ✅ Checklist Implémentation

- [x] Mock data (10 events + 10 catégories)
- [x] Page discover avec routing
- [x] Barre de recherche full-text
- [x] Filtres avancés (catégories, prix, période)
- [x] Section recommandations
- [x] 3 vues (grille, liste, timeline)
- [x] EventCard component (3 variants)
- [x] RSVP system (mock state)
- [x] Couleurs rôle-spécifiques
- [x] Animations Framer Motion
- [x] Typography Izzico (Nunito + Inter)
- [x] Link dans header navigation
- [ ] Page détail event
- [ ] Page mes events
- [ ] Page créer event
- [ ] Intégration base de données (Supabase)
- [ ] API routes
- [ ] Notifications
- [ ] Système de reviews

---

**🚀 La page est prête à tester !** Ouvre http://localhost:3000/hub/events et explore toutes les fonctionnalités. La timeline view est particulièrement réussie pour visualiser le planning !
