'use client';
import { useRouter } from 'next/navigation'; import Stepper from '@/components/Stepper'; import { track } from '@/lib/analytics';
const OPTIONS=['non-smoker','quiet','pet-friendly','remote-worker','early-bird','night-owl'];
export default function LifestyleStep(){ const r=useRouter();
  const toggle=(k:string)=>{ const current=new Set<string>(JSON.parse(localStorage.getItem('lifestyle')||'[]')); current.has(k)?current.delete(k):current.add(k); localStorage.setItem('lifestyle',JSON.stringify([...current])); };
  const next=()=>{ track('lifestyle_done',{lifestyle: JSON.parse(localStorage.getItem('lifestyle')||'[]')}); r.push('/onboarding/searcher/review'); };
  const selected: string[] = JSON.parse(localStorage.getItem('lifestyle')||'[]');
  return (<main className="max-w-3xl mx-auto p-6 space-y-6">
    <Stepper/>
    <div className="card space-y-4">
      <h1 className="text-xl font-semibold">Lifestyle preferences</h1>
      <div className="flex flex-wrap gap-2">{OPTIONS.map(o=>{ const active=selected.includes(o);
        return (<button key={o} onClick={()=>toggle(o)} className={`px-3 py-2 rounded-2xl border ${active?'bg-[color:var(--easy-yellow)]':'bg-white'}`}>{o}</button>);})}</div>
      <button className="btn btn-primary" onClick={next}>Continue</button>
    </div>
  </main>);
}