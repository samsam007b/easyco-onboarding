'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">EasyCo — Prototype</h1>
      <p> Lance un test utilisateur et enregistre tes réponses localement. </p>

      <Link
        href="/consent?source=landing"
        className="inline-block px-4 py-2 rounded bg-[color:var(--easy-purple)] text-white"
      >
        Start user test
      </Link>
    </main>
  );
}
