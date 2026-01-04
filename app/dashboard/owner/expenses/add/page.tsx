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
import { logger } from '@/lib/utils/logger';
import { useLanguage } from '@/lib/i18n/use-language';

export default function AddOwnerExpensePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.owner?.expensesAddPage;
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

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('properties')
          .select('id, title')
          .eq('owner_id', user.id)
          .eq('status', 'published');

        if (error) {
          logger.supabaseError('load owner properties for expense form', error, { userId: user.id });
          setError(t?.errors?.loadProperties?.[language] || 'Unable to load your properties. Please try again.');
          return;
        }

        if (data) {
          setProperties(data);
          if (data.length === 0) {
            logger.warn('Owner has no published properties for expense', { userId: user.id });
            setError(t?.errors?.noPublishedProperties?.[language] || 'You must have a published property to add expenses.');
          } else if (data.length === 1) {
            // Auto-select if only one property
            setFormData(prev => ({ ...prev, property: data[0].id }));
            logger.debug('Auto-selected single property for expense', { propertyId: data[0].id });
          }
        }
      } catch (err) {
        logger.error('Failed to load properties for expense form', err, { userId: user.id });
        setError(t?.errors?.loadError?.[language] || 'An error occurred while loading your properties.');
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
        setError(t?.errors?.notLoggedIn?.[language] || 'You must be logged in to add an expense.');
        setIsSubmitting(false);
        return;
      }

      if (!formData.property) {
        setError(t?.errors?.selectProperty?.[language] || 'Please select a property.');
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
      logger.info('Owner expense added successfully', {
        propertyId: formData.property,
        title: formData.title,
        amount: formData.amount
      });
      router.push('/dashboard/owner');
    } catch (err) {
      logger.error('Failed to submit owner expense', err, { formData });
      setError(t?.errors?.submitError?.[language] || 'Error adding expense. Please try again.');
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
              <h1 className="text-3xl font-bold text-purple-900">{t?.title?.[language] || 'Add Expense'}</h1>
              <p className="text-gray-600 mt-1">{t?.subtitle?.[language] || 'Record property-related expenses'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="superellipse-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-purple-700" />
              {t?.cardTitle?.[language] || 'Expense Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 superellipse-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Select
                  label={t?.property?.[language] || 'Property'}
                  value={formData.property}
                  onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                  options={properties.map(p => ({ value: p.id, label: p.title }))}
                  placeholder={properties.length === 0 ? (t?.noProperties?.[language] || 'No properties found') : (t?.selectProperty?.[language] || 'Select property')}
                  required
                  className="superellipse-xl"
                  disabled={properties.length === 0}
                />
              </div>

              <div>
                <Label htmlFor="title">{t?.expenseTitle?.[language] || 'Expense Title'}</Label>
                <Input
                  id="title"
                  placeholder={t?.expenseTitlePlaceholder?.[language] || 'e.g., Maintenance, Repairs, Utilities'}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="superellipse-xl"
                />
              </div>

              <div>
                <Label htmlFor="amount">{t?.amount?.[language] || 'Amount (€)'}</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="superellipse-xl"
                />
              </div>

              <div>
                <Select
                  label={t?.category?.[language] || 'Category'}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={[
                    { value: 'maintenance', label: t?.categories?.maintenance?.[language] || 'Maintenance' },
                    { value: 'repairs', label: t?.categories?.repairs?.[language] || 'Repairs' },
                    { value: 'utilities', label: t?.categories?.utilities?.[language] || 'Utilities' },
                    { value: 'insurance', label: t?.categories?.insurance?.[language] || 'Insurance' },
                    { value: 'property_tax', label: t?.categories?.property_tax?.[language] || 'Property Tax' },
                    { value: 'management', label: t?.categories?.management?.[language] || 'Property Management' },
                    { value: 'other', label: t?.categories?.other?.[language] || 'Other' },
                  ]}
                  placeholder={t?.selectCategory?.[language] || 'Select category'}
                  required
                  className="superellipse-xl"
                />
              </div>

              <div>
                <Label htmlFor="date">{t?.date?.[language] || 'Date'}</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="superellipse-xl"
                />
              </div>

              <div>
                <Label htmlFor="description">{t?.description?.[language] || 'Description (Optional)'}</Label>
                <Textarea
                  id="description"
                  placeholder={t?.descriptionPlaceholder?.[language] || 'Add any additional details...'}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="superellipse-xl"
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 superellipse-xl"
                >
                  {t?.cancel?.[language] || 'Cancel'}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || properties.length === 0}
                  className="flex-1 bg-purple-900 hover:bg-purple-950 superellipse-xl disabled:opacity-50"
                >
                  {isSubmitting ? (t?.submitting?.[language] || 'Adding...') : (t?.submit?.[language] || 'Add Expense')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
