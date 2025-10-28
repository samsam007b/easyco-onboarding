# E2E Tests avec Playwright

Tests end-to-end critiques pour l'application EasyCo Onboarding.

## Installation

```bash
npm install
npx playwright install  # Install browsers
```

## Exécuter les tests

```bash
# Tous les tests (headless)
npm run test:e2e

# Avec UI interactive
npm run test:e2e:ui

# Avec navigateur visible
npm run test:e2e:headed

# Mode debug (step-by-step)
npm run test:e2e:debug

# Voir le dernier rapport
npm run test:report
```

## Structure des tests

### critical-flows.spec.ts
Tests pour les flows utilisateurs critiques:
- ✅ Authentication (homepage, login)
- ✅ Dashboard navigation (owner/searcher)
- ✅ Property browsing & details
- ✅ Applications management
- ✅ Loading states
- ✅ Mobile responsiveness
- ✅ Error handling (404, invalid IDs)

### matching-algorithm.spec.ts
Tests spécifiques au système de matching:
- ✅ Top Matches page avec scores
- ✅ Match breakdown détaillé
- ✅ Preferences Editor avec live preview
- ✅ Sauvegarde des préférences
- ✅ Match badges sur property cards
- ✅ Reverse matching pour owners

## Couverture

**Pages testées**:
- / (homepage)
- /login
- /dashboard/owner
- /dashboard/searcher
- /dashboard/owner/applications
- /dashboard/searcher/top-matches
- /dashboard/settings/preferences
- /properties/browse
- /properties/[id]

**Fonctionnalités testées**:
- Navigation
- Authentification
- Loading states
- Responsive design
- Error handling
- Matching algorithm
- Preferences management
- Application management

## CI/CD Integration

Les tests sont configurés pour tourner sur GitHub Actions:
- Retry 2x en cas d'échec
- Screenshots sur failure
- Videos des échecs
- HTML report généré

## Configuration

Voir `playwright.config.ts` pour:
- Browser configurations
- Timeouts
- Base URL
- Reporters
- Screenshots/videos settings

## Tips

- Utilisez `test.only()` pour tester un seul test
- Utilisez `test.skip()` pour skip un test
- Les tests tournent en parallèle par défaut
- Le dev server démarre automatiquement
