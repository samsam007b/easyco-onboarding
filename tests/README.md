# EasyCo E2E Tests

Tests automatisés End-to-End avec Playwright pour l'application EasyCo.

## 📁 Structure

```
tests/
├── e2e/
│   ├── auth/
│   │   ├── signup.spec.ts           # Tests inscription
│   │   ├── login.spec.ts            # Tests connexion
│   │   └── password-reset.spec.ts   # Tests reset password (à venir)
│   ├── onboarding/
│   │   ├── searcher-flow.spec.ts    # Tests onboarding searcher
│   │   ├── owner-flow.spec.ts       # Tests onboarding owner (à venir)
│   │   └── resident-flow.spec.ts    # Tests onboarding resident (à venir)
│   ├── properties/
│   │   ├── create-property.spec.ts  # Tests création propriété (à venir)
│   │   └── browse-properties.spec.ts # Tests recherche (à venir)
│   └── messaging/
│       ├── send-message.spec.ts     # Tests messagerie (à venir)
│       └── notifications.spec.ts    # Tests notifications (à venir)
├── fixtures/
│   └── test-data.ts                 # Données de test et helpers
└── README.md                        # Ce fichier
```

## 🚀 Installation

Les dépendances sont déjà installées. Si besoin :

```bash
npm install -D @playwright/test
npx playwright install
```

## 📝 Lancer les Tests

### Mode Headless (CI/CD)
```bash
npm run test:e2e
```

### Mode UI (Interface Graphique)
```bash
npm run test:e2e:ui
```

### Mode Headed (Voir le navigateur)
```bash
npm run test:e2e:headed
```

### Mode Debug
```bash
npm run test:e2e:debug
```

### Voir le Rapport
```bash
npm run test:report
```

## 🧪 Tests Disponibles

### Auth Tests (✅ Complétés)
- **signup.spec.ts**
  - ✅ Affichage de la page signup
  - ✅ Validation des champs requis
  - ✅ Validation format email
  - ✅ Validation force mot de passe
  - ✅ Inscription réussie
  - ✅ Prévention email dupliqué
  - ✅ Lien vers login

- **login.spec.ts**
  - ✅ Affichage de la page login
  - ✅ Validation des champs requis
  - ✅ Erreur credentials invalides
  - ✅ Connexion réussie
  - ✅ Lien vers signup
  - ✅ Lien mot de passe oublié
  - ✅ Persistance de session

### Onboarding Tests (✅ Complétés)
- **searcher-flow.spec.ts**
  - ✅ Complétion basic info
  - ✅ Navigation back/forth
  - ✅ Auto-save progress
  - ✅ Flow complet onboarding
  - ✅ Validation champs requis

### Tests à Venir (🔄)
- Owner onboarding flow
- Resident onboarding flow
- Property creation
- Property search
- Messaging
- Notifications

## 🔧 Configuration

La configuration Playwright se trouve dans `playwright.config.ts`.

### Navigateurs Testés
- ✅ Chromium (Desktop)
- ✅ Firefox (Desktop)
- ✅ WebKit/Safari (Desktop)
- ✅ Chrome Mobile
- ✅ Safari Mobile

### Serveur de Dev
Le serveur de développement démarre automatiquement avant les tests sur `http://localhost:3000`.

## 📊 Couverture des Tests

**Statut Actuel**: ~40% des flux critiques

### Couvert:
- ✅ Signup/Login
- ✅ Onboarding Searcher (complet)
- ✅ Validation formulaires
- ✅ Navigation
- ✅ Auto-save

### À Couvrir:
- 🔄 Onboarding Owner
- 🔄 Onboarding Resident
- 🔄 Création de propriété
- 🔄 Recherche propriétés
- 🔄 Messaging
- 🔄 Notifications
- 🔄 Rate limiting

**Objectif**: 80%+ couverture des flux critiques

## 🎯 Bonnes Pratiques

### Écriture de Tests
1. **Un test = Un scénario utilisateur**
2. **Utiliser les data-testid** pour les sélecteurs stables
3. **Éviter les waitForTimeout**, préférer waitForURL, waitForSelector
4. **Tests indépendants** - Ne pas dépendre de l'ordre d'exécution
5. **Cleanup** - Nettoyer les données de test après exécution

### Exemple de Test
```typescript
test('should complete user action', async ({ page }) => {
  // Arrange - Setup initial state
  await page.goto('/page');

  // Act - Perform action
  await page.fill('[name="field"]', 'value');
  await page.click('button[type="submit"]');

  // Assert - Verify result
  await expect(page).toHaveURL('/success');
  await expect(page.locator('text=Success')).toBeVisible();
});
```

## 🐛 Debugging

### Voir les Screenshots
Les screenshots des échecs sont dans `test-results/`

### Voir la Trace
```bash
npx playwright show-trace test-results/trace.zip
```

### Mode Debug Interactif
```bash
npm run test:e2e:debug
```

## 📈 CI/CD Integration

Les tests s'exécutent automatiquement sur:
- ✅ Pull Requests
- ✅ Push sur main
- ✅ Déploiements

Configuration dans `.github/workflows/e2e-tests.yml` (à créer)

## 🔗 Ressources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Assertions](https://playwright.dev/docs/assertions)

## 📞 Support

Pour des questions sur les tests:
1. Consulter la [documentation Playwright](https://playwright.dev/docs/intro)
2. Voir les exemples dans `tests/e2e/`
3. Vérifier `playwright.config.ts` pour la configuration

---

**Dernière mise à jour**: 2025-10-28
**Tests créés**: 3 fichiers (signup, login, searcher-flow)
**Coverage**: ~40% flux critiques
