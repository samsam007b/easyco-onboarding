# Theme Constants - Guide de Synchronisation

## ⚠️ Source Unique de Vérité

**TOUS les design tokens** (couleurs, gradients, spacing, etc.) sont définis dans **`app/globals.css`** avec des CSS variables.

Les fichiers `*-theme.ts` dans ce dossier sont des **miroirs TypeScript** pour les composants qui nécessitent des valeurs inline (Framer Motion, styles dynamiques, etc.).

## 📋 Processus de Modification

### Quand modifier une couleur ou un gradient :

1. ✅ **Modifier `app/globals.css` D'ABORD**
   ```css
   /* Exemple: changer la couleur searcher primary */
   --searcher-500: #ffa000;  /* Nouvelle valeur */
   ```

2. ✅ **Propager dans les fichiers theme.ts concernés**
   ```typescript
   // lib/constants/searcher-theme.ts
   export const searcherColors = {
     primary: '#ffa000',  // ← Mettre à jour ici
     ...
   }
   ```

3. ✅ **Mettre à jour la charte graphique**
   ```html
   <!-- brand-identity/izzico-charte-graphique-complete.html -->
   <!-- Mettre à jour le swatch de couleur -->
   ```

4. ✅ **Vérifier visuellement**
   - Tester dans l'app web (npm run dev)
   - Vérifier que les composants utilisent la bonne couleur
   - Checker la charte graphique (ouvrir le HTML)

## 📁 Fichiers Theme Actuels

| Fichier | Rôle | Couleur Primary | Status |
|---------|------|-----------------|--------|
| `searcher-theme.ts` | Searcher | #ffa000 | ✅ Aligné v3 |
| `owner-theme.ts` | Owner | #9c5698 | ✅ Aligné v3 |
| `resident-theme.ts` | Resident | #e05747 | ✅ Aligné v3 |

## 🔍 Vérification de Cohérence

Pour vérifier que tous les fichiers sont synchronisés :

```bash
# Chercher toutes les définitions de couleur primary
grep -n "primary.*#" lib/constants/*-theme.ts app/globals.css

# Devrait retourner:
# searcher-theme.ts: primary: '#ffa000'
# owner-theme.ts: primary: '#9c5698'
# resident-theme.ts: primary: '#e05747'
# globals.css: --searcher-500: #ffa000
# globals.css: --owner-500: #9c5698
# globals.css: --resident-500: #e05747
```

## 📚 Références

- **Source de vérité absolue** : `brand-identity/izzico-charte-graphique-complete.html`
- **Implémentation web** : `app/globals.css`
- **Implémentation iOS** : `EasyCoiOS-Clean/IzzIco/IzzIco/Core/DesignSystem/IzzicoDesignTokens.swift`

## 🚨 Attention

**JAMAIS** modifier une couleur uniquement dans un fichier `*-theme.ts` sans mettre à jour `globals.css`. Cela créerait une désynchronisation entre les composants qui utilisent CSS variables (Tailwind) et ceux qui utilisent les constants JS.

**Workflow correct** :
```
globals.css → *-theme.ts → Charte graphique → iOS DesignTokens.swift
     ↓             ↓              ↓                    ↓
  (Source)    (Miroir JS)    (Référence)        (Miroir Swift)
```

## ✅ Checklist Modification Couleur

Avant de commit une modification de couleur :

- [ ] Modifié dans `app/globals.css` (CSS variable)
- [ ] Modifié dans `lib/constants/*-theme.ts` (constant JS)
- [ ] Testé visuellement dans l'app (npm run dev)
- [ ] Mis à jour dans `izzico-charte-graphique-complete.html` si pertinent
- [ ] Commit message mentionne "DESIGN SYSTEM" pour traçabilité

---

**Dernière synchronisation** : 2026-01-18
**Version design system** : v3.1.0
