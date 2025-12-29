import { test, expect } from '@playwright/test';
import { testUsers } from '../../fixtures/test-data';

test.describe('User Login Flow', () => {
  test('should display login page correctly', async ({ page }) => {
    await page.goto('/login');

    // Check page loaded
    await expect(page).toHaveTitle(/Izzico/);

    // Check form elements exist
    await expect(page.locator('[name="email"]')).toBeVisible();
    await expect(page.locator('[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/login');

    // Try to submit without filling fields
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(page.locator('text=/email.*required/i')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'nonexistent@example.com');
    await page.fill('[name="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    // Check for error message
    await expect(
      page.locator('text=/invalid.*credentials/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('should successfully login with valid credentials', async ({
    page,
  }) => {
    await page.goto('/login');

    // Use test user credentials
    await page.fill('[name="email"]', testUsers.searcher.email);
    await page.fill('[name="password"]', testUsers.searcher.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to dashboard or welcome
    await page.waitForURL(/\/(dashboard|welcome)/, { timeout: 10000 });

    // Check we're authenticated
    const url = page.url();
    expect(url).toMatch(/\/(dashboard|welcome)/);
  });

  test('should have link to signup page', async ({ page }) => {
    await page.goto('/login');

    // Check for signup link
    const signupLink = page.locator('a[href="/signup"]');
    await expect(signupLink).toBeVisible();

    // Click signup link
    await signupLink.click();
    await expect(page).toHaveURL('/signup');
  });

  test('should have forgot password link', async ({ page }) => {
    await page.goto('/login');

    // Check for forgot password link
    const forgotLink = page.locator('a[href="/forgot-password"]');
    await expect(forgotLink).toBeVisible();

    // Click forgot password link
    await forgotLink.click();
    await expect(page).toHaveURL('/forgot-password');
  });

  test('should persist session after page reload', async ({ page }) => {
    await page.goto('/login');

    // Login
    await page.fill('[name="email"]', testUsers.searcher.email);
    await page.fill('[name="password"]', testUsers.searcher.password);
    await page.click('button[type="submit"]');

    // Wait for redirect
    await page.waitForURL(/\/(dashboard|welcome)/, { timeout: 10000 });

    // Reload page
    await page.reload();

    // Should still be authenticated
    const url = page.url();
    expect(url).not.toContain('/login');
    expect(url).not.toContain('/signup');
  });
});
