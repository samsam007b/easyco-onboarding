# EasyCo iOS - Design System Complet

## 🎨 SYSTÈME DE COULEURS

### Couleurs Primaires
```swift
// Violet principal - Identité EasyCo
Primary:        #4A148C  (74, 20, 140)
Primary Light:  #6A1B9A  (106, 27, 154)
Primary Dark:   #38006B  (56, 0, 107)

// Gradients principaux
Gradient CTA:   Linear #6A1B9A → #4A148C
Gradient Hero:  Linear #7B1FA2 → #4A148C → #38006B
```

### Couleurs Secondaires
```swift
Accent Yellow:  #FFC107  (255, 193, 7)
Accent Orange:  #FF9800  (255, 152, 0)
Accent Pink:    #E91E63  (233, 30, 99)
```

### Couleurs de Statut
```swift
Success:        #4CAF50  (76, 175, 80)
Warning:        #FF9800  (255, 152, 0)
Error:          #F44336  (244, 67, 54)
Info:           #2196F3  (33, 150, 243)
Pending:        #FFC107  (255, 193, 7)
```

### Backgrounds
```swift
Background Primary:    #FAFAFA  (250, 250, 250)
Background Secondary:  #F5F5F5  (245, 245, 245)
Card Background:       #FFFFFF  (255, 255, 255)
Overlay Dark:          rgba(0, 0, 0, 0.4)
Overlay Light:         rgba(0, 0, 0, 0.1)
```

### Textes
```swift
Text Primary:          #1A1A1A  (26, 26, 26)
Text Secondary:        #666666  (102, 102, 102)
Text Tertiary:         #999999  (153, 153, 153)
Text On Primary:       #FFFFFF  (255, 255, 255)
Text Disabled:         #CCCCCC  (204, 204, 204)
```

### Bordures & Dividers
```swift
Border Light:          #E0E0E0  (224, 224, 224)
Border Medium:         #BDBDBD  (189, 189, 189)
Border Dark:           #9E9E9E  (158, 158, 158)
Divider:               #EEEEEE  (238, 238, 238)
```

---

## 📐 TYPOGRAPHIE

### Familles de Polices
```swift
Primary Font:   SF Pro Display (titres, headlines)
Body Font:      SF Pro Text (corps de texte)
Mono Font:      SF Mono (code, données techniques)
```

### Échelle Typographique

#### Display (Très grands titres)
```swift
Display Large:
  - Font: SF Pro Display Bold
  - Size: 40pt
  - Line Height: 48pt
  - Weight: 700

Display Medium:
  - Font: SF Pro Display Bold
  - Size: 32pt
  - Line Height: 40pt
  - Weight: 700
```

#### Titres
```swift
Title 1:
  - Font: SF Pro Display Semibold
  - Size: 28pt
  - Line Height: 34pt
  - Weight: 600

Title 2:
  - Font: SF Pro Display Semibold
  - Size: 24pt
  - Line Height: 30pt
  - Weight: 600

Title 3:
  - Font: SF Pro Display Medium
  - Size: 20pt
  - Line Height: 26pt
  - Weight: 500
```

#### Corps de texte
```swift
Body Large:
  - Font: SF Pro Text Regular
  - Size: 18pt
  - Line Height: 24pt
  - Weight: 400

Body:
  - Font: SF Pro Text Regular
  - Size: 16pt
  - Line Height: 22pt
  - Weight: 400

Body Small:
  - Font: SF Pro Text Regular
  - Size: 14pt
  - Line Height: 20pt
  - Weight: 400
```

#### Labels & Captions
```swift
Label:
  - Font: SF Pro Text Medium
  - Size: 14pt
  - Line Height: 18pt
  - Weight: 500

Caption:
  - Font: SF Pro Text Regular
  - Size: 12pt
  - Line Height: 16pt
  - Weight: 400

Overline:
  - Font: SF Pro Text Semibold
  - Size: 11pt
  - Line Height: 14pt
  - Weight: 600
  - Letter Spacing: 0.5pt
  - Transform: UPPERCASE
```

---

## 📏 SPACING & LAYOUT

