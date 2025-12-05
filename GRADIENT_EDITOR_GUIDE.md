# 🎨 Guide de l'Éditeur de Gradients Interactif

**Date:** 5 Décembre 2025
**Version:** 1.0
**Localisation:** `/app/admin/(dashboard)/dashboard/design-system` > Section "Gradient Signature"

---

## 📍 Accès à l'Éditeur

Pour accéder à l'éditeur de gradients interactif:

1. Connectez-vous à l'interface admin
2. Naviguez vers `/admin/dashboard/design-system`
3. Cliquez sur l'onglet **"Gradient Signature"**
4. L'éditeur apparaît en haut de la section

---

## 🎯 Fonctionnalités

### Vue d'Ensemble

L'éditeur de gradients vous permet d'expérimenter avec les gradients de chaque rôle sans modifier les couleurs officielles du design system.

### Caractéristiques Principales

#### 1. **Trois Sections Indépendantes**
- 🟣 **Owner** (Propriétaire) - Mauve
- 🟠 **Resident** (Locataire) - Orange
- 🟡 **Searcher** (Candidat) - Jaune doré

#### 2. **Contrôles de Couleur**

Pour chaque rôle, vous pouvez ajuster **3 couleurs**:

##### Couleur de Départ
- Position: 0% du gradient
- Contrôles: Color picker + input texte hex

##### Couleur Centrale (Dominante)
- Position: 50% du gradient
- **C'est la couleur principale** qui définit l'identité du rôle
- Contrôles: Color picker + input texte hex

##### Couleur de Fin
- Position: 100% du gradient
- Contrôles: Color picker + input texte hex

#### 3. **Prévisualisation en Temps Réel**
- Barre de gradient mise à jour instantanément
- Animation fluide lors des changements
- Taille: Full width, 96px de hauteur

#### 4. **Sortie CSS**
- Code CSS généré automatiquement
- Format: `linear-gradient(135deg, start 0%, middle 50%, end 100%)`
- Copie facile pour implémentation

#### 5. **Bouton de Sauvegarde**
- Sauvegarde locale (localStorage)
- Feedback visuel:
  - 💾 État normal: "Sauvegarder"
  - ⏳ Pendant la sauvegarde: "Sauvegarde..." (spinner)
  - ✅ Après sauvegarde: "Sauvegardé !" (2 secondes)
- Background du bouton = gradient actuel

---

## 🔧 Comment Utiliser

### Étape 1: Sélectionner un Rôle

Choisissez le rôle dont vous souhaitez modifier le gradient:
- Owner (gauche)
- Resident (centre)
- Searcher (droite)

### Étape 2: Ajuster les Couleurs

**Option A - Color Picker:**
1. Cliquez sur le carré de couleur
2. Sélectionnez votre couleur dans le picker
3. La prévisualisation se met à jour instantanément

