/**
 * Test fixtures and data for E2E tests
 */

export const testUsers = {
  searcher: {
    email: 'test-searcher@easyco-test.com',
    password: 'SecurePass123!',
    fullName: 'Test Searcher',
  },
  owner: {
    email: 'test-owner@easyco-test.com',
    password: 'SecurePass123!',
    fullName: 'Test Owner',
  },
  resident: {
    email: 'test-resident@easyco-test.com',
    password: 'SecurePass123!',
    fullName: 'Test Resident',
  },
};

export const testProperty = {
  title: 'Test Coliving Property',
  description: 'Beautiful test property for automated testing',
  address: 'Rue de Test 123, Brussels',
  city: 'Brussels',
  monthlyRent: 800,
  deposit: 1600,
  rooms: 5,
  availableRooms: 2,
  amenities: ['WiFi', 'Kitchen', 'Laundry'],
};

export const testOnboardingData = {
  searcher: {
    basicInfo: {
      firstName: 'Test',
      lastName: 'Searcher',
      dateOfBirth: '1995-05-15',
      nationality: 'Belgian',
      currentCity: 'Brussels',
    },
    preferences: {
      budgetMin: 500,
      budgetMax: 1000,
      preferredCity: 'Brussels',
      moveInDate: '2025-12-01',
    },
    lifestyle: {
      isSmoker: false,
      hasPets: false,
      cleanliness: 'tidy',
    },
  },
  owner: {
    basicInfo: {
      firstName: 'Test',
      lastName: 'Owner',
      phoneNumber: '+32 456 78 90 12',
      landlordType: 'individual',
    },
    bankInfo: {
      iban: 'BE68 5390 0754 7034',
      accountHolderName: 'Test Owner',
    },
  },
};

/**
 * Helper to generate unique test email
 */
export function generateTestEmail(role: 'searcher' | 'owner' | 'resident'): string {
  const timestamp = Date.now();
  return `test-${role}-${timestamp}@easyco-test.com`;
}

/**
 * Helper to wait for navigation
 */
export async function waitForNavigation(page: any, expectedUrl: string, timeout = 5000) {
  await page.waitForURL(expectedUrl, { timeout });
}

/**
 * Helper to login as a specific user
 */
export async function loginAs(page: any, userType: 'searcher' | 'owner' | 'resident') {
  const user = testUsers[userType];

  await page.goto('/login');
  await page.fill('[name="email"]', user.email);
  await page.fill('[name="password"]', user.password);
  await page.click('button[type="submit"]');

  // Wait for redirect after login
  await page.waitForURL(/\/(dashboard|welcome)/, { timeout: 5000 });
}

/**
 * Helper to signup a new user
 */
export async function signupNewUser(
  page: any,
  email: string,
  password: string,
  fullName: string
) {
  await page.goto('/signup');
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.fill('[name="fullName"]', fullName);
  await page.click('button[type="submit"]');
}

/**
 * Helper to clear test data from Supabase
 * NOTE: This should only be used in test environment
 */
export async function cleanupTestData(email: string) {
  // This would connect to Supabase and delete test user
  // Implementation depends on your Supabase setup
  console.log(`Cleanup test data for: ${email}`);
  // TODO: Implement actual cleanup
}