### Système de Spacing (Base 4pt)
```swift
xxxs:  2pt   (0.5 × base)
xxs:   4pt   (1 × base)
xs:    8pt   (2 × base)
sm:    12pt  (3 × base)
md:    16pt  (4 × base)
lg:    24pt  (6 × base)
xl:    32pt  (8 × base)
xxl:   48pt  (12 × base)
xxxl:  64pt  (16 × base)
```

### Padding Standards
```swift
Card Padding:          16pt (md)
Screen Padding:        20pt
Section Padding:       24pt (lg)
Button Padding H:      24pt (lg)
Button Padding V:      12pt (sm)
Input Padding:         12pt (sm)
```

### Marges & Gaps
```swift
Section Gap:           24pt (lg)
Card Gap:              16pt (md)
List Item Gap:         12pt (sm)
Form Field Gap:        16pt (md)
Button Group Gap:      8pt (xs)
```

---

## 🔘 COMPOSANTS UI

### Boutons

#### Bouton Primary (CTA)
```swift
Height:                50pt
Border Radius:         12pt
Background:            Gradient #6A1B9A → #4A148C
Text Color:            #FFFFFF
Font:                  SF Pro Text Semibold 16pt
Shadow:                0 4px 12px rgba(74, 20, 140, 0.3)
Padding:               24pt horizontal

States:
  - Normal:    opacity 1.0
  - Pressed:   opacity 0.85, scale 0.98
  - Disabled:  opacity 0.4
```

#### Bouton Secondary
```swift
Height:                50pt
Border Radius:         12pt
Background:            Transparent
Border:                2pt solid #4A148C
Text Color:            #4A148C
Font:                  SF Pro Text Semibold 16pt
Padding:               24pt horizontal

States:
  - Normal:    border #4A148C
  - Pressed:   background rgba(74, 20, 140, 0.05)
  - Disabled:  opacity 0.4
```

#### Bouton Tertiary / Text
```swift
Height:                44pt
Background:            Transparent
Text Color:            #4A148C
Font:                  SF Pro Text Medium 15pt
Underline:             None

States:
  - Normal:    color #4A148C
  - Pressed:   opacity 0.6
```

#### Bouton Icon
```swift
Size:                  44pt × 44pt
Border Radius:         12pt
Background:            #F5F5F5
Icon Size:             24pt
Icon Color:            #4A148C

States:
  - Normal:    background #F5F5F5
  - Pressed:   background #E0E0E0
```

### Cards

#### Card Standard
```swift
Background:            #FFFFFF
Border Radius:         16pt
Shadow:                0 2px 8px rgba(0, 0, 0, 0.08)
Padding:               16pt
Border:                None
```

#### Card Elevated (Important)
```swift
Background:            #FFFFFF
Border Radius:         20pt
Shadow:                0 4px 16px rgba(0, 0, 0, 0.12)
Padding:               20pt
Border:                None
```

#### Card Interactive
```swift
Background:            #FFFFFF
Border Radius:         16pt
Shadow:                0 2px 8px rgba(0, 0, 0, 0.08)
Padding:               16pt

States:
  - Normal:    shadow 0 2px 8px rgba(0, 0, 0, 0.08)
  - Pressed:   shadow 0 1px 4px rgba(0, 0, 0, 0.12)
                       scale 0.98
```

### Input Fields

#### Text Input
```swift
Height:                50pt
Border Radius:         12pt
Background:            #F5F5F5
Border:                1pt solid transparent
Text Color:            #1A1A1A
Font:                  SF Pro Text Regular 16pt
Padding:               12pt horizontal
Placeholder Color:     #999999

States:
  - Normal:    border transparent, background #F5F5F5
  - Focus:     border #4A148C, background #FFFFFF
  - Error:     border #F44336, background #FFF5F5
  - Disabled:  opacity 0.5
```

#### Search Bar
```swift
Height:                44pt
Border Radius:         22pt (pill)
Background:            #F5F5F5
Icon:                  24pt magnifying glass, #666666
Text Color:            #1A1A1A
Font:                  SF Pro Text Regular 15pt
Padding:               12pt horizontal + 40pt left (icon space)
```

### Badges

