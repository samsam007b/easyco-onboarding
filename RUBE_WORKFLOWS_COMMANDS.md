# 🤖 RUBE WORKFLOWS - Commandes Complètes

Ce document contient toutes les commandes à utiliser avec Rube pour automatiser votre productivité.

---

## 📋 TABLE DES MATIÈRES

1. [Morning Routines](#morning-routines)
2. [EasyCo/IzzIco Workflows](#eascoizzico-workflows)
3. [IHECS Académique](#ihecs-académique)
4. [Career & Stages](#career--stages)
5. [Projets Créatifs](#projets-créatifs)
6. [Evening & Weekly Reviews](#evening--weekly-reviews)
7. [Maintenance & Optimization](#maintenance--optimization)

---

## 🌅 MORNING ROUTINES

### 1. Morning Briefing Complet

**Fréquence** : Chaque matin à 8h (ou à la demande)

**Commande** :
```
Crée mon morning briefing quotidien :

1. Analyse mes emails Gmail non lus depuis hier 18h
2. Liste mes événements Google Calendar pour aujourd'hui
3. Vérifie mes tâches Notion dans "Master Inbox" avec priorité Urgent ou Important
4. Vérifie l'activité GitHub sur le repo EasyCo depuis hier
5. Vérifie s'il y a de nouvelles erreurs critiques dans Sentry
6. Compile tout ça dans un message Discord formaté avec :
   - 📧 Top 3 emails à traiter en priorité
   - 📅 Mes événements du jour avec horaires
   - ✅ Mes 5 tâches prioritaires
   - 🚀 Résumé activité EasyCo (commits, PRs, issues)
   - ⚠️ Alertes éventuelles (bugs, deadlines proches)
```

**Résultat attendu** : Un message Discord complet qui vous dit exactement comment démarrer votre journée.

---

### 2. Smart Email Triage

**Fréquence** : 2-3x par jour (matin, midi, soir)

**Commande** :
```
Analyse mes 30 derniers emails Gmail non lus et :

1. Catégorise-les automatiquement :
   - 🚀 EasyCo/IzzIco (mentions de startup, tech, fundraising)
   - 📚 IHECS (emails du domaine @ihecs.be, profs, deadlines)
   - 💼 Career (stages, opportunités, recruteurs, LinkedIn)
   - 🎨 Créatif (Agoria, projets communication)
   - 💡 Newsletters/Veille
   - 🗑️ Spam/Non prioritaire

2. Pour chaque email catégorie EasyCo/IHECS/Career/Créatif :
   - Ajoute une ligne dans ma database Notion "Master Inbox"
   - Indique l'action requise
   - Estime le temps nécessaire (5min/15min/30min/1h+)
   - Définis la priorité (Urgent/Important/Normal)

3. Envoie-moi un résumé sur Discord avec le nombre d'items par catégorie

4. Archive automatiquement les newsletters et spam après extraction d'infos pertinentes
```

---

### 3. Calendar Optimizer

**Fréquence** : Chaque matin après briefing

**Commande** :
```
Optimise mon calendrier Google Calendar pour aujourd'hui :

1. Analyse mes tâches Notion prioritaires (Master Inbox + Deadline Tracker)
2. Identifie les tâches sans créneau bloqué
3. Calcule le temps libre entre mes événements existants
4. Propose des blocs de temps pour :
   - Deep work EasyCo (idéalement 2-3h d'affilée)
   - Travail académique IHECS (selon deadlines proches)
   - Batch emails (30min max)
   - Pause déjeuner (si pas déjà bloqué)

5. Crée des événements "Focus Time" dans mon calendrier avec :
   - Titre clair (ex: "🚀 EasyCo - Dev Feature X")
   - Description avec lien Notion vers la tâche
   - Couleur selon catégorie

6. Envoie-moi le planning proposé sur Discord pour validation avant création
```

---

## 🚀 EASC0/IZZICO WORKFLOWS

### 4. Dev Sprint Daily Update

**Fréquence** : Chaque soir à 18h

**Commande** :
```
Génère mon daily update EasyCo :

1. Analyse l'activité GitHub aujourd'hui :
   - Commits pushés (avec messages)
   - Pull Requests créées/mergées
   - Issues ouvertes/fermées
   - Code reviews effectuées

2. Vérifie Sentry :
   - Nouvelles erreurs critiques
   - Erreurs résolues
   - Tendances (hausse/baisse des erreurs)

3. Check Supabase (si possible via API) :
   - Status général
   - Nombre de requêtes aujourd'hui
   - Éventuels problèmes

4. Met à jour ma database Notion "EasyCo Sprint Board" :
   - Déplace les tâches terminées vers "Done"
   - Ajoute les nouveaux bugs Sentry comme issues

5. Crée une note quotidienne dans Notion page "EasyCo Hub" avec :
   - Résumé de la journée
   - Accomplissements
   - Blocages rencontrés
   - Next steps pour demain

6. Envoie le résumé sur Discord
```

---

### 5. Bug Triage Automatique

**Fréquence** : Dès qu'une erreur critique apparaît dans Sentry (idéalement)

**Commande de setup** :
```
Configure un monitoring Sentry -> Notion :

Quand une nouvelle erreur "critical" ou "error" apparaît dans Sentry :

1. Crée automatiquement une entrée dans "EasyCo Sprint Board" avec :
   - Titre : "[BUG] [Sentry-ID] Message d'erreur"
   - Type : Bug
   - Priorité : 🔴 Critique (si critical) ou 🟠 Haute (si error)
   - Status : To Do
   - Lien Sentry dans la propriété dédiée
   - Stack trace copiée dans les notes

2. Si l'erreur affecte >50 utilisateurs ou se répète >10x en 1h :
   - Envoie une notification Discord immédiate
   - Crée un événement "🚨 Bug Critical" dans Google Calendar dans l'heure suivante

3. Si c'est un bug déjà connu (même message) :
   - Met à jour le compteur d'occurrences
   - Pas de nouvelle notification
```

---

### 6. Funding Opportunities Scanner

**Fréquence** : 2x par semaine (lundi et jeudi)

**Commande** :
```
Recherche de nouvelles opportunités de financement pour EasyCo :

1. Analyse mes emails Gmail des 3 derniers jours avec mots-clés :
   - "bourse", "financement", "startup", "incubateur", "concours"
   - "grant", "funding", "pitch", "accelerator", "call for proposals"

2. Pour chaque opportunité identifiée :
   - Vérifie si elle existe déjà dans ma database "Funding Tracker" Notion
   - Si nouvelle : crée une entrée avec toutes les infos disponibles
   - Extrait : montant, deadline, critères d'éligibilité
   - Définis le Status : "🔍 À explorer"
   - Ajoute une tâche dans Master Inbox : "Analyser opportunité [Nom]"

3. Recherche sur le web (si possible) :
   - Nouvelles bourses belges pour startups 2025
   - Programmes d'incubation Bruxelles
   - Concours pitch startup Belgique

4. Génère un rapport Notion avec :
   - Nombre d'opportunités trouvées
   - Top 3 à investiguer en priorité (selon montant et deadline)
   - Calendrier des deadlines ce mois-ci

5. Envoie le rapport sur Discord avec lien vers la page Notion
```

---

### 7. GitHub Activity Report (Weekly)

**Fréquence** : Chaque vendredi soir

**Commande** :
```
Génère mon rapport hebdomadaire GitHub pour EasyCo :

1. Compile les stats de la semaine :
   - Nombre de commits
   - Lignes de code ajoutées/supprimées
   - Pull Requests créées/mergées/en review
   - Issues ouvertes/fermées
   - Fichiers modifiés (top 10)

2. Identifie les highlights :
   - Plus gros refactoring
   - Nouvelles features ajoutées
   - Bugs critiques résolus

3. Crée une page Notion "📊 GitHub Week [numéro semaine]" dans EasyCo Hub avec :
   - Graphiques de commits (si possible)
   - Liste des PRs avec liens
   - Ratio bugs/features
   - Velocity (issues closed vs opened)

4. Prépare un tweet-thread (brouillon) :
   - "Cette semaine sur EasyCo : [highlights]"
   - Stats clés
   - Screenshot(s) si pertinent
   - Hashtags : #BuildInPublic #Startup #Belgium

5. Enregistre le thread dans Notion pour review avant publication
```

---

## 📚 IHECS ACADÉMIQUE

### 8. Deadline Tracker Auto-Update

**Fréquence** : Quotidien, chaque matin après email check

**Commande** :
```
Scan mes emails IHECS pour nouveaux deadlines :

1. Analyse tous les emails de @ihecs.be et profs connus reçus depuis 24h

2. Détecte les patterns de deadline :
   - "à rendre le", "deadline", "date limite", "pour le [date]"
   - "examen le", "présentation le", "projet à soumettre"

3. Pour chaque deadline identifié :
   - Vérifie si existe déjà dans "Deadline Tracker IHECS" Notion
   - Si nouveau : crée une entrée avec :
     * Nom du devoir
     * Cours concerné (extrait de l'email ou du sujet)
     * Date limite
     * Type (Devoir/Examen/Présentation/Projet)
     * Status : 📝 À faire
     * Notes initiales (copie de la consigne email)

4. Calcule le temps restant et définis priorité :
   - < 3 jours : 🔴 Urgent
   - 3-7 jours : 🟠 Important
   - > 7 jours : 🟡 Normal

5. Pour les deadlines < 7 jours :
   - Ajoute une tâche dans Master Inbox
   - Bloque un créneau dans Google Calendar si pas déjà fait
   - Notifie sur Discord

6. Génère une vue "Cette semaine" avec tous les devoirs à rendre
```

---

### 9. Bibliographie Manager (Think Tanks)

**Fréquence** : À chaque ajout d'article/source

**Commande** :
```
Gère ma bibliographie pour le mémoire Think Tanks :

1. Quand je reçois un PDF par email Gmail :
   - Vérifie si sujet lié aux think tanks (mots-clés : think tank, influence, lobbying, policy, etc.)
   - Si oui : sauvegarde dans Google Drive folder "Mémoire Think Tanks"

2. Extrait les métadonnées :
   - Auteur(s)
   - Titre
   - Année de publication
   - DOI (si disponible)
   - Journal/Publisher

3. Génère automatiquement la référence APA :
   - Format : Auteur, A. A. (Année). Titre de l'article. Titre de la revue, Volume(Numéro), pages. DOI
   - Exemple : Cervera-Marzal, M. (2022). Les think tanks progressistes...

4. Crée une entrée dans database "Bibliographie Think Tanks" Notion :
   - Référence APA complète
   - Métadonnées séparées
   - Lien vers PDF dans Drive
   - État de lecture : 📚 À lire
   - Thème principal : [à définir manuellement]
   - Pertinence : [à évaluer après lecture]

5. Ajoute une tâche "Lire et ficher [Titre court]" dans Master Inbox

6. Met à jour un compteur : "Articles bibliographie : X/[target]"
```

---

### 10. APA Citation Helper

**Fréquence** : Sur demande

**Commande** :
```
Aide-moi à formater cette source en APA (7ème édition) :

[Coller les infos de la source : auteur, titre, année, journal, etc.]

1. Génère la référence APA complète
2. Vérifie les règles IHECS spécifiques si différentes
3. Ajoute à ma database "Bibliographie Think Tanks" Notion
4. Copie la référence formatée dans mon presse-papier (si possible)

Format de sortie :
- Référence bibliographique complète
- Citation dans le texte (Auteur, Année)
- Vérification : italiques, majuscules, ponctuation correcte
```

---

### 11. Study Session Timer & Logger

**Fréquence** : Pendant sessions d'étude

**Commande de démarrage** :
```
Lance une session d'étude IHECS pour [Sujet/Devoir] :

1. Crée un événement Google Calendar :
   - Titre : "📚 Étude - [Sujet]"
   - Durée : [XX minutes/heures]
   - Statut : Occupé
   - Description : Timer lancé via Rube

2. Envoie une notification Discord :
   - "🎯 Session d'étude démarrée : [Sujet]"
   - "⏱️ Durée prévue : [XX]"
   - "Focus mode ON"

3. À la fin de la session (après durée prévue) :
   - Envoie notification Discord : "⏰ Session terminée"
   - Demande un quick feedback : efficacité 1-5, accomplissements

4. Log dans Notion page "Analytics" :
   - Date + Durée + Sujet + Score efficacité
   - Ajout aux stats hebdomadaires
```

---

## 💼 CAREER & STAGES

### 12. Job Opportunities Scanner

**Fréquence** : 3x par semaine (lundi, mercredi, vendredi)

**Commande** :
```
Scanne mes sources pour opportunités de stage/carrière :

1. Analyse emails Gmail :
   - LinkedIn job alerts
   - Mails de recruteurs
   - Newsletters emploi
   - Contacts réseau mentionnant "stage", "opportunité", "hiring"

2. Pour chaque opportunité :
   - Entreprise + Poste
   - Secteur (Public Affairs / EU Affairs / Comm / Lobbying / Autre)
   - Type (Stage/Job/Freelance)
   - Localisation
   - Deadline candidature (si mentionnée)
   - Salaire/Rémunération (si indiqué)

3. Évalue la pertinence (1-5) selon mes critères :
   - Public Affairs / European Affairs
   - Bruxelles ou remote
   - Alignement avec mes intérêts (think tanks, influence, politiques publiques)

4. Crée une entrée dans "Opportunités Stages" Notion si score ≥ 3 :
   - Toutes les infos extraites
   - Status : 🔍 Découvert
   - Ajoute une tâche dans Master Inbox : "Analyser opportunité [Entreprise - Poste]"

5. Pour les opportunités score 5 (parfaites) :
   - Notification Discord immédiate
   - Crée un événement Google Calendar "⏰ Deadline candidature [Entreprise]" à J-2

6. Génère un rapport hebdomadaire :
   - Nouvelles opportunités trouvées
   - Top 3 à prioriser
   - Statistiques (nombre par secteur, localisation)
```

---

### 13. Application Tracker

**Fréquence** : Après chaque candidature envoyée (manuel trigger)

**Commande** :
```
J'ai envoyé une candidature pour [Entreprise - Poste] :

1. Met à jour l'entrée dans "Opportunités Stages" Notion :
   - Status : 📝 Candidature envoyée
   - Date d'envoi : aujourd'hui
   - Documents envoyés : [CV/LM/Portfolio - préciser lesquels]

2. Crée un follow-up automatique :
   - Événement Google Calendar dans 7 jours : "📧 Follow-up candidature [Entreprise]"
   - Tâche Notion : "Relancer [Entreprise] si pas de réponse"

3. Sauvegarde les documents envoyés :
   - Archive dans Google Drive folder "Candidatures 2025/[Entreprise]"
   - Liens dans l'entrée Notion

4. Log dans analytics :
   - +1 candidature ce mois-ci
   - Secteur, type de poste

5. Envoie confirmation Discord :
   - "✅ Candidature trackée : [Entreprise - Poste]"
   - "🗓️ Follow-up programmé pour [date]"
```

---

### 14. Interview Preparation Assistant

**Fréquence** : Dès qu'une interview est confirmée

**Commande** :
```
J'ai une interview avec [Entreprise] le [Date] à [Heure] :

1. Crée une page Notion dédiée "🎯 Interview [Entreprise]" :
   - Infos pratiques (date, heure, lieu/lien visio, contact)
   - Recherche entreprise (mission, valeurs, clients, actualités)
   - Recherche interlocuteur (LinkedIn, articles, profil)
   - Mes questions à poser (template)
   - Points clés à mentionner (mes compétences alignées avec le poste)
   - Notes pendant l'interview (template vierge)

2. Recherche d'infos (si possible web search) :
   - Site web de l'entreprise → Résumé activités
   - LinkedIn entreprise → Actualités récentes
   - Articles de presse mentionnant l'entreprise
   - Compile tout dans la page Notion

3. Prépare un dossier Google Drive "Interview [Entreprise]" :
   - CV envoyé
   - LM envoyée
   - Portfolio / travaux pertinents
   - Notes de préparation

4. Crée des événements Google Calendar :
   - L'interview elle-même (avec lien visio si fourni)
   - Veille : "🎯 Prép interview [Entreprise]" (2h bloquées)
   - 1h avant : Rappel "⏰ Interview dans 1h"

5. Prépare un checklist pré-interview :
   - [ ] Relire l'offre et ma candidature
   - [ ] Réviser ma page de préparation Notion
   - [ ] Préparer 3 questions pertinentes
   - [ ] Tester la connexion (si visio)
   - [ ] Avoir CV et notes à portée

6. Envoie sur Discord :
   - Confirmation de setup
   - Lien vers page Notion
   - Countdown jusqu'à l'interview
```

---

### 15. Network Contact Logger

**Fréquence** : Après chaque échange professionnel important

**Commande** :
```
Log mon échange avec [Nom de la personne] :

1. Crée/met à jour une fiche contact dans Notion "Contacts & Network" :
   - Nom complet
   - Entreprise + Poste
   - Secteur
   - LinkedIn URL
   - Email
   - Comment on s'est rencontré (contexte)
   - Date du dernier échange : aujourd'hui
   - Résumé de l'échange : [à compléter]
   - Potentiel de collaboration (1-5)
   - Sujets d'intérêt commun
   - Next step / follow-up prévu

2. Si la personne a mentionné une opportunité/info importante :
   - Crée une tâche dans Master Inbox
   - Lie la tâche à la fiche contact

3. Si un follow-up est prévu :
   - Crée un événement Google Calendar ou tâche Notion avec date
   - Rappel 2 jours avant

4. Log dans analytics :
   - +1 interaction réseau cette semaine
   - Secteur de la personne

5. Suggestion de message de remerciement/follow-up (brouillon) :
   - Email ou LinkedIn message
   - Ton approprié selon le contexte
   - Sauvegarde dans la fiche contact Notion
```

---

## 🎨 PROJETS CRÉATIFS

### 16. Agoria Campaign Tracker

**Fréquence** : Quotidien pendant la période du projet

**Commande** :
```
Update projet Agoria "Célébrons la conformité" :

1. Vérifie mes fichiers Figma récents :
   - Identifie les designs liés à Agoria (par nom)
   - Liste les dernières modifications
   - Compte le nombre de frames/composants

2. Crée/met à jour la page Notion "🎨 Campagne Agoria" :
   - Progression par phase (DA / Déclinaisons / Validation)
   - Inventaire des assets créés :
     * Affiche principale
     * Déclinaisons réseaux sociaux (LinkedIn, Instagram, Twitter)
     * Bannière web
     * Script radio
     * Éléments site web
   - Liens vers fichiers Figma/Canva
   - Deadlines restantes

3. Génère un status report :
   - % de complétion estimé
   - Prochaines étapes
   - Blocages éventuels

4. Si deadline < 3 jours :
   - Notification Discord prioritaire
   - Bloque des créneaux focus dans Google Calendar

5. Prépare une checklist de livraison :
   - [ ] Tous les formats exportés
   - [ ] Dossier client organisé
   - [ ] Rationnels créatifs rédigés
   - [ ] Présentation finale
```

---

### 17. IA DAYS Workflow (4 jours)

**Fréquence** : Au lancement du projet (puis tracking quotidien)

**Commande de setup** :
```
Lance le workflow IA DAYS (méthode 4 jours) pour [Nom du projet] :

1. Crée une page Notion "🎬 IA DAYS - [Nom projet]" avec structure :

   **JOUR 1 : IDÉATION**
   - [ ] Brainstorming concepts
   - [ ] Définition message clé
   - [ ] Storyboard / structure
   - [ ] Validation direction
   - Deadline : [Date J1] 18h

   **JOUR 2 : CRÉATION VISUELLE**
   - [ ] Design assets principaux
   - [ ] Création visuels (Figma/Canva)
   - [ ] Sélection images/vidéos stock
   - [ ] Palette couleurs finalisée
   - Deadline : [Date J2] 18h

   **JOUR 3 : ANIMATION / VOIX**
   - [ ] Enregistrement voix-off (si applicable)
   - [ ] Animation des visuels
   - [ ] Transitions
   - [ ] Musique / sound design
   - Deadline : [Date J3] 18h

   **JOUR 4 : MONTAGE FINAL**
   - [ ] Assemblage final
   - [ ] Étalonnage couleur
   - [ ] Mixage audio
   - [ ] Exports multiples formats
   - [ ] Review & ajustements
   - Deadline : [Date J4] 18h

2. Bloque 4 jours COMPLETS dans Google Calendar :
   - Chaque jour : 9h-18h "🎬 IA DAYS - [Nom projet] - JOUR X"
   - Status : Occupé (bloque toute autre réunion)
   - Description : Checklist du jour

3. Configure des rappels quotidiens :
   - Matin 9h : "🎬 IA DAYS Jour X - C'est parti !"
   - Soir 17h : "⏰ Il reste 1h - Checkpoint"
   - Soir 18h : "✅ End of Day X - Quick review"

4. Crée un channel Discord dédié ou section notes pour logs quotidiens

5. À la fin de chaque jour :
   - Demande un quick debrief (ce qui est fait, ce qui reste, blocages)
   - Update automatique de la page Notion
   - Si retard détecté : alerte + suggestion d'ajustement

6. Fin Jour 4 :
   - Checklist finale de livraison
   - Archive du projet dans Notion + Drive
   - Post-mortem rapide (qu'est-ce qui a bien marché, à améliorer)
```

---

### 18. Content Calendar (Multi-Projects)

**Fréquence** : Hebdomadaire (préparation de la semaine suivante)

**Commande** :
```
Prépare mon calendrier de contenu pour la semaine prochaine :

1. Analyse mes projets créatifs actifs dans Notion :
   - Agoria
   - CARE (podcast/vidéo)
   - IA DAYS
   - EasyCo (communication/marketing)
   - Personnel

2. Pour chaque projet avec contenu à publier :
   - Identifie les assets prêts (status "Finalisé" dans Notion)
   - Suggère des dates/horaires de publication optimaux
   - Plateformes appropriées (Twitter/LinkedIn/Instagram/YouTube)

3. Crée un planning dans Notion "📅 Content Calendar Semaine [X]" :
   - Vue calendrier
   - Chaque post planifié avec :
     * Date/Heure
     * Plateforme
     * Projet associé
     * Type de contenu (image/vidéo/texte/thread)
     * Statut (Brouillon/Programmé/Publié)
     * Lien vers l'asset

4. Pour chaque post :
   - Génère un brouillon de caption (si texte nécessaire)
   - Hashtags appropriés
   - Call-to-action

5. Crée des rappels Google Calendar :
   - 1h avant chaque publication prévue
   - Ou : planifie directement sur les plateformes si intégration possible

6. Envoie le planning sur Discord pour review

7. Track après publication :
   - Log des contenus publiés
   - Analytics basiques (à remplir manuellement ou automatiquement si API)
```

---

## 🌙 EVENING & WEEKLY REVIEWS

### 19. Evening Wind-Down

**Fréquence** : Chaque soir à 18h

**Commande** :
```
Fais mon bilan de fin de journée :

1. Résumé de ce qui a été accompli :
   - Tâches Notion passées en "✅ Traité" ou "Completed" aujourd'hui
   - Commits GitHub sur EasyCo
   - Emails traités (approximation basée sur activité Gmail)
   - Événements/meetings attendus (Google Calendar)

2. Check deadlines proches :
   - Scan "Deadline Tracker IHECS" : qu'est-ce qui arrive dans les 3 prochains jours ?
   - Scan "Opportunités Stages" : deadlines candidatures proches ?
   - Scan "Projets Créatifs" : livrables imminents ?

3. Prépare la todo list de demain :
   - Top 3 priorités basées sur urgence + importance
   - Crée 3 tâches "🌅 Tomorrow - [Task]" dans Master Inbox
   - Suggère un ordre d'attaque

4. Cleanup :
   - Archive les tâches "Traité" de plus de 2 jours dans Master Inbox
   - Marque les emails Gmail traités comme lus/archivés (si évident)

5. Calcule un "Productivity Score" (simple) :
   - Nombre de tâches complétées vs planifiées
   - Score : ⭐⭐⭐ Excellent / ⭐⭐ Bien / ⭐ À améliorer

6. Envoie le résumé sur Discord :
   - ✅ Accomplissements du jour
   - 🎯 Top 3 de demain
   - 💡 1 insight ou leçon apprise
   - Score de productivité
```

---

### 20. Weekly Review (vendredi soir ou dimanche)

**Fréquence** : Hebdomadaire

**Commande** :
```
Génère ma weekly review complète pour la semaine [numéro] :

1. Compile les métriques :

   **🚀 EasyCo/IzzIco**
   - Commits GitHub cette semaine
   - PRs mergées / Issues closed
   - Nouvelles features shipped
   - Bugs résolus
   - Heures estimées de dev (basé sur calendrier bloqué)

   **📚 IHECS**
   - Devoirs rendus
   - Heures d'étude loggées
   - Articles lus (bibliographie)
   - Progression mémoire
   - Notes obtenues (si applicable)

   **💼 Career**
   - Candidatures envoyées
   - Interviews réalisées
   - Nouvelles opportunités détectées
   - Contacts réseau (nouveaux/follow-ups)

   **🎨 Créatif**
   - Projets avancés
   - Assets créés
   - Contenus publiés

   **📊 Général**
   - Emails traités (estimation)
   - Meetings/événements
   - Temps productif total (basé sur calendar + logs)

2. Analyse qualitative :
   - **🏆 Top 3 Wins de la semaine** : plus grandes réussites
   - **🚧 Blocages rencontrés** : obstacles, difficultés
   - **💡 Leçons apprises** : insights, nouvelles compétences
   - **🔄 À améliorer** : process, habitudes, time management

3. Review des objectifs :
   - Objectifs de la semaine : atteints ? partiellement ? pas du tout ?
   - Pourquoi ? (analyse rapide)

4. Planning semaine prochaine :
   - **🎯 Top 3 Priorités** absolues
   - **📅 Deadlines à anticiper**
   - **⚠️ Risques/challenges** prévus
   - **🔗 Ajustements** à faire (workflows, planning, focus)

5. Métriques de bien-être :
   - **🔋 Score énergie** : 🔋🔋🔋 / 🔋🔋 / 🔋
   - **😊 Score satisfaction** : 😄 / 😐 / 😞
   - **⚖️ Équilibre vie pro/perso** : ressenti

6. Crée une entrée dans database "Weekly Reviews" Notion :
   - Toutes les métriques chiffrées
   - Sections qualitatives remplies
   - Graphiques (si possible)

7. Génère 2 visualisations (texte formaté) :
   - Timeline de la semaine (jour par jour, highlights)
   - Répartition du temps (EasyCo X% / IHECS Y% / Career Z% / Créatif W%)

8. Envoie le rapport complet sur Discord ET crée la page Notion

9. Bonus : Suggestion de rewards
   - Si productivité élevée : "Tu as mérité [suggestion activité plaisir]"
   - Si semaine difficile : "Prends soin de toi : [suggestion récupération]"
```

---

### 21. Monthly Review (fin de mois)

**Fréquence** : Mensuelle

**Commande** :
```
Génère ma monthly review pour [Mois Année] :

1. Agrège toutes les weekly reviews du mois depuis Notion

2. Calcule les métriques cumulées :
   - Total commits GitHub
   - Total devoirs IHECS rendus
   - Total candidatures envoyées
   - Total contenus créatifs produits
   - Total heures productives (estimation)

3. Identifie les tendances :
   - Progression vs mois précédent (hausse/baisse)
   - Patterns de productivité (meilleurs jours, meilleurs moments)
   - Catégories de tâches dominantes (où va mon temps ?)

4. Bilan objectifs mensuels :
   - Liste les objectifs du mois (si définis)
   - Status : atteints / en cours / abandonnés
   - Raisons des succès/échecs

5. Highlights du mois :
   - 🏆 Plus grande réussite
   - 💡 Plus grande leçon apprise
   - 🚀 Plus grosse avancée projet
   - 🤝 Meilleure rencontre/opportunité

6. Areas d'amélioration :
   - Qu'est-ce qui n'a pas bien marché ?
   - Quels workflows sont inefficaces ?
   - Quelles habitudes à changer ?

7. Planning mois prochain :
   - 🎯 Top 3-5 Objectifs
   - 📅 Deadlines majeures connues
   - 🆕 Nouveaux projets à lancer
   - 🔧 Optimisations à implémenter

8. Crée une page Notion "📊 Monthly Review [Mois]" avec tout ça

9. Envoie un résumé inspirant sur Discord

10. Suggestion : moment de célébration
    - Reconnaissance de tes accomplissements
    - Reward approprié
```

---

## 🔧 MAINTENANCE & OPTIMIZATION

### 22. Notion Database Cleanup

**Fréquence** : Toutes les 2 semaines

**Commande** :
```
Nettoie mes databases Notion :

1. **Master Inbox** :
   - Archive toutes les tâches "✅ Traité" de plus de 14 jours
   - Supprime les items "🗑️ Archivé" de plus de 30 jours
   - Identifie les tâches "📥 Nouveau" ou "👀 En cours" de plus de 7 jours (probablement abandonnées)
   - Suggère de les archiver ou re-prioriser

2. **Deadline Tracker IHECS** :
   - Archive les devoirs "✅ Terminé" de plus de 30 jours
   - Marque en rouge les devoirs "📝 À faire" dont la deadline est dépassée
   - Suggère de les passer en "⚠️ Retard" ou de mettre à jour

3. **Opportunités Stages** :
   - Archive les opportunités "❌ Refusé" de plus de 60 jours
   - Archive les opportunités "✅ Accepté" une fois le stage terminé
   - Relance pour les opportunités "📧 Contact initial" de plus de 14 jours sans suite

4. **EasyCo Sprint Board** :
   - Archive les tâches "Done" du sprint actuel vers "Archive Sprint [X]"
   - Déplace les tâches "To Do" non commencées depuis >14 jours vers "Backlog"

5. **Funding Tracker** :
   - Archive les opportunités passées (deadline dépassée)
   - Marque les soumissions sans réponse depuis >60 jours comme "⏳ Probablement perdu"

6. Génère un rapport :
   - Nombre d'items archivés par database
   - Nombre d'items nécessitant attention
   - Recommandations d'organisation

7. Envoie le rapport sur Discord
```

---

### 23. Calendar Audit

**Fréquence** : Hebdomadaire (dimanche soir)

**Commande** :
```
Analyse mon utilisation du temps cette semaine via Google Calendar :

1. Compile les événements de la semaine écoulée :
   - Total heures bloquées
   - Catégories :
     * 🚀 EasyCo (dev, meetings projet)
     * 📚 IHECS (cours, étude, devoirs)
     * 💼 Career (interviews, networking)
     * 🎨 Créatif (design, production)
     * 📧 Admin (emails, tâches diverses)
     * 🧘 Personnel (sport, loisirs, repos)

2. Calcule la répartition en % :
   - Visualisation texte type :
     ```
     🚀 EasyCo      ████████████░░░░░░░░ 40%
     📚 IHECS       ████████░░░░░░░░░░░░ 30%
     💼 Career      ████░░░░░░░░░░░░░░░░ 15%
     🎨 Créatif     ██░░░░░░░░░░░░░░░░░░ 10%
     📧 Admin       █░░░░░░░░░░░░░░░░░░░  5%
     ```

3. Compare avec mes objectifs/cibles :
   - Exemple cible : EasyCo 40% / IHECS 35% / Career 15% / Créatif 10%
   - Identifie les écarts
   - Suggère des ajustements pour la semaine prochaine

4. Identifie les problèmes :
   - **Time fragmentation** : trop de petits blocs dispersés
   - **Overbooking** : journées à >8h bloquées
   - **Underbooking** : journées avec <3h de focus time
   - **Lack of deep work** : pas de blocs >2h d'affilée
   - **No breaks** : pas de pauses/blancs dans la semaine

5. Recommandations concrètes :
   - "Groupe tes sessions EasyCo en blocs de 3h minimum"
   - "Bloque 1h de buffer chaque jour pour l'imprévu"
   - "Déplace ton batch emails à un moment fixe (ex: 11h et 16h)"
   - "Bloque au moins 1 créneau de 4h de deep work cette semaine"

6. Crée une page Notion "⏱️ Time Audit Week [X]" avec :
   - Toutes les visualisations
   - Insights
   - Action items pour améliorer

7. Envoie le rapport sur Discord avec 3 actions prioritaires
```

---

### 24. Workflow Performance Review

**Fréquence** : Mensuelle

**Commande** :
```
Évalue l'efficacité de mes workflows Rube :

1. Liste tous les workflows actifs :
   - Morning Briefing
   - Smart Email Triage
   - Dev Sprint Daily Update
   - Deadline Tracker Auto-Update
   - Job Opportunities Scanner
   - Evening Wind-Down
   - Weekly Review
   - Etc.

2. Pour chaque workflow :
   - Fréquence d'utilisation ce mois-ci
   - Temps économisé estimé (vs faire manuellement)
   - Fiabilité (% de fois où ça a bien fonctionné)
   - Satisfaction personnelle (1-5)

3. Identifie :
   - ✅ **Workflows stars** : les plus utiles, à conserver tel quel
   - 🔧 **À optimiser** : utiles mais peuvent être améliorés
   - ❌ **À supprimer** : peu utilisés ou inefficaces
   - 💡 **Manquants** : nouveaux besoins identifiés ce mois-ci

4. Suggestions d'amélioration :
   - Pour chaque workflow "À optimiser" : proposition concrète d'amélioration
   - Pour chaque besoin "Manquant" : idée de nouveau workflow

5. Crée une page Notion "🔧 Workflow Review [Mois]" avec :
   - Tableau de performance
   - Insights
   - Roadmap d'optimisation

6. Calcule le ROI global :
   - Temps total économisé ce mois-ci
   - Nombre de tâches automatisées
   - Impact sur productivité (ressenti)

7. Envoie le rapport sur Discord

8. Implémente les quick wins :
   - 1-2 optimisations rapides à faire immédiatement
```

---

## 🎯 QUICK COMMANDS (Usage Quotidien)

Voici des commandes rapides à utiliser au besoin dans Claude Code :

### Quick Inbox Process
```
Traite rapidement ma Master Inbox Notion : montre-moi les 10 items les plus urgents avec actions recommandées
```

### Quick Task Add
```
Ajoute une tâche dans ma Master Inbox : [description de la tâche], catégorie [EasyCo/IHECS/Career/Créatif], priorité [Urgent/Important/Normal]
```

### Quick Meeting Prep
```
J'ai un meeting dans 1h avec [personne/sujet]. Prépare-moi : résumé du contexte depuis mes notes Notion, questions clés à poser, objectifs du meeting
```

### Quick Email Draft
```
Rédige un email pour [contexte] : [détails]. Ton [formel/semi-formel/amical]. Sauvegarde le brouillon dans Notion pour review
```

### Quick Status Check
```
Donne-moi un status ultra-rapide : combien de tâches urgentes, prochaine deadline, événements aujourd'hui, alertes EasyCo
```

### Quick Motivation Boost
```
C'est une journée difficile. Rappelle-moi mes récentes réussites (depuis mes weekly reviews) et mes objectifs principaux
```

---

## 📝 NOTES IMPORTANTES

1. **Ces commandes sont des templates** : adaptez-les à vos besoins spécifiques
2. **Testez progressivement** : commencez par 2-3 workflows, puis ajoutez-en
3. **Itérez** : après 1-2 semaines, affinez selon ce qui marche/marche pas
4. **Notion API** : certaines commandes nécessitent que Rube puisse écrire dans Notion (à vérifier/configurer)
5. **Authentification** : assurez-vous que toutes vos apps sont bien connectées à Rube
6. **Notifications Discord** : si trop nombreuses, ajustez la fréquence ou créez un channel dédié "Rube Notifications"

---

## 🚀 PROCHAINES ÉTAPES

1. ✅ Choisir les 3-5 workflows prioritaires à implémenter en premier
2. ✅ Tester chaque commande une par une
3. ✅ Créer les databases Notion nécessaires (voir COMMAND_CENTER_SETUP.md)
4. ✅ Ajuster les commandes selon les résultats
5. ✅ Documenter vos propres variations

---

**Ce système est vivant. Faites-le évoluer avec vous !** 🌱
