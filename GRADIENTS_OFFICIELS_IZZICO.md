# 🔒 Gradients Officiels IzzIco - VERSION VERROUILLÉE

**Date de verrouillage**: 9 décembre 2025
**Marque**: IzzIco (anciennement EasyCo)
**Statut**: ✅ FINAL - NE PAS MODIFIER

---

## 🌈 Gradient Signature de Marque (Logo Principal)

### Version Officielle Choisie
```css
linear-gradient(135deg, #9c5698 0%, #FF5722 50%, #FFB10B 100%)
```

**Couleurs exactes**:
- **0% (Mauve)**: `#9c5698` - RGB(156, 86, 152) - Représente Owner
- **50% (Orange)**: `#FF5722` - RGB(255, 87, 34) - Représente Resident
- **100% (Jaune)**: `#FFB10B` - RGB(255, 177, 11) - Représente Searcher

**Utilisation**:
- ✅ Logo principal IzzIco
- ✅ Bouton "S'inscrire" landing page (élément générique multi-rôles)
- ✅ Badge "Profil Vérifié"
- ✅ Action "Super Like"
- ✅ Empty states (icônes)
- ✅ Logo mobile

**NE PAS utiliser pour**:
- ❌ Navigation (trop de répétition)
- ❌ Éléments répétitifs (perd son impact)
- ❌ Boutons CTA par rôle (y compris "Continuer" onboarding - utiliser les gradients CTA spécifiques ci-dessous)

---

## 🟣 Gradient Owner CTA

```css
linear-gradient(135deg, #7B5FB8 0%, #A67BB8 50%, #C98B9E 100%)
```

**Couleurs**:
- 0%: `#7B5FB8` - Mauve foncé
- 50%: `#A67BB8` - Mauve rose
- 100%: `#C98B9E` - Rose mauve

**Utilisation**: Interface propriétaire, boutons CTA Owner, headers Owner

---

## 🟠 Gradient Resident CTA

```css
linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)
```

**Couleurs**:
- 0%: `#D97B6F` - Terracotta
- 50%: `#E8865D` - Corail doux
- 100%: `#FF8C4B` - Orange vif

**Utilisation**: Interface résident, boutons CTA Resident, headers Resident

---

## 🟡 Gradient Searcher CTA

```css
linear-gradient(135deg, #FFA040 0%, #FFB85C 50%, #FFD080 100%)
```

**Couleurs**:
- 0%: `#FFA040` - Orange clair
- 50%: `#FFB85C` - Beige doré
- 100%: `#FFD080` - Jaune doré

**Utilisation**: Interface chercheur, boutons CTA Searcher, headers Searcher

---

## 📍 Fichiers à maintenir synchronisés

1. ✅ `/app/globals.css` - Variables CSS `--gradient-brand-*`
2. ✅ `/lib/design-system/gradients.ts` - Export TypeScript
3. ✅ `/app/admin/(dashboard)/dashboard/design-system/page.tsx` - Page design system
4. ✅ `/IZZICO_GRADIENTS_FIGMA.md` - Documentation Figma

---

## 🚨 RÈGLE ABSOLUE

**Ces gradients sont maintenant VERROUILLÉS pour la marque IzzIco.**

Toute modification doit :
1. Être approuvée explicitement par le propriétaire du projet
2. Être documentée avec justification dans ce fichier
3. Être appliquée dans TOUS les fichiers listés ci-dessus

**Date de dernière modification**: 9 décembre 2025
**Modifié par**: Samuel Baudon (propriétaire)
**Raison**: Choix définitif après comparaison visuelle Figma vs Code
