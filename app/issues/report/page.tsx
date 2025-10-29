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

export default function ReportIssuePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'medium',
    description: '',
    location: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement issue submission
    console.log('Issue:', formData);
    router.push('/home/resident');
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
                  className="flex-1 bg-orange-600 hover:bg-orange-700 rounded-xl"
                >
                  Submit Report
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
