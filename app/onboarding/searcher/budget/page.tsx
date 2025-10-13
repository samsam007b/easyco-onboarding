'use client';
import { useForm } from 'react-hook-form'; import { z } from 'zod'; import { useRouter } from 'next/navigation';
import Stepper from '@/components/Stepper'; import { track } from '@/lib/analytics';
const Schema=z.object({ budget_min:z.coerce.number().min(100).max(5000), budget_max:z.coerce.number().min(100).max(5000) });
type FormData=z.infer<typeof Schema>;
export default function BudgetStep(){
  const { register, handleSubmit, formState:{errors} } = useForm<FormData>({ defaultValues:{
    budget_min:Number(localStorage.getItem('budget_min')||400), budget_max:Number(localStorage.getItem('budget_max')||800) } });
  const r=useRouter();
  const onSubmit=(d:FormData)=>{ localStorage.setItem('budget_min',String(d.budget_min)); localStorage.setItem('budget_max',String(d.budget_max)); track('budget_done',d); r.push('/onboarding/searcher/location'); };
  return (<main className="max-w-3xl mx-auto p-6 space-y-6">
    <Stepper/>
    <div className="card space-y-4">
      <h1 className="text-xl font-semibold">Monthly budget</h1>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div><label className="block text-sm">Min</label><input type="number" {...register('budget_min',{valueAsNumber:true})} className="w-full border rounded-2xl p-3"/>{errors.budget_min&&<p className="text-red-600 text-sm">Invalid min</p>}</div>
        <div><label className="block text-sm">Max</label><input type="number" {...register('budget_max',{valueAsNumber:true})} className="w-full border rounded-2xl p-3"/>{errors.budget_max&&<p className="text-red-600 text-sm">Invalid max</p>}</div>
        <button className="btn btn-primary" type="submit">Continue</button>
      </form>
    </div>
  </main>);
}