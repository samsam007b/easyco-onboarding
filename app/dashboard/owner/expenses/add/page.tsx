'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

export default function AddOwnerExpensePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    property: '',
    title: '',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement expense submission
    console.log('Owner Expense:', formData);
    router.push('/home/owner');
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Select
                  label="Property"
                  value={formData.property}
                  onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                  options={[
                    { value: 'prop1', label: 'Brussels Centre Apartment' },
                    { value: 'prop2', label: 'Ixelles Coliving' },
                    { value: 'prop3', label: 'Etterbeek Studio' },
                  ]}
                  placeholder="Select property"
                  required
                  className="rounded-xl"
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
                  className="flex-1 bg-purple-900 hover:bg-purple-950 rounded-xl"
                >
                  Add Expense
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
