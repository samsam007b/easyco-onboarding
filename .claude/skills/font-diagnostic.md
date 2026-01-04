---
name: font-diagnostic
description: Diagnose and fix Next.js font issues with Tailwind CSS. Use when fonts display incorrectly or fallback to system fonts.
---

# Font Diagnostic - Next.js + Tailwind CSS

Use this skill to diagnose and fix font display issues in the Izzico project.

## Quick Diagnostic Checklist

Run these checks in order:

### 1. Check Font Variable Classes Location

```bash
# Font classes MUST be on <html>, not <body>
grep -n "inter.variable\|nunito.variable\|fredoka.variable" app/layout.tsx
```

**Expected output:**
```tsx
// Line should show classes on <html>:
<html lang="fr" className={`${inter.variable} ${nunito.variable} ${fredoka.variable}`}>
```

**Problem if you see:**
```tsx
// Classes on <body> = WRONG
<body className={`${inter.variable} ${nunito.variable} ${fredoka.variable}`}>
```

### 2. Check CSS Variable Definitions

```bash
# Variables should be defined on html element
grep -A5 "@layer base" app/globals.css | head -20
```

**Expected:** `--font-body`, `--font-heading`, `--font-brand` defined on `html {}` block.

### 3. Verify Tailwind Config

```bash
# Check fontFamily configuration
grep -A10 "fontFamily" tailwind.config.ts
```

**Expected:** `sans`, `heading`, `brand` use `var(--font-inter)`, `var(--font-nunito)`, `var(--font-fredoka)`.

### 4. Check Font Loading in fonts.ts

```bash
# Verify fonts are exported with correct variable names
grep -E "variable.*--font" app/fonts.ts
```

**Expected:**
```typescript
variable: '--font-inter'
variable: '--font-nunito'
variable: '--font-fredoka'
```

## The Root Cause

### Why Fonts Don't Display

**Technical explanation:**

1. **Tailwind preflight** applies font-family on `html` element:
   ```css
   html, :host {
     font-family: var(--font-inter), 'Inter', system-ui, ...
   }
   ```

2. **Next.js `next/font`** generates classes that define CSS variables:
   ```css
   .__variable_abc123 {
     --font-inter: 'Inter', sans-serif;
   }
   ```

3. **CSS variable inheritance**: Variables only inherit **downward** in the DOM tree.

4. **The bug**: If Next.js classes are on `<body>`, then `<html>` cannot see `--font-inter` → browser falls back to `system-ui`.

### Visual Explanation

```
❌ WRONG (variables on body, preflight on html)
┌──────────────────────────────────────┐
│ <html>                               │
│   font-family: var(--font-inter) ← UNRESOLVED! Falls back
│   ┌────────────────────────────────┐ │
│   │ <body class="__variable_abc">  │ │
│   │   --font-inter: 'Inter'        │ │ ← Defined here, too late!
│   │   (content uses system font)   │ │
│   └────────────────────────────────┘ │
└──────────────────────────────────────┘

✅ CORRECT (variables on html, preflight on html)
┌──────────────────────────────────────┐
│ <html class="__variable_abc">        │
│   --font-inter: 'Inter'              │ ← Defined here
│   font-family: var(--font-inter) ← RESOLVED! Uses Inter
│   ┌────────────────────────────────┐ │
│   │ <body>                         │ │
│   │   (content uses Inter font)    │ │
│   └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

## The Fix

### Step 1: Update layout.tsx

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    // ✅ Font classes on <html>
    <html lang="fr" className={`${inter.variable} ${nunito.variable} ${fredoka.variable}`}>
      <head>...</head>
      {/* ✅ No font classes on <body> */}
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
```

### Step 2: Update globals.css

```css
@layer base {
  /* ✅ Define font variables on html */
  html {
    --font-body: var(--font-inter), 'Inter', -apple-system, sans-serif;
    --font-heading: var(--font-nunito), 'Nunito', -apple-system, sans-serif;
    --font-brand: var(--font-fredoka), 'Fredoka', -apple-system, sans-serif;
  }

  body {
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
}
```

## Symptoms & Solutions

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| All fonts are system fonts | Font classes on `<body>` | Move to `<html>` |
| Headings look wrong | Missing `font-heading` in CSS | Add `h1-h6 { font-family: var(--font-heading) }` |
| Brand text ("Izzico") wrong | Missing `.font-brand` class | Add `font-brand` to element |
| Fonts flash on load | Missing `display: 'swap'` | Add to font configuration |
| Fonts work locally, not prod | Build cache issue | Clear `.next/` and rebuild |

## Prevention Rules

1. **Never** put Next.js font variable classes on `<body>`
2. **Always** define CSS font variables on `html` element
3. **Always** use `@layer base` for font declarations
4. **Always** test fonts in production build, not just dev

## Files to Check

1. `app/layout.tsx` - Font class placement
2. `app/globals.css` - CSS variable definitions
3. `app/fonts.ts` - Font loading configuration
4. `tailwind.config.ts` - fontFamily configuration

## Quick Test Command

```bash
# Build and check output
npm run build && grep -r "font-family" .next/static/css/*.css | head -10
```

This should show Inter, Nunito, and Fredoka in the CSS output.
