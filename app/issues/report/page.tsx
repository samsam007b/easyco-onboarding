'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { createClient } from '@/lib/auth/supabase-client';
import { useAuth } from '@/lib/contexts/auth-context';

export default function ReportIssuePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'medium',
    description: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!user) {
        setError('Vous devez être connecté pour signaler un problème');
        setIsSubmitting(false);
        return;
      }

      const supabase = createClient();

      // Get user's property_id from property_members table
      const { data: memberData, error: memberError } = await supabase
        .from('property_members')
        .select('property_id')
        .eq('user_id', user.id)
        .single();

      if (memberError || !memberData) {
        setError('Vous devez être membre d\'une propriété pour signaler des problèmes');
        setIsSubmitting(false);
        return;
      }

      // Insert maintenance request
      const { error: insertError } = await supabase
        .from('maintenance_requests')
        .insert({
          property_id: memberData.property_id,
          created_by: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          location: formData.location || null,
          status: 'open'
        });

      if (insertError) {
        throw insertError;
      }

      // Success - redirect to dashboard
      router.push('/dashboard/resident');
    } catch (err) {
      console.error('Error submitting issue:', err);
      setError('Erreur lors du signalement. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Report Issue</h1>
              <p className="text-gray-600 mt-1">Let us know about maintenance or problems</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              Issue Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Issue Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Broken shower head, Heating not working"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>

              <div>
                <Select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={[
                    { value: 'plumbing', label: 'Plumbing' },
                    { value: 'electrical', label: 'Electrical' },
                    { value: 'heating', label: 'Heating/Cooling' },
                    { value: 'appliances', label: 'Appliances' },
                    { value: 'structure', label: 'Structure/Building' },
                    { value: 'cleaning', label: 'Cleaning' },
                    { value: 'noise', label: 'Noise Complaint' },
                    { value: 'other', label: 'Other' },
                  ]}
                  placeholder="Select category"
                  required
                  className="rounded-xl"
                />
              </div>

              <div>
                <Select
                  label="Priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  options={[
                    { value: 'low', label: 'Low - Can wait' },
                    { value: 'medium', label: 'Medium - Should fix soon' },
                    { value: 'high', label: 'High - Urgent attention needed' },
                    { value: 'emergency', label: 'Emergency - Immediate action required' },
                  ]}
                  placeholder="Select priority"
                  required
                  className="rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="location">Location in Property</Label>
                <Input
                  id="location"
                  placeholder="e.g., Room 204, Kitchen, Bathroom"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="rounded-xl"
                  rows={6}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">Emergency Issues</h4>
                    <p className="text-sm text-yellow-800">
                      For emergencies (gas leaks, flooding, electrical hazards), please call emergency services immediately and then report here.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Submit Report'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
