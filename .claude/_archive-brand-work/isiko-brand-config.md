---
brand_name: "IzzIco"
tagline: "Trouve ta coloc' ideale"
industry: "PropTech / Coliving"
market: "Belgique"
target_demographic: "20-35 ans"
created: "2025-01-01"
updated: "2025-01-01"
version: "2.0"
---

# IzzIco Brand Configuration

## Vue d'Ensemble

**Mission :** Revolutionner la colocation en Belgique en combinant le meilleur d'Airbnb (reservation instantanee), Tinder (matching par compatibilite) et Immoweb (recherche exhaustive).

**Vision :** Devenir LA reference de la colocation en Belgique francophone, puis expansion Benelux.

**Proposition de Valeur :** Trouver un logement partage qui correspond vraiment a ta personnalite, pas juste a ton budget.

---

## Valeurs de Marque

| Valeur | Expression | Anti-pattern |
|--------|------------|--------------|
| **Confiance** | KYC obligatoire, profils verifies | Profils anonymes, pas de verification |
| **Simplicite** | UX intuitive, processus fluide | Formulaires interminables, jargon |
| **Innovation** | Matching intelligent, tech moderne | Process papier, pas de digital |
| **Transparence** | Charges detaillees, communication claire | Frais caches, mauvaises surprises |
| **Communaute** | Colocations harmonieuses | Colocs subies, pas choisies |

---

## Segments Utilisateurs

### 1. Proprietaires (Owners)
- **Couleur :** Violet `#8B5CF6`
- **Persona principale :** Marc, gestionnaire immobilier
- **Objectif :** Louer vite, bien, sans impaye
- **Ton :** Professionnel, efficace, rassurant

### 2. Chercheurs (Searchers)
- **Couleur :** Bleu `#3B82F6`
- **Persona principale :** Lea, jeune professionnelle
- **Objectif :** Trouver une coloc qui me ressemble
- **Ton :** Accessible, enthousiaste, moderne

### 3. Residents (Tenants)
- **Couleur :** Vert `#10B981`
- **Persona principale :** Thomas, locataire actif
- **Objectif :** Gerer ma vie de coloc facilement
- **Ton :** Chaleureux, pratique, communautaire

---

## Palette de Couleurs

### Gradient Signature
```css
/* Le gradient qui represente tous les roles */
background: linear-gradient(135deg,
  #9c5698 0%,    /* Mauve (Origine Owner) */
  #FF5722 50%,   /* Orange (Transition) */
  #FFB10B 100%   /* Jaune (Energie Searcher) */
);
```

### Couleurs Primaires
| Nom | Hex | Usage |
|-----|-----|-------|
| Primary Blue | `#3B82F6` | CTAs, liens, interface chercheurs |
| Dark Blue | `#1E3A8A` | Titres, headers |
| White | `#FFFFFF` | Backgrounds, cartes |

### Couleurs par Role
| Role | Couleur | Hex | Tailwind |
|------|---------|-----|----------|
| Owner | Violet | `#8B5CF6` | `violet-500` |
| Searcher | Bleu | `#3B82F6` | `blue-500` |
| Resident | Vert | `#10B981` | `green-500` |

### Couleurs Status
| Status | Hex | Usage |
|--------|-----|-------|
| Succes | `#10B981` | Confirmations, paiements reussis |
| Attention | `#F59E0B` | Alertes non-critiques |
| Erreur | `#EF4444` | Erreurs, rejets |
| Info | `#06B6D4` | Tips, tooltips |

---

## Typographie

### Police Principale : Inter
- **Light (300)** : Metadonnees, labels subtils
- **Regular (400)** : Corps de texte
- **Medium (500)** : Sous-titres, navigation
- **SemiBold (600)** : Boutons, H3-H6
- **Bold (700)** : H1-H2
- **ExtraBold (800)** : Logo type, hero

### Hierarchie
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| H1 Hero | Inter | 48px | 800 | `#1E3A8A` |
| H2 Section | Inter | 36px | 700 | `#1E3A8A` |
| H3 Subsection | Inter | 28px | 600 | `#1F2937` |
| Body | Inter | 16px | 400 | `#1F2937` |
| Small | Inter | 14px | 400 | `#6B7280` |
| Button | Inter | 16px | 600 | varies |

