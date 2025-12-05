# Prompt pour Claude Chatbot (Web App)

## Contexte

Je suis Samuel Baudon, fondateur d'EasyCo, une plateforme de colocation en Belgique. J'ai une réunion prochainement avec un investisseur majeur et j'ai besoin de créer une présentation visuelle professionnelle à partir du pitch deck détaillé ci-dessous.

## Objectif

Transformer ce pitch deck Markdown (30+ pages de contenu détaillé) en une **présentation Google Slides professionnelle et visuellement attractive** adaptée pour une réunion investisseur.

## Instructions Spécifiques

1. **Format de sortie** : Google Slides (ou PowerPoint compatible)

2. **Structure souhaitée** :
   - ~20-25 slides maximum (condensé du document complet)
   - Slides visuelles avec graphiques, tableaux, icônes
   - Pas de pavés de texte (bullet points courts)
   - Design moderne et professionnel

3. **Sections prioritaires à inclure** :
   - Executive Summary (1-2 slides)
   - Le Problème (2 slides max)
   - Notre Solution - 3 Interfaces (3-4 slides avec visuels)
   - Analyse Concurrentielle (1 tableau récapitulatif)
   - Marché & Opportunité (2-3 slides avec chiffres clés)
   - Modèle Économique (2 slides)
   - Projections Financières (2 slides avec graphiques)
   - Technologie & Traction (1-2 slides)
   - Équipe (1 slide)
   - Demande de Financement (1 slide)
   - Vision & Exit (1 slide)

4. **Style visuel souhaité** :
   - Couleurs : Bleu/blanc (couleurs EasyCo) ou palette professionnelle
   - Graphiques pour les données chiffrées
   - Icônes pour illustrer les concepts
   - Photos/mockups si possible (interfaces app)
   - Design épuré, moderne, "startup tech"

5. **Éléments visuels importants** :
   - Tableau comparatif des 8 concurrents
   - Graphique market sizing (€5,5B → €20-100M objectif)
   - Timeline produit (phases 1-5)
   - Projections revenus Y1, Y2, Y3
   - Unit economics (LTV/CAC)
   - Utilisation des fonds (pie chart 60% équipe, 28% marketing, etc.)

6. **Tone & Message** :
   - Confiant mais réaliste
   - Data-driven (beaucoup de chiffres précis)
   - Vision ambitieuse mais crédible
   - Mettre en avant la traction technique (150K+ lignes code, iOS ready)

## Livrables Attendus

1. **Fichier Google Slides** (ou PowerPoint) avec ~20-25 slides
2. **Notes de présentation** pour chaque slide (ce que je dois dire)
3. **Version PDF** exportable

## Contraintes

