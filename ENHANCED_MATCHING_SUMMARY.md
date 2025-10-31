# Système de Matching Amélioré - Documentation

## Résumé

Système de matching avancé avec scores détaillés pour connecter les chercheurs avec les propriétés les plus adaptées à leurs critères.

## Fichiers Créés/Modifiés

### Services

#### [lib/services/enhanced-matching-service.ts](lib/services/enhanced-matching-service.ts)
Service complet pour le matching avec:
- **Calcul de score pondéré** (Budget 30%, Localisation 25%, Style de vie 20%, Disponibilité 15%, Préférences 10%)
- **Génération automatique de matches** pour un chercheur
- **Statistiques de matching** (total, vus, contactés, scores moyens)
- **Gestion des états** (active, viewed, contacted, hidden)
- **Système de feedback** pour améliorer les recommandations

Fonctions principales:
```typescript
calculateEnhancedMatchScore(searcherId, ownerId, propertyId?) // Calcul du score
findMatchesForSearcher(searcherId, options) // Récupération des matches
generateMatchesForSearcher(searcherId) // Génération de nouveaux matches
markMatchViewed(matchId, userId) // Marquer comme vu
updateMatchStatus(matchId, status) // Changer le statut
hideMatch(matchId) // Masquer un match
getMatchStatistics(userId) // Obtenir les statistiques
submitMatchFeedback(matchId, userId, feedback) // Soumettre un feedback
```

### API Routes

#### [app/api/matching/generate/route.ts](app/api/matching/generate/route.ts)
**POST** `/api/matching/generate`
- Génère de nouveaux matches pour le chercheur connecté
- Vérifie que l'utilisateur est bien un chercheur
- Retourne le nombre de matches générés

#### [app/api/matching/matches/route.ts](app/api/matching/matches/route.ts)
**GET** `/api/matching/matches`
- Récupère les matches avec filtres
- Query params: `limit`, `minScore`, `status`, `includeStats`
- Retourne les matches et statistiques optionnelles

#### [app/api/matching/matches/[matchId]/view/route.ts](app/api/matching/matches/[matchId]/view/route.ts)
**POST** `/api/matching/matches/[matchId]/view`
- Marque un match comme vu
- Enregistre la date de visualisation

#### [app/api/matching/matches/[matchId]/contact/route.ts](app/api/matching/matches/[matchId]/contact/route.ts)
**POST** `/api/matching/matches/[matchId]/contact`
- Marque un match comme contacté
- Crée une conversation entre chercheur et propriétaire
- Envoie une notification au propriétaire

#### [app/api/matching/matches/[matchId]/hide/route.ts](app/api/matching/matches/[matchId]/hide/route.ts)
**POST** `/api/matching/matches/[matchId]/hide`
- Masque un match de la liste de l'utilisateur

### Composants UI

#### [components/matching/PropertyMatchCard.tsx](components/matching/PropertyMatchCard.tsx)
Carte d'affichage d'un match avec:
- **Photo du bien** avec badge de score
- **Informations de base**: titre, localisation, prix, disponibilité
- **Score de compatibilité** avec code couleur
- **Raisons du match** (top 2 affichées)
- **Détail des scores par critère** (expandable):
  - Budget
  - Localisation
  - Style de vie
  - Disponibilité
  - Préférences
- **Informations propriétaire**
- **Actions**: Voir le bien, Contacter, Masquer

#### [app/matching/properties/page.tsx](app/matching/properties/page.tsx)
Page principale des matches avec:
- **En-tête** avec titre et compteur de matches
- **Boutons d'action**: Actualiser, Générer nouveaux matches
- **Statistiques** (5 cartes):
  - Total de matches
  - Matches vus
  - Matches contactés
  - Score moyen
  - Meilleur score
- **Filtres interactifs**:
  - Score minimum (50%, 60%, 70%, 80%)
  - Statut (Actifs, Vus, Contactés)
- **Bannière informative** expliquant le système de scoring
- **Grille de matches** (responsive: 1/2/3 colonnes)
- **État vide** avec suggestions d'actions