---

## Ton de Voix

### Pour Proprietaires
- **Style :** Professionnel mais accessible
- **Tutoyement :** Vous
- **Exemples :**
  - "Trouvez le locataire ideal en 48h"
  - "Reduisez les impayes de 60% grace au KYC"
- **A eviter :** Trop casual, argot

### Pour Chercheurs
- **Style :** Accessible, enthousiaste
- **Tutoyement :** Tu
- **Exemples :**
  - "Trouve ta coloc' ideale en quelques swipes"
  - "Rencontre des colocataires qui te ressemblent"
- **A eviter :** Trop corporate, jargon

### Pour Residents
- **Style :** Chaleureux, pratique
- **Tutoyement :** Tu
- **Exemples :**
  - "Ton loyer en 2 clics"
  - "Organise une soiree avec tes colocs"
- **A eviter :** Froid, administratif

---

## Logo

### Versions
1. **Logo Textuel** : "IzzIco" avec gradient signature
   - Usage : Headers desktop, marketing, presentations
   - Fichier : `public/logos/izzico-logo-text-final.svg`

2. **Logo Icon** : Maison avec gradient
   - Usage : Favicon, app mobile, petits formats
   - Fichier : `public/logos/izzico-icon.svg`

3. **Logo Compact** : Version reduite texte
   - Usage : Signatures email, documents
   - Fichier : `public/logos/izzico-logo-compact.svg`

### Caracteristiques Techniques
- Gradient diagonal 135deg
- Z en miroir (effet signature)
- Font Arial Black 900
- Pas d'ombre (design epure)

---

## Motion Design

### Principes
- **Subtle & Purposeful** : Animations ont une raison
- **Fast & Responsive** : 150-300ms
- **Natural Easing** : Ease-out par defaut

### Durees
| Type | Duree | Usage |
|------|-------|-------|
| Micro | 150ms | Hover, focus |
| Transition | 200ms | Color, opacity |
| Entrance | 300ms | Modals, dropdowns |
| Page | 500ms | Transitions pages |

### Easing
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Photographie

### Style
- **Lumiere naturelle** : Bright, airy spaces
- **Authentique** : Vraies personnes, pas trop posees
- **Diverse** : Tous publics (etudiants, jeunes actifs)
- **Local** : Quartiers belges (Bruxelles, Gand, Liege)

### Traitement
- Saturation legerement augmentee
- Contraste moyen-eleve
- Temperature warm
- Eviter filtres Instagram excessifs

---

## Composants UI

### Boutons
```css
/* Primary */
background: #3B82F6;
color: white;
padding: 12px 24px;
border-radius: 8px;

/* Hover */
background: #2563EB;
```

### Cards
```css
background: white;
border: 1px solid #E5E7EB;
border-radius: 12px;
padding: 24px;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
```

### Inputs
```css
border: 1px solid #D1D5DB;
border-radius: 8px;
padding: 12px 16px;
/* Focus */
border-color: #3B82F6;
box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
```

---

## Keywords SEO

coliving belgique, colocation bruxelles, chercher colocation,
habitat partage, roommate matching, location meublee,
kot etudiant, appartement partage, vivre ensemble,
communaute residence, logement jeunes actifs

---

## Concurrents

| Concurrent | Forces | Faiblesses |
|------------|--------|------------|
| Immoweb | Reference, volume | Pas de matching, UX datee |
| Facebook Groups | Gratuit, large audience | Pas securise, spam |
| Roomster | International | Peu adapte Belgique |
| Roomiez | Concept similaire | Peu de visibilite |

---

## Differenciateurs IzzIco

1. **Matching intelligent** base sur compatibilite personnelle
2. **KYC obligatoire** pour securite (proprietaires rassures)
3. **UX moderne** style Airbnb/Tinder (jeunes adorent)
4. **Focus Belgique** (localisation, langue, culture)
5. **Paiements integres** (loyer via app)
6. **Communaute** (events, chat colocs)
