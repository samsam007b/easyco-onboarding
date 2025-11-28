import { redirect } from 'next/navigation';

// Redirect to new admin login page
export default function AdminPage() {
  redirect('/admin/login');
}
