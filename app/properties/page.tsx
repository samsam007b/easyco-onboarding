import { redirect } from 'next/navigation';

/**
 * Redirect /properties to /properties/browse
 * This page exists to handle direct navigation to /properties
 */
export default function PropertiesRedirect() {
  redirect('/properties/browse');
}
