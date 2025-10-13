// app/admin/page.tsx
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fetchData() {
  const [o, b, f] = await Promise.all([
    supabase.from('onboardings').select('*').order('created_at', { ascending: false }).limit(200),
    supabase.from('group_briefs').select('*').order('created_at', { ascending: false }).limit(200),
    supabase.from('feedback').select('*').order('created_at', { ascending: false }).limit(200),
  ]);
  return { onboardings: o.data ?? [], briefs: b.data ?? [], feedback: f.data ?? [] };
}

export default async function AdminPage() {
  const { onboardings, briefs, feedback } = await fetchData();

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
      <h1 className="text-2xl font-semibold">Admin — Data</h1>

      {[
        { title: 'Onboardings', rows: onboardings, key: 'onb' },
        { title: 'Group Briefs', rows: briefs, key: 'brf' },
        { title: 'Feedback', rows: feedback, key: 'fb' },
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

      <div className="text-sm text-gray-500">
        <Link href="/">← Back to app</Link>
      </div>
    </main>
  );
}
