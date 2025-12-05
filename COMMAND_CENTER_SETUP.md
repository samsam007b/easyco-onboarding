# 🎯 COMMAND CENTER - Guide Complet de Setup

## Vue d'ensemble

Votre Command Center est votre cockpit de productivité. C'est LA page que vous ouvrez chaque matin pour avoir une vue complète de tout ce qui se passe dans votre vie pro et académique.

---

## 🏗️ ARCHITECTURE NOTION

### Structure Hiérarchique

```
📊 COMMAND CENTER (Page principale)
│
├── 🚀 EasyCo/IzzIco Hub
│   ├── 📈 Dashboard Metrics
│   ├── 🐛 Bug Tracker (lié à GitHub/Sentry)
│   ├── 🎯 Sprint Planning
│   ├── 💰 Funding Opportunities
│   └── 📣 Communication Log
│
├── 📚 IHECS - Académique
│   ├── 📅 Deadline Tracker
│   ├── 📖 Bibliographie Think Tanks
│   ├── 📝 Travaux en Cours
│   ├── ✅ Checklist Normes APA
│   └── 🎓 Notes de Cours
│
├── 💼 Career & Stages
│   ├── 🎯 Opportunités Actives
│   ├── 📧 Contacts & Network
│   ├── 📄 Templates (CV, LM)
│   └── 🗓️ Interview Prep
│
├── 🎨 Projets Créatifs
│   ├── 🎨 Agoria Campaign
│   ├── 🎬 IA DAYS (Timeline 4j)
│   ├── 📱 CARE (Podcast/Vidéo)
│   └── 🎙️ Discours Éloquence
│
├── 📬 Inbox & Tasks
│   ├── 📧 Emails à Traiter
│   ├── ✅ Today's Tasks
│   ├── 📌 Cette Semaine
│   └── 🔮 Backlog
│
└── 📊 Analytics & Reviews
    ├── 📅 Weekly Reviews
    ├── 📈 Productivity Metrics
    └── 🎯 Goals Tracking
```

---

## 📦 BASES DE DONNÉES NOTION À CRÉER

### 1. 🚀 **EasyCo Sprint Board** (Database)

**Type** : Board (Kanban)

**Propriétés** :
- `Titre` (Title)
- `Status` (Select) : Backlog / To Do / In Progress / Testing / Done
- `Type` (Select) : Feature / Bug / Improvement / Documentation
- `Priorité` (Select) : 🔴 Critique / 🟠 Haute / 🟡 Moyenne / 🟢 Basse
- `GitHub Issue` (URL)
- `Sentry Link` (URL)
- `Sprint` (Select) : S1, S2, S3...
- `Assigné` (Person)
- `Date limite` (Date)
- `Tags` (Multi-select) : Frontend, Backend, iOS, Database, Design

**Vues** :
1. Board par Status
2. Liste par Priorité
3. Timeline par Sprint
4. Filtre "Bugs seulement"

---

### 2. 💰 **Funding Tracker** (Database)

**Type** : Table

**Propriétés** :
- `Nom de l'opportunité` (Title)
- `Type` (Select) : Bourse / Incubateur / Concours / Subside / Investissement
- `Montant` (Number) → €
- `Deadline` (Date)
- `Status` (Select) : 🔍 À explorer / 📝 En cours / ✅ Soumis / ❌ Rejeté / ✅ Obtenu
- `Éligibilité` (Select) : ✅ Éligible / ⚠️ À vérifier / ❌ Non éligible
- `URL` (URL)
- `Contact` (Email)
- `Notes` (Text)
- `Documents requis` (Multi-select)

**Vues** :
1. Calendrier par Deadline
2. Filtre "Éligible + Deadline proche"
3. Board par Status

---

### 3. 📚 **Deadline Tracker IHECS** (Database)

**Type** : Calendar + Table

**Propriétés** :
- `Devoir` (Title)
- `Cours` (Select) : Public Affairs / Communication Stratégique / Mémoire / etc.
- `Type` (Select) : Devoir / Présentation / Examen / Lecture / Projet
- `Date limite` (Date)
- `Status` (Select) : 📝 À faire / 🔄 En cours / ✅ Terminé / 📮 Rendu
- `Priorité` (Select) : 🔴 Urgent / 🟠 Important / 🟡 Normal
- `Temps estimé` (Number) → heures
- `Dépendances` (Relation) → autres devoirs
- `Notes` (Text)
- `Fichiers` (Files)

**Vues** :
1. Calendrier mensuel
2. Liste "Cette semaine"
3. Board par Status
4. Filtre "Urgent + Non terminé"

---

### 4. 📖 **Bibliographie Think Tanks** (Database)

**Type** : Table

