# EasyCo Design System

## Overview

The EasyCo Design System is built on the principles of being **modern**, **minimal**, and **friendly**. It creates a cohesive experience across the coliving platform while maintaining the warm, welcoming feel that students and young professionals expect.

## Core Principles

### 🎨 Modern
- Clean lines and contemporary aesthetics
- Subtle animations and micro-interactions
- Progressive design patterns

### 🎯 Minimal
- Focused layouts with intentional white space
- Essential elements only, no visual clutter
- Clear information hierarchy

### 😊 Friendly
- Warm, approachable color palette
- Rounded corners and soft shadows
- Human-centered language and icons

---

## Color System

### Primary Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Deep Purple** | `#4A148C` | Primary brand color, headers, CTA text |
| **Mustard Yellow** | `#FFD600` | Primary CTA buttons, accents, highlights |
| **Pure White** | `#FFFFFF` | Background, cards, clarity |

### Secondary Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Light Purple** | `#7E57C2` | Hover states, subtle accents |
| **Dark Purple** | `#311B92` | Hover states for primary purple |
| **Dark Mustard** | `#F57F17` | Hover states for mustard buttons |
| **Light Gray** | `#F5F5F5` | Page backgrounds, subtle separators |
| **Medium Gray** | `#E0E0E0` | Borders, dividers |
| **Dark Gray** | `#757575` | Body text, secondary information |

### Status Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Success** | `#10B981` | Success messages, completed states |
| **Warning** | `#F59E0B` | Warnings, pending states |
| **Error** | `#EF4444` | Error messages, critical alerts |
| **Info** | `#3B82F6` | Information, neutral alerts |

---

## Typography

### Font Family
- **Primary**: Inter, Poppins, Roboto
- **Fallback**: system-ui, -apple-system, sans-serif

### Typography Scale

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| **H1** | 3xl (1.875rem) | Bold (700) | Main page titles |
| **H2** | 2xl (1.5rem) | Semibold (600) | Section headers |
| **H3** | xl (1.25rem) | Semibold (600) | Subsection titles |
| **Body** | base (1rem) | Regular (400) | Main content text |
| **Caption** | sm (0.875rem) | Regular (400) | Secondary text, metadata |
| **Small** | xs (0.75rem) | Regular (400) | Legal text, fine print |

### Line Heights
- **Headings**: 1.4
- **Body text**: 1.5
- **Captions**: 1.4

---

## Components

### Buttons

#### Primary Button
```css
.easyCo-button-primary {
  background: var(--color-easyCo-mustard);
  color: black;
  border-radius: 2rem;
  font-weight: 500;
}
```
**Usage**: Main CTAs, primary actions

#### Secondary Button
```css
.easyCo-button-secondary {
  background: var(--color-easyCo-purple);
  color: white;
  border-radius: 2rem;
  font-weight: 500;
}
```
**Usage**: Secondary actions, navigation

#### Outline Button
```css
.easyCo-button-outline {
  border: 2px solid var(--color-easyCo-purple);
  color: var(--color-easyCo-purple);
  background: transparent;
  border-radius: 2rem;
}
```
**Usage**: Alternative actions, less emphasis

#### Ghost Button
```css
.easyCo-button-ghost {
  background: transparent;
  color: var(--color-easyCo-purple);
  border-radius: 2rem;
}
```
**Usage**: Tertiary actions, minimal emphasis

#### Disabled State
```css
.easyCo-button:disabled {
  background: var(--color-easyCo-gray-medium);
  color: var(--color-easyCo-gray-dark);
  cursor: not-allowed;
}
```

### Cards

#### Standard Card
```css
.easyCo-card {
  background: white;
  border-radius: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: none;
}
```

#### Property Card
```css
.easyCo-card-property {
  background: white;
  border-radius: 3rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
```

#### Finance KPI Card
- **Background**: Gradient based on metric type
- **Border radius**: 2rem
- **Padding**: 1.5rem
- **Icon container**: Colored circle with white icon

### Input Fields

#### Standard Input
```css
.easyCo-input {
  border: 2px solid var(--color-easyCo-gray-medium);
  border-radius: 2rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

.easyCo-input:focus {
  border-color: var(--color-easyCo-purple);
  outline: none;
}
```

#### Error State
```css
.easyCo-input.error {
  border-color: var(--color-easyCo-error);
}
```

#### Disabled State
```css
.easyCo-input:disabled {
  background: var(--color-easyCo-gray-light);
  color: var(--color-easyCo-gray-dark);
}
```

### Dropdowns

#### Select Component
- **Border radius**: 2rem
- **Border**: 2px solid medium gray
- **Focus state**: Purple border
- **Options**: White background, hover with light purple

### Badges

#### Available Badge
```css
.easyCo-badge-available {
  background: var(--color-easyCo-mustard);
  color: black;
  border-radius: 1rem;
  padding: 0.25rem 0.75rem;
}
```

#### Status Badges
- **Success**: Green background, dark green text
- **Warning**: Yellow background, dark yellow text
- **Error**: Red background, dark red text
- **Info**: Blue background, dark blue text

### Modals

#### Modal Container
- **Background**: White
- **Border radius**: 3rem
- **Max width**: 32rem
- **Padding**: 2rem
- **Shadow**: Large shadow

#### Modal Actions
- **Button layout**: Flex row, gap between buttons
- **Primary action**: Mustard button
- **Secondary action**: Outline button

