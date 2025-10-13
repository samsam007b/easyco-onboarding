'use client';
import Stepper from '@/components/Stepper'; import { useRouter } from 'next/navigation'; import { track } from '@/lib/analytics';
export default function ReviewStep(){
  const r=useRouter();
  const data={ budget_min: localStorage.getItem('budget_min'), budget_max: localStorage.getItem('budget_max'),
    areas: localStorage.getItem('areas'), move_in_date: localStorage.getItem('move_in_date'),
    lifestyle: JSON.parse(localStorage.getItem('lifestyle')||'[]') as string[] };
  const next=()=>{ track('review_continue', data); r.push('/onboarding/searcher/group-brief'); };
  return (<main className="max-w-3xl mx-auto p-6 space-y-6">
    <Stepper/>
    <div className="card space-y-4">
      <h1 className="text-xl font-semibold">Review your preferences</h1>
      <ul className="space-y-1 text-sm">
        <li><strong>Budget:</strong> €{data.budget_min}–€{data.budget_max}</li>
        <li><strong>Areas:</strong> {data.areas}</li>
        <li><strong>Move-in:</strong> {data.move_in_date||'—'}</li>
        <li><strong>Lifestyle:</strong> {data.lifestyle.join(', ')||'—'}</li>
      </ul>
      <button className="btn btn-primary" onClick={next}>Looks good → Group Brief</button>
    </div>
  </main>);
}