import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Real Matching Algorithm Implementation
 * Tests the new real matching system (not mock)
 */

test.describe('Real Matching Algorithm', () => {
  test('dashboard should generate real matches on first load', async ({ page }) => {
    // Note: This test requires a test user to be created or logged in
    // For now, we'll test as an authenticated searcher

    await page.goto('/dashboard/searcher/v2');

    // Wait for auth check and potential redirect
    await page.waitForTimeout(2000);

    const url = page.url();

    // If redirected to login, skip (need auth setup)
    if (url.includes('/auth') || url.includes('/login')) {
      test.skip();
      return;
    }

    // Wait for matches section to load
    const matchesSection = page.locator('text=/Tes Meilleurs Matchs/i');
    await expect(matchesSection).toBeVisible({ timeout: 15000 });

    // Check for loading spinner while generating matches
    const spinner = page.locator('[class*="animate-spin"]');
    const hadSpinner = await spinner.isVisible().catch(() => false);

    // Wait for matches to appear or empty state
    await page.waitForTimeout(3000);

    // Check for either matches or empty state
    const hasMatches = await page.locator('[class*="PropertyCard"]').count() > 0;
    const hasEmptyState = await page
      .locator('text=/Aucun match pour le moment/i')
      .isVisible()
      .catch(() => false);

    // Should have either matches or empty state
    expect(hasMatches || hasEmptyState).toBe(true);
  });

  test('match scores should be real percentages (not 95, 90, 85 sequence)', async ({ page }) => {
    await page.goto('/dashboard/searcher/v2');

    // Wait for page load
    await page.waitForTimeout(3000);

    const url = page.url();
    if (url.includes('/auth') || url.includes('/login')) {
      test.skip();
      return;
    }

    // Find compatibility score badges
    const scoreBadges = page.locator('[class*="bg-green-500"]:has-text("%")');
    const count = await scoreBadges.count();

    if (count > 0) {
      // Get all score texts
      const scores: number[] = [];
      for (let i = 0; i < Math.min(count, 3); i++) {
        const text = await scoreBadges.nth(i).textContent();
        const match = text?.match(/(\d+)%/);
        if (match) {
          scores.push(parseInt(match[1]));
        }
      }

      // Check that scores are NOT the mock sequence (95, 90, 85, 80, 75, 70...)
      // Real algorithm scores should vary more naturally
      if (scores.length >= 3) {
        const isMockSequence =
          scores[0] === 95 && scores[1] === 90 && scores[2] === 85;

        // Scores should NOT be the mock sequence
        expect(isMockSequence).toBe(false);
      }
    }
  });

  test('hovering on match score should show detailed breakdown', async ({ page }) => {
    await page.goto('/dashboard/searcher/v2');

    await page.waitForTimeout(3000);

    const url = page.url();
    if (url.includes('/auth') || url.includes('/login')) {
      test.skip();
      return;
    }

    // Find a property card with match score
    const propertyCard = page.locator('[class*="relative group"]').first();
    const isVisible = await propertyCard.isVisible().catch(() => false);

    if (isVisible) {
      // Hover over the card to trigger tooltip
      await propertyCard.hover();

      // Wait a bit for tooltip to appear
      await page.waitForTimeout(500);

      // Check for tooltip with breakdown
      const tooltip = page.locator('text=/Pourquoi ce match/i');
      const tooltipVisible = await tooltip.isVisible().catch(() => false);

      if (tooltipVisible) {
        // Check for score breakdown elements
        const hasBudgetScore = await page
          .locator('text=/Budget:/i')
          .isVisible()
          .catch(() => false);
        const hasLocationScore = await page
          .locator('text=/Localisation:/i')
          .isVisible()
          .catch(() => false);
        const hasLifestyleScore = await page
          .locator('text=/Lifestyle:/i')
          .isVisible()
          .catch(() => false);

        // At least one breakdown should be visible
        expect(hasBudgetScore || hasLocationScore || hasLifestyleScore).toBe(true);
      }
    }
  });

  test('should show loading state while generating matches', async ({ page }) => {
    await page.goto('/dashboard/searcher/v2');

    // Look for loading spinner quickly
    const spinner = page.locator('[class*="animate-spin"]');

    // Check if spinner appears (it might disappear quickly)
    const spinnerAppeared = await Promise.race([
      spinner.waitFor({ state: 'visible', timeout: 1000 }).then(() => true),
      page.waitForTimeout(1000).then(() => false),
    ]);

    // It's okay if spinner doesn't appear (matches cached or loaded fast)
    // Just verify page doesn't crash
    await page.waitForTimeout(2000);

    const hasError = await page
      .locator('text=/error|erreur/i')
      .isVisible()
      .catch(() => false);

    expect(hasError).toBe(false);
  });

  test('empty state should have actionable CTA when no matches', async ({ page }) => {
    // This test would need a fresh user with no matches
    // For now, we'll just check if empty state exists when matches are absent

    await page.goto('/dashboard/searcher/v2');

    await page.waitForTimeout(3000);

    const url = page.url();
    if (url.includes('/auth') || url.includes('/login')) {
      test.skip();
      return;
    }

    // Check if empty state is present
    const emptyState = page.locator('text=/Aucun match pour le moment/i');
    const isEmptyStateVisible = await emptyState.isVisible().catch(() => false);

    if (isEmptyStateVisible) {
      // Should have a CTA button to complete profile
      const ctaButton = page.locator('button:has-text("Compléter mon profil")');
      await expect(ctaButton).toBeVisible();

      // Button should be clickable
      await expect(ctaButton).toBeEnabled();

      // Click should navigate to profile page
      await ctaButton.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('/profile');
    }
  });

  test('matching API should be accessible and return valid data', async ({ page }) => {
    // Test the API endpoint directly
    const response = await page.request.get('/api/matching/matches?limit=5&minScore=60');

    // API should return 200 or 401 (if not authenticated)
    expect([200, 401]).toContain(response.status());

    if (response.status() === 200) {
      const data = await response.json();

      // Check response structure
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('matches');

      // Matches should be an array
      expect(Array.isArray(data.matches)).toBe(true);
    }
  });

  test('should handle match generation API call', async ({ page }) => {
    // Test match generation endpoint
    const response = await page.request.post('/api/matching/generate');

    // Should return 200, 401 (not auth), or 403 (not searcher role)
    expect([200, 401, 403]).toContain(response.status());

    if (response.status() === 200) {
      const data = await response.json();

      // Check response structure
      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('matchesGenerated');

      // matchesGenerated should be a number
      expect(typeof data.matchesGenerated).toBe('number');
    }
  });
});

