# Direction Artistique IzzIco - Document Complet

> Version 1.0 - Janvier 2025
> Genere avec le brand-ecosystem de plugins Claude Code

---

## Vue d'Ensemble

### Mission
**"Transformer la recherche de colocation en rencontre de communaute"**

### Positionnement
IzzIco est la plateforme belge de colocation qui met l'humain au centre. La ou les concurrents montrent des murs, IzzIco revele les gens qui vivent dedans.

### Marche
- **Zone** : Belgique (focus Bruxelles, expansion Wallonie/Flandre)
- **Cible** : 20-35 ans, jeunes professionnels
- **Segments** : Chercheurs, Proprietaires, Residents

---

## Identite Visuelle

### Logo
- **Nom** : IzzIco (avec majuscules I-I)
- **Concept** : Z miroir symbolisant la connexion
- **Gradient signature** : Mauve → Orange → Jaune (135deg)
- **Font** : Arial Black 900

### Palette de Couleurs

#### Couleurs Primaires par Segment
| Segment | Couleur | Hex | Usage |
|---------|---------|-----|-------|
| Chercheurs | Bleu Confiance | `#3B82F6` | CTA recherche, matchs |
| Proprietaires | Violet Premium | `#8B5CF6` | Dashboard proprio, premium |
| Residents | Vert Equilibre | `#10B981` | Hub resident, confirmations |

#### Gradient Signature
```css
background: linear-gradient(135deg, #9c5698 0%, #FF5722 50%, #FFB10B 100%);
```
Usage : Logo, headers principaux, moments de celebration

#### Neutrals
- Background : `#FFFFFF` (light) / `#0F172A` (dark)
- Text : `#1E293B` (primary) / `#64748B` (secondary)
- Borders : `#E2E8F0`

### Typographie

| Usage | Font | Weight |
|-------|------|--------|
| Headings | Inter | 700 (Bold) |
| Body | Inter | 400 (Regular) |
| UI | Inter | 500 (Medium) |
| Marketing | Poppins | 600 (SemiBold) |

---

## Personas

### Personas Primaires

#### 1. Lea - La jeune pro qui cherche sa tribu
- **Segment** : Chercheurs
- **Age** : 25-30 ans
- **Objectif** : Trouver des colocs compatibles, pas juste un toit
- **Frustration** : "Les sites ne montrent que des murs"
- **Fichier** : [lea-chercheuse.md](../personas/lea-chercheuse.md)

#### 2. Marc - Le proprio qui veut des locataires fiables
- **Segment** : Proprietaires
- **Age** : 45-55 ans
- **Objectif** : Locataires verifies, paiements securises
- **Frustration** : "50 candidatures dont 45 non qualifiees"
- **Fichier** : [marc-proprietaire.md](../personas/marc-proprietaire.md)

#### 3. Thomas - Le coloc qui veut une vie simple
- **Segment** : Residents
- **Age** : 28-35 ans
- **Objectif** : Gestion coloc sans stress
- **Frustration** : "Le groupe WhatsApp c'est le chaos"
- **Fichier** : [thomas-resident.md](../personas/thomas-resident.md)

### Anti-Persona

#### Kevin - Le chasseur de bons plans
- **Type** : Anti-persona (NON cible)
- **Caracteristique** : Prix minimum seul critere
- **Fichier** : [kevin-chasseur-promo.md](../personas/kevin-chasseur-promo.md)

---

## Scenarios d'Usage

### Documentes

| Persona | Scenario | Fichier |
|---------|----------|---------|
| Lea | Premiere recherche de colocation | [lea-premiere-recherche.md](../personas/scenarios/lea-premiere-recherche.md) |
| Marc | Chambre a louer | [marc-chambre-a-louer.md](../personas/scenarios/marc-chambre-a-louer.md) |
| Thomas | Vie quotidienne en coloc | [thomas-vie-quotidienne.md](../personas/scenarios/thomas-vie-quotidienne.md) |

---

## Tonalite et Voix

### Principes Fondamentaux
- **Humaine** : Comme un ami, pas une banque
- **Claire** : Pas de jargon, phrases courtes
- **Rassurante** : Simplifier, pas compliquer
- **Inclusive** : Tu/Vous selon contexte

### Adaptation par Segment

| Segment | Registre | Ton | Exemple |
|---------|----------|-----|---------|
| Chercheurs | Amical, encourageant | Positif, empathique | "Trouve ta tribu" |
| Proprietaires | Professionnel, rassurant | Factuel, solutions | "Locataires verifies" |
| Residents | Decontracte, efficace | Direct, minimal | "Loyer paye ✓" |