**Option B - Saisie Manuelle:**
1. Cliquez dans le champ texte (format: #RRGGBB)
2. Tapez ou collez votre code couleur hex
3. Appuyez sur Enter ou cliquez ailleurs

### Étape 3: Prévisualiser

Observez le gradient en temps réel dans la barre de prévisualisation.

### Étape 4: Vérifier le CSS

Consultez le code CSS généré dans la section "Code CSS" pour voir le gradient final.

### Étape 5: Sauvegarder

Cliquez sur le bouton **"Sauvegarder"** pour enregistrer vos modifications localement.

---

## 💡 Exemples d'Utilisation

### Cas d'Usage 1: Tester une Variation de Teinte

**Objectif:** Rendre le gradient Owner plus rosé

1. Sélectionner la section **Owner**
2. Ajuster la couleur centrale:
   - Avant: `#A67BB8` (mauve)
   - Après: `#C98B9E` (mauve-rose)
3. Prévisualiser le résultat
4. Si satisfait, cliquer sur "Sauvegarder"

### Cas d'Usage 2: Créer un Gradient Plus Vibrant

**Objectif:** Augmenter la saturation du gradient Searcher

1. Sélectionner la section **Searcher**
2. Ajuster les trois couleurs:
   - Départ: `#FF9500` (au lieu de `#FFA040`)
   - Centre: `#FFB000` (au lieu de `#FFB85C`)
   - Fin: `#FFDD00` (au lieu de `#FFD080`)
3. Comparer avec l'original dans la section suivante
4. Sauvegarder si approuvé

### Cas d'Usage 3: Harmoniser avec une Nouvelle Palette

**Objectif:** Adapter les gradients à une nouvelle direction artistique

1. Préparer vos nouvelles couleurs cibles
2. Pour chaque rôle:
   - Modifier les couleurs de départ/centre/fin
   - Vérifier l'harmonie avec le code CSS
3. Sauvegarder chaque rôle séparément
4. Tester visuellement dans l'application

---

## 📊 Valeurs par Défaut

### Owner (Propriétaire)
```css
background: linear-gradient(135deg,
  #7B5FB8 0%,     /* Mauve foncé */
  #A67BB8 50%,    /* Mauve moyen */
  #C98B9E 100%    /* Mauve-rose */
);
```

### Resident (Locataire)
```css
background: linear-gradient(135deg,
  #D97B6F 0%,     /* Orange-corail */
  #E8865D 50%,    /* Orange saumon */
  #FF8C4B 100%    /* Orange vif */
);
```

### Searcher (Candidat)
```css
background: linear-gradient(135deg,
  #FFA040 0%,     /* Orange doré */
  #FFB85C 50%,    /* Jaune-or */
  #FFD080 100%    /* Jaune clair */
);
```

---

## 🔐 Persistance des Données

### Stockage Local

Les gradients sauvegardés sont stockés dans le **localStorage** du navigateur:

```javascript
// Clés utilisées
localStorage.getItem('gradient_owner')
localStorage.getItem('gradient_resident')
localStorage.getItem('gradient_searcher')
```

### Format de Stockage

```json
{
  "start": "#7B5FB8",
  "middle": "#A67BB8",
  "end": "#C98B9E"
}
```

### Récupération au Rechargement

⚠️ **Important:** Les valeurs sauvegardées ne sont **pas** automatiquement rechargées au refresh de la page.

Pour implémenter la persistance complète, il faudrait ajouter un `useEffect` pour charger les valeurs depuis localStorage au montage du composant.

---

## ⚙️ Configuration Technique

### Composant Principal

**Nom:** `InteractiveGradientEditor`
**Fichier:** `/app/admin/(dashboard)/dashboard/design-system/page.tsx`
**Ligne:** ~4060

### États React

```typescript
// Gradients pour chaque rôle
const [ownerGradient, setOwnerGradient] = useState({...})
const [residentGradient, setResidentGradient] = useState({...})
const [searcherGradient, setSearcherGradient] = useState({...})

// Statuts de sauvegarde
const [saveStatus, setSaveStatus] = useState<{
  owner: 'idle' | 'saving' | 'saved',
  resident: 'idle' | 'saving' | 'saved',
  searcher: 'idle' | 'saving' | 'saved'
}>({...})
```

### Fonction de Sauvegarde

```typescript
const handleSaveGradient = async (role: 'owner' | 'resident' | 'searcher') => {
  // 1. Change l'état en "saving"
  setSaveStatus(prev => ({ ...prev, [role]: 'saving' }));

  // 2. Récupère le gradient actuel
  const gradient = role === 'owner' ? ownerGradient : ...;

  // 3. Sauvegarde dans localStorage
  localStorage.setItem(`gradient_${role}`, JSON.stringify(gradient));

  // 4. Feedback visuel (0.5s saving → 2s saved → idle)
  setTimeout(() => {
    setSaveStatus(prev => ({ ...prev, [role]: 'saved' }));
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, [role]: 'idle' }));
    }, 2000);
  }, 500);
};
```

---

## 🎨 Personnalisation Avancée

### Modifier les Couleurs par Défaut

Pour changer les valeurs initiales affichées au chargement:

```typescript
// Dans InteractiveGradientEditor
const [ownerGradient, setOwnerGradient] = useState({
  start: '#VOTRE_COULEUR',   // Changez ici
  middle: '#VOTRE_COULEUR',  // Changez ici
  end: '#VOTRE_COULEUR'      // Changez ici
});
```

### Ajouter un Nouveau Rôle

1. Créer un nouvel état:
```typescript
const [nouveauRoleGradient, setNouveauRoleGradient] = useState({...});
```

2. Ajouter dans le grid:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  {/* ... Existing roles ... */}
  {renderGradientEditor('nouveau-role', 'Gradient Nouveau', nouveauRoleGradient, setNouveauRoleGradient, '#COULEUR')}
</div>
```

### Modifier l'Angle du Gradient

Actuellement configuré à 135deg (diagonal). Pour changer:

```typescript
const gradientCSS = `linear-gradient(90deg, ...)`; // Horizontal
// ou
const gradientCSS = `linear-gradient(180deg, ...)`; // Vertical
```

---

## 📱 Responsive Design

### Breakpoints

- **Mobile** (< 1024px): Layout en colonne unique
- **Desktop** (≥ 1024px): Grid 3 colonnes

### Classes Tailwind

```tsx
className="grid grid-cols-1 lg:grid-cols-3 gap-6"
```

Pour adapter à 4 colonnes:
```tsx
className="grid grid-cols-1 lg:grid-cols-4 gap-6"
```

---

## ⚠️ Limitations Actuelles

### 1. Pas de Synchronisation avec globals.css
Les modifications faites dans l'éditeur **ne modifient PAS** automatiquement les variables CSS du fichier `globals.css`.

**Solution:** Copier manuellement les valeurs et les coller dans `globals.css`.

### 2. Pas de Persistance au Refresh
Les valeurs ne sont pas rechargées depuis localStorage au refresh.

**Solution Future:** Ajouter un `useEffect` pour charger les valeurs sauvegardées:
```typescript
useEffect(() => {
  const savedOwner = localStorage.getItem('gradient_owner');
  if (savedOwner) {
    setOwnerGradient(JSON.parse(savedOwner));
  }
  // Idem pour resident et searcher
}, []);
```

### 3. Pas de Validation des Couleurs
Aucune vérification que la couleur saisie est valide.

**Solution Future:** Ajouter une regex de validation hex:
```typescript
const isValidHex = (hex: string) => /^#[0-9A-F]{6}$/i.test(hex);
```

### 4. Pas d'Export vers Fichier
Impossible d'exporter les gradients vers un fichier CSS.

**Solution Future:** Ajouter un bouton "Exporter CSS" qui génère un fichier téléchargeable.

---

## 🚀 Améliorations Futures

### Priorité Haute
- [ ] Recharger les gradients sauvegardés au montage
- [ ] Validation des codes couleur hex
- [ ] Bouton "Réinitialiser" pour revenir aux valeurs par défaut

### Priorité Moyenne
- [ ] Synchronisation avec globals.css (via API)
- [ ] Historique des changements (undo/redo)
- [ ] Prévisualisation sur des composants réels

### Priorité Basse
- [ ] Export CSS vers fichier
- [ ] Import de gradients depuis fichier
- [ ] Partage de gradients (URL encodé)
- [ ] Suggestions de palettes harmonieuses

---

## 📖 Références

### Couleurs Officielles
Voir [COLOR_SYSTEM_FINAL.md](./COLOR_SYSTEM_FINAL.md) pour les couleurs primaires validées.

### Variables CSS
Voir [app/globals.css](app/globals.css) pour la liste complète des variables.

### Design System
Accès: [/admin/dashboard/design-system](/admin/dashboard/design-system)

---

## 🆘 Support & Questions

### Comment réinitialiser un gradient ?
Actuellement, il faut rafraîchir la page. Un bouton "Réinitialiser" sera ajouté dans une future version.

### Les changements affectent-ils la production ?
**Non.** Les changements sont sauvegardés localement dans votre navigateur uniquement. Ils n'affectent pas les couleurs officielles de l'application.

### Comment appliquer mes gradients en production ?
1. Copier les valeurs CSS générées
2. Ouvrir [app/globals.css](app/globals.css)
3. Modifier les variables correspondantes
4. Commit et push les changements

### Les gradients sont-ils synchronisés entre appareils ?
**Non.** Ils sont stockés dans le localStorage local. Pour synchroniser, vous devriez implémenter un système de sauvegarde en base de données.

---

**Version:** 1.0
**Dernière mise à jour:** 5 Décembre 2025
**Auteur:** Design System EasyCo
**Status:** ✅ Production Ready
