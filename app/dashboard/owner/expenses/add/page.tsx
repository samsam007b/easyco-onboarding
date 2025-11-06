'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { createClient } from '@/lib/auth/supabase-client';
import { useAuth } from '@/lib/contexts/auth-context';

export default function AddOwnerExpensePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<Array<{ id: string; title: string }>>([]);
  const [formData, setFormData] = useState({
    property: '',
    title: '',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const loadProperties = async () => {
      if (!user) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from('properties')
        .select('id, title')
        .eq('owner_id', user.id)
        .eq('status', 'published');

      if (!error && data) {
        setProperties(data);
        if (data.length === 1) {
          setFormData(prev => ({ ...prev, property: data[0].id }));
        }
      }
    };

    loadProperties();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!user) {
        setError('Vous devez être connecté pour ajouter une dépense');
        setIsSubmitting(false);
        return;
      }

      if (!formData.property) {
        setError('Veuillez sélectionner une propriété');
        setIsSubmitting(false);
        return;
      }

      const supabase = createClient();

      // Insert expense for owner's property
      const { error: insertError } = await supabase
        .from('expenses')
        .insert({
          property_id: formData.property,
          created_by: user.id,
          title: formData.title,
          description: formData.description || null,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date,
          status: 'approved', // Owner expenses are auto-approved
          split_type: 'equal'
        });

      if (insertError) {
        throw insertError;
      }

      // Success - redirect to dashboard
      router.push('/dashboard/owner');
    } catch (err) {
      console.error('Error submitting expense:', err);
      setError('Erreur lors de l\'ajout de la dépense. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
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
              <h1 className="text-3xl font-bold text-purple-900">Add Expense</h1>
              <p className="text-gray-600 mt-1">Record property-related expenses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-purple-700" />
              Expense Details
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
                <Select
                  label="Property"
                  value={formData.property}
                  onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                  options={properties.map(p => ({ value: p.id, label: p.title }))}
                  placeholder={properties.length === 0 ? "No properties found" : "Select property"}
                  required
                  className="rounded-xl"
                  disabled={properties.length === 0}
                />
              </div>

              <div>
                <Label htmlFor="title">Expense Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Maintenance, Repairs, Utilities"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                    { value: 'maintenance', label: 'Maintenance' },
                    { value: 'repairs', label: 'Repairs' },
                    { value: 'utilities', label: 'Utilities' },
                    { value: 'insurance', label: 'Insurance' },
                    { value: 'property_tax', label: 'Property Tax' },
                    { value: 'management', label: 'Property Management' },
                    { value: 'other', label: 'Other' },
                  ]}
                  placeholder="Select category"
                  required
                  className="rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-xl"
                  rows={4}
                />
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
                  disabled={isSubmitting || properties.length === 0}
                  className="flex-1 bg-purple-900 hover:bg-purple-950 rounded-xl disabled:opacity-50"
                >
                  {isSubmitting ? 'Ajout en cours...' : 'Add Expense'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
