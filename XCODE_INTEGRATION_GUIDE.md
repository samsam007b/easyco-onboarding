# 📱 Guide d'intégration Xcode - Guest Mode & Landing

## 🎯 Fichiers à ajouter au projet

Voici les 3 nouveaux fichiers créés qui doivent être ajoutés à Xcode :

### 1. ImageCache.swift
📍 **Emplacement** : `EasyCoiOS-Clean/EasyCo/EasyCo/Core/Services/ImageCache.swift`
📂 **Groupe Xcode** : `Core/Services/`
🎯 **Target** : EasyCo

### 2. WelcomeSheet.swift
📍 **Emplacement** : `EasyCoiOS-Clean/EasyCo/EasyCo/Features/Auth/WelcomeSheet.swift`
📂 **Groupe Xcode** : `Features/Auth/`
🎯 **Target** : EasyCo

### 3. GuestModeManager.swift
📍 **Emplacement** : `EasyCoiOS-Clean/EasyCo/EasyCo/Core/Auth/GuestModeManager.swift`
📂 **Groupe Xcode** : `Core/Auth/`
🎯 **Target** : EasyCo

---

## 📋 Étapes d'intégration

### Méthode : Drag & Drop (Recommandée)

1. **Ouvrir Xcode**
   ```bash
   open EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj
   ```

2. **Ajouter les 3 fichiers** en les glissant dans Xcode :
   - `ImageCache.swift` → dans groupe `Core/Services/`
   - `WelcomeSheet.swift` → dans groupe `Features/Auth/`
   - `GuestModeManager.swift` → dans groupe `Core/Auth/`

3. **Options** :
   - ✅ Cocher "Copy items if needed"
   - ✅ Cocher target "EasyCo"
   - Cliquer sur "Finish"

---

## ✅ Test rapide

**Build le projet** : `⌘ + B`

Si le build réussit ✅ → Tout est bon !

---

## 🎨 Design Final du WelcomeSheet

```
┌─────────────────────────────────┐
│   [glassmorphism gradient]      │ ← Header avec logo
│   🟠 EasyCo                      │
├─────────────────────────────────┤
│      Bienvenue !                │ ← Fond blanc
│  Trouve ta colocation...        │
│                                 │
│ 🔍 Je cherche un logement       │
│ [Créer mon compte] →            │
│                                 │
│ 🏠 Je loue mon bien             │
│ [Publier mon bien] →            │
│                                 │
│ [Continuer en invité]           │
└─────────────────────────────────┘
```

---

**Bonne intégration ! 🚀**
