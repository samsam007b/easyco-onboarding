'use client';

import { useState } from 'react';
import { X, Calendar, DollarSign, Briefcase, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApplications } from '@/lib/hooks/use-applications';
import { useLanguage } from '@/lib/i18n/use-language';
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
  const { t } = useLanguage();
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
      <div className="bg-white superellipse-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 superellipse-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#4A148C]">{t('applicationModal.title')}</h2>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('applicationModal.personalInfo')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('applicationModal.fullName')}
                </label>
                <Input
                  type="text"
                  value={formData.applicant_name}
                  onChange={(e) => handleChange('applicant_name', e.target.value)}
                  required
                  placeholder={t('applicationModal.placeholders.fullName')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('applicationModal.email')}
                </label>
                <Input
                  type="email"
                  value={formData.applicant_email}
                  onChange={(e) => handleChange('applicant_email', e.target.value)}
                  required
                  placeholder={t('applicationModal.placeholders.email')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('applicationModal.phone')}
                </label>
                <Input
                  type="tel"
                  value={formData.applicant_phone || ''}
                  onChange={(e) => handleChange('applicant_phone', e.target.value)}
                  placeholder={t('applicationModal.placeholders.phone')}
                />
              </div>
            </div>
          </div>

          {/* Move-in Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('applicationModal.moveInDetails')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {t('applicationModal.desiredMoveInDate')}
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
                  {t('applicationModal.leaseDuration')}
                </label>
                <select
                  value={formData.lease_duration_months || 12}
                  onChange={(e) => handleChange('lease_duration_months', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4A148C] focus:outline-none"
                >
                  <option value={3}>{t('applicationModal.leaseOptions.months3')}</option>
                  <option value={6}>{t('applicationModal.leaseOptions.months6')}</option>
                  <option value={12}>{t('applicationModal.leaseOptions.months12')}</option>
                  <option value={24}>{t('applicationModal.leaseOptions.months24')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('applicationModal.professionalInfo')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  {t('applicationModal.occupation')}
                </label>
                <Input
                  type="text"
                  value={formData.occupation || ''}
                  onChange={(e) => handleChange('occupation', e.target.value)}
                  placeholder={t('applicationModal.placeholders.occupation')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('applicationModal.employerInstitution')}
                </label>
                <Input
                  type="text"
                  value={formData.employer_name || ''}
                  onChange={(e) => handleChange('employer_name', e.target.value)}
                  placeholder={t('applicationModal.placeholders.employer')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  {t('applicationModal.monthlyIncome')}
                </label>
                <Input
                  type="number"
                  value={formData.monthly_income || ''}
                  onChange={(e) => handleChange('monthly_income', parseFloat(e.target.value))}
                  placeholder={t('applicationModal.placeholders.income')}
                  min="0"
                  step="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('applicationModal.incomeHelper')}
                </p>
              </div>
            </div>
          </div>

          {/* Personal Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              {t('applicationModal.messageToOwner')}
            </label>
            <textarea
              value={formData.message || ''}
              onChange={(e) => handleChange('message', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4A148C] focus:outline-none resize-none"
              placeholder={t('applicationModal.placeholders.message')}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('applicationModal.messageHelper')}
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-purple-50 border border-purple-200 superellipse-xl p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">{t('applicationModal.disclaimerNote')}</span> {t('applicationModal.disclaimer')}
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
              {t('applicationModal.cancel')}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('applicationModal.submitting') : t('applicationModal.submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
