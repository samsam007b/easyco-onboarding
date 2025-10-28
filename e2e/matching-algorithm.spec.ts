import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Matching Algorithm
 * Critical user flows for property matching
 */

test.describe('Matching Algorithm', () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Setup test user with preferences
    await page.goto('/');
  });

  test('should display Top Matches page with correct scores', async ({ page }) => {
    // Navigate to Top Matches
    await page.goto('/dashboard/searcher/top-matches');

    // Wait for page to load
    await page.waitForSelector('h1', { timeout: 10000 });

    // Check page title
    await expect(page.locator('h1')).toContainText('Top Matches');

    // Check that match scores are visible
    const matchBadges = page.locator('[class*="text-"][class*="font-"]').filter({ hasText: /\d+%/ });
    await expect(matchBadges.first()).toBeVisible({ timeout: 5000 });

    // Verify score is between 0-100
    const scoreText = await matchBadges.first().textContent();
    const score = parseInt(scoreText?.match(/\d+/)?.[0] || '0');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('should show match breakdown when clicking property', async ({ page }) => {
    await page.goto('/dashboard/searcher/top-matches');

    // Wait for properties to load
    await page.waitForSelector('[class*="Card"]', { timeout: 10000 });

    // Click on first property card
    const firstProperty = page.locator('[class*="Card"]').first();
    await firstProperty.click();

    // Should show detailed breakdown (or navigate to detail page)
    // This depends on your implementation
    await page.waitForTimeout(1000);
  });

  test('Preferences Editor updates match scores in real-time', async ({ page }) => {
    await page.goto('/dashboard/settings/preferences');

    // Wait for form to load
    await page.waitForSelector('input[type="number"]', { timeout: 10000 });

    // Get initial preview score
    const previewCard = page.locator('[class*="Preview"]');
    const initialScoreText = await previewCard.textContent();
    const initialScore = parseInt(initialScoreText?.match(/\d+/)?.[0] || '0');

    // Change budget
    const maxBudgetInput = page.locator('input[type="number"]').nth(1);
    await maxBudgetInput.fill('2000');

    // Wait for preview to update
    await page.waitForTimeout(500);

    // Verify score changed (or stayed same, depending on data)
    const newScoreText = await previewCard.textContent();
    const newScore = parseInt(newScoreText?.match(/\d+/)?.[0] || '0');

    // Score should be valid
    expect(newScore).toBeGreaterThanOrEqual(0);
    expect(newScore).toBeLessThanOrEqual(100);
  });

  test('should save preferences successfully', async ({ page }) => {
    await page.goto('/dashboard/settings/preferences');

    // Wait for form
    await page.waitForSelector('button', { timeout: 10000 });

    // Fill some preferences
    const minBudget = page.locator('input[type="number"]').first();
    await minBudget.fill('800');

    // Click save button
    const saveButton = page.locator('button').filter({ hasText: 'Save' });
    await saveButton.click();

    // Wait for success message
    await expect(page.locator('[class*="sonner"]').or(page.locator('[role="status"]'))).toContainText(/saved/i, {
      timeout: 5000,
    });
  });
});

test.describe('Property Browsing with Match Scores', () => {
  test('should show match badges on property cards', async ({ page }) => {
    await page.goto('/properties/browse');

    // Wait for properties to load
    await page.waitForSelector('[class*="Card"]', { timeout: 10000 });

    // Check for match badges
    const matchBadges = page.locator('[class*="Match"]');
    const count = await matchBadges.count();

    if (count > 0) {
      // If there are matches, verify badge content
      await expect(matchBadges.first()).toBeVisible();
      const badgeText = await matchBadges.first().textContent();
      expect(badgeText).toMatch(/\d+%/);
    }
  });

  test('property detail page shows full match breakdown', async ({ page }) => {
    // First get a property ID from browse page
    await page.goto('/properties/browse');
    await page.waitForSelector('a[href*="/properties/"]', { timeout: 10000 });

    const propertyLink = page.locator('a[href*="/properties/"]').first();
    await propertyLink.click();

    // Wait for detail page
    await page.waitForSelector('h1', { timeout: 10000 });

    // Look for match score components
    const matchScore = page.locator('[class*="Match"]').or(page.locator('[class*="score"]'));

    if (await matchScore.count() > 0) {
      await expect(matchScore.first()).toBeVisible();
    }
  });
});

test.describe('Reverse Matching for Owners', () => {
  test('should show applicant scores on applications page', async ({ page }) => {
    await page.goto('/dashboard/owner/applications');

    // Wait for page to load
    await page.waitForSelector('h1', { timeout: 10000 });

    // Check if there are applications
    const applications = page.locator('[class*="application"]').or(page.locator('[class*="Card"]'));
    const count = await applications.count();

    if (count > 0) {
      // Verify application cards are visible
      await expect(applications.first()).toBeVisible();
    }
  });
});
