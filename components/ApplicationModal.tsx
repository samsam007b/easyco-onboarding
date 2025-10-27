'use client';

import { useState } from 'react';
import { X, Calendar, DollarSign, Briefcase, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApplications } from '@/lib/hooks/use-applications';
import type { CreateApplicationData } from '@/lib/hooks/use-applications';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  userId: string;
  userProfile: {
    full_name: string;
    email: string;
    phone_number?: string;
  };
}

export default function ApplicationModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  userId,
  userProfile,
}: ApplicationModalProps) {
  const { createApplication } = useApplications(userId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateApplicationData>({
    property_id: propertyId,
    applicant_name: userProfile.full_name || '',
    applicant_email: userProfile.email || '',
    applicant_phone: userProfile.phone_number || '',
    desired_move_in_date: '',
    lease_duration_months: 12,
    occupation: '',
    monthly_income: undefined,
    employer_name: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await createApplication(formData);

    if (success) {
      onClose();
    }

    setIsSubmitting(false);
  };

  const handleChange = (field: keyof CreateApplicationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#4A148C]">Apply for Property</h2>
              <p className="text-sm text-gray-600 mt-1">{propertyTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  value={formData.applicant_name}
                  onChange={(e) => handleChange('applicant_name', e.target.value)}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.applicant_email}
                  onChange={(e) => handleChange('applicant_email', e.target.value)}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.applicant_phone || ''}
                  onChange={(e) => handleChange('applicant_phone', e.target.value)}
                  placeholder="+32 XXX XX XX XX"
                />
              </div>
            </div>
          </div>

          {/* Move-in Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Move-in Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Desired Move-in Date
                </label>
                <Input
                  type="date"
                  value={formData.desired_move_in_date || ''}
                  onChange={(e) => handleChange('desired_move_in_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lease Duration (months)
                </label>
                <select
                  value={formData.lease_duration_months || 12}
                  onChange={(e) => handleChange('lease_duration_months', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4A148C] focus:outline-none"
                >
                  <option value={3}>3 months</option>
                  <option value={6}>6 months</option>
                  <option value={12}>12 months</option>
                  <option value={24}>24 months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Occupation
                </label>
                <Input
                  type="text"
                  value={formData.occupation || ''}
                  onChange={(e) => handleChange('occupation', e.target.value)}
                  placeholder="e.g., Software Engineer, Student, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employer/Institution
                </label>
                <Input
                  type="text"
                  value={formData.employer_name || ''}
                  onChange={(e) => handleChange('employer_name', e.target.value)}
                  placeholder="Company or university name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Monthly Income (€)
                </label>
                <Input
                  type="number"
                  value={formData.monthly_income || ''}
                  onChange={(e) => handleChange('monthly_income', parseFloat(e.target.value))}
                  placeholder="e.g., 2500"
                  min="0"
                  step="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This information helps the landlord assess your application
                </p>
              </div>
            </div>
          </div>

          {/* Personal Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Message to Owner (Optional)
            </label>
            <textarea
              value={formData.message || ''}
              onChange={(e) => handleChange('message', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4A148C] focus:outline-none resize-none"
              placeholder="Introduce yourself and explain why you're interested in this property..."
            />
            <p className="text-xs text-gray-500 mt-1">
              A personal message can help your application stand out
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Note:</span> By submitting this application, you agree
              that the information provided is accurate. The property owner will review your application
              and contact you if approved.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