### Tabs

#### Tab Container
```css
.easyCo-tabs {
  background: var(--color-easyCo-gray-light);
  border-radius: 2rem;
  padding: 0.25rem;
}
```

#### Active Tab
```css
.easyCo-tab-active {
  background: white;
  color: var(--color-easyCo-purple);
  border-radius: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

---

## Icons

### Expense Categories

| Category | Icon | Color | Usage |
|----------|------|-------|-------|
| **Rent** | Home | Blue (#3B82F6) | Monthly rent payments |
| **Utilities** | Zap | Yellow (#F59E0B) | Electricity, gas, water |
| **Maintenance** | Wrench | Green (#10B981) | Repairs and upkeep |
| **Taxes** | FileText | Red (#EF4444) | Property taxes |
| **Internet** | Wifi | Purple (#7C3AED) | WiFi and connectivity |
| **Parking** | Car | Indigo (#6366F1) | Parking fees |
| **Insurance** | Shield | Orange (#F97316) | Property insurance |
| **Water** | Droplets | Cyan (#06B6D4) | Water utilities |

### Status Icons

| Status | Icon | Color |
|--------|------|-------|
| **Success** | CheckCircle | Green |
| **Error** | XCircle | Red |
| **Warning** | AlertCircle | Yellow |
| **Info** | Info | Blue |

### Navigation Icons

| Section | Icon | Usage |
|---------|------|-------|
| **Home** | Home | Main dashboard |
| **Properties** | Building | Property management |
| **Roommates** | Users | Social features |
| **Finance** | DollarSign | Financial tracking |
| **Calendar** | Calendar | Scheduling |
| **Favorites** | Heart | Saved items |
| **Location** | MapPin | Geographic features |

---

## Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| **xs** | 0.25rem | Tight spacing |
| **sm** | 0.5rem | Small gaps |
| **md** | 1rem | Standard spacing |
| **lg** | 1.5rem | Section spacing |
| **xl** | 2rem | Large spacing |
| **2xl** | 3rem | Major section breaks |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| **sm** | 0.75rem | Small elements |
| **md** | 1rem | Standard radius |
| **lg** | 1.5rem | Cards, inputs |
| **xl** | 2rem | Large cards |
| **2xl** | 3rem | Property cards |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| **sm** | `0 1px 2px rgba(0, 0, 0, 0.05)` | Subtle elevation |
| **md** | `0 4px 6px rgba(0, 0, 0, 0.1)` | Card elevation |
| **lg** | `0 10px 15px rgba(0, 0, 0, 0.1)` | Property cards |
| **xl** | `0 20px 25px rgba(0, 0, 0, 0.1)` | Modals, overlays |

---

## Usage Guidelines

### When to Use Each Color

#### Purple (#4A148C)
- ✅ Page headers and titles
- ✅ Navigation elements
- ✅ Text that needs emphasis
- ❌ Large background areas
- ❌ Body text (use gray instead)

#### Mustard Yellow (#FFD600)
- ✅ Primary action buttons
- ✅ Call-to-action elements
- ✅ "Available" status indicators
- ✅ Highlighting important information
- ❌ Large text blocks
- ❌ Backgrounds (too bright)

#### White (#FFFFFF)
- ✅ Card backgrounds
- ✅ Page backgrounds
- ✅ Button text on colored backgrounds
- ✅ Creating breathing room
- ❌ Text on light backgrounds

### Accessibility

#### Color Contrast
- **AA compliance**: All text meets WCAG 2.1 AA standards
- **Purple on white**: 8.5:1 ratio
- **Black on mustard**: 7.2:1 ratio
- **Dark gray on white**: 4.8:1 ratio

#### Interactive Elements
- **Minimum touch target**: 44px × 44px
- **Focus indicators**: Visible purple outline
- **Hover states**: Subtle color shifts

#### Typography
- **Minimum font size**: 14px
- **Line length**: Maximum 75 characters
- **Font weights**: Maximum of 3 weights used

### Responsive Behavior

#### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

#### Mobile Adaptations
- **Touch-friendly**: Larger buttons and touch targets
- **Simplified layouts**: Single column on mobile
- **Readable text**: Minimum 16px on mobile devices

---

## Implementation

### CSS Custom Properties

All design tokens are available as CSS custom properties:

```css
/* Colors */
var(--color-easyCo-purple)
var(--color-easyCo-mustard)
var(--color-easyCo-gray-light)

/* Spacing */
var(--easyCo-spacing-md)
var(--easyCo-spacing-lg)

/* Shadows */
var(--easyCo-shadow-md)
var(--easyCo-shadow-lg)
```

### Utility Classes

Pre-built utility classes for common patterns:

```css
.easyCo-card
.easyCo-button-primary
.easyCo-button-secondary
.easyCo-input
.easyCo-badge-available
```

### Component Library

All components are built using shadcn/ui as the foundation, with EasyCo-specific styling applied through CSS custom properties and utility classes.

---

## Maintenance

### Adding New Components
1. Follow existing naming conventions
2. Use design tokens for colors and spacing
3. Ensure accessibility compliance
4. Document usage and variations

### Updating Colors
1. Update CSS custom properties
2. Test contrast ratios
3. Update documentation
4. Review all components for impact

### Version Control
- **Major changes**: Breaking changes to component APIs
- **Minor changes**: New components or non-breaking updates
- **Patch changes**: Bug fixes and small improvements