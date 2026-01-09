# 🎉 Events Feature - README

**Status**: ✅ MVP Implémenté avec Mock Data
**Date**: 2026-01-09
**Version**: 1.0 - Demo

---

## 🚀 Quick Start

```bash
# 1. Installer les dépendances (si pas déjà fait)
npm install

# 2. Lancer le serveur de développement
npm run dev

# 3. Ouvrir dans le navigateur
http://localhost:3000/hub/events
```

**Accès rapide** :
- Page Events : http://localhost:3000/hub/events/discover
- Navigation : Cliquer "Events" dans le header du /hub

---

## 📦 Ce qui a été créé

### **1. Base de Données** (Ready for Production)

| Fichier | Description |
|---------|-------------|
| [`supabase/migrations/120_create_events_system.sql`](supabase/migrations/120_create_events_system.sql) | Migration complète avec 7 tables + RLS + fonctions SQL |

**Tables créées** :
- `event_categories` (10 catégories pré-configurées)
- `events` (public, property, community)
- `event_attendees` (RSVP tracking)
- `event_invitations` (invite friends)
- `event_reviews` (post-event feedback)
- `user_event_preferences` (personalization)
- `event_analytics` (tracking & monetization)

### **2. Mock Data** (Pour Demo)

| Fichier | Description |
|---------|-------------|
| [`lib/mock-data/events.ts`](lib/mock-data/events.ts) | 10 events variés + 10 catégories |

**Events inclus** :
- Brussels Jazz Marathon (Festival gratuit)
- Escape Room (Activité payante, -20% promo)
- Expo Van Gogh (Musée, -15% promo)
- Pizza Party (Co-living team building)
- Running Session (Sport gratuit)
- After-Work Bar (Networking)
- Yoga Sunrise (Wellness gratuit)
- Cinéma Plein Air (Culture gratuite)
- Food Tour (Culinaire, -€10 promo)
- Izzico Meetup (Community event)

### **3. Frontend Pages**

| Fichier | URL | Description |
|---------|-----|-------------|
| [`app/hub/events/page.tsx`](app/hub/events/page.tsx) | `/hub/events` | Redirect vers discover |
| [`app/hub/events/discover/page.tsx`](app/hub/events/discover/page.tsx) | `/hub/events/discover` | Page principale Events |

### **4. Components**

| Fichier | Description |
|---------|-------------|
| [`components/events/EventCard.tsx`](components/events/EventCard.tsx) | Card component avec 3 variants |
| [`lib/types/events.ts`](lib/types/events.ts) | TypeScript types complets |

### **5. Documentation**

| Fichier | Contenu |
|---------|---------|
| [`docs/EVENTS_FEATURE_PROPOSAL.md`](docs/EVENTS_FEATURE_PROPOSAL.md) | Vision stratégique complète |
| [`docs/EVENTS_IMPLEMENTATION_GUIDE.md`](docs/EVENTS_IMPLEMENTATION_GUIDE.md) | Guide technique développeur |
| [`docs/EVENTS_PAGE_DEMO.md`](docs/EVENTS_PAGE_DEMO.md) | Guide demo de la page |
| [`docs/EVENTS_EXAMPLES.md`](docs/EVENTS_EXAMPLES.md) | Exemples scénarios + monétisation |
| `README_EVENTS.md` | Ce fichier |

---

## 🎨 Features Implémentées

### ✅ Page Discover

**Recherche** :
- Barre de recherche full-text (titre, description, ville, tags)
- Recherche instantanée

**Filtres** :
- Panneau dépliable avec compteur de filtres actifs
- **Catégories** : 10 badges cliquables (multi-sélection)
- **Prix** : Tous / Gratuit / Payant
- **Période** : Tous / Aujourd'hui / Cette semaine / Ce mois
- Bouton "Réinitialiser" pour clear

**Recommandations** :
- Section "Recommandé pour toi" (3 events)
- Affichée uniquement si pas de filtres actifs
- Icon ✨ Sparkles

**Vues Multiples** :
1. **Grille** (défaut) - 3 colonnes, cards grandes
2. **Liste** - 1 colonne, cards compact
3. **Timeline** ⭐ - Groupé par date avec badge visuel

**RSVP System** :
- 2 boutons : "M'intéresse" ❤️ / "J'y vais" ✓
- État persiste (mock state local)
- Animations au clic

### ✅ EventCard Component

**3 Variants** :
- `default` : Full card (image + détails + actions)
- `compact` : Horizontal layout (pour liste)
- `featured` : Avec badge "Featured" ✨

