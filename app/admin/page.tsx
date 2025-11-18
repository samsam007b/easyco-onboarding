// app/admin/page.tsx
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { createClient as createServerClient } from '@/lib/auth/supabase-server';
import { ADMIN_CONFIG, DB_LIMITS } from '@/lib/config/constants';
import { ROUTES } from '@/lib/config/routes';

async function checkAdminAccess() {
  const supabase = await createServerClient();

  // Vérifier l'authentification
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login?redirect=/admin');
  }

  // Vérifier si l'utilisateur est admin via la fonction RPC
  const { data: isAdmin, error: adminError } = await supabase
    .rpc('is_admin', { user_email: user.email });

  if (adminError || !isAdmin) {
    // FIXME: Use logger.error('Admin check failed:', adminError);
    redirect(ROUTES.HOME);
  }

  // Logger l'accès admin
  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'admin_access',
    resource_type: 'admin_panel',
    metadata: {
      email: user.email,
      timestamp: new Date().toISOString()
    }
  });

  return user;
}

async function fetchData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    return {
      users: [],
      profiles: [],
      properties: [],
      groups: [],
      applications: [],
      notifications: []
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const [users, profiles, properties, groups, applications, notifications] = await Promise.all([
    supabase.from('users').select('id, email, full_name, user_type, onboarding_completed, created_at').order('created_at', { ascending: false }).limit(DB_LIMITS.USERS),
    supabase.from('user_profiles').select('*').order('created_at', { ascending: false }).limit(DB_LIMITS.PROFILES),
    supabase.from('properties').select('*').order('created_at', { ascending: false }).limit(DB_LIMITS.PROPERTIES),
    supabase.from('groups').select('*').order('created_at', { ascending: false }).limit(DB_LIMITS.GROUPS),
    supabase.from('applications').select('*').order('created_at', { ascending: false }).limit(DB_LIMITS.APPLICATIONS),
    supabase.from('notifications').select('id, user_id, type, message, read, created_at').order('created_at', { ascending: false }).limit(DB_LIMITS.NOTIFICATIONS),
  ]);
  return {
    users: users.data ?? [],
    profiles: profiles.data ?? [],
    properties: properties.data ?? [],
    groups: groups.data ?? [],
    applications: applications.data ?? [],
    notifications: notifications.data ?? []
  };
}

export default async function AdminPage() {
  // Vérifier l'accès admin AVANT de charger les données
  const user = await checkAdminAccess();

  const { users, profiles, properties, groups, applications, notifications } = await fetchData();

  const toCSV = (rows: any[]) => {
    if (!rows.length) return '';
    const headers = Object.keys(rows[0]);
    const escape = (v: any) =>
      typeof v === 'string' && v.includes(',') ? `"${v.replace(/"/g, '""')}"` : v ?? '';
    const lines = [headers.join(',')].concat(
      rows.map(r => headers.map(h => escape((r as any)[h])).join(','))
    );
    return lines.join('\n');
  };

  return (
    <main className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Admin — Data</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            📊 Dashboard
          </Link>
          <div className="text-sm text-gray-500">
            Logged in as: {user.email}
          </div>
        </div>
      </div>

      {[
        { title: 'Users', rows: users, key: 'users' },
        { title: 'User Profiles', rows: profiles, key: 'profiles' },
        { title: 'Properties', rows: properties, key: 'properties' },
        { title: 'Groups', rows: groups, key: 'groups' },
        { title: 'Applications', rows: applications, key: 'applications' },
        { title: 'Notifications', rows: notifications, key: 'notifications' },
      ].map(({ title, rows, key }) => (
        <section key={key} className="border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-medium">{title} ({rows.length})</h2>
            <form action={async () => {
              'use server';
            }}>
              <a
                href={`data:text/csv;charset=utf-8,${encodeURIComponent(toCSV(rows))}`}
                download={`${title.toLowerCase().replace(' ', '-')}.csv`}
                className="px-3 py-1 rounded bg-black text-white text-sm"
              >
                Download CSV
              </a>
            </form>
          </div>
          <div className="overflow-auto">
            <table className="min-w-[800px] text-sm">
              <thead>
                <tr className="text-left border-b">
                  {rows[0] ? Object.keys(rows[0]).map(h => (
                    <th key={h} className="py-2 pr-4 font-medium">{h}</th>
                  )) : <th className="py-2 pr-4">No data</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    {Object.keys(rows[0] ?? {}).map(h => (
                      <td key={h} className="py-2 pr-4 whitespace-nowrap">
                        {Array.isArray((r as any)[h]) ? (r as any)[h].join(' | ') : String((r as any)[h] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <div className="text-sm text-gray-500 mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="font-medium mb-2">ℹ️ Data Limits Information</p>
        <p className="text-xs mb-2">
          Currently showing up to {DB_LIMITS.USERS} users, {DB_LIMITS.PROFILES} profiles, {DB_LIMITS.PROPERTIES} properties,
          {DB_LIMITS.GROUPS} groups, {DB_LIMITS.APPLICATIONS} applications, and {DB_LIMITS.NOTIFICATIONS} notifications.
        </p>
        <p className="text-xs text-gray-400">
          To modify these limits, update the DB_LIMITS configuration in lib/config/constants.ts
        </p>
      </div>

      <div className="text-sm text-gray-500">
        <Link href={ROUTES.HOME}>← Back to app</Link>
      </div>
    </main>
  );
}
