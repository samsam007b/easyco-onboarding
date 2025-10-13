'use client';
import { useForm } from 'react-hook-form'; import { z } from 'zod'; import { useRouter } from 'next/navigation';
import Stepper from '@/components/Stepper'; import { track } from '@/lib/analytics'; import { supabase } from '@/lib/supabaseClient';

const Schema=z.object({
  group_name: z.string().min(2),
  budget_min: z.coerce.number().min(100).max(10000),
  budget_max: z.coerce.number().min(100).max(10000),
  preferred_areas: z.string().min(2),
  min_bedrooms: z.coerce.number().min(1).max(12),
  lease_length: z.string().min(1),
});
type FormData = z.infer<typeof Schema>;

export default function GroupBriefStep(){
  const r=useRouter();
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      group_name: '',
      budget_min: Number(localStorage.getItem('budget_min')||400),
      budget_max: Number(localStorage.getItem('budget_max')||800),
      preferred_areas: localStorage.getItem('areas')||'',
      min_bedrooms: 3,
      lease_length: '6-12 months',
    }
  });

  const onSubmit = async (d: FormData) => {
    track('group_brief_submit', d);
    const tester_id = localStorage.getItem('tester_id') || null;
    const onboarding = {
      tester_id,
      budget_min: Number(localStorage.getItem('budget_min')||0),
      budget_max: Number(localStorage.getItem('budget_max')||0),
      areas: localStorage.getItem('areas')||'',
      move_in_date: localStorage.getItem('move_in_date')||null,
      lifestyle: JSON.parse(localStorage.getItem('lifestyle')||'[]') as string[]
    };
    try{ await supabase.from('test_onboardings').insert(onboarding); } catch(e){ console.error(e); }
    try{
      const { error } = await supabase.from('test_group_briefs').insert({
        tester_id,
        group_name: d.group_name, budget_min: d.budget_min, budget_max: d.budget_max,
        preferred_areas: d.preferred_areas, min_bedrooms: d.min_bedrooms, lease_length: d.lease_length
      });
      if(error){ alert('Saved locally. Supabase insert failed.'); }
    } catch(e){ console.error(e); }
    r.push('/post-test');
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <Stepper/>
      <div className="card space-y-4">
        <h1 className="text-xl font-semibold">Create a Group Brief</h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div><label className="block text-sm">Group name</label><input className="w-full border rounded-2xl p-3" {...register('group_name')}/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm">Budget min (€)</label><input type="number" className="w-full border rounded-2xl p-3" {...register('budget_min',{valueAsNumber:true})}/></div>
            <div><label className="block text-sm">Budget max (€)</label><input type="number" className="w-full border rounded-2xl p-3" {...register('budget_max',{valueAsNumber:true})}/></div>
          </div>
          <div><label className="block text-sm">Preferred areas (comma-separated)</label><input className="w-full border rounded-2xl p-3" {...register('preferred_areas')}/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm">Min bedrooms</label><input type="number" className="w-full border rounded-2xl p-3" {...register('min_bedrooms',{valueAsNumber:true})}/></div>
            <div><label className="block text-sm">Lease length</label><input className="w-full border rounded-2xl p-3" placeholder="e.g., 6-12 months" {...register('lease_length')}/></div>
          </div>
          <button className="btn btn-primary" type="submit">Submit brief</button>
        </form>
      </div>
    </main>
  );
}