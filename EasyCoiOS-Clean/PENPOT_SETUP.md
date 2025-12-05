# Configuration Penpot MCP - Guide Complet

## ✅ Ce qui a été fait

### 1. Installation Penpot MCP
- ✅ Package manager `uv` installé
- ✅ Serveur `penpot-mcp` installé via uvx
- ✅ Serveur accessible à `/Users/samuelbaudon/.local/bin/uvx`

### 2. Configuration Claude Desktop
- ✅ Fichier de config MCP créé : `~/Library/Application Support/Claude/claude_desktop_config.json`
- ✅ Token d'authentification Penpot ajouté
- ✅ URL de l'API Penpot configurée

### 3. Design System créé
- ✅ Documentation complète : [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- ✅ Design tokens JSON : [design-tokens.json](./design-tokens.json)

---

## 🔄 Prochaine Étape : Redémarrer Claude Desktop

Pour activer le serveur MCP Penpot, **redémarre Claude Desktop** :

### Sur macOS :
1. **Quitter complètement** : `Cmd+Q` ou `Claude → Quit`
2. **Rouvrir Claude Desktop**
3. Le serveur MCP Penpot se chargera automatiquement

### Vérification après redémarrage :
Demande à Claude : *"Peux-tu lister les outils MCP disponibles ?"*

Tu devrais voir les outils Penpot disponibles :
- `penpot_list_projects` - Lister les projets
- `penpot_create_project` - Créer un projet
- `penpot_create_file` - Créer un fichier de design
- `penpot_get_file` - Récupérer un fichier
- `penpot_export` - Exporter en SVG/PNG/PDF
- etc.

---

## 📋 Configuration MCP actuelle

Le fichier `~/Library/Application Support/Claude/claude_desktop_config.json` contient :

```json
{
  "mcpServers": {
    "penpot": {
      "command": "/Users/samuelbaudon/.local/bin/uvx",
      "args": ["penpot-mcp"],
      "env": {
        "PENPOT_TOKEN": "votre_token_ici",
        "PENPOT_API_URL": "https://design.penpot.app"
      }
    }
  }
}
```

---

## 🎨 Prochaines Actions (après redémarrage)

### 1. Tester la connexion Penpot
Demande à Claude :
```
Peux-tu lister mes projets Penpot ?
```

### 2. Créer le projet EasyCo iOS
Demande à Claude :
```
Crée un nouveau projet Penpot nommé "EasyCo iOS" avec une description
"Application mobile iOS pour la gestion locative et coliving"
```

### 3. Générer les designs des écrans
Une fois le projet créé, demande à Claude de générer les designs :
- Welcome Screen avec glassmorphism
- Login/Signup screens
- Resident Dashboard
- Property List & Detail
- Swipe Matching
- Chat interface
- Profile screen

---

## 📚 Ressources créées

### Design System complet
📄 [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

Contient :
- 🎨 Palette de couleurs complète
- 📐 Système de typographie
- 📏 Spacing & Layout
- 🔘 Composants UI (Boutons, Cards, Inputs, Badges)
- 🎭 Animations & Transitions
- 🖼️ Iconographie
- 🌈 Gradients spéciaux

### Design Tokens JSON
📄 [design-tokens.json](./design-tokens.json)

Format standard pour import dans :
- Figma (via plugin Figma Tokens)
- Penpot (via import JSON)
- Code Swift (génération automatique)

---

## 🛠️ Commandes utiles

### Vérifier l'installation
```bash
# Vérifier uvx
which uvx
uvx --version

# Tester Penpot MCP
export PATH="$HOME/.local/bin:$PATH"
uvx penpot-mcp --help
```

### Voir la config MCP
```bash
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### Relancer le serveur manuellement (debug)
```bash
export PATH="$HOME/.local/bin:$PATH"
export PENPOT_TOKEN="votre_token"
export PENPOT_API_URL="https://design.penpot.app"
uvx penpot-mcp
```

---

## 🐛 Troubleshooting

### Le serveur MCP ne se charge pas
1. Vérifier que Claude Desktop est **complètement redémarré**
2. Vérifier le fichier de config : `~/Library/Application Support/Claude/claude_desktop_config.json`
3. Vérifier les logs de Claude Desktop (si disponibles)

### Erreur d'authentification
1. Vérifier que le token Penpot est correct
2. Se reconnecter à [design.penpot.app](https://design.penpot.app)
3. Régénérer un nouveau token si nécessaire

### Commande uvx non trouvée
```bash
# Ajouter au PATH
export PATH="$HOME/.local/bin:$PATH"

# Ou réinstaller uv
curl -LsSf https://astral.sh/uv/install.sh | sh
```

---

## 🎯 Workflow de design avec Penpot + Claude

### 1. Création programmatique
Claude peut créer des designs directement via l'API Penpot :
- Frames/Artboards
- Formes (rectangles, cercles, polygones)
- Texte avec styles
- Images
- Groupes et composants

### 2. Export automatique
Claude peut exporter en :
- **SVG** - Vecteurs pour intégration web/mobile
- **PNG** - Rasters haute qualité
- **PDF** - Documentation

### 3. Synchronisation code ↔ design
- Extraire les couleurs/styles depuis Penpot
- Générer du code Swift depuis les designs
- Valider la conformité au design system

---

## 📞 Support

### Documentation officielle
- [Penpot MCP GitHub](https://github.com/montevive/penpot-mcp)
- [Penpot API Documentation](https://help.penpot.app/plugins/api/)
- [MCP Protocol Docs](https://modelcontextprotocol.io/)

### Liens utiles
- [Penpot Web App](https://design.penpot.app)
- [Penpot Community](https://community.penpot.app)
- [Design Tokens Format](https://tokens.studio/)

---

## ✨ Prochaine étape

**➡️ Redémarre Claude Desktop maintenant !**

Puis reviens me dire : *"C'est fait, teste la connexion Penpot"*

Et on pourra commencer à générer les designs de ton app EasyCo iOS ! 🚀

---

**Made with ❤️ for EasyCo**
**Penpot MCP Setup - December 2024**
