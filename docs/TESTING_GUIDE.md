# 🧪 Testing Guide - EasyCo

## Quick Start

### Lancer les tests
```bash
# Tous les tests
npm test

# Mode watch (développement)
npm test -- --watch

# Avec coverage
npm test -- --coverage

# Un fichier spécifique
npm test event-validator.test.ts
```

---

## 📁 Structure des Tests

```
__tests__/
├── analytics/
│   ├── event-validator.test.ts    # Tests validation PII
│   ├── cookie-consent.test.ts     # Tests consentement RGPD
│   └── retry-queue.test.ts        # Tests queue retry (à créer)
├── components/
│   └── (à créer)
└── lib/
    └── (à créer)
```

---

## ✅ Tests Existants

### 1. **Event Validator Tests**

**Fichier**: `__tests__/analytics/event-validator.test.ts`

**Coverage**:
- ✅ Détection email
- ✅ Détection téléphone
- ✅ Détection carte bancaire
- ✅ Clés bloquées (passwords, tokens)
- ✅ Objets imbriqués
- ✅ Tableaux
- ✅ User properties validation
- ✅ Edge cases (null, undefined, empty)
- ✅ Performance (1000 champs en <100ms)

**Exécution**:
```bash
npm test event-validator
```

**Exemple de test**:
```typescript
it('should block email addresses', () => {
  const result = validateEventProperties({
    user_email: 'test@example.com',
    name: 'John Doe',
  });

  expect(result.user_email).toBeUndefined();
  expect(result.name).toBe('John Doe');
});
```

---

### 2. **Cookie Consent Tests**

**Fichier**: `__tests__/analytics/cookie-consent.test.ts`

**Coverage**:
- ✅ Sauvegarde dans localStorage
- ✅ Récupération du consentement
- ✅ Versioning (invalidation anciennes versions)
- ✅ Vérification consentement par catégorie
- ✅ Accept/Reject All
- ✅ Helper functions (canUseAnalytics, canUseMarketing)
- ✅ Gestion d'erreurs localStorage
- ✅ Parsing JSON invalide

**Exécution**:
```bash
npm test cookie-consent
```

**Exemple de test**:
```typescript
it('should accept all cookies', () => {
  acceptAll();

  const savedData = (localStorage.setItem as jest.Mock).mock.calls[0][1];
  const consent = JSON.parse(savedData);

  expect(consent.analytics).toBe(true);
  expect(consent.marketing).toBe(true);
});
```

---

## 📊 Coverage Requirements

**Seuils minimums définis** (dans `jest.config.js`):

```javascript
coverageThresholds: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

### Vérifier le coverage
```bash
npm test -- --coverage --coverageReporters=text
```

### Rapport HTML détaillé
```bash
npm test -- --coverage
# Ouvrir: coverage/lcov-report/index.html
```

---

## 🎯 Best Practices

### 1. **Structure d'un Test**

```typescript
describe('Feature Name', () => {
  // Setup
  beforeEach(() => {
    // Code avant chaque test
  });

  afterEach(() => {
    // Cleanup après chaque test
  });

  describe('Sub-feature', () => {
    it('should do something specific', () => {
      // Arrange
      const input = { ... };

      // Act
      const result = functionToTest(input);

      // Assert
      expect(result).toBe(expectedValue);
    });
  });
});
```

### 2. **Naming Convention**

```typescript
// ❌ Mauvais
it('test 1', () => { ... });

// ✅ Bon
it('should block email addresses from event properties', () => { ... });
it('should handle null values without throwing errors', () => { ... });
```

### 3. **Mocking**

#### localStorage Mock
```typescript
beforeEach(() => {
  global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  } as any;
});
```

#### Next.js Router Mock
```typescript
// Déjà configuré dans jest.setup.js
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => '/',
}));
```

#### Supabase Mock
```typescript
jest.mock('@/lib/auth/supabase-client', () => ({
  createClient: () => ({
    from: (table: string) => ({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: mockData,
          error: null,
        }),
      }),
    }),
  }),
}));
```

---

## 🚀 Tests à Créer (Roadmap)

### Priority 1 - CRITIQUE
- [ ] `retry-queue.test.ts` - Queue de retry analytics
- [ ] `use-analytics.test.ts` - React hooks analytics
- [ ] `event-tracker.test.ts` - Tracking events

### Priority 2 - IMPORTANT
- [ ] `CookieConsentBanner.test.tsx` - Composant UI consent
- [ ] `Analytics.test.tsx` - Composant Analytics
- [ ] `admin/dashboard.test.tsx` - Dashboard admin

### Priority 3 - NICE TO HAVE
- [ ] E2E tests (Playwright)
  - Onboarding flow complet
  - Application flow
  - Matching flow
- [ ] Visual regression tests (Chromatic)
- [ ] Performance tests (Lighthouse CI)

---

## 🔧 Configuration

### jest.config.js

```javascript
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'lib/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};
```

### jest.setup.js

Fichier de configuration exécuté avant tous les tests :
- Import `@testing-library/jest-dom`
- Mocks Next.js router
- Mock `window.matchMedia`

---

## 📈 CI/CD Integration

### GitHub Actions (à créer)

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm ci
      - run: npm test -- --coverage

      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## 🐛 Debugging Tests

### Mode Debug
```bash
# Avec Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Avec console.log
npm test -- --verbose
```

### Test spécifique
```typescript
// Focus un seul test
it.only('should test this one', () => { ... });

// Skip un test
it.skip('skip this test', () => { ... });
```

---

## 📚 Resources

### Documentation
- [Jest](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing](https://nextjs.org/docs/testing)

### Commandes Utiles

```bash
# Liste tous les tests
npm test -- --listTests

# Voir les tests lents
npm test -- --verbose

# Clear cache
npm test -- --clearCache

# Update snapshots
npm test -- -u
```

---

## ✨ Tips & Tricks

### 1. Tester les Erreurs
```typescript
it('should throw error for invalid input', () => {
  expect(() => {
    validateEventProperties(null as any);
  }).toThrow();
});
```

### 2. Tester Async/Await
```typescript
it('should load user data', async () => {
  const user = await fetchUser('user-123');
  expect(user.name).toBe('John Doe');
});
```

### 3. Snapshot Testing
```typescript
it('should match snapshot', () => {
  const component = render(<MyComponent />);
  expect(component).toMatchSnapshot();
});
```

---

## 🎯 Objectif Final

**Target Coverage**: 80%+ sur toutes les métriques

```
Statements   : 80% ( X/Y )
Branches     : 80% ( X/Y )
Functions    : 80% ( X/Y )
Lines        : 80% ( X/Y )
```

**Nombre de tests**: 100+ tests unitaires et d'intégration

---

## 📞 Support

Questions sur les tests ?
- Guide : `/docs/TESTING_GUIDE.md`
- Config : `/jest.config.js`, `/jest.setup.js`
- Examples : `/__tests__/analytics/`