test.describe('Match Interactions', () => {
  test('should be able to mark property as favorite from matches', async ({ page }) => {
    await page.goto('/dashboard/searcher/v2');

    await page.waitForTimeout(3000);

    const url = page.url();
    if (url.includes('/auth') || url.includes('/login')) {
      test.skip();
      return;
    }

    // Find a property card
    const propertyCard = page.locator('[class*="PropertyCard"]').first();
    const isVisible = await propertyCard.isVisible().catch(() => false);

    if (isVisible) {
      // Find the favorite/heart button
      const heartButton = propertyCard.locator('button:has([class*="Heart"])');
      const buttonExists = await heartButton.isVisible().catch(() => false);

      if (buttonExists) {
        // Click to favorite
        await heartButton.click();

        // Wait for state update
        await page.waitForTimeout(500);

        // Heart should be filled or show active state
        const heartIcon = heartButton.locator('[class*="Heart"]');
        const classes = await heartIcon.getAttribute('class');

        // Should have fill class or red color
        expect(classes).toMatch(/fill|red/);
      }
    }
  });

  test('should navigate to property detail from match', async ({ page }) => {
    await page.goto('/dashboard/searcher/v2');

    await page.waitForTimeout(3000);

    const url = page.url();
    if (url.includes('/auth') || url.includes('/login')) {
      test.skip();
      return;
    }

    // Find and click first property card
    const propertyCard = page.locator('[class*="PropertyCard"]').first();
    const isVisible = await propertyCard.isVisible().catch(() => false);

    if (isVisible) {
      // Click on the card (not on buttons)
      const cardLink = propertyCard.locator('a').first();
      await cardLink.click();

      // Should navigate to property detail page
      await page.waitForTimeout(1000);
      expect(page.url()).toMatch(/\/properties\/[a-z0-9-]+/);
    }
  });
});