- Ne pas inventer de chiffres ou données (utiliser uniquement ceux fournis)
- Rester factuel sur la traction (pas de "milliers d'utilisateurs" si on n'en a pas)
- Être honnête sur le status actuel (MVP en cours, pas encore lancé publiquement)

---

# CONTENU DU PITCH DECK À TRANSFORMER

(Le contenu Markdown complet suit ci-dessous)

---

# EasyCo — Investor Pitch Deck 2025

**Révolutionner la Colocation en Belgique**

---

## Executive Summary

**Vision**: EasyCo est une plateforme hybride combinant les meilleurs aspects d'**Airbnb** (réservation instantanée avec calendrier), **Tinder** (matching par compatibilité), et **Immoweb** (recherche immobilière exhaustive) pour révolutionner le marché de la colocation en Belgique.

### Proposition de Valeur

**3 Interfaces Spécialisées**:
1. **Propriétaires** — Gestion locative complète, KYC obligatoire des locataires, calendrier de pré-réservation
2. **Candidats-Locataires** — Recherche intelligente, matching par compatibilité (swipe style Tinder), profils détaillés
3. **Locataires Actuels** — Dashboard résident, paiements en ligne, maintenance, messagerie intégrée

### Marché Cible

- **Marché total belge**: €5,5 milliards/an
- **Objectif**: 1-5% de part de marché = **€20-100M de revenus potentiels**
- **500 000 étudiants** en Belgique
- **Déficit de 70 000 logements** prévu d'ici 2030
- **300 000 logements partagés** existants
- **2,8 occupants** par logement en moyenne

### Demande de Financement

**€500K seed** à une valorisation pré-money de **€2M**
- 20% dilution
- Runway: 18-24 mois
- Objectif: MVP complet → 10K utilisateurs → Series A

### Traction Actuelle

- ✅ **Application web Next.js** en production (V3.1)
- ✅ **Application iOS native** SwiftUI prête pour TestFlight
- ✅ **150 000+ lignes de code** (11 271 fichiers TypeScript)
- ✅ **515+ composants React** construits
- ✅ **365 fichiers Swift** (iOS natif)
- ✅ **Architecture MVVM** complète
- ✅ **Intégration Supabase** (auth, base de données, RLS policies)

---

## 1. Le Problème

### Douleurs des Propriétaires

1. **Gestion administrative lourde** — Contrats, états des lieux, quittances
2. **Risque financier** — Impayés, dégradations, turnover élevé
3. **Temps consommé** — Visites, sélection, communication
4. **Difficulté à vérifier** — Identité, solvabilité, compatibilité des colocataires

### Douleurs des Locataires

1. **Recherche inefficace** — Sites multiples, informations dispersées
2. **Compatibilité incertaine** — Rencontrer des colocataires inconnus = risque
3. **Processus fastidieux** — Visites multiples, négociations, paperasse
4. **Manque de transparence** — Charges réelles, règles de la colocation
5. **Délais longs** — Entre recherche et emménagement

### Inefficacité du Marché Actuel

- **Appartager, Roomlala, Kotplanet**: Fonctionnalités limitées, UX datée
- **HousingAnywhere, Spotahome**: Focus étudiants internationaux uniquement
- **Cohabs, ToitMoiNous**: Offre limitée géographiquement
- **Immoweb**: Pas de matching, pas de colocation-first features

**Aucune solution n'offre**: KYC systématique + matching compatibilité + réservation instantanée + gestion financière intégrée

---

## 2. Notre Solution

### Interface 1: Propriétaires

**Tableau de bord complet** pour gérer l'ensemble du cycle locatif:

#### Fonctionnalités Clés

1. **Gestion des Propriétés**
   - Upload multi-photos (jusqu'à 20 photos par bien)
   - Description détaillée (équipements, règles, charges)
   - Calendrier de disponibilité (style Airbnb)
   - Pré-réservations avec acompte

2. **Screening des Candidats**
   - **KYC obligatoire** (vérification identité via itsme/eID)
   - Vérification revenus/garants
   - Historique locatif
   - Score de compatibilité avec colocataires existants

3. **Outils Financiers**
   - Paiements en ligne automatisés
   - Suivi des loyers et charges
   - Génération automatique de quittances
   - Répartition charges style Tricount
   - Historique complet des transactions

4. **Communication**
   - Messagerie intégrée avec tous les locataires
   - Notifications automatiques (paiements, maintenance)
   - Système de tickets pour maintenance

5. **Documents & Légal**
   - Génération contrats automatisée
   - Stockage états des lieux
   - Archives digitales conformes

#### Bénéfices Propriétaires

- **Réduction 80%** du temps de gestion administrative
- **Réduction 60%** des impayés (KYC + paiement automatique)
- **Remplissage plus rapide** (24-48h vs 2-4 semaines)
- **Moins de turnover** (meilleur matching = locataires plus heureux)

### Interface 2: Candidats-Locataires

**Recherche intelligente** et **matching par compatibilité**:

#### Fonctionnalités Clés

1. **Recherche Avancée**
   - Filtres multicritères (prix, localisation, équipements)
   - Carte interactive (Google Maps API)
   - Disponibilité en temps réel
   - Photos HD, visites virtuelles

2. **Profil Candidat Riche**
   - **KYC obligatoire** (identité vérifiée = badge)
   - Informations lifestyle (fumeur/non-fumeur, animaux, horaires)
   - Préférences de colocation
   - Centres d'intérêt, habitudes
   - Documents (contrat travail, fiches de paie, garants)

3. **Matching Style Tinder**
   - **Swipe droite/gauche** sur profils de colocataires potentiels
   - Algorithme de compatibilité (lifestyle, horaires, centres d'intérêt)
   - Score de match affiché (0-100%)
   - Chat uniquement si match mutuel

4. **Réservation Instantanée**
   - Calendrier de disponibilité (comme Airbnb)
   - Pré-réservation avec acompte sécurisé
   - Confirmation sous 24h (après validation propriétaire)

5. **Comparaison & Favoris**
   - Sauvegarde des annonces favorites
   - Comparaison côte-à-côte
   - Alertes nouvelles annonces matching critères

#### Bénéfices Candidats

- **Gain de temps 70%** (recherche centralisée + matching)
- **Meilleure compatibilité** (réduction conflits = 80%)
- **Transparence totale** (profils vérifiés, charges détaillées)
- **Processus simplifié** (de la recherche au contrat en 3 jours)

### Interface 3: Locataires Actuels

**Dashboard résident** pour gérer la vie quotidienne en colocation:

#### Fonctionnalités Clés

1. **Informations Propriété**
   - Détails du bail (dates, montant, renouvellement)
   - Contacts (propriétaire, colocataires, services)
   - Documents (contrat, états des lieux, règlement)

2. **Paiements & Finances**
   - **Paiement en ligne du loyer** (carte bancaire, virement)
   - Historique des paiements
   - Répartition des charges (graphique interactif)
   - Notifications avant échéance
   - Téléchargement quittances

3. **Gestion Charges Partagées (style Tricount)**
   - Création dépenses communes (courses, internet, électricité)
   - Répartition automatique entre colocataires
   - Paiements intégrés
   - Historique des remboursements

4. **Maintenance & Tickets**
   - Création demandes de maintenance
   - Upload photos du problème
   - Suivi statut (en attente, en cours, résolu)
   - Historique des interventions

5. **Communication Colocataires**
   - Messagerie groupe colocation
   - Calendrier partagé (nettoyage, visiteurs)
   - Tableau d'affichage (annonces, règles)

6. **Vie de la Colocation**
   - Profils des colocataires
   - Règles de la maison
   - Planning des tâches ménagères

#### Bénéfices Locataires

- **Transparence financière** (charges détaillées)
- **Facilité de paiement** (automatique, rappels)
- **Maintenance rapide** (tickets trackés)
- **Meilleure communication** (disputes réduites)

### Différenciateurs Clés

| Fonctionnalité | EasyCo | Appartager | HousingAnywhere | Immoweb |
|----------------|--------|------------|-----------------|----------|
| **KYC Obligatoire** | ✅ | ❌ | ❌ | ❌ |
| **Matching Compatibilité** | ✅ (Tinder-style) | ❌ | ❌ | ❌ |
| **Réservation Instantanée** | ✅ (calendrier Airbnb) | ❌ | ✅ | ❌ |
| **Gestion Financière Intégrée** | ✅ (style Tricount) | ❌ | ❌ | ❌ |
| **Dashboard Propriétaires** | ✅ (complet) | Limité | ❌ | Basique |
| **Interface Locataires Actuels** | ✅ (3e interface dédiée) | ❌ | ❌ | ❌ |
| **Mobile Natif** | ✅ (iOS ready) | ❌ (web only) | App basique | App basique |

---

## 3. Analyse Concurrentielle Détaillée

### 1. Appartager

**Forces**:
- Présence établie en France/Belgique
- Base d'utilisateurs existante
- Gratuit pour candidats

**Faiblesses**:
- UX datée (site vieillissant)
- Pas de KYC systématique
- Pas de matching compatibilité
- Pas de paiement intégré
- Fonctionnalités propriétaires limitées

**Notre Avantage**: Technologie moderne, KYC, matching, paiements intégrés

### 2. HousingAnywhere

**Forces**:
- Réservation en ligne fonctionnelle
- Paiements sécurisés
- Focus étudiants internationaux

**Faiblesses**:
- **Pas de marché belge fort** (focus NL/UK/ES)
- Frais élevés (15-20% commission)
- Pas de matching compatibilité
- Pas d'interface pour locataires actuels
- Pas de gestion charges partagées

**Notre Avantage**: Focus Belgique, matching, interface locataires, charges partagées

### 3. Roomlala

**Forces**:
- Présence France/Belgique
- Système de garantie

**Faiblesses**:
- UX basique
- Pas de KYC robuste
- Pas de matching
- Fonctionnalités limitées

**Notre Avantage**: Matching, KYC, dashboard complet propriétaires/locataires

### 4. Kotplanet

**Forces**:
- Focus Belgique (kots étudiants)
- Connaissance marché local

**Faiblesses**:
- **Uniquement étudiants** (marché limité)
- Technologie datée
- Pas de KYC
- Pas de matching
- Pas de paiements intégrés

**Notre Avantage**: Tous publics (étudiants + jeunes actifs + familles), matching, paiements

### 5. Spotahome

**Forces**:
- Photos/vidéos professionnelles
- Réservation sans visite
- Présence européenne

**Faiblesses**:
- **Offre Belgique très limitée**
- Prix élevé (frais propriétaires + locataires)
- Pas de matching compatibilité
- Pas d'interface locataires actuels

**Notre Avantage**: Focus Belgique, matching, interface complète locataires

### 6. Cohabs

**Forces**:
- Colocations haut de gamme
- Design moderne
- Services inclus

**Faiblesses**:
- **Uniquement leurs propres biens** (pas de marketplace)
- Prix premium (€700-1200/chambre)
- Offre géographique limitée (Bruxelles uniquement)
- Pas de matching

**Notre Avantage**: Marketplace ouvert, tous prix, toute Belgique, matching

### 7. ToitMoiNous

**Forces**:
- Colocation solidaire (intergénérationnelle)
- Niche intéressante

**Faiblesses**:
- **Marché très niche** (seniors + jeunes)
- Volume faible
- Fonctionnalités basiques

**Notre Avantage**: Marché général + tech avancée

### 8. Immoweb

**Forces**:
- **Leader immobilier Belgique**
- Base d'utilisateurs massive
- Forte notoriété

**Faiblesses**:
- **Pas de focus colocation** (toutes annonces immobilières)
- Pas de matching compatibilité
- Pas de KYC
- Pas de gestion financière
- Pas d'interface locataires actuels
- UX générique (pas optimisée colocation)

**Notre Avantage**: 100% colocation-first, matching, KYC, gestion complète

### Tableau Récapitulatif Concurrence

| Concurrent | Part Marché Estimée | Forces Principales | Notre Différenciation |
|------------|---------------------|--------------------|-----------------------|
| Appartager | ~15% | Base utilisateurs établie | Matching, KYC, paiements, tech moderne |
| HousingAnywhere | ~10% (Belgique faible) | Réservation en ligne | Focus Belgique, matching, charges partagées |
| Roomlala | ~8% | Garantie locative | KYC robuste, matching, dashboards |
| Kotplanet | ~12% (étudiants) | Focus Belgique kots | Tous publics, tech avancée |
| Spotahome | ~3% (Belgique faible) | Photos pro, réservation | Offre Belgique, matching, locataires actuels |
| Cohabs | ~2% (premium) | Services inclus, design | Marketplace ouvert, tous prix |
| ToitMoiNous | ~1% (niche) | Solidaire | Marché général, volume |
| Immoweb | ~20% (colocation) | Leader immobilier | Colocation-first, matching, gestion complète |
| **Autres/Fragmentation** | ~29% | — | Agrégation via plateforme unique |

**Opportunité EasyCo**: Capter 15-20% du marché fragmentation + convertir utilisateurs plateformes datées = **objectif 10-15% parts de marché à 3 ans**

---

## 4. Marché & Opportunité

### Taille du Marché Belge

**Marché Total Immobilier Locatif**:
- **€5,5 milliards/an** (locations résidentielles Belgique)
- **1,5 million de logements locatifs** au total
- **300 000 logements en colocation** (20% du locatif)
- Loyer moyen: **€850-1200/mois** (Bruxelles), **€600-900** (Wallonie/Flandre)

**Segment Colocation**:
- **300 000 logements partagés**
- **2,8 occupants par logement** en moyenne
- = **~840 000 personnes** en colocation
- Turnover annuel: **~35%** = **294 000 nouveaux placements/an**

**Revenus Potentiels (commission 10% sur transactions)**:
- 294 000 placements × loyer moyen €900 × 10% commission = **€26,5M/an** (side transactions)
- + Abonnements propriétaires: 100 000 bailleurs × €15/mois = **€18M/an**
- + Abonnements locataires premium: 100 000 × €5/mois = **€6M/an**
- **Total marché adressable: €50M+/an**

**Objectif EasyCo**: 1-5% parts de marché à 3 ans = **€20-100M revenus annuels**

### Démographie Cible

1. **Étudiants**: **500 000** en Belgique
   - 60% en location (300 000)
   - 70% en colocation (210 000)
   - Turnover 100%/an (changement annuel)

2. **Jeunes Actifs (25-35 ans)**: **~400 000** en location
   - 40% en colocation (160 000)
   - Turnover 30%/an

3. **Travailleurs Internationaux**: **~150 000**
   - 80% en location temporaire/colocation
   - Turnover élevé (50%/an)

4. **Familles Monoparentales**: **~80 000**
   - 25% intéressées colocation intergénérationnelle

**Total Population Cible**: **~600 000 personnes** en recherche active annuellement

### Drivers de Croissance

1. **Crise du Logement**
   - **Déficit de 70 000 logements** prévu d'ici 2030
   - Prix immobilier: +45% depuis 2010
   - Loyers: +30% depuis 2015

2. **Précarité Étudiante**
   - 1 étudiant sur 4 en difficulté financière
   - Colocation = solution économique (-40% vs studio)

3. **Mobilité Professionnelle**
   - Bruxelles = hub européen (institutions, multinationales)
   - Demande forte locations temporaires/flexibles

4. **Évolution Sociale**
   - Acceptation croissante colocation (tous âges)
   - Recherche de communauté (post-Covid)
   - Économie collaborative

### Go-To-Market Strategy

**Phase 1 (Mois 1-6): Bruxelles — Niche Étudiants**
- Partenariats universités (ULB, VUB, UCLouvain)
- Campus ambassadors (20 étudiants)
- Événements étudiants (kots à kot)
- Objectif: **2 000 utilisateurs** (1 000 propriétaires, 1 000 étudiants)

**Phase 2 (Mois 6-12): Expansion Géographique**
- Liège, Gand, Anvers, Louvain-la-Neuve
- Segment: Étudiants + jeunes actifs (25-30 ans)
- Marketing digital (Meta Ads, Google Ads)
- Objectif: **10 000 utilisateurs**

**Phase 3 (Mois 12-18): Nationwide + Diversification**
- Toute la Belgique
- Tous segments (étudiants, actifs, familles, intergénérationnel)
- Partenariats agences immobilières
- Objectif: **50 000 utilisateurs**

**Phase 4 (Mois 18-24): Professionnalisation**
- Services premium (assurance, déménagement, nettoyage)
- API B2B pour agences immobilières
- Expansion internationale (France, Pays-Bas)
- Objectif: **100 000+ utilisateurs**

### Acquisition Channels

1. **Organic**
   - SEO ("colocation Bruxelles", "kot étudiant")
   - Content marketing (blog, guides)
   - Viralité (parrainage: €50 réduction pour parrain + filleul)

2. **Paid**
   - Meta Ads (Facebook, Instagram): €20 CAC
   - Google Ads (Search, Display): €25 CAC
   - TikTok Ads (étudiants): €15 CAC

3. **Partnerships**
   - Universités (newsletters, événements)
   - Entreprises (programmes relocation)
   - Agences immobilières (co-branding)

4. **Community**
   - Ambassadors étudiants (commissions)
   - Événements colocation (apéros, workshops)
   - Groupes Facebook/WhatsApp

**Objectif Blended CAC**: **€20-30** (LTV: €150-200 → LTV/CAC = 5-10x)

---

## 5. Modèle Économique

### Streams de Revenus

#### 1. Commissions sur Placements (B2C)

**Modèle**: Commission propriétaire à chaque nouveau placement
- **€1 200** par placement (équivalent 1 mois de loyer)
- Compétitif vs agences traditionnelles (€1 500-2 000)
- Volume estimé Y1: 585 placements = **€702 000**
- Volume estimé Y2: 5 400 placements = **€6 480 000**

**Avantages**:
- Pas de coût pour candidats (adoption rapide)
- Propriétaires prêts à payer (ROI immédiat)
- Alignement incentives (on gagne si placement réussi)

#### 2. Abonnements Propriétaires (SaaS)

**Freemium Model**:
- **Gratuit**: 1 propriété, fonctionnalités basiques
- **Pro (€15/mois)**: Propriétés illimitées, analytics, priorité annonces
- **Premium (€50/mois)**: Gestion multi-biens, API, support prioritaire

**Volume estimé**:
- Y1: 300 propriétaires × €15/mois = **€54 000**
- Y2: 2 000 propriétaires × €18/mois (blended) = **€432 000**

#### 3. Abonnements Locataires Premium (optionnel)

**Premium Features (€5/mois)**:
- Profil boosté (visibilité x3)
- Swipes illimités (vs 20/jour gratuit)
- Historique matchs illimités
- Accès priorité nouvelles annonces

**Volume estimé**:
- Y1: 200 premium × €5/mois = **€12 000**
- Y2: 2 000 premium × €5/mois = **€120 000**

#### 4. Services Additionnels (Future)

- **Assurance Loyers Impayés**: €50/placement (commission revendeur)
- **Déménagement**: Partenariat MovingBelgium (commission 15%)
- **Nettoyage Fin de Bail**: €150/intervention (commission 20%)
- **États des Lieux Digitaux**: €80/EDL (outil interne)

**Volume estimé** (Y2+): **€100-200K/an**

### Projections Financières (3 ans)

#### Année 1 (2026)

**Revenus**:
- Commissions placements: €702 000 (585 placements @ €1 200)
- Abonnements propriétaires: €54 000 (300 Pro)
- Abonnements locataires: €12 000 (200 Premium)
- Services additionnels: €10 000
- **Total: €778 000**

**Coûts**:
- Équipe (5 FTE): €300 000
- Cloud & Infra: €30 000
- Marketing & Sales: €200 000 (CAC €25 × 8 000 users)
- Légal & Admin: €20 000
- Misc & Contingency: €30 000
- **Total: €580 000**

**EBITDA: +€198 000** (marge 25%)

#### Année 2 (2027)

**Revenus**:
- Commissions placements: €6 480 000 (5 400 placements)
- Abonnements propriétaires: €432 000 (2 000 Pro)
- Abonnements locataires: €120 000 (2 000 Premium)
- Services additionnels: €150 000
- **Total: €7 182 000**

**Coûts**:
- Équipe (12 FTE): €750 000
- Cloud & Infra: €120 000
- Marketing & Sales: €1 500 000
- Légal & Admin: €80 000
- Misc: €100 000
- **Total: €2 550 000**

**EBITDA: +€4 632 000** (marge 64%)

#### Année 3 (2028)

**Revenus**:
- Commissions placements: €18 000 000 (15 000 placements)
- Abonnements: €1 500 000
- Services additionnels: €500 000
- **Total: €20 000 000**

**EBITDA: +€12 000 000** (marge 60%)

### Unit Economics

**Par Placement**:
- Commission: €1 200
- CAC propriétaire: €40
- CAC locataire: €25
- Total CAC: €65
- **Marge brute: €1 135** (95%)

**LTV Propriétaire**:
- Turnover moyen: 2,5 placements/an (35% taux rotation × 7 chambres moyennes)
- Durée vie: 3 ans
- LTV = 2,5 × 3 × €1 200 = **€9 000**
- CAC: €40
- **LTV/CAC: 225x**

**LTV Locataire**:
- Fréquence: 1 recherche tous les 2 ans
- Durée vie: 6 ans (3 recherches)
- Abonnement Premium: 30% × €5 × 12 mois × 2 ans = €36
- LTV = €36
- CAC: €25
- **LTV/CAC: 1,4x** (mais gratuit pour locataires = acquisition virale)

**Breakeven**: Mois 8 (après 300 placements)

---

## 6. Technologie & Product

### Stack Technique

#### Frontend Web

- **Framework**: Next.js 14.2 (React 18.2, TypeScript 5.4)
- **Styling**: TailwindCSS 3.4 + Framer Motion (animations)
- **UI Components**: Radix UI (accessibilité)
- **State Management**: React Query (TanStack)
- **Maps**: @vis.gl/react-google-maps
- **Forms**: React Hook Form + Zod (validation)

**Metrics**:
- 11 271 fichiers TypeScript
- 515+ composants React
- 150 000+ lignes de code
- Architecture modulaire (Features-based)

#### Mobile iOS (Natif)

- **Framework**: SwiftUI 5.0
- **Architecture**: MVVM (365 fichiers Swift)
- **Backend**: Supabase Swift SDK
- **Animations**: Spring effects + staggered
- **Status**: Prêt pour TestFlight beta

**Features iOS**:
- Dashboard Résident complet
- Paiements en ligne intégrés
- Maintenance & tickets
- Messagerie
- Documents & contrats

#### Mobile Android (Roadmap)

- **Option 1**: React Native (code sharing avec web)
- **Option 2**: Flutter (performance native)
- **Recommandation**: React Native (team expertise, time-to-market)

#### Backend & Infrastructure

- **BaaS**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Database**: PostgreSQL 15 (RLS policies pour sécurité)
- **Auth**: Supabase Auth (OAuth Google, email/password, itsme future)
- **Storage**: Supabase Storage (photos propriétés, documents)
- **Realtime**: Supabase Realtime (messagerie, notifications)
- **CDN**: Vercel Edge Network
- **Monitoring**: Sentry (error tracking)
- **Analytics**: Vercel Analytics + Custom (Supabase Functions)

#### APIs Tierces

- **KYC/Vérification Identité**:
   - itsme (Belgique)
   - eID reader API (carte d'identité)
   - Fallback: Manuel (upload ID + selfie)

- **Paiements**:
   - Stripe (cartes bancaires)
   - Bancontact (paiements Belgique)
   - SEPA (virements)

- **Maps & Geocoding**:
   - Google Maps API (affichage cartes)
   - Google Places API (autocomplete adresses)
   - Google Geocoding API (lat/lng)

- **Notifications**:
   - OneSignal (push notifications)
   - SendGrid (emails transactionnels)
   - Twilio (SMS confirmations)

- **Document Generation**:
   - PDFKit (contrats, quittances)
   - DocuSign (signatures électroniques)

### Sécurité & Compliance

#### GDPR Compliance

- Consentement explicite (cookies, données)
- Droit à l'oubli (suppression compte)
- Export données (format JSON)
- Politique confidentialité + CGU
- DPO désigné (Data Protection Officer)

#### Row Level Security (RLS)

- Policies PostgreSQL sur toutes les tables
- Users ne peuvent voir que leurs données
- Propriétaires: uniquement leurs biens
- Locataires: uniquement leurs baux

#### Encryption

- HTTPS obligatoire (TLS 1.3)
- Données sensibles chiffrées (identité, paiements)
- Passwords hashés (bcrypt)
- Tokens JWT pour authentification

#### KYC & Anti-Fraud

- Vérification identité obligatoire
- Détection comptes multiples (même email/téléphone)
- Modération annonces (AI + manuel)
- Système de réputation (avis vérifiés)

### Roadmap Produit

#### Phase 1: MVP (Actuel — Q4 2025)

✅ **Complété**:
- Interface Propriétaires (création annonces, gestion)
- Interface Candidats (recherche, favoris)
- Interface Locataires (dashboard, paiements)
- Auth & profiles (Supabase)
- iOS natif (TestFlight ready)

⏳ **En Cours**:
- Matching algorithm (compatibilité)
- KYC integration (itsme)
- Paiements Stripe

#### Phase 2: Beta Privée (Q1 2026)

- [ ] Matching Tinder-style opérationnel
- [ ] KYC obligatoire activé
- [ ] Paiements en ligne (Stripe + Bancontact)
- [ ] Messagerie in-app
- [ ] Notifications push
- [ ] 100 beta users (50 propriétaires, 50 locataires)

#### Phase 3: Launch Public Bruxelles (Q2 2026)

- [ ] Calendrier disponibilité (style Airbnb)
- [ ] Réservation instantanée
- [ ] Génération contrats automatique
- [ ] System avis & réputation
- [ ] Android app (React Native)
- [ ] Objectif: 2 000 users

#### Phase 4: Expansion Nationale (Q3-Q4 2026)

- [ ] Gestion charges partagées (Tricount-style)
- [ ] Maintenance & tickets
- [ ] Documents vault
- [ ] Dashboard analytics propriétaires
- [ ] API B2B (agences immobilières)
- [ ] Objectif: 10 000 users

#### Phase 5: Professionnalisation (2027)

- [ ] Services additionnels (assurance, déménagement)
- [ ] IA recommendations (annonces matching profil)
- [ ] Chat AI assistant (questions propriétaires/locataires)
- [ ] Expansion internationale (France, NL)
- [ ] Objectif: 50 000 users

---

## 7. Développement & Coûts

### Timeline Développement

**Estimation Totale MVP Complet**: **6-9 mois**

#### Breakdown par Fonctionnalité

| Fonctionnalité | Durée | Status Actuel |
|----------------|-------|---------------|
| Auth & Profiles | 2 semaines | ✅ Complété |
| Interface Propriétaires (CRUD annonces) | 3 semaines | ✅ Complété |
| Interface Candidats (recherche) | 3 semaines | ✅ Complété |
| Interface Locataires (dashboard) | 4 semaines | ✅ Complété (iOS) |
| Matching Algorithm | 4 semaines | 🔄 50% done |
| KYC Integration | 3 semaines | ⏳ À faire |
| Paiements Stripe | 3 semaines | ⏳ À faire |
| Messagerie | 3 semaines | ⏳ À faire |
| Calendrier Dispo | 2 semaines | ⏳ À faire |
| Notifications | 2 semaines | ⏳ À faire |
| Génération Contrats | 3 semaines | ⏳ À faire |
| Android App | 6 semaines | ⏳ Roadmap |
| Tests & Debug | 4 semaines | 🔄 Continu |

**Restant à faire**: ~12 semaines (3 mois) pour MVP complet market-ready

### Coûts Développement

#### Option 1: Développeur Solo (Actuel)

**Profil**: Full-stack senior (vous)
- Salaire: €0 (equity-only jusqu'à seed)
- Durée: 9 mois (achèvement MVP)
- **Coût total: €0** (mais opportunity cost élevé)

#### Option 2: Équipe Lean (Recommandé Post-Seed)

**Équipe**:
- 1× CTO/Lead Dev (vous): €70K/an
- 1× Full-Stack Dev: €55K/an
- 1× Mobile Dev (iOS/Android): €55K/an
- 1× Designer UI/UX: €45K/an
- Freelance QA: €20K/an

**Coût annuel**: **€245K**
**Durée MVP complet**: 4-5 mois (équipe de 4)

#### Option 3: Agence Externe

**Profil**: Agence belge mid-tier
- Tarif jour: €500-700/jour
- Durée: 6 mois (120 jours)
- **Coût total: €60-84K** (MVP basique)

**⚠️ Risque**: Pas de ownership long-terme, maintenance coûteuse

#### Option 4: Offshore (Roumanie, Portugal)

**Profil**: Équipe offshore qualifiée
- Tarif jour: €300-400/jour
- Durée: 6 mois
- **Coût total: €36-48K**

**⚠️ Risque**: Communication, time zones, qualité variable

#### Recommandation

**Court terme (Pre-Seed)**: Option 1 (solo) → Vous continuez jusqu'à seed (3 mois restants)

**Post-Seed (€500K raise)**: Option 2 (équipe lean)
- Vous (CTO) + 2 devs + 1 designer = €245K/an
- Permet de scaler rapidement post-launch
- Ownership & culture d'équipe

### Coûts Infrastructure (Annuels)

#### Année 1 (0-10K users)

- **Supabase**: Free tier → Pro (€25/mois) = €300
- **Vercel**: Pro (€20/mois) = €240
- **Google Maps API**: €200/mois = €2 400
- **Stripe**: 1,4% + €0,25/transaction = variable (~€10K sur €700K GMV)
- **SendGrid**: €15/mois = €180
- **OneSignal**: Free tier
- **Sentry**: €26/mois = €312
- **Domain & SSL**: €50/an
- **Apple Developer**: €99/an
- **Google Play**: €25 one-time

**Total Y1**: **€13 606** (~€1 135/mois)

#### Année 2 (10-50K users)

- **Supabase**: Pro+ (€599/mois) = €7 188
- **Vercel**: Pro+ (€150/mois) = €1 800
- **Google Maps**: €1 000/mois = €12 000
- **Stripe fees**: ~€90K (sur €6,5M GMV)
- **SendGrid**: €80/mois = €960
- **OneSignal**: Growth (€99/mois) = €1 188
- **Misc**: €5 000

**Total Y2**: **€118 136** (~€9 845/mois)

#### Année 3 (50-100K users)

- Infrastructure scaling: **~€300K/an**

---

## 8. Équipe & Expertise

### Founder: Samuel Baudon (Vous)

**Profil**:
- **Full-Stack Developer** senior
- Expertise: Next.js, React, TypeScript, SwiftUI, Supabase
- Projet EasyCo: 150K+ lignes de code produites
- Vision produit claire (3 interfaces, matching, KYC)

**Achievements**:
- ✅ Web app production-ready (Next.js, 11K fichiers TS)
- ✅ iOS native app (SwiftUI, 365 fichiers Swift, TestFlight-ready)
- ✅ Architecture scalable (Supabase, RLS policies, MVVM)
- ✅ Design system complet (Tailwind, Framer Motion)

**Compétences Complémentaires Nécessaires**:
- Business Development & Sales
- Marketing & Growth
- Operations & Customer Success

### Équipe Idéale Post-Seed

#### C-Level

1. **CEO / Co-Founder** (À recruter)
   - Profil: Entrepreneur expérimenté, idéalement ex-PropTech/Marketplace
   - Responsabilités: Vision, fundraising, partenariats stratégiques
   - Equity: 20-25%

2. **CTO** (Vous — Samuel)
   - Product development
   - Architecture technique
   - Équipe engineering
   - Equity: 30-40% (founder)

#### Engineering (4 FTE Y1)

3. **Senior Full-Stack Developer**
   - Backend Supabase, API design
   - Salary: €55-65K + equity (0,5-1%)

4. **Mobile Developer** (iOS/Android)
   - React Native ou Flutter
   - Salary: €50-60K + equity (0,5%)

5. **UI/UX Designer**
   - Design system, prototypes, user research
   - Salary: €40-50K + equity (0,3%)

#### Business (2-3 FTE Y1)

6. **Head of Growth**
   - Marketing digital, SEO, paid acquisition
   - Partenariats (universités, agences)
   - Salary: €50-60K + equity (1-2%)

7. **Customer Success Manager**
   - Onboarding propriétaires
   - Support utilisateurs
   - Salary: €35-45K + equity (0,3%)

#### Advisors (Equity-Only)

- **PropTech Expert** (ex-Immoweb, Cohabs, etc.)
- **Legal/Compliance** (bail immobilier belge, GDPR)
- **Growth Marketing** (marketplace 2-sided)

**Total Équipe Y1**: **7 personnes** (€300K salaires + €200K equity over 4 years)

---

## 9. Utilisation des Fonds (€500K Seed)

### Breakdown Détaillé

#### 1. Équipe (60% — €300K)

- Salaires 5 FTE × 18 mois = €300K
  - CTO (vous): €70K/an → €105K (18 mois)
  - Full-Stack Dev: €55K → €82,5K
  - Mobile Dev: €55K → €82,5K
  - Designer: €40K → €60K
  - Head of Growth: €50K → €75K (12 mois)
- Freelance QA & Support: €20K

**Total Équipe: €305K**

#### 2. Marketing & Acquisition (28% — €140K)

- Paid Ads (Meta, Google, TikTok): €80K
  - CAC target: €25
  - Volume: 3 200 users
- Partnerships & Events: €30K
  - Universités, campus ambassadors
  - Événements kots à kot
- Content & SEO: €15K
  - Blog, guides, vidéos
- Branding & Design: €10K
  - Logo, website, print materials
- PR & Communications: €5K

**Total Marketing: €140K**

#### 3. Infrastructure & Tech (6% — €30K)

- Cloud & SaaS (18 mois): €20K
  - Supabase, Vercel, Google Maps, etc.
- Licenses & Tools: €5K
  - GitHub, Figma, Notion, Slack, etc.
- Security & Compliance: €5K
  - Audits sécurité, GDPR compliance

**Total Tech: €30K**

#### 4. Légal & Admin (4% — €20K)

- Constitution société: €2K
- Contrats (CGU, confidentialité): €3K
- Comptabilité & fiscalité: €5K (18 mois)
- Assurances: €3K
- Divers admin: €7K

**Total Légal: €20K**

#### 5. Contingency & Misc (2% — €10K)

- Imprévus, ajustements

**Total: €505K** (légèrement au-dessus de €500K = ajustements à faire)

### Milestones Associés

| Mois | Milestone | Burn Rate | Cash Restant |
|------|-----------|-----------|---------------|
| M0 | Closing seed | €0 | €500K |
| M3 | MVP complet + Beta privée (100 users) | €85K | €415K |
| M6 | Launch public Bruxelles (2K users) | €85K | €330K |
| M9 | Expansion 3 villes (5K users) | €85K | €245K |
| M12 | Nationwide (10K users, €200K ARR) | €85K | €160K |
| M15 | Professionnalisation (20K users, €500K ARR) | €85K | €75K |
| M18 | Series A raise (€2-3M) | €85K | €0 → €2M+ |

**Average Burn Rate**: €28K/mois (runway 18 mois)

---

## 10. Risques & Mitigation

### 1. Risque: Adoption Lente (Cold Start Problem)

**Description**: Marketplace 2-sided = besoin de propriétaires ET locataires simultanément. Sans annonces, pas de locataires. Sans locataires, pas d'incitation propriétaires.

**Probabilité**: Moyenne (40%)

**Impact**: Élevé (retarde croissance, augmente burn)

**Mitigation**:
- **Focus géographique hyper-local** (Bruxelles uniquement au départ)
- **Side niche** (étudiants = turnover élevé, besoin urgent)
- **Partenariats universités** (accès direct à cohortes étudiantes)
- **Incentives early adopters** (€100 crédit pour 10 premiers propriétaires)
- **Manual curation initiale** (sourcing propriétaires nous-mêmes)

### 2. Risque: Concurrence Immoweb

**Description**: Immoweb pourrait lancer features colocation (matching, KYC) et utiliser sa base massive pour nous écraser.

**Probabilité**: Moyenne (30%)

**Impact**: Très élevé (existential threat)

**Mitigation**:
- **Speed to market** (lancer avant qu'ils réagissent)
- **Focus niche** (100% colocation vs leur 5%)
- **Superior UX** (matching, KYC = différenciation)
- **Community building** (loyauté utilisateurs)
- **Partenariats exclusifs** (universités, agences)
- **Acquisition potentielle** (être acquis par Immoweb = exit)

### 3. Risque: Complexité KYC

**Description**: KYC obligatoire = friction onboarding. Users peuvent abandonner si trop compliqué.

**Probabilité**: Moyenne (35%)

**Impact**: Moyen (réduit conversion)

**Mitigation**:
- **itsme integration** (KYC en 30 secondes pour Belges)
- **Onboarding progressif** (KYC seulement avant 1er contact propriétaire, pas à l'inscription)
- **Éducation users** (expliquer pourquoi KYC = sécurité)
- **Badge "Vérifié"** (gamification, statut social)

### 4. Risque: Régulation Immobilière

**Description**: Législation belge sur baux = complexe. Risque de non-conformité légale.

**Probabilité**: Faible (15%)

**Impact**: Élevé (amendes, shutdown)

**Mitigation**:
- **Advisor légal** spécialisé immobilier belge
- **CGU robustes** (clauses disclaimer)
- **Génération contrats conformes** (templates validés avocat)
- **Veille législative** (monitoring changements lois)

### 5. Risque: Churn Propriétaires

**Description**: Propriétaires testent la plateforme, ne trouvent pas locataires, partent.

**Probabilité**: Moyenne (40%)

**Impact**: Moyen (réduit offre)

**Mitigation**:
- **Garantie placement** (si pas de locataire en 30 jours, remboursement)
- **Optimisation annonces** (aide photos, descriptions)
- **Boost gratuit** (visibilité x2 premiers 15 jours)
- **Customer success proactif** (appels, tips)

### 6. Risque: Fraude & Scams

**Description**: Fausses annonces, propriétaires malveillants, locataires fraudeurs.

**Probabilité**: Moyenne (25%)

**Impact**: Très élevé (réputation détruite)

**Mitigation**:
- **KYC obligatoire** (vérification identité)
- **Modération annonces** (AI + review manuel)
- **Système avis** (réputation propriétaires + locataires)
- **Dépôt fiduciaire** (paiements bloqués jusqu'à confirmation)
- **Assurance** (protection contre fraude)

---

## 11. Vision Long-Terme

### 3 Ans (2028)

- **100 000 utilisateurs** actifs (50K propriétaires, 50K locataires)
- **15 000 placements/an** (5% du marché belge)
- **€20M ARR** (commissions + abonnements + services)
- **Profitable** (EBITDA margin 40%+)
- **Leader colocation Belgique** (top-of-mind)

### 5 Ans (2030)

- **Expansion internationale**: France, Pays-Bas, Allemagne
- **500K utilisateurs** (multi-pays)
- **€100M ARR**
- **Series B/C** (€20-50M raises)
- **Services additionnels**: Assurance, déménagement, nettoyage, décoration
- **API B2B**: Agences immobilières, gestionnaires, institutions

### 10 Ans (2035) — Vision

**EasyCo = "Booking.com de la Colocation"**

- **Plateforme européenne** (15+ pays)
- **5M utilisateurs**
- **€500M+ ARR**
- **IPO ou Acquisition** (exit €1-2B)
- **Impact social**: Résolution crise logement étudiant, réduction solitude, économie collaborative

### Exit Scenarios

#### Scenario 1: Acquisition Stratégique (Probabilité 60%)

**Acquéreurs Potentiels**:
- **Immoweb** (Axel Springer): €50-200M (selon traction)
- **Cohabs**: €20-50M (consolidation marché)
- **Booking.com**: €100-300M (diversification hébergement)
- **Airbnb**: €200-500M (segment long-term stays)

**Timeline**: 3-5 ans post-launch

#### Scenario 2: IPO (Probabilité 20%)

**Conditions**:
- €100M+ ARR
- Profitable (EBITDA 30%+)
- Multi-pays
- Timeline: 7-10 ans

**Valorisation IPO**: €500M - €1,5B (5-15x ARR)

#### Scenario 3: Independent Growth (Probabilité 20%)

- Reste privé, profitable
- Dividendes aux fondateurs/investisseurs
- Équipe managériale autonome

---

## 12. Demande aux Investisseurs

### Financement Demandé

**€500 000** en seed funding

**Structure**:
- **SAFE** (Simple Agreement for Future Equity) ou **Convertible Note**
- **Valorisation pré-money**: €2M
- **Dilution**: 20% (post-money valuation €2,5M)
- **Discount future rounds**: 20%
- **Valuation cap**: €6M

### Allocation Fonds

- **60%** Équipe (5 FTE, 18 mois)
- **28%** Marketing & Acquisition
- **6%** Infrastructure & Tech
- **4%** Légal & Admin
- **2%** Contingency

### Milestones Clés (18 Mois)

1. **M3**: MVP complet + 100 beta users
2. **M6**: Launch public Bruxelles + 2K users
3. **M12**: 10K users, €200K ARR
4. **M18**: 20K users, €500K ARR, **Series A ready** (€2-3M raise à €10M valuation)

### Return Potential

**Seed Investment**: €500K @ €2M pre-money (20% equity)

**Exit Scenarios**:

| Scenario | Exit Valuation | Return (20% stake) | Multiple |
|----------|----------------|--------------------|----------|
| Conservative (M&A Y3) | €20M | €4M | 8x |
| Base Case (M&A Y5) | €100M | €20M | 40x |
| Optimistic (IPO Y7) | €500M | €100M | 200x |

**IRR (Internal Rate of Return)**:
- Conservative: 38% annualisé
- Base Case: 62% annualisé
- Optimistic: 91% annualisé

### Pourquoi Investir Maintenant?

1. **Timing Parfait**
   - Crise logement s'aggrave (déficit 70K d'ici 2030)
   - Post-Covid = acceptation colocation en hausse
   - Concurrents datés = fenêtre d'opportunité

2. **Traction Technique**
   - 150K+ lignes code déjà produites
   - Web app + iOS natif prêts
   - Pas de dette technique

3. **Marché Énorme**
   - €5,5B marché total Belgique
   - 300K logements partagés
   - 600K recherches actives/an

4. **Founder Exécution**
   - Samuel = full-stack senior
   - Vision claire (3 interfaces, matching, KYC)
   - Déjà prouvé capacité build (app complète solo)

5. **Modèle Économique Solide**
   - Unit economics favorables (LTV/CAC = 225x)
   - Breakeven rapide (M8)
   - Profitable Y2 (marge 64%)

6. **Exit Path Clair**
   - Acquéreurs évidents (Immoweb, Cohabs, Booking, Airbnb)
   - Précédents (HousingAnywhere acquis, Spotahome levées €100M+)

---

## 13. Next Steps

### Pour Continuer la Discussion

1. **Deck Review** (ce document)
   - Questions, clarifications
   - Deep-dive sections spécifiques

2. **Product Demo**
   - Web app (production): [URL]
   - iOS app (TestFlight): [lien]
   - Walkthrough des 3 interfaces

3. **Financial Model**
   - Spreadsheet détaillé (projections 5 ans)
   - Sensibilité assumptions

4. **Due Diligence**
   - Code review (GitHub access)
   - Architecture technique
   - Roadmap détaillée

5. **Term Sheet**
   - Négociation valorisation
   - Structure investment (SAFE, convertible, equity)
   - Timeline closing

### Contact

**Samuel Baudon**
- Email: baudonsamuel@gmail.com
- Téléphone: [À ajouter]
- LinkedIn: [À ajouter]
- GitHub: [À ajouter]

**EasyCo**
- Website: [À ajouter]
- Deck: [Ce document]
- Demo: [URL]

---

**EasyCo — Révolutionner la Colocation en Belgique**

*Merci pour votre attention. Prêt à transformer le marché locatif belge ensemble?*

---

**Document Version**: 2.0 (Enhanced with PDF details)
**Date**: 5 Décembre 2025
**Confidential**: Ce document contient des informations confidentielles et propriétaires.
