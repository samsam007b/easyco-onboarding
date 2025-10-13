'use client';
import { useRouter, useSearchParams } from 'next/navigation';
export default function Consent() {
  const r = useRouter();
  const q = useSearchParams();
  const agree = () => {
    const tester = q.get('tester') || '';
    if (tester) localStorage.setItem('tester_id', tester);
    localStorage.setItem('consent','yes');
    r.push('/onboarding/searcher');
  };
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="card space-y-4">
        <h1 className="text-2xl font-bold">Consent for UX Test</h1>
        <p className="text-sm text-gray-700">
          We collect your answers for research only. No personal identifiers. You can request deletion at any time.
        </p>
        <div className="flex gap-3">
          <button className="btn btn-primary" onClick={agree}>I agree</button>
          <button className="btn" onClick={()=>history.back()}>Cancel</button>
        </div>
      </div>
    </main>
  );
}