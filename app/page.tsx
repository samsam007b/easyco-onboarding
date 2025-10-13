import Link from "next/link";
export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">EasyCo — Prototype</h1>
      <div className="card space-y-4">
        <p>Run a full onboarding + group brief and store results in Supabase.</p>
        <div className="flex gap-3">
          <Link href="/consent" className="btn btn-primary">Start user test</Link>
          <Link href="/admin" className="btn btn-secondary">Admin</Link>
        </div>
      </div>
    </main>
  );
}