**Elements** :
- Cover image (ou placeholder gradiant si pas d'image)
- Badges : Featured / Co-living / Prix ou Gratuit
- Catégorie avec couleur spécifique
- Date + Heure + Lieu
- Promo code (pour events partenaires)
- Compteurs participants (going + interested)
- Avatars colocataires qui y vont
- Boutons RSVP interactifs
- Lien externe (pour tickets)

**Design** :
- Couleurs dynamiques par rôle (Resident/Searcher/Owner)
- Animations Framer Motion (fade in + hover)
- Typography Izzico (Nunito + Inter)
- Shadows role-colored

### ✅ Navigation

**Header Hub** :
- Ajout du lien "Events" avec icon MapPin
- Position entre "Résidents" et "Tâches"

---

## 🎯 Cas d'Usage

### **Scénario 1 : Découverte Simple**

```
1. User clique "Events" dans header
2. Page charge avec 10 events
3. Section "Recommandé pour toi" en haut
4. User scroll → voit tous les events
5. Clique sur "Brussels Jazz Marathon"
6. (À implémenter) Page détail s'ouvre
```

### **Scénario 2 : Recherche Filtrée**

```
1. User tape "escape" dans la barre de recherche
2. 1 résultat : "Escape Room"
3. User clique badge "Gratuit uniquement"
4. Résultats filtrés : 6 events gratuits
5. User clique "Cette semaine"
6. Résultats affinés : 4 events gratuits cette semaine
```

### **Scénario 3 : Vue Timeline**

```
1. User clique bouton "Timeline"
2. Events groupés par date
3. Badge coloré pour chaque jour (15 Jan, 16 Jan...)
4. Sous chaque date : liste des events
5. Très visuel pour planning hebdomadaire
```

### **Scénario 4 : RSVP**

```
1. User voit "Yoga au Lever du Soleil"
2. Clique "M'intéresse" → Bouton devient orange, heart filled
3. Change d'avis → Clique "J'y vais"
4. Bouton devient "J'y vais" avec checkmark
5. (À implémenter) État sauvegardé en DB
```

---

## 📊 Mock Data Overview

### **Diversité**

| Aspect | Détails |
|--------|---------|
| **Types** | 80% Public, 10% Property, 10% Community |
| **Prix** | 60% Gratuit, 40% Payant |
| **Catégories** | 10 différentes (Festivals, Sports, Food, Culture...) |
| **Partenariats** | 50% avec promos (-10% à -20%) |
| **Timing** | Du 15/01 au 24/01 (events espacés) |
| **Horaires** | Morning (yoga, running), Afternoon (food tour), Evening (bar, cinéma) |

### **Highlights**

🌟 **Events Featured** :
- Brussels Jazz Marathon
- Expo Van Gogh
- Yoga Sunrise
- Izzico Meetup

🏷️ **Events avec Promos** :
- Escape Room : -20% (IZZICO20)
- Expo Van Gogh : -15% (IZZICO15)
- Food Tour : -€10 (IZZICO10)

🏠 **Property Events** :
- Pizza Party - 8 participants confirmés

💫 **Community Events** :
- Izzico Meetup - 94 participants confirmés

---

## 🔧 Configuration

### **Couleurs par Rôle**

Le système s'adapte automatiquement au rôle actif de l'utilisateur :

| Rôle | Gradient | Primary | Background |
|------|----------|---------|------------|
| **Resident** | #e05747 → #ff7c10 → #ffa000 | #e05747 | from-orange-50 to-red-50 |
| **Searcher** | #ffa000 → #ffb933 → #ffd966 | #ffa000 | from-yellow-50 to-orange-50 |
| **Owner** | #9c5698 → #c85570 → #d15659 | #9c5698 | from-purple-50 to-pink-50 |

### **Typography**

- **Headings** : Nunito (`font-heading`)
- **Body** : Inter (`font-sans`)
- **Brand** : Fredoka (`font-brand`) - non utilisé dans Events

### **Animations**

```typescript
// Card entrance
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { delay: index * 0.05 }

// Hover effect
whileHover: { y: -4 }
transition: { duration: 0.2 }
```

---

## 🚧 Prochaines Étapes

### **Phase 1 - Pages Manquantes** (Semaines 1-2)

- [ ] **Page Détail Event** `/hub/events/[id]`
  - Description complète
  - Map intégrée
  - Liste participants
  - Section reviews
  - Bouton "Inviter"

- [ ] **Page Mes Events** `/hub/events/my-events`
  - Onglets : Going / Interested / Passés
  - Calendar widget
  - Export iCal

- [ ] **Page Créer Event** `/hub/events/create`
  - Form pour property events
  - Upload image
  - Date/time picker

### **Phase 2 - Intégration DB** (Semaines 3-4)

- [ ] Appliquer migration SQL
- [ ] Créer API routes
- [ ] Connecter pages au backend
- [ ] Implémenter RSVP persistence
- [ ] Tests RLS policies

### **Phase 3 - Features Avancées** (Semaines 5-6)

- [ ] API Eventbrite (public events)
- [ ] Notifications système
- [ ] Weekly digest email
- [ ] Reviews & ratings
- [ ] Map view
- [ ] Invitations système

### **Phase 4 - Monétisation** (Semaines 7-8)

- [ ] Affiliate tracking
- [ ] Featured placement système
- [ ] Dashboard analytics partenaires
- [ ] Izzico Miles gamification

---

## 📖 Documentation Complète

### **Stratégie & Vision**

Lire [`docs/EVENTS_FEATURE_PROPOSAL.md`](docs/EVENTS_FEATURE_PROPOSAL.md) pour :
- Vision stratégique
- Architecture complète
- Stratégie de monétisation (€37k An 1 → €120k An 2)
- Roadmap détaillée
- Success metrics

### **Guide Technique**

Lire [`docs/EVENTS_IMPLEMENTATION_GUIDE.md`](docs/EVENTS_IMPLEMENTATION_GUIDE.md) pour :
- Setup base de données
- Création API routes
- Exemples de code
- Tests & déploiement
- Troubleshooting

### **Guide Demo**

Lire [`docs/EVENTS_PAGE_DEMO.md`](docs/EVENTS_PAGE_DEMO.md) pour :
- Détails des fichiers créés
- Checklist fonctionnalités
- Comment tester toutes les features
- Screenshots attendus

### **Exemples & Scénarios**

Lire [`docs/EVENTS_EXAMPLES.md`](docs/EVENTS_EXAMPLES.md) pour :
- Cas d'usage par persona (Searcher, Resident, Owner)
- Scénarios détaillés (weekend resident, newcomer discovery)
- Exemples de partenariats
- Projections revenus détaillées
- Features sociales (invitations, sharing, gamification)

---

## 🎨 Design System

**Conforme aux guidelines Izzico** :

✅ **Colors** - brand-identity/izzico-color-system.html
✅ **Voice** - brand-identity/izzico-voice-guidelines.md
✅ **Fonts** - Nunito (headings) + Inter (body)
✅ **Shapes** - Rounded (2xl, 3xl)
✅ **Animations** - Framer Motion smooth
✅ **No emojis in UI** - Sauf dans contenu events

---

## 💡 Tips

### **Pour tester rapidement** :

```bash
# Lancer le serveur
npm run dev

# Ouvrir directement la page Events
open http://localhost:3000/hub/events
```

### **Pour explorer les mocks** :

```typescript
// Voir tous les events mock
import { MOCK_EVENTS } from '@/lib/mock-data/events';
console.log(MOCK_EVENTS);

// Voir toutes les catégories
import { MOCK_CATEGORIES } from '@/lib/mock-data/events';
console.log(MOCK_CATEGORIES);
```

### **Pour personnaliser** :

1. **Ajouter un event** : Éditer `lib/mock-data/events.ts`
2. **Changer les couleurs** : Éditer `ROLE_COLORS` dans `EventCard.tsx` ou `discover/page.tsx`
3. **Modifier les filtres** : Éditer `discover/page.tsx` section "Filters Panel"

---

## 🐛 Troubleshooting

### **Problème : Page blanche**

```bash
# Vérifier les erreurs console
npm run dev
# Ouvrir Console DevTools (F12)
```

### **Problème : Imports manquants**

```typescript
// Vérifier que date-fns est installé
npm install date-fns

// Vérifier Framer Motion
npm install framer-motion
```

### **Problème : Couleurs ne s'affichent pas**

Vérifier que `useRole()` hook fonctionne :
```typescript
import { useRole } from '@/lib/role/role-context';
const { activeRole } = useRole();
console.log(activeRole); // Doit afficher 'resident', 'searcher' ou 'owner'
```

---

## 📞 Support

**Questions ?** Consultez la documentation complète dans `/docs/`

**Bugs ?** Ouvrir une issue sur le repo

**Suggestions ?** Contacter l'équipe produit

---

**🎉 La page Events est prête !** Explore toutes les fonctionnalités et n'hésite pas à personnaliser selon tes besoins.
