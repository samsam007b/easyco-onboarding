'use client';
import { useForm } from 'react-hook-form'; import { z } from 'zod'; import { supabase } from '@/lib/supabaseClient'; import { useRouter } from 'next/navigation'; import { toast } from 'sonner';
const Schema=z.object({ rating:z.coerce.number().min(1).max(5), comment:z.string().optional() });
type FormData = z.infer<typeof Schema>;
export default function PostTest(){
  const r=useRouter();
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { rating: 4, comment: '' } });
  const onSubmit = async (d: FormData) => {
    const tester_id = localStorage.getItem('tester_id') || null;
    try{
      await supabase.from('test_feedback').insert({ tester_id, rating: d.rating, comment: d.comment||null });
      toast.success('Thanks for your feedback!');
    } catch(e){ // FIXME: Use logger.error(e); toast.error('Could not save feedback (check Supabase).'); }
    r.push('/');
  };
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="card space-y-4">
        <h1 className="text-2xl font-bold">Post-test feedback</h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm">Overall satisfaction (1-5)</label>
            <input type="number" min={1} max={5} className="w-full border rounded-2xl p-3" {...register('rating', {valueAsNumber:true})}/>
          </div>
          <div>
            <label className="block text-sm">Any comments?</label>
            <textarea className="w-full border rounded-2xl p-3" rows={4} {...register('comment')}/>
          </div>
          <button className="btn btn-primary" type="submit">Send feedback</button>
        </form>
      </div>
    </main>
  );
}