'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, Upload, FileText, DollarSign, Calendar, User, Mail, Phone, Briefcase, Home, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/auth/supabase-client';
import { getPropertyById } from '@/lib/property-helpers';
import { getPropertyDetailsData } from '@/lib/services/rooms.service';
import type { Property } from '@/types/property.types';
import type { RoomWithTotal } from '@/types/room.types';
import { toast } from 'sonner';
import { storageService } from '@/lib/services/storage-service';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';

export default function PropertyApplicationPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const propertyId = params.id as string;
  const roomId = searchParams.get('room');

  const [property, setProperty] = useState<Property | null>(null);
  const [room, setRoom] = useState<RoomWithTotal | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    desiredMoveInDate: '',
    leaseDurationMonths: 12,
    message: '',
    occupation: '',
    monthlyIncome: '',
    employerName: '',
  });

  // Document upload state
  const [documents, setDocuments] = useState({
    idDocument: null as File | null,
    proofOfIncome: null as File | null,
    referenceLetter: null as File | null,
  });

  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, [propertyId, roomId]);

  const loadData = async () => {
    setLoading(true);

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user) {
      toast.error(t('properties.apply.errors.mustBeLoggedIn'));
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    // Load user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profile) {
      setUserProfile(profile);
      // Pre-fill form with profile data
      setFormData(prev => ({
        ...prev,
        occupation: profile.occupation || '',
        employerName: profile.employer_name || '',
        monthlyIncome: profile.monthly_income || '',
      }));
    }

    // Load property
    const result = await getPropertyById(propertyId);
    if (result.success && result.data) {
      setProperty(result.data);
    } else {
      toast.error(t('properties.apply.errors.propertyNotFound'));
      router.push('/properties/browse');
      return;
    }

    // Load room if specified
    if (roomId) {
      try {
        const roomData = await getPropertyDetailsData(propertyId);
        const selectedRoom = roomData.rooms.find(r => r.id === roomId);
        if (selectedRoom) {
          setRoom(selectedRoom);
        }
      } catch (error) {
        console.error('Error loading room:', error);
      }
    }

    setLoading(false);
  };

  const handleFileChange = (field: keyof typeof documents, file: File | null) => {
    setDocuments(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error(t('properties.apply.errors.mustBeLoggedIn'));
        return;
      }

      // Upload documents if provided
      let idDocumentUrl = null;
      let proofOfIncomeUrl = null;
      let referenceLetterUrl = null;

      if (documents.idDocument) {
        const validation = storageService.validateFile(documents.idDocument);
        if (!validation.valid) {
          toast.error(`${t('properties.apply.documents.idDocument')}: ${validation.error}`);
          return;
        }
        const result = await storageService.uploadApplicationDocument(documents.idDocument, user.id, 'id');
        if (result.success) {
          idDocumentUrl = result.url || null;
        } else {
          toast.error(`${t('properties.apply.errors.uploadError')} ${t('properties.apply.documents.idDocument')}: ${result.error}`);
          return;
        }
      }

      if (documents.proofOfIncome) {
        const validation = storageService.validateFile(documents.proofOfIncome);
        if (!validation.valid) {
          toast.error(`${t('properties.apply.documents.proofOfIncome')}: ${validation.error}`);
          return;
        }
        const result = await storageService.uploadApplicationDocument(documents.proofOfIncome, user.id, 'income');
        if (result.success) {
          proofOfIncomeUrl = result.url || null;
        } else {
          toast.error(`${t('properties.apply.errors.uploadError')} ${t('properties.apply.documents.proofOfIncome')}: ${result.error}`);
          return;
        }
      }

      if (documents.referenceLetter) {
        const validation = storageService.validateFile(documents.referenceLetter);
        if (!validation.valid) {
          toast.error(`${t('properties.apply.documents.referenceLetter')}: ${validation.error}`);
          return;
        }
        const result = await storageService.uploadApplicationDocument(documents.referenceLetter, user.id, 'reference');
        if (result.success) {
          referenceLetterUrl = result.url || null;
        } else {
          toast.error(`${t('properties.apply.errors.uploadError')} ${t('properties.apply.documents.referenceLetter')}: ${result.error}`);
          return;
        }
      }

      // Create application
      const { data, error } = await supabase
        .from('applications')
        .insert({
          property_id: propertyId,
          applicant_id: user.id,
          applicant_name: userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : user.email || 'Unknown',
          applicant_email: user.email,
          applicant_phone: userProfile?.phone_number || null,
          desired_move_in_date: formData.desiredMoveInDate || null,
          lease_duration_months: formData.leaseDurationMonths,
          occupation: formData.occupation || null,
          monthly_income: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : null,
          employer_name: formData.employerName || null,
          message: formData.message || null,
          id_document_url: idDocumentUrl,
          proof_of_income_url: proofOfIncomeUrl,
          reference_letter_url: referenceLetterUrl,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error(t('properties.apply.errors.alreadyApplied'));
        } else {
          throw error;
        }
        return;
      }

      toast.success(t('properties.apply.success'));
      router.push('/dashboard/searcher/my-applications');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.message || t('properties.apply.errors.submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{t('properties.apply.title')}</h1>
          <p className="text-gray-600 mt-2">{property.title}</p>
          {room && (
            <p className="text-orange-600 font-medium mt-1">
              {t('properties.apply.selectedRoom')}: {room.room_name || `${t('properties.apply.room')} ${room.room_number}`} - €{room.price}/{t('properties.apply.perMonth')}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-orange-600" />
                {t('properties.apply.sections.personalInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t('properties.apply.fields.fullName')}</Label>
                  <input
                    type="text"
                    id="name"
                    value={userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t('properties.apply.fields.email')}</Label>
                  <input
                    type="email"
                    id="email"
                    value={userProfile?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">{t('properties.apply.fields.phoneOptional')}</Label>
                <input
                  type="tel"
                  id="phone"
                  value={userProfile?.phone_number || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Move-in Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-orange-600" />
                {t('properties.apply.sections.moveInDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="moveInDate">{t('properties.apply.fields.desiredMoveInDate')} *</Label>
                  <input
                    type="date"
                    id="moveInDate"
                    required
                    value={formData.desiredMoveInDate}
                    onChange={(e) => setFormData({ ...formData, desiredMoveInDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <Label htmlFor="leaseDuration">{t('properties.apply.fields.leaseDuration')} *</Label>
                  <select
                    id="leaseDuration"
                    required
                    value={formData.leaseDurationMonths}
                    onChange={(e) => setFormData({ ...formData, leaseDurationMonths: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={3}>{t('properties.apply.leaseOptions.threeMonths')}</option>
                    <option value={6}>{t('properties.apply.leaseOptions.sixMonths')}</option>
                    <option value={12}>{t('properties.apply.leaseOptions.twelveMonths')}</option>
                    <option value={24}>{t('properties.apply.leaseOptions.twentyFourMonths')}</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-600" />
                {t('properties.apply.sections.professionalInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="occupation">{t('properties.apply.fields.occupation')}</Label>
                <input
                  type="text"
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder={t('properties.apply.placeholders.occupation')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employer">{t('properties.apply.fields.employerName')}</Label>
                  <input
                    type="text"
                    id="employer"
                    value={formData.employerName}
                    onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                    placeholder={t('properties.apply.placeholders.employerName')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <Label htmlFor="income">{t('properties.apply.fields.monthlyIncome')}</Label>
                  <input
                    type="number"
                    id="income"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                    placeholder="2500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Message */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-600" />
                {t('properties.apply.sections.personalMessage')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="message">{t('properties.apply.fields.aboutYou')}</Label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t('properties.apply.placeholders.message')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </CardContent>
          </Card>

          {/* Documents Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                {t('properties.apply.sections.documents')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                {t('properties.apply.documentsHelp')}
              </p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="idDocument">{t('properties.apply.documents.idDocument')}</Label>
                  <input
                    type="file"
                    id="idDocument"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('idDocument', e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="proofOfIncome">{t('properties.apply.documents.proofOfIncome')}</Label>
                  <input
                    type="file"
                    id="proofOfIncome"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('proofOfIncome', e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="referenceLetter">{t('properties.apply.documents.referenceLetter')}</Label>
                  <input
                    type="file"
                    id="referenceLetter"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('referenceLetter', e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-between bg-white superellipse-2xl p-6 shadow-lg border border-orange-100">
            <div>
              <p className="text-sm text-gray-600">
                {t('properties.apply.submitDisclaimer')}
              </p>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-6"
            >
              {submitting ? (
                <>
                  <LoadingHouse size={20} />
                  {t('properties.apply.submitting')}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  {t('properties.apply.submit')}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