## Pondération des Scores

```typescript
export const MATCH_WEIGHTS = {
  BUDGET: 30,      // 30% - Le plus important
  LOCATION: 25,    // 25% - Deuxième critère
  LIFESTYLE: 20,   // 20% - Troisième critère
  AVAILABILITY: 15, // 15% - Quatrième critère
  PREFERENCES: 10,  // 10% - Cinquième critère
} as const;
```

## Calcul des Scores

### Budget Score (30%)
- Compare le budget du chercheur avec le loyer du bien
- Score maximal si le loyer est dans la fourchette budgétaire
- Pénalité progressive si hors budget

### Location Score (25%)
- Basé sur la ville préférée du chercheur
- Peut être étendu pour inclure le quartier, distance, etc.

### Lifestyle Score (20%)
- Compare les préférences de style de vie
- Fumeur/non-fumeur
- Animaux
- Vie sociale (calme/festive)

### Availability Score (15%)
- Vérifie si les dates correspondent
- Compare `available_from` avec `move_in_date`

### Preferences Score (10%)
- Type de bien préféré
- Meublé/non meublé
- Nombre de pièces
- Autres préférences spécifiques

## États des Matches

- **`active`**: Nouveau match, non encore vu
- **`viewed`**: Match vu par l'utilisateur
- **`contacted`**: Utilisateur a contacté le propriétaire
- **`hidden`**: Match masqué par l'utilisateur

## Codes Couleur des Scores

- **≥ 80%**: Vert (excellent match)
- **60-79%**: Jaune (bon match)
- **< 60%**: Orange (match moyen)

## Workflow Utilisateur

1. **Accès à la page** `/matching/properties` (chercheurs uniquement)
2. **Visualisation** des matches existants avec statistiques
3. **Filtrage** par score minimum et statut
4. **Consultation** du détail d'un match avec score breakdown
5. **Actions possibles**:
   - Voir le bien → redirige vers `/properties/[id]` et marque comme vu
   - Contacter → crée une conversation et notifie le propriétaire
   - Masquer → retire le match de la liste
6. **Génération** de nouveaux matches via le bouton

## Intégration Base de Données

Le système utilise les tables existantes:
- **`matches`**: Stocke les matches générés
- **`user_profiles`**: Profils chercheurs et propriétaires
- **`properties`**: Biens immobiliers
- **`conversations`**: Créées lors du contact
- **`notifications`**: Alertes pour les propriétaires

Colonnes importantes dans `matches`:
```sql
- id: UUID
- property_id: UUID (référence)
- searcher_id: UUID (référence)
- owner_id: UUID (référence)
- match_score: INTEGER (0-100)
- score_breakdown: JSONB
- match_reasons: TEXT[]
- status: VARCHAR (active/viewed/contacted/hidden)
- viewed_at: TIMESTAMPTZ
- contacted_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
```

## Améliorations Futures Possibles

1. **Machine Learning**:
   - Utiliser le feedback utilisateur pour affiner les scores
   - Apprendre des patterns de succès/échec

2. **Critères additionnels**:
   - Distance aux transports
   - Distance au travail/école
   - Score de quartier (sécurité, commodités)
   - Compatibilité propriétaire-chercheur basée sur personnalités

3. **Notifications**:
   - Alertes pour nouveaux matches au-dessus d'un certain score
   - Résumé hebdomadaire des meilleurs matches

4. **Analytics**:
   - Taux de réponse par score
   - Temps moyen avant contact
   - Taux de conversion match → location

5. **A/B Testing**:
   - Tester différentes pondérations
   - Optimiser l'UI pour maximiser les contacts

## Notes Techniques

- **TypeScript strict** pour la sécurité des types
- **Validation RLS** sur toutes les requêtes Supabase
- **Gestion d'erreurs** complète avec messages utilisateur
- **Performance**: Indexes sur `matches` (user_id, status, score)
- **Build**: Passe sans erreurs ✅

## Date de Création

31 Octobre 2025

## Statut

✅ Prêt à l'emploi - Build réussi
