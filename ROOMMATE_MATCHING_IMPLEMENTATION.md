# Implémentation - Matching Colocataires ✅

## 📊 Status: Phase 1 Implémentée

**Date**: 2025-01-03
**Approche**: Matching basé sur compatibilité avec les résidents (vs caractéristiques du logement)

---

## 🎯 Philosophie

**AVANT**:
- Matching = Compatibilité avec le logement (prix, localisation, chambres)
- ❌ Redondant avec les filtres

**APRÈS**:
- Filtres = Caractéristiques du logement (prix, ville, chambres, meublé...)
- Matching = Compatibilité sociale avec les colocataires 🤝
- ✅ Vraie valeur ajoutée!

---

## 📁 Fichiers Créés

### 1. Service de Matching
**Fichier**: `lib/services/roommate-matching-service.ts`

**Fonctions principales**:
- `calculateRoommateCompatibility()` - Calcul searcher ↔ résident
- `calculatePropertyRoommateCompatibility()` - Calcul searcher ↔ tous les résidents
- `getCompatibilityDescription()` - Labels et descriptions

**Scoring (0-100)**:
- Lifestyle: 30pts (propreté, bruit, invités)
- Schedule: 20pts (horaires, travail)
- Social: 20pts (énergie sociale, activités)
- Values: 15pts (valeurs, priorités)
- Habits: 15pts (tabac, animaux, cuisine)

### 2. Mapper de Profils
**Fichier**: `lib/services/roommate-profile-mapper.ts`

**Fonctions**:
- `mapUserProfileToRoommateProfile()` - Conversion user_profiles → RoommateProfile
- `fetchRoommateProfile()` - Load depuis DB
- `fetchPropertyResidents()` - Load résidents d'une propriété (Phase 1: owner only)

**Mapping Colonnes**:
```typescript
{
  cleanliness_level: profile.cleanliness_preference || profile.cleanliness_expectation,
  social_energy: profile.sociability_level || profile.social_energy,
  smoking: profile.smoker || profile.smoking || profile.is_smoker,
  // ...
}
```

---

## 🔄 Modifications de Code

### BrowseContent.tsx

**Changements**:
1. Imports ajoutés:
   ```typescript
   import { calculatePropertyRoommateCompatibility } from '@/lib/services/roommate-matching-service';
   import { mapUserProfileToRoommateProfile } from '@/lib/services/roommate-profile-mapper';
   ```

2. Calcul des scores (useMemo):
   ```typescript
   const propertiesWithRoommateScores = useMemo(() => {
     // Convert searcher to RoommateProfile
     const searcherRoommateProfile = mapUserProfileToRoommateProfile(searcherProfile);

     return properties.map(property => {
       const residents = residentsData.get(property.id);
       const residentProfiles = residents.map(r => mapUserProfileToRoommateProfile(r));

       // Calculate compatibility
       const matchResult = calculatePropertyRoommateCompatibility(
         searcherRoommateProfile,
         residentProfiles
       );

       return { ...property, roommateMatch: matchResult };
     });
   }, [properties, residentsData, searcherProfile]);
   ```

3. Passage à PropertyCard:
   ```typescript
   <PropertyCard
     roommateMatch={property.roommateMatch}
     // ...
   />
   ```

### PropertyCard.tsx

**Changements**:
1. Interface mise à jour:
   ```typescript
   interface PropertyCardProps {
     roommateMatch?: RoommateMatchResult; // NEW
     // ...
   }
   ```

2. Import:
   ```typescript
   import type { RoommateMatchResult } from '@/lib/services/roommate-matching-service';
   import { getCompatibilityDescription } from '@/lib/services/roommate-matching-service';
   ```

3. Affichage du score:
   ```typescript
   {roommateMatch && (
     <div className="badge">
       {roommateMatch.averageScore}% Match {roommateMatch.compatibilityLevel}
     </div>
   )}
   ```

---

## ✅ Ce Qui Fonctionne

1. ✅ Service de matching créé avec algorithme complet
2. ✅ Mapper pour conversion user_profiles → RoommateProfile
3. ✅ BrowseContent calcule les scores pour chaque propriété
4. ✅ PropertyCard reçoit le roommateMatch
5. ✅ Système extensible pour Phase 2 (table residents)

---

## 🔄 Phase 1 vs Phase 2

### Phase 1 (Actuelle - Implémentée)
- Utilise `properties.owner_id` comme unique résident
- Fonction: `fetchPropertyOwnerAsResident(ownerId)`
- Avantage: Fonctionne immédiatement
- Limite: Un seul résident par propriété

### Phase 2 (Future)
- Table dédiée `property_residents`
- Plusieurs résidents par propriété
- Fonction: `fetchPropertyResidents(propertyId)` → query table
- Avantage: Matching avec tous les colocataires

---

## 📊 Exemples de Scores

### Excellent Match (85%)
```typescript
searcher = {
  cleanliness_level: 8,
  social_energy: 7,
  smoking: false,
  wake_up_time: 'normal'
}

resident = {
  cleanliness_level: 8,
  social_energy: 6,
  smoking: false,
  wake_up_time: 'normal'
}

// Breakdown:
// Lifestyle: 28/30 (cleanliness + noise match)
// Schedule: 18/20 (horaires alignés)
// Social: 17/20 (énergie similaire)
// Values: 12/15 (quelques valeurs partagées)
// Habits: 13/15 (habitudes compatibles)
// TOTAL: 88/100 → Excellent Match 🌟
```

