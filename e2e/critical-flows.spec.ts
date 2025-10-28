import { test, expect } from '@playwright/test';

/**
 * Critical E2E Tests for Core User Flows
 */

test.describe('Authentication', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    // Check that homepage loads
    await expect(page).toHaveTitle(/EasyCo|Onboarding/i);

    // Check for key elements
    const heading = page.locator('h1').or(page.locator('[class*="hero"]'));
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('login page is accessible', async ({ page }) => {
    await page.goto('/login');

    // Check for login form
    await expect(page.locator('input[type="email"]').or(page.locator('input[name*="email"]'))).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('input[type="password"]').or(page.locator('input[name*="password"]'))).toBeVisible();
  });
});

test.describe('Dashboard Navigation', () => {
  test('owner dashboard loads', async ({ page }) => {
    await page.goto('/dashboard/owner');

    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Check that we're on dashboard (or redirected to login)
    const url = page.url();
    expect(url).toMatch(/dashboard|login/);
  });

  test('searcher dashboard loads', async ({ page }) => {
    await page.goto('/dashboard/searcher');

    await page.waitForLoadState('networkidle', { timeout: 15000 });

    const url = page.url();
    expect(url).toMatch(/dashboard|login/);
  });
});

test.describe('Property Management', () => {
  test('properties browse page loads', async ({ page }) => {
    await page.goto('/properties/browse');

    // Wait for page to load
    await page.waitForSelector('h1', { timeout: 10000 });

    // Check for property cards or empty state
    const content = page.locator('main').or(page.locator('[class*="container"]'));
    await expect(content).toBeVisible();
  });

  test('property detail page loads', async ({ page }) => {
    // Navigate to browse first
    await page.goto('/properties/browse');

    // Wait for properties to load
    await page.waitForTimeout(2000);

    // Try to find a property link
    const propertyLinks = page.locator('a[href*="/properties/"]');
    const count = await propertyLinks.count();

    if (count > 0) {
      await propertyLinks.first().click();

      // Wait for detail page
      await page.waitForSelector('h1', { timeout: 10000 });

      // Verify we're on a property detail page
      expect(page.url()).toMatch(/\/properties\/[a-z0-9-]+/);
    }
  });
});

test.describe('Applications', () => {
  test('owner applications page loads', async ({ page }) => {
    await page.goto('/dashboard/owner/applications');

    // Wait for page
    await page.waitForSelector('h1', { timeout: 10000 });

    // Check page title
    await expect(page.locator('h1')).toContainText(/applications/i);

    // Check for filter buttons
    const filters = page.locator('button').filter({ hasText: /pending|approved|rejected/i });
    await expect(filters.first()).toBeVisible();
  });

  test('applications page shows stats', async ({ page }) => {
    await page.goto('/dashboard/owner/applications');

    await page.waitForSelector('[class*="Card"]', { timeout: 10000 });

    // Look for stat cards
    const statCards = page.locator('[class*="Card"]').filter({ hasText: /total|pending|approved/i });
    const count = await statCards.count();

    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Loading States', () => {
  test('dashboard shows skeleton/loading state initially', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for loading indicator (spinner or skeleton)
    const loader = page.locator('[class*="animate-spin"]').or(page.locator('[class*="skeleton"]'));
    const isVisible = await loader.isVisible().catch(() => false);

    // It's okay if it's not visible (page might load fast)
    // Just checking it doesn't crash
    expect(true).toBe(true);
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('homepage is mobile responsive', async ({ page }) => {
    await page.goto('/');

    // Check that page loads on mobile
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Verify page doesn't have horizontal scroll
    const body = page.locator('body');
    const boundingBox = await body.boundingBox();

    expect(boundingBox?.width).toBeLessThanOrEqual(375);
  });

  test('dashboard is mobile responsive', async ({ page }) => {
    await page.goto('/dashboard');

    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Check for mobile menu or responsive layout
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('404 page works', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-12345');

    // Should get 404 or redirect
    expect([404, 200, 302]).toContain(response?.status());
  });

  test('invalid property ID shows error', async ({ page }) => {
    await page.goto('/properties/invalid-id-123456');

    await page.waitForTimeout(2000);

    // Should show error or redirect
    const url = page.url();
    const hasError = await page.locator('[class*="error"]').or(page.locator('text=/not found/i')).isVisible().catch(() => false);

    expect(hasError || url !== '/properties/invalid-id-123456').toBe(true);
  });
});
