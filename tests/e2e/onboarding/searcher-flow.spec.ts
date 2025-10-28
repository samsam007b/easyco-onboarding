import { test, expect } from '@playwright/test';
import { generateTestEmail, testOnboardingData } from '../../fixtures/test-data';

test.describe('Searcher Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Create a new user and login
    const testEmail = generateTestEmail('searcher');

    // Signup
    await page.goto('/signup');
    await page.fill('[name="email"]', testEmail);
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="fullName"]', 'Test Searcher');
    await page.click('button[type="submit"]');

    // Wait for welcome page
    await page.waitForURL('/welcome', { timeout: 10000 });

    // Select "searcher" role
    await page.click('button:has-text("Searcher")');

    // Should redirect to onboarding
    await page.waitForURL(/\/onboarding\/searcher/, { timeout: 10000 });
  });

  test('should complete basic info step', async ({ page }) => {
    // Should be on basic info page
    await expect(page).toHaveURL(/\/onboarding\/searcher\/basic-info/);

    const { basicInfo } = testOnboardingData.searcher;

    // Fill basic info
    await page.fill('[name="firstName"]', basicInfo.firstName);
    await page.fill('[name="lastName"]', basicInfo.lastName);
    await page.fill('[name="dateOfBirth"]', basicInfo.dateOfBirth);
    await page.selectOption('[name="nationality"]', basicInfo.nationality);
    await page.fill('[name="currentCity"]', basicInfo.currentCity);

    // Click Continue
    await page.click('button:has-text("Continue")');

    // Should move to next step
    await page.waitForURL(/\/onboarding\/searcher\/daily-habits/, {
      timeout: 5000,
    });
  });

  test('should navigate back and forth between steps', async ({ page }) => {
    // Go to basic info
    await page.goto('/onboarding/searcher/basic-info');

    const { basicInfo } = testOnboardingData.searcher;

    // Fill and submit
    await page.fill('[name="firstName"]', basicInfo.firstName);
    await page.fill('[name="lastName"]', basicInfo.lastName);
    await page.fill('[name="dateOfBirth"]', basicInfo.dateOfBirth);
    await page.click('button:has-text("Continue")');

    // On daily habits
    await page.waitForURL(/\/daily-habits/);

    // Go back
    await page.click('button:has-text("Back")');

    // Should be back on basic info
    await expect(page).toHaveURL(/\/basic-info/);

    // Form data should be preserved
    await expect(page.locator('[name="firstName"]')).toHaveValue(
      basicInfo.firstName
    );
  });

  test('should auto-save progress', async ({ page }) => {
    const { basicInfo } = testOnboardingData.searcher;

    await page.goto('/onboarding/searcher/basic-info');

    // Fill form
    await page.fill('[name="firstName"]', basicInfo.firstName);
    await page.fill('[name="lastName"]', basicInfo.lastName);

    // Wait for auto-save (2 seconds debounce)
    await page.waitForTimeout(3000);

    // Reload page
    await page.reload();

    // Data should be preserved
    await expect(page.locator('[name="firstName"]')).toHaveValue(
      basicInfo.firstName
    );
    await expect(page.locator('[name="lastName"]')).toHaveValue(
      basicInfo.lastName
    );
  });

  test('should complete full onboarding flow', async ({ page }) => {
    // This is a longer test that goes through all steps
    // Adjust based on your actual onboarding flow

    // Step 1: Basic Info
    await page.goto('/onboarding/searcher/basic-info');
    const { basicInfo, preferences, lifestyle } = testOnboardingData.searcher;

    await page.fill('[name="firstName"]', basicInfo.firstName);
    await page.fill('[name="lastName"]', basicInfo.lastName);
    await page.fill('[name="dateOfBirth"]', basicInfo.dateOfBirth);
    await page.click('button:has-text("Continue")');

    // Step 2: Preferences (adjust selectors based on your form)
    await page.waitForURL(/\/preferences/i);
    await page.fill('[name="budgetMin"]', preferences.budgetMin.toString());
    await page.fill('[name="budgetMax"]', preferences.budgetMax.toString());
    await page.fill('[name="preferredCity"]', preferences.preferredCity);
    await page.click('button:has-text("Continue")');

    // Step 3: Lifestyle
    await page.waitForURL(/\/lifestyle/i);
    if (lifestyle.isSmoker) {
      await page.check('[name="isSmoker"]');
    }
    if (lifestyle.hasPets) {
      await page.check('[name="hasPets"]');
    }
    await page.click('button:has-text("Continue")');

    // Final step: Review
    await page.waitForURL(/\/review/i);

    // Submit onboarding
    await page.click('button:has-text("Complete")');

    // Should redirect to dashboard
    await page.waitForURL('/dashboard/searcher', { timeout: 10000 });
    await expect(page).toHaveURL('/dashboard/searcher');

    // Check onboarding completed
    await expect(page.locator('text=/Welcome/i')).toBeVisible();
  });

  test('should validate required fields on each step', async ({ page }) => {
    await page.goto('/onboarding/searcher/basic-info');

    // Try to continue without filling required fields
    await page.click('button:has-text("Continue")');

    // Should show validation errors
    await expect(page.locator('text=/required/i').first()).toBeVisible();

    // Should not navigate away
    await expect(page).toHaveURL(/\/basic-info/);
  });
});
