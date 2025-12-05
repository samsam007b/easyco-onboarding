# Commandes pour Claude Code Terminal - Penpot Setup

## 🚀 Instructions

1. **Ouvre un nouveau terminal**
2. **Lance Claude Code** :
   ```bash
   cd /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean
   claude
   ```

3. **Copie-colle les commandes ci-dessous** dans la session Claude

---

## 📋 Commandes à exécuter dans Claude Terminal

### **Étape 1 : Vérifier les outils MCP disponibles**

```
Peux-tu lister tous les outils MCP disponibles ?
Je cherche spécifiquement les outils Penpot.
```

**Résultat attendu :** Tu devrais voir des outils comme :
- `penpot_list_projects`
- `penpot_create_project`
- `penpot_create_file`
- `penpot_get_file`
- `penpot_export`
- etc.

---

### **Étape 2 : Tester la connexion Penpot**

```
Utilise l'outil Penpot pour lister mes projets existants.
```

**Résultat attendu :** Liste de tes projets Penpot (ou liste vide si premier projet)

---

### **Étape 3 : Créer le projet EasyCo iOS**

```
Crée un nouveau projet Penpot avec ces informations :
- Nom : "EasyCo iOS"
- Description : "Application mobile iOS pour la gestion locative et coliving - Design system complet"

Utilise le design system situé dans ces fichiers :
- /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/DESIGN_SYSTEM.md
- /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/design-tokens.json
```

---

### **Étape 4 : Créer les artboards des écrans principaux**

```
Dans le projet "EasyCo iOS", crée les artboards suivants (format iPhone 15 Pro : 393x852pt) :

1. Welcome Screen
   - Fond : Guest mode view avec blur
   - Sheet glassmorphism en bas
   - Logo EasyCo
   - Boutons : "Se connecter", "Créer un compte", "Explorer en invité"

2. Login/Signup Screen
   - Gradient background (#F3E5F5 → #FFF9E6)
   - Card blanche centrée
   - Toggle Connexion/Inscription
   - Champs email/password
   - Bouton CTA violet

3. Resident Dashboard
   - Header "Mon Logement"
   - Card propriété actuelle
   - Card prochain paiement
   - Graphique donut répartition charges
   - Actions rapides (grid 2x2)
   - Historique paiements
   - Demandes maintenance

4. Property List
   - Search bar avec filtres
   - Cards de propriétés avec :
     - Photo (160pt height)
     - Badge prix
     - Localisation
     - Caractéristiques (bed/bath/area)

5. Property Detail
   - Gallery photos (TabView)
   - Titre + prix
   - Localisation
   - Détails (chambres, bains, surface)
   - Description
   - Équipements (grid)
   - Bouton CTA "Postuler"

6. Swipe Matching
   - Card 70% screen height
   - Photo plein écran
   - Score compatibilité en haut
   - Overlays swipe (vert/rouge)

7. Chat View
   - Liste conversations (si liste)
   - OU Bulles messages style iMessage
   - Input avec emoji picker

8. Profile View
   - Photo de profil
   - Infos personnelles
   - Score compatibilité (radar chart)
   - Badge vérification

Utilise la palette de couleurs et les styles du design system DESIGN_SYSTEM.md
```

---

### **Étape 5 : Exporter les designs**

```
Exporte tous les artboards créés en :
- Format SVG (pour vecteurs)
- Format PNG @2x (pour preview)

Sauvegarde-les dans : /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/Designs/
```

---

## 🎨 Design System à utiliser

Les fichiers de référence sont :
- **Design System complet** : `DESIGN_SYSTEM.md`
- **Design Tokens JSON** : `design-tokens.json`

### Couleurs principales :
- Primary : #4A148C
- Primary Light : #6A1B9A
- Accent Yellow : #FFC107
- Success : #4CAF50
- Background : #FAFAFA
- Card : #FFFFFF

### Typography :
- Display : SF Pro Display Bold 32-40pt
- Titles : SF Pro Display Semibold 20-28pt
- Body : SF Pro Text Regular 14-16pt

### Spacing :
- xs: 8pt, sm: 12pt, md: 16pt, lg: 24pt, xl: 32pt

### Border Radius :
- Buttons/Inputs : 12pt
- Cards : 16pt
- Cards elevated : 20pt

---

## ✅ Checklist de vérification

Après chaque étape, vérifie que :

- [ ] Les outils Penpot sont disponibles
- [ ] La connexion à ton compte Penpot fonctionne
- [ ] Le projet "EasyCo iOS" est créé
- [ ] Les 8 artboards sont créés avec les bonnes dimensions
- [ ] Les couleurs correspondent au design system
- [ ] Les typographies sont correctes
- [ ] Les spacing sont cohérents
- [ ] Les exports SVG/PNG sont générés

---

## 🐛 Si ça ne marche pas

Si les outils MCP Penpot ne sont pas disponibles dans le terminal Claude :

1. **Vérifie la config MCP** :
   ```bash
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

2. **Vérifie que le serveur fonctionne** :
   ```bash
   export PATH="$HOME/.local/bin:$PATH"
   uvx penpot-mcp --help
   ```

3. **Essaie de redémarrer Claude Desktop** complètement

4. **Alternative** : Utilise Claude Desktop (app graphique) au lieu du terminal

---

## 📞 Support

Si tu as des questions ou problèmes :
- Reviens dans VSCode Claude Code
- Décris ce qui s'est passé
- Je t'aiderai à débugger ou à trouver une solution alternative

---

**Bonne chance ! 🚀🎨**