**Propriétés** :
- `Référence APA` (Title) → Format automatique
- `Auteur(s)` (Text)
- `Année` (Number)
- `Type` (Select) : Article académique / Livre / Rapport / Thèse / Site web
- `Thème principal` (Multi-select) : Influence / Démocratie / Idéologie / Média / Lobbying
- `Pertinence` (Select) : ⭐⭐⭐ Essentiel / ⭐⭐ Important / ⭐ Secondaire
- `État de lecture` (Select) : 📚 À lire / 👀 En cours / ✅ Lu / 📝 Fiche faite
- `Citations clés` (Text)
- `Notes de lecture` (Text)
- `PDF` (Files)
- `DOI/URL` (URL)

**Vues** :
1. Liste par pertinence
2. Filtre "À lire en priorité"
3. Par thème
4. Timeline de lecture

---

### 5. 💼 **Opportunités Stages** (Database)

**Type** : Board

**Propriétés** :
- `Entreprise` (Title)
- `Poste` (Text)
- `Type` (Select) : Stage / Job étudiant / Freelance / CDI futur
- `Secteur` (Select) : Public Affairs / EU Affairs / Communication / Lobbying
- `Status` (Select) : 🔍 Découvert / 📧 Contact initial / 📝 Candidature envoyée / 📞 Interview planifié / ⏳ En attente / ✅ Accepté / ❌ Refusé
- `Deadline candidature` (Date)
- `Date interview` (Date)
- `Contact principal` (Text)
- `Email` (Email)
- `LinkedIn` (URL)
- `Localisation` (Select) : Bruxelles / Remote / Autre
- `Salaire/Rémunération` (Text)
- `Notes` (Text)
- `Documents envoyés` (Multi-select) : CV / LM / Portfolio

**Vues** :
1. Board par Status
2. Calendrier des interviews
3. Liste "Active applications"

---

### 6. 🎨 **Projets Créatifs** (Database)

**Type** : Gallery + Board

**Propriétés** :
- `Nom du projet` (Title)
- `Client/Cours` (Select) : Agoria / CARE / IA DAYS / Personnel
- `Type` (Select) : Campagne / Vidéo / Design / Audio / Écriture
- `Status` (Select) : 💡 Idéation / 🎨 Création / 🔄 Révision / ✅ Finalisé / 📮 Livré
- `Deadline` (Date)
- `Phase actuelle` (Select)
- `Fichiers Figma` (URL)
- `Fichiers Canva` (URL)
- `Assets` (Files)
- `Thumbnail` (Files) → pour la vue Gallery
- `Notes créatives` (Text)

**Vues** :
1. Gallery avec thumbnails
2. Timeline par deadline
3. Board par status
4. Filtre par client

---

### 7. 📬 **Master Inbox** (Database)

**Type** : Table

**Propriétés** :
- `Item` (Title)
- `Source` (Select) : Gmail / Discord / Conversation / Idée
- `Catégorie` (Select) : 🚀 EasyCo / 📚 IHECS / 💼 Career / 🎨 Créatif / 💡 Idée / ❓ Divers
- `Priorité` (Select) : 🔴 Urgent / 🟠 Important / 🟡 Normal / 🔵 Info
- `Action requise` (Text)
- `Temps estimé` (Number) → minutes
- `Date d'ajout` (Created time)
- `Status` (Select) : 📥 Nouveau / 👀 En cours / ✅ Traité / ➡️ Délégué / 🗑️ Archivé
- `Deadline` (Date)

**Vues** :
1. Filtre "À traiter aujourd'hui"
2. Par catégorie
3. Par priorité
4. "Quick wins" (< 15min)

---

### 8. 📊 **Weekly Reviews** (Database)

**Type** : Table

**Propriétés** :
- `Semaine` (Title) → Format "S01 2025 - 6-12 Jan"
- `Date` (Date)
- `EasyCo - Commits` (Number)
- `EasyCo - Features shipped` (Number)
- `IHECS - Devoirs rendus` (Number)
- `IHECS - Heures d'étude` (Number)
- `Emails traités` (Number)
- `Meetings/Interviews` (Number)
- `Temps productif total` (Number) → heures
- `Wins de la semaine` (Text)
- `Blocages rencontrés` (Text)
- `Leçons apprises` (Text)
- `Top 3 priorités semaine suivante` (Text)
- `Score énergie` (Select) : 🔋🔋🔋 / 🔋🔋 / 🔋
- `Score satisfaction` (Select) : 😄 / 😐 / 😞

**Vues** :
1. Liste chronologique
2. Graphiques de métriques (si Notion Charts activé)

---

## 🎨 PAGE PRINCIPALE : COMMAND CENTER

### Structure de la page