### Low Match (35%)
```typescript
searcher = {
  cleanliness_level: 9,
  social_energy: 2,
  smoking: false,
  wake_up_time: 'early'
}

resident = {
  cleanliness_level: 3,
  social_energy: 9,
  smoking: true,
  wake_up_time: 'late'
}

// Breakdown:
// Lifestyle: 12/30 (grande différence propreté)
// Schedule: 8/20 (incompatibilité horaires)
// Social: 5/20 (introvert vs extrovert)
// Values: 5/15 (peu de valeurs communes)
// Habits: 5/15 (fumeur vs non-fumeur)
// TOTAL: 35/100 → Low Match ⚠️
```

---

## 🧪 Pour Tester

### 1. Vérifier le Calcul
```bash
npm run dev
# Aller sur /dashboard/searcher (browse properties)
# Ouvrir console navigateur
# Chercher les logs: "🔄 Converted searcher profile"
```

### 2. Vérifier les Scores
- Les PropertyCard devraient afficher un badge de compatibilité
- Score basé sur compatibilité avec le propriétaire (Phase 1)
- Scores varieront selon les profils

### 3. Debug
```typescript
// Dans BrowseContent.tsx, ligne ~438
console.log('Roommate scores calculated:', propertiesWithRoommateScores);
```

---

## 📝 TODO Liste

### Phase 1 - Complété ✅
- [x] Créer `roommate-matching-service.ts`
- [x] Créer `roommate-profile-mapper.ts`
- [x] Modifier BrowseContent pour calculer scores
- [x] Modifier PropertyCard pour recevoir roommateMatch
- [x] Documentation

### Phase 2 - À Faire
- [ ] Créer table `property_residents`
- [ ] Migration SQL
- [ ] Modifier `fetchPropertyResidents()` pour query table
- [ ] UI pour gérer résidents (admin)
- [ ] Afficher compatibilité individuelle avec chaque résident
- [ ] Modal avec détails breakdown

### Phase 3 - Améliorations
- [ ] Filtrer par score minimum de compatibilité
- [ ] Trier par compatibilité
- [ ] Weights personnalisables
- [ ] System de "dealbreakers"
- [ ] Afficher insights/concerns dans PropertyCard

---

## 🎨 UI Suggestions (Non implémenté)

### Badge Simple
```jsx
{roommateMatch && (
  <div className={cn(
    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
    roommateMatch.compatibilityLevel === 'excellent' && "bg-green-100 text-green-700",
    roommateMatch.compatibilityLevel === 'good' && "bg-blue-100 text-blue-700",
    roommateMatch.compatibilityLevel === 'fair' && "bg-yellow-100 text-yellow-700",
    roommateMatch.compatibilityLevel === 'low' && "bg-orange-100 text-orange-700"
  )}>
    {getCompatibilityDescription(roommateMatch.compatibilityLevel).icon}
    {roommateMatch.averageScore}% Match
  </div>
)}
```

### Modal Détails
```jsx
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Compatibilité Colocataires</DialogTitle>
      <DialogDescription>
        {getCompatibilityDescription(roommateMatch.compatibilityLevel).description}
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4">
      {/* Score Global */}
      <div className="text-center">
        <div className="text-4xl font-bold">{roommateMatch.averageScore}%</div>
        <div className="text-sm text-muted-foreground">
          {getCompatibilityDescription(roommateMatch.compatibilityLevel).label}
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        <ProgressBar label="Lifestyle" value={roommateMatch.breakdown.lifestyle} max={30} />
        <ProgressBar label="Schedule" value={roommateMatch.breakdown.schedule} max={20} />
        <ProgressBar label="Social" value={roommateMatch.breakdown.social} max={20} />
        <ProgressBar label="Values" value={roommateMatch.breakdown.values} max={15} />
        <ProgressBar label="Habits" value={roommateMatch.breakdown.habits} max={15} />
      </div>

      {/* Strengths */}
      {roommateMatch.strengths.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">✨ Points Forts</h4>
          <ul className="space-y-1">
            {roommateMatch.strengths.map((s, i) => (
              <li key={i} className="text-sm text-green-600">{s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Concerns */}
      {roommateMatch.concerns.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">⚠️ Points d'Attention</h4>
          <ul className="space-y-1">
            {roommateMatch.concerns.map((c, i) => (
              <li key={i} className="text-sm text-yellow-600">{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </DialogContent>
</Dialog>
```

---

## 🔗 Liens Utiles

- **Spec complète**: [ROOMMATE_MATCHING_SPEC.md](ROOMMATE_MATCHING_SPEC.md)
- **Service**: [lib/services/roommate-matching-service.ts](lib/services/roommate-matching-service.ts)
- **Mapper**: [lib/services/roommate-profile-mapper.ts](lib/services/roommate-profile-mapper.ts)

---

## 📞 Support

Si problèmes:
1. Vérifier console logs dans le navigateur
2. Vérifier que searcher profile est chargé
3. Vérifier que résidents sont chargés pour les propriétés
4. Vérifier mapping des colonnes dans mapper
