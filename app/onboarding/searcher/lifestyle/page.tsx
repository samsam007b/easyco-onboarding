'use client';

import { useRouter } from 'next/navigation';
import Stepper from '@/components/Stepper';
import { track } from '@/lib/analytics';

// tape explicitement le tableau pour éviter les warnings TS
const OPTIONS: string[] = [
  'non-smoker',
  'quiet',
  'pet-friendly',
  'remote-worker',
  'early-bird',
  'night-owl',
];

// helpers 100% tableau (pas de Set)
function readLifestyle(): string[] {
  try {
    const raw = localStorage.getItem('lifestyle');
    const arr = JSON.parse(raw ?? '[]');
    return Array.isArray(arr) ? (arr as string[]) : [];
  } catch {
    return [];
  }
}

function writeLifestyle(vals: string[]) {
  localStorage.setItem('lifestyle', JSON.stringify(vals));
}

export default function LifestyleStep() {
  const r = useRouter();

  const toggle = (k: string) => {
    const current = readLifestyle();
    const i = current.indexOf(k);
    if (i >= 0) current.splice(i, 1);
    else current.push(k);
    writeLifestyle(current);
  };

  const next = () => {
    track('lifestyle_done', { lifestyle: readLifestyle() });
    r.push('/onboarding/searcher/review');
  };

  const selected = readLifestyle();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Stepper />
      <div className="card space-y-4">
        <h1 className="text-xl font-semibold">Lifestyle preferences</h1>

        <div className="flex flex-wrap gap-2">
          {OPTIONS.map((o) => {
            const active = selected.includes(o);
            return (
              <button
                key={o}
                onClick={() => toggle(o)}
                className={`px-3 py-2 rounded-2xl border ${
                  active ? 'bg-primary text-white' : 'bg-white'
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>

        <button className="btn btn-primary" onClick={next}>
          Continue
        </button>
      </div>
    </main>
  );
}