#### Badge Status
```swift
Height:                24pt
Border Radius:         12pt (pill)
Font:                  SF Pro Text Semibold 12pt
Padding:               8pt horizontal

Variants:
  - Success:   background #E8F5E9, color #2E7D32
  - Warning:   background #FFF3E0, color #E65100
  - Error:     background #FFEBEE, color #C62828
  - Info:      background #E3F2FD, color #1565C0
  - Pending:   background #FFF8E1, color #F57F17
```

#### Badge Count
```swift
Size:                  20pt × 20pt (min)
Border Radius:         10pt (circle)
Background:            #F44336
Text Color:            #FFFFFF
Font:                  SF Pro Text Bold 11pt
```

### Dividers
```swift
Height:                1pt
Color:                 #EEEEEE
Margin:                16pt vertical
```

---

## 🎭 ANIMATIONS & TRANSITIONS

### Durées Standard
```swift
Instant:               0.1s
Quick:                 0.2s
Normal:                0.3s
Slow:                  0.5s
Very Slow:             0.8s
```

### Easing Functions
```swift
Standard:              cubic-bezier(0.4, 0.0, 0.2, 1)
Deceleration:          cubic-bezier(0.0, 0.0, 0.2, 1)
Acceleration:          cubic-bezier(0.4, 0.0, 1, 1)
Sharp:                 cubic-bezier(0.4, 0.0, 0.6, 1)
Spring:                spring(response: 0.5, dampingFraction: 0.8)
```

### Animations Communes

#### Fade In
```swift
Duration:              0.3s
From:                  opacity 0
To:                    opacity 1
Easing:                Standard
```

#### Slide In
```swift
Duration:              0.3s
From:                  translateY(20pt), opacity 0
To:                    translateY(0), opacity 1
Easing:                Deceleration
```

#### Scale Pop
```swift
Duration:              0.2s
From:                  scale(0.9), opacity 0
To:                    scale(1.0), opacity 1
Easing:                Spring
```

#### Button Press
```swift
Duration:              0.15s
From:                  scale(1.0)
To:                    scale(0.98)
Easing:                Quick
```

#### Staggered List (cascade)
```swift
Item Delay:            0.05s between items
Animation:             Slide In
Max Items:             20 (then instant)
```

---

## 🖼️ ICONOGRAPHIE

### Tailles d'Icônes
```swift
Small:                 16pt
Medium:                24pt
Large:                 32pt
Extra Large:           48pt
```

### Styles d'Icônes
```swift
Library:               Lucide Icons (primary)
Fallback:              SF Symbols
Stroke Width:          2pt
Corner Radius:         2pt
```

### Icônes Principales
```swift
Navigation:
  - Home:              home
  - Search:            search
  - Messages:          message-circle
  - Profile:           user
  - Settings:          settings

Actions:
  - Add:               plus
  - Edit:              edit-2
  - Delete:            trash-2
  - Share:             share-2
  - Download:          download
  - Upload:            upload
  - Close:             x
  - Check:             check
  - Arrow Right:       arrow-right

Status:
  - Success:           check-circle
  - Error:             alert-circle
  - Warning:           alert-triangle
  - Info:              info

Property:
  - Bed:               bed-double
  - Bath:              shower
  - Area:              square
  - Location:          map-pin
```

---

## 📱 LAYOUTS & GRIDS

### Breakpoints (bien que iOS natif)
```swift
iPhone SE:             375pt width
iPhone Standard:       390pt width
iPhone Plus:           428pt width
iPhone Max:            430pt width
iPad:                  768pt width
```

### Safe Areas
```swift
Top Safe Area:         44-59pt (status bar + notch)
Bottom Safe Area:      34pt (home indicator)
Horizontal Padding:    20pt
```

### Grid System
```swift
Columns:               12 (flexible)
Gutter:                16pt
Margin:                20pt
```

---

## 🎯 ÉTATS INTERACTIFS

### Opacités
```swift
Pressed:               0.85
Hovered (iPad):        0.9
Disabled:              0.4
Inactive:              0.6
Ghost:                 0.1
```

### Haptic Feedback
```swift
Light Impact:          Button taps, toggle switches
Medium Impact:         Confirmations, selections
Heavy Impact:          Destructive actions
Success:               Completion, achievements
Warning:              Attention needed
Error:                 Mistakes, failures
```

