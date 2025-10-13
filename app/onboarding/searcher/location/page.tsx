'use client';
import { useForm } from 'react-hook-form'; import { z } from 'zod'; import { useRouter } from 'next/navigation';
import Stepper from '@/components/Stepper'; import { track } from '@/lib/analytics';
const Schema=z.object({ areas:z.string().min(2), move_in_date:z.string().optional() });
type FormData=z.infer<typeof Schema>;
export default function LocationStep(){
  const { register, handleSubmit } = useForm<FormData>({ defaultValues:{
    areas: localStorage.getItem('areas')||'Ixelles, Saint-Gilles', move_in_date: localStorage.getItem('move_in_date')||'' } });
  const r=useRouter();
  const onSubmit=(d:FormData)=>{ localStorage.setItem('areas',d.areas); if(d.move_in_date) localStorage.setItem('move_in_date',d.move_in_date); track('location_done',d); r.push('/onboarding/searcher/lifestyle'); };
  return (<main className="max-w-3xl mx-auto p-6 space-y-6">
    <Stepper/>
    <div className="card space-y-4">
      <h1 className="text-xl font-semibold">Preferred areas & move-in</h1>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div><label className="block text-sm">Areas (comma-separated)</label><input type="text" {...register('areas')} className="w-full border rounded-2xl p-3"/></div>
        <div><label className="block text-sm">Target move-in date</label><input type="date" {...register('move_in_date')} className="w-full border rounded-2xl p-3"/></div>
        <button className="btn btn-primary" type="submit">Continue</button>
      </form>
    </div>
  </main>);
}