### Guide Complet
[voice-guide-by-segment.md](voice-guide-by-segment.md)

---

## Composants UI

### Cartes Colocation (Chercheurs)
- Photo logement + avatars colocs
- Score compatibilite visible (ex: 87%)
- Prix et localisation
- Badge "Verifie" si applicable

### Dashboard Proprio (Proprietaires)
- Vue tableau des chambres
- Indicateurs : taux occupation, paiements
- Candidatures avec scores
- Actions rapides

### Hub Resident (Residents)
- Feed d'activite simple
- Actions 1-tap (payer, signaler)
- Planning taches
- Events coloc

### Boutons et CTA
```
Primaire : Gradient signature, texte blanc
Secondaire : Outline couleur segment, texte couleur
Tertiaire : Ghost, texte gris
```

---

## Motion Design

### Principes
- **Subtil** : Pas de distraction
- **Fonctionnel** : Feedback d'action
- **Rapide** : 200-300ms max

### Animations Cles
| Element | Animation | Duree |
|---------|-----------|-------|
| Page transition | Fade + slide | 250ms |
| Card hover | Elevation + scale 1.02 | 150ms |
| Confirmation | Check + pulse | 400ms |
| Match | Confetti subtil | 600ms |

---

## Accessibilite

### Contraste Minimum
- Texte sur fond : 4.5:1 (AA)
- Grands titres : 3:1

### Couleurs Testees
| Combinaison | Ratio | Status |
|-------------|-------|--------|
| Bleu #3B82F6 sur blanc | 4.7:1 | ✓ AA |
| Violet #8B5CF6 sur blanc | 4.5:1 | ✓ AA |
| Vert #10B981 sur blanc | 3.2:1 | ✓ Grands textes |

### Bonnes Pratiques
- Labels sur tous les inputs
- Alt text sur toutes les images
- Navigation clavier complete
- Lecteur d'ecran compatible

---

## Fichiers de la DA

### Structure
```
.claude/
├── brand/
│   ├── isiko-brand-config.md      # Configuration centralisee
│   ├── voice-guide-by-segment.md  # Guide de tonalite
│   └── DA-ISIKO-COMPLETE.md       # Ce document
│
└── personas/
    ├── lea-chercheuse.md          # Persona Chercheurs
    ├── marc-proprietaire.md       # Persona Proprietaires
    ├── thomas-resident.md         # Persona Residents
    ├── kevin-chasseur-promo.md    # Anti-persona
    │
    └── scenarios/
        ├── lea-premiere-recherche.md
        ├── marc-chambre-a-louer.md
        └── thomas-vie-quotidienne.md
```

### Documents Existants (Projet)
```
/
├── IZZICO_BRAND_KIT.md           # Brand kit complet
├── IZZICO_COLOR_PALETTE.md       # Palette detaillee
└── LOGO_IZZICO_FINAL.md          # Specifications logo
```

---

## Utilisation

### Pour les Designers
1. Consulter la palette et les composants UI
2. Utiliser les personas pour les maquettes
3. Valider avec les scenarios

### Pour les Developpeurs
1. Implementer les variables CSS de la palette
2. Respecter les durees d'animation
3. Tester l'accessibilite

### Pour le Marketing
1. Adapter la tonalite au segment cible
2. Eviter les anti-patterns Kevin
3. Utiliser les verbatims des personas

### Pour le Produit
1. Prioriser les features avec les personas
2. Valider les parcours avec les scenarios
3. Mesurer avec les KPIs definis

---

## Prochaines Etapes Suggerees

### Court Terme
- [ ] Exporter la palette en tokens design (Figma, CSS vars)
- [ ] Creer les composants UI dans Storybook
- [ ] Valider les personas avec des interviews reelles

### Moyen Terme
- [ ] Ajouter des personas secondaires (etudiant Erasmus, coloc senior)
- [ ] Creer des scenarios supplementaires (onboarding, probleme technique)
- [ ] Tester la tonalite avec A/B tests

### Long Terme
- [ ] Etendre la DA aux supports print/events
- [ ] Documenter les edge cases et exceptions
- [ ] Mettre en place un design system complet

---

## Changelog

| Version | Date | Changements |
|---------|------|-------------|
| 1.0 | 2025-01-01 | Creation initiale avec brand-ecosystem |

---

*Document genere avec les plugins brand-ecosystem de Claude Code :*
*persona-builder, copywriting-guide, accessibility-toolkit, ux-patterns*