---

## 🌈 GRADIENTS SPÉCIAUX

### Gradient Backgrounds
```swift
Hero Gradient:
  Colors:              #F3E5F5 → #FFF9E6
  Direction:           Top Leading → Bottom Trailing
  Use:                 Login, Welcome screens

Card Gradient Accent:
  Colors:              rgba(106, 27, 154, 0.05) → transparent
  Direction:           Top → Bottom
  Use:                 Featured cards

Glassmorphism:
  Background:          rgba(255, 255, 255, 0.85)
  Backdrop Blur:       20pt
  Border:              1pt solid rgba(255, 255, 255, 0.3)
  Shadow:              0 8px 32px rgba(0, 0, 0, 0.1)
```

---

## 📊 GRAPHIQUES & DATA VIZ

### Couleurs de Graphiques
```swift
Chart Color 1:         #4A148C  (Primary)
Chart Color 2:         #FFC107  (Accent)
Chart Color 3:         #2196F3  (Info)
Chart Color 4:         #4CAF50  (Success)
Chart Color 5:         #FF9800  (Warning)
Chart Color 6:         #E91E63  (Accent Pink)
```

### Donut Chart (Expenses)
```swift
Track Width:           24pt
Background:            #F5F5F5
Active Segment:        Respective colors
Center Hole:           60% of radius
```

---

## 🎪 COMPOSANTS SPÉCIAUX EASYCO

### Property Card
```swift
Height:                280pt
Border Radius:         20pt
Image Height:          160pt
Content Padding:       16pt
Shadow:                0 4px 12px rgba(0, 0, 0, 0.1)

Elements:
  - Badge Price:       Top Right, Yellow, 24pt high
  - Location Icon:     16pt, Gray
  - Features Row:      Icons 20pt, Gray text 14pt
```

### Match Card (Swipe)
```swift
Width:                 Screen Width - 40pt
Height:                Screen Height × 0.7
Border Radius:         32pt
Shadow:                0 8px 24px rgba(0, 0, 0, 0.15)

Overlays:
  - Like (Right):      Green, check icon, opacity 0
  - Pass (Left):       Red, X icon, opacity 0
  - Score Badge:       Top, gradient, 60pt diameter
```

### Chat Bubble
```swift
Max Width:             75% of screen
Border Radius:         20pt
Padding:               12pt horizontal, 8pt vertical

Sent (User):
  - Background:        Gradient #6A1B9A → #4A148C
  - Text Color:        #FFFFFF
  - Alignment:         Right
  - Tail:              Bottom Right

Received:
  - Background:        #F5F5F5
  - Text Color:        #1A1A1A
  - Alignment:         Left
  - Tail:              Bottom Left
```

---

## 🔐 DESIGN TOKENS (JSON Export)

```json
{
  "colors": {
    "primary": "#4A148C",
    "primaryLight": "#6A1B9A",
    "primaryDark": "#38006B",
    "accentYellow": "#FFC107",
    "success": "#4CAF50",
    "error": "#F44336",
    "warning": "#FF9800",
    "info": "#2196F3",
    "backgroundPrimary": "#FAFAFA",
    "backgroundSecondary": "#F5F5F5",
    "cardBackground": "#FFFFFF",
    "textPrimary": "#1A1A1A",
    "textSecondary": "#666666"
  },
  "spacing": {
    "xxxs": 2,
    "xxs": 4,
    "xs": 8,
    "sm": 12,
    "md": 16,
    "lg": 24,
    "xl": 32,
    "xxl": 48,
    "xxxl": 64
  },
  "borderRadius": {
    "sm": 8,
    "md": 12,
    "lg": 16,
    "xl": 20,
    "xxl": 24,
    "pill": 999
  },
  "shadows": {
    "sm": "0 2px 8px rgba(0,0,0,0.08)",
    "md": "0 4px 12px rgba(0,0,0,0.1)",
    "lg": "0 8px 24px rgba(0,0,0,0.12)",
    "primary": "0 4px 12px rgba(74,20,140,0.3)"
  }
}
```

---

**Made with ❤️ for EasyCo iOS**
**Design System v1.0 - December 2024**