```markdown
# 🎯 COMMAND CENTER
*Dernière mise à jour : [Auto]*

---

## ⚡ Today at a Glance

[Embedded view: Master Inbox - Filtre "Aujourd'hui"]
[Embedded view: Deadline Tracker - Filtre "Cette semaine"]
[Embedded view: Google Calendar - Today]

---

## 🚀 EasyCo/IzzIco Hub

### 📈 Quick Metrics
- 🐛 Bugs actifs : [Linked view: Sprint Board - Bugs]
- 🎯 Sprint actuel : [S# - X/Y tasks done]
- ⚠️ Erreurs Sentry (24h) : [À tracker via workflow]
- 💾 Supabase Status : [À vérifier via workflow]

[Embedded view: EasyCo Sprint Board - Current Sprint]
[Embedded view: Funding Tracker - Deadlines proches]

🔗 [Accès rapide GitHub](https://github.com/...) | [Sentry](https://sentry.io/...) | [Supabase Dashboard](https://supabase.com/...)

---

## 📚 IHECS - Vue Académique

### 🎯 Deadlines Imminentes
[Embedded view: Deadline Tracker - Urgent + Non terminé]

### 📖 Mémoire Think Tanks
- 📊 Progression : [X/Y articles lus]
- 📝 Prochaine étape : [À définir]

[Embedded view: Bibliographie - À lire en priorité]

---

## 💼 Career & Stages

[Embedded view: Opportunités Stages - Active applications]

### 🎯 Next Actions
- [ ] [Auto-généré via workflow]

---

## 🎨 Projets Créatifs

[Embedded view: Projets Créatifs - En cours]

---

## 📊 This Week

### ✅ Accomplissements
- [Auto-rempli via Weekly Review workflow]

### 🎯 Top 3 Priorités
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

### ⏱️ Time Allocation Target
- 🚀 EasyCo : 40%
- 📚 IHECS : 35%
- 💼 Career : 15%
- 🎨 Créatif : 10%

---

## 🔗 Quick Links

### 🛠️ Outils
- [Gmail](https://gmail.com)
- [Google Calendar](https://calendar.google.com)
- [GitHub](https://github.com)
- [Figma](https://figma.com)
- [Canva](https://canva.com)

### 📚 Resources
- [APA Style Guide](https://apastyle.apa.org/)
- [IHECS Intranet](#)
- [TED Tenders](https://ted.europa.eu/)

---

## 🤖 Commandes Rube Rapides

Copier-coller dans Claude Code :

### Morning Briefing
```
Crée mon morning briefing : analyse mes emails Gmail non lus, mes événements Google Calendar d'aujourd'hui, mes tâches Notion prioritaires, l'activité GitHub EasyCo d'hier, et résume tout dans la section "Today at a Glance" de mon Command Center Notion
```

### Weekly Review
```
Génère ma weekly review : compile mes commits GitHub cette semaine, mes devoirs IHECS rendus, mes emails traités, mes meetings, et crée une nouvelle entrée dans ma database Weekly Reviews Notion
```

### Smart Task Routing
```
Analyse mes 20 derniers emails Gmail, identifie ceux qui nécessitent une action, catégorise-les (EasyCo/IHECS/Career/Créatif), et ajoute-les à ma Master Inbox Notion avec priorité appropriée
```

---

*Ce Command Center est vivant. Il évolue avec vos workflows. Personnalisez-le !*
```

---

## 🚀 PROCHAINES ÉTAPES

1. **Créer ces databases dans Notion** (je vais vous guider)
2. **Configurer les workflows Rube** pour automatiser l'alimentation
3. **Tester les commandes** une par une
4. **Itérer et optimiser** selon vos retours

---

## 💡 NOTION PRO TIPS

### Raccourcis clavier essentiels
- `/` → Menu de blocs
- `@` → Mentionner une page/personne/date
- `Cmd/Ctrl + P` → Recherche rapide
- `Cmd/Ctrl + E` → Inline code
- `Cmd/Ctrl + Shift + L` → Toggle dark mode

### Features puissantes à utiliser
1. **Relations & Rollups** : Connectez vos databases entre elles
2. **Formulas** : Calculs automatiques (ex: temps restant avant deadline)
3. **Templates** : Créez des templates pour tâches récurrentes
4. **Synced Blocks** : Réutilisez du contenu à plusieurs endroits
5. **Web Clipper** : Sauvegardez des articles directement dans Notion

### Organisation
- Utilisez des **emojis** pour la navigation visuelle rapide
- Créez des **toggles** pour masquer les sections moins utilisées
- Utilisez **Timeline view** pour visualiser vos projets
- **Gallery view** pour vos projets créatifs avec thumbnails

---

## 🎯 PHILOSOPHIE DU SYSTÈME

Ce Command Center suit le principe **"Capture → Clarify → Organize → Reflect → Engage"** (GTD adapté) :

1. **Capture** : Master Inbox attrape tout
2. **Clarify** : Workflows Rube catégorisent automatiquement
3. **Organize** : Databases spécialisées structurent l'info
4. **Reflect** : Weekly Reviews vous font prendre du recul
5. **Engage** : Today at a Glance vous dit quoi faire maintenant

**Objectif** : Libérer votre cerveau pour la créativité et l'exécution, pas la gestion.
