---
notion_page_id: "2cd98c38-d2a6-80c6-91b4-e5bac9ebd221"
project_name: "IzzIco.be"
auto_sync: true
last_sync: "2025-12-29T00:21:00.000Z"

# Cache des IDs Notion (evite les recherches repetees)
cache:
  # Pages principales
  pages:
    hub_projet: "2cd98c38-d2a6-80c6-91b4-e5bac9ebd221"
    dashboard: "2d798c38-d2a6-81d7-992d-c2eec2a0466c"
    vision: "2d798c38-d2a6-816b-b9b3-da5322e3ec95"
    roadmap: "2d798c38-d2a6-8193-8707-ee59aa9a47bb"
    execution: "2d798c38-d2a6-8196-907a-e33901c3097a"
    suivi: "2d798c38-d2a6-813c-a3d6-e5236b18e696"
    documentation: "2d798c38-d2a6-814d-8f5f-e8518b7471c9"
    analyse_concurrentielle: "2cd98c38-d2a6-81ac-a658-ef3721c2cbcb"
    pain_points: "2cd98c38-d2a6-818d-8dea-cf617b371e08"
    marketing: "2cd98c38-d2a6-8172-8a5a-f7856d20d709"
    dev_log: "2d698c38-d2a6-8144-9b1f-d6d7434ab198"

  # Bases de donnees
  databases:
    backlog_taches: "2d798c38-d2a6-815a-a0f1-cb8966ab19ea"
    phases_projet: "2d798c38-d2a6-810d-b6ab-e021f5537a37"
    changelog: "2d798c38-d2a6-8163-bfbe-d868168ba3a6"

  # Navigation toggles (hub dashboard)
  toggles:
    nav_dashboard: "2d798c38-d2a6-81f1-ae4a-e9ccbbc4cd8e"
    nav_vision: "2d798c38-d2a6-81f6-9a67-df4b6b739d65"
    nav_roadmap: "2d798c38-d2a6-81b6-901b-cc8ef4514f88"
    nav_execution: "2d798c38-d2a6-8150-b7c4-e4e91dea2b6c"
    nav_suivi: "2d798c38-d2a6-81ab-b12b-c049bb185d97"
    nav_documentation: "2d798c38-d2a6-8120-8ba6-ceb66cbcf09e"

  # To-do blocks (interactive tasks)
  todos:
    bug_inscription: "2d798c38-d2a6-81c1-8999-f8cd64c7e3ef"
    dashboard_admin: "2d798c38-d2a6-8142-a741-e6d5e1d4da96"
    stripe_checkout: "2d798c38-d2a6-81ed-a6a0-dbe67e4f97cc"

# Configuration performance
performance:
  batch_size: 100           # Max blocks par appel
  rate_limit_delay_ms: 350  # Delai entre appels
  max_retries: 3            # Tentatives sur erreur
  cache_ttl_hours: 24       # Duree validite cache

# Session MCP active
mcp_session_id: "cost"
---

## Notes du Projet

Projet IzzIco.be - Plateforme d'onboarding pour cooperatives en Belgique.

### Liens
- Page Notion: https://www.notion.so/IzzIco-be-2cd98c38d2a680c691b4e5bac9ebd221

### Structure Notion Actuelle (Dashboard v2 - 29/12/2025)

```
IzzIco.be (Hub Projet - Dashboard Style)
│
├── [CHILD PAGES - 10 sous-pages]
│   ├── Analyse Concurrentielle
│   ├── Probleme & Pain Points
│   ├── Marketing & Communication
│   ├── Development Log
│   ├── Dashboard & KPIs
│   ├── Vision & Strategie
│   ├── Roadmap & Planning
│   ├── Execution & Taches
│   ├── Suivi & Historique
│   └── Documentation Technique
│
├── [CALLOUT] Status: Phase 2 - 60%
├── [PARAGRAPH] Derniere mise a jour
│
├── [HEADING 1] Taches Prioritaires
│   ├── [CALLOUT red] Bug critique inscription
│   ├── [CALLOUT blue] Dashboard admin
│   └── [CALLOUT gray] Stripe checkout
│
├── [HEADING 1] Progression par Phase
│   ├── [CALLOUT green] Phase 1: 100%
│   ├── [CALLOUT yellow] Phase 2: 60%
│   └── [CALLOUT gray] Phase 3: 0%
│
├── [HEADING 2] Navigation Rapide
│   ├── [TOGGLE] Dashboard & KPIs -> lien
│   ├── [TOGGLE] Vision & Strategie -> lien
│   ├── [TOGGLE] Roadmap & Planning -> lien
│   ├── [TOGGLE] Execution & Taches -> lien
│   ├── [TOGGLE] Suivi & Historique -> lien
│   └── [TOGGLE] Documentation Technique -> lien
│
├── [HEADING 2] Taches a Faire
│   ├── [TO_DO] Bug critique inscription
│   ├── [TO_DO] Dashboard admin
│   └── [TO_DO] Stripe checkout
│
├── [HEADING 2] Metriques Cles
│   ├── [CALLOUT] Progression phases
│   └── [CALLOUT] Stats taches
│
├── [HEADING 2] Liens Rapides
│   └── [PARAGRAPH] Site, GitHub, Supabase, Stripe
│
├── [HEADING 2] Informations Projet
│   ├── [PARAGRAPH] Nom projet
│   ├── [PARAGRAPH] Objectif
│   └── [PARAGRAPH] Stack technique
│
└── [HEADING 2] Sous-pages du Projet
    └── [PARAGRAPH] Description
```

### Features Notion Utilisees

| Feature | Usage | Quantite |
|---------|-------|----------|
| **child_page** | Sous-pages navigables | 10 |
| **toggle** | Navigation expandable | 6 |
| **to_do** | Taches interactives | 3 |
| **callout** | Status et progression | 8 |
| **heading_1/2** | Organisation sections | 7 |
| **divider** | Separation visuelle | 6 |
| **paragraph** | Texte et liens | 8 |

### Optimisations Appliquees

1. **Caching IDs** - Tous les IDs (pages, toggles, todos) caches localement
2. **Batching** - Operations groupees (max 100 blocks par appel)
3. **Session unique** - Reutilisation session MCP "cost"
4. **Dashboard style** - Vue d'ensemble immediate au premier regard
5. **Toggles navigation** - Acces rapide sans quitter la page
6. **To-do interactifs** - Cases a cocher directement sur le hub
7. **Callouts colores** - Code couleur pour priorites et statuts

### Prochaines Ameliorations

- [ ] Ajouter linked database inline pour Backlog (API limitation)
- [ ] Implementer backup automatique avant modifications
- [ ] Ajouter metriques de performance des appels API
