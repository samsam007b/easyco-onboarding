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

export default function PropertyApplicationPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
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
      toast.error('Vous devez être connecté pour postuler');
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
      toast.error('Propriété introuvable');
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
        toast.error('Vous devez être connecté');
        return;
      }

      // Upload documents if provided
      let idDocumentUrl = null;
      let proofOfIncomeUrl = null;
      let referenceLetterUrl = null;

      if (documents.idDocument) {
        const validation = storageService.validateFile(documents.idDocument);
        if (!validation.valid) {
          toast.error(`Pièce d'identité: ${validation.error}`);
          return;
        }
        const result = await storageService.uploadApplicationDocument(documents.idDocument, user.id, 'id');
        if (result.success) {
          idDocumentUrl = result.url || null;
        } else {
          toast.error(`Erreur lors de l'upload de la pièce d'identité: ${result.error}`);
          return;
        }
      }

      if (documents.proofOfIncome) {
        const validation = storageService.validateFile(documents.proofOfIncome);
        if (!validation.valid) {
          toast.error(`Justificatif de revenus: ${validation.error}`);
          return;
        }
        const result = await storageService.uploadApplicationDocument(documents.proofOfIncome, user.id, 'income');
        if (result.success) {
          proofOfIncomeUrl = result.url || null;
        } else {
          toast.error(`Erreur lors de l'upload du justificatif de revenus: ${result.error}`);
          return;
        }
      }

      if (documents.referenceLetter) {
        const validation = storageService.validateFile(documents.referenceLetter);
        if (!validation.valid) {
          toast.error(`Lettre de recommandation: ${validation.error}`);
          return;
        }
        const result = await storageService.uploadApplicationDocument(documents.referenceLetter, user.id, 'reference');
        if (result.success) {
          referenceLetterUrl = result.url || null;
        } else {
          toast.error(`Erreur lors de l'upload de la lettre de recommandation: ${result.error}`);
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
          toast.error('Vous avez déjà postulé pour cette propriété');
        } else {
          throw error;
        }
        return;
      }

      toast.success('Candidature envoyée avec succès!');
      router.push('/dashboard/searcher/my-applications');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi de la candidature');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium">Chargement...</p>
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
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Candidater pour ce logement</h1>
          <p className="text-gray-600 mt-2">{property.title}</p>
          {room && (
            <p className="text-orange-600 font-medium mt-1">
              Chambre sélectionnée: {room.room_name || `Chambre ${room.room_number}`} - €{room.price}/mois
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-orange-600" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <input
                    type="text"
                    id="name"
                    value={userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="phone">Téléphone (optionnel)</Label>
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
                Détails d'emménagement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="moveInDate">Date d'emménagement souhaitée *</Label>
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
                  <Label htmlFor="leaseDuration">Durée du bail (mois) *</Label>
                  <select
                    id="leaseDuration"
                    required
                    value={formData.leaseDurationMonths}
                    onChange={(e) => setFormData({ ...formData, leaseDurationMonths: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={3}>3 mois</option>
                    <option value={6}>6 mois</option>
                    <option value={12}>12 mois</option>
                    <option value={24}>24 mois</option>
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
                Informations professionnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="occupation">Profession / Occupation</Label>
                <input
                  type="text"
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="Ex: Développeur, Étudiant, Manager..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employer">Nom de l'employeur</Label>
                  <input
                    type="text"
                    id="employer"
                    value={formData.employerName}
                    onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                    placeholder="Nom de l'entreprise"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <Label htmlFor="income">Revenu mensuel (€)</Label>
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
                Message personnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="message">Parlez-nous de vous (optionnel)</Label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Présentez-vous au propriétaire, expliquez pourquoi vous êtes intéressé par ce logement..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </CardContent>
          </Card>

          {/* Documents Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Documents (optionnel)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Ces documents aideront à accélérer le traitement de votre candidature
              </p>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="idDocument">Pièce d'identité</Label>
                  <input
                    type="file"
                    id="idDocument"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('idDocument', e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="proofOfIncome">Justificatif de revenus</Label>
                  <input
                    type="file"
                    id="proofOfIncome"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('proofOfIncome', e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="referenceLetter">Lettre de recommandation</Label>
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
          <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
            <div>
              <p className="text-sm text-gray-600">
                En soumettant cette candidature, vous acceptez d'être contacté par le propriétaire
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
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Envoyer ma candidature
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
