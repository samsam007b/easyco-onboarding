import { redirect } from 'next/navigation';

/**
 * Events hub - redirects to discover page
 * Using server-side redirect for better performance and SEO
 */
export default function EventsPage() {
  redirect('/hub/events/discover');
}
