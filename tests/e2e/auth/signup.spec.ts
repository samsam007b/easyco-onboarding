import { test, expect } from '@playwright/test';
import { generateTestEmail } from '../../fixtures/test-data';

test.describe('User Signup Flow', () => {
  test('should display signup page correctly', async ({ page }) => {
    await page.goto('/signup');

    // Check page loaded
    await expect(page).toHaveTitle(/Izzico/);

    // Check form elements exist
    await expect(page.locator('[name="email"]')).toBeVisible();
    await expect(page.locator('[name="password"]')).toBeVisible();
    await expect(page.locator('[name="fullName"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/signup');

    // Try to submit without filling fields
    await page.click('button[type="submit"]');

    // Check for validation errors (adjust selectors based on your implementation)
    await expect(page.locator('text=/email.*required/i')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/signup');

    // Enter invalid email
    await page.fill('[name="email"]', 'invalid-email');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="fullName"]', 'Test User');
    await page.click('button[type="submit"]');

    // Check for email validation error
    await expect(page.locator('text=/valid email/i')).toBeVisible();
  });

  test('should validate password strength', async ({ page }) => {
    await page.goto('/signup');

    // Enter weak password
    await page.fill('[name="email"]', generateTestEmail('searcher'));
    await page.fill('[name="password"]', '123'); // Too short
    await page.fill('[name="fullName"]', 'Test User');
    await page.click('button[type="submit"]');

    // Check for password validation error
    await expect(page.locator('text=/8.*characters/i')).toBeVisible();
  });

  test('should successfully sign up new user', async ({ page }) => {
    const testEmail = generateTestEmail('searcher');

    await page.goto('/signup');

    // Fill signup form
    await page.fill('[name="email"]', testEmail);
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="fullName"]', 'Test User');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to welcome page for role selection
    await page.waitForURL('/welcome', { timeout: 10000 });
    await expect(page).toHaveURL('/welcome');

    // Check welcome page content
    await expect(page.locator('text=/choose.*role/i')).toBeVisible();
  });

  test('should prevent duplicate email signup', async ({ page }) => {
    const testEmail = 'existing-user@izzico-test.com';

    await page.goto('/signup');

    await page.fill('[name="email"]', testEmail);
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="fullName"]', 'Test User');

    await page.click('button[type="submit"]');

    // Should show error for existing email
    await expect(page.locator('text=/already.*exists/i')).toBeVisible({
      timeout: 5000,
    });
  });

  test('should have link to login page', async ({ page }) => {
    await page.goto('/signup');

    // Check for login link
    const loginLink = page.locator('a[href="/login"]');
    await expect(loginLink).toBeVisible();

    // Click login link
    await loginLink.click();
    await expect(page).toHaveURL('/login');
  });
});
