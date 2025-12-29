/**
 * Admin Demo Helpers
 *
 * Used to conditionally show mock/demo data only for specific admin accounts.
 * Regular users see clean empty states with CTAs instead of fake data.
 */

// Admin emails that can see demo/mock data
const ADMIN_DEMO_EMAILS = [
  'baudonsamuel@gmail.com',
  'sam7777jones@gmail.com',
];

/**
 * Check if the given email is an admin demo account
 * These accounts can see mock data for testing/demo purposes
 */
export function isAdminDemoEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_DEMO_EMAILS.includes(email.toLowerCase());
}

/**
 * Hook-friendly helper to use in components
 * Returns true if the current user email matches an admin demo account
 */
export function shouldShowDemoData(userEmail: string | null | undefined): boolean {
  return isAdminDemoEmail(userEmail);
}
