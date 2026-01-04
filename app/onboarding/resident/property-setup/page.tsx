'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Home,
  Plus,
  LogIn,
  MapPin,
  Hash,
  ArrowRight,
  Building2,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MainResidentWelcome from '@/components/onboarding/MainResidentWelcome';
import ResidentWelcome from '@/components/onboarding/ResidentWelcome';

type SetupMode = 'choice' | 'create' | 'join';

interface PropertyCreatedData {
  id: string;
  title: string;
  city: string;
  invitation_code: string;
  owner_code: string;
}

export default function ResidentPropertySetupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<SetupMode>('choice');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Welcome modals
  const [showMainResidentWelcome, setShowMainResidentWelcome] = useState(false);
  const [showResidentWelcome, setShowResidentWelcome] = useState(false);
  const [propertyCreatedData, setPropertyCreatedData] = useState<PropertyCreatedData | null>(null);

  // Form state for creating a property
  const [createForm, setCreateForm] = useState({
    name: '',
    address: '',
    city: '',
    postal_code: '',
    total_rooms: 2,
  });

  // Form state for joining a property
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setCurrentUserId(user.id);

      // Check if user already has a property membership - DIRECT QUERY (RLS disabled)
      const { data: membership, error } = await supabase
        .from('property_members')
        .select('property_id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (!error && membership?.property_id) {
        // User already has a property, skip to hub
        router.push('/hub');
        return;
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsLoading(false);
    }
  };

  const createProperty = async () => {
    if (!currentUserId) return;
    if (!createForm.name || !createForm.address || !createForm.city) {
      toast.error(t('residentOnboarding.propertySetup.errors.requiredFields'));
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate invitation codes using DB functions
      const { data: invitationCode } = await supabase
        .rpc('generate_invitation_code');

      const { data: ownerCode } = await supabase
        .rpc('generate_owner_code');

      // Create property + membership using SECURITY DEFINER function (bypasses RLS)
      const { data: result, error: createError } = await supabase
        .rpc('create_resident_property', {
          p_user_id: currentUserId,
          p_title: createForm.name,
          p_address: createForm.address,
          p_city: createForm.city,
          p_postal_code: createForm.postal_code,
          p_country: 'France',
          p_property_type: 'coliving',
          p_bedrooms: createForm.total_rooms,
          p_bathrooms: 1,
          p_total_rooms: createForm.total_rooms,
          p_monthly_rent: 0,
          p_available_from: new Date().toISOString().split('T')[0],
          p_is_available: false,
          p_status: 'draft',
          p_invitation_code: invitationCode,
          p_owner_code: ownerCode,
        });

      if (createError) {
        console.error('Error creating property:', createError);
        throw createError;
      }

      console.log('✅ Property + Membership created:', result);

      // Extract property and membership from result
      const property = result.property;
      const membershipData = result.membership;

      // Store property info + codes in sessionStorage
      sessionStorage.setItem('currentProperty', JSON.stringify({
        id: property.id,
        title: property.title,
        city: property.city,
        address: property.address,
        invitation_code: property.invitation_code,
        owner_code: property.owner_code,
        is_creator: true, // User created this property
      }));

      // Set flag to prevent redirect loop (expires in 5 seconds)
      sessionStorage.setItem('justCreatedProperty', Date.now().toString());

      toast.success(t('residentOnboarding.propertySetup.success.created'));

      // Store created property data for welcome modal
      setPropertyCreatedData({
        id: property.id,
        title: property.title,
        city: property.city,
        invitation_code: property.invitation_code,
        owner_code: property.owner_code,
      });

      // Show Main Resident welcome modal
      setShowMainResidentWelcome(true);
    } catch (error: any) {
      console.error('❌ Error creating property:', error);
      toast.error(`${t('residentOnboarding.propertySetup.errors.error')}: ${error.message || t('residentOnboarding.propertySetup.errors.unknown')}`);
      setIsSubmitting(false);
    }
  };

  const joinProperty = async () => {
    if (!currentUserId) return;
    if (!joinCode.trim()) {
      toast.error(t('residentOnboarding.propertySetup.errors.invitationCodeRequired'));
      return;
    }

    setIsSubmitting(true);
    try {
      // Search for property by invitation_code (not by ID anymore)
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('id, title, city, address, invitation_code')
        .eq('invitation_code', joinCode.trim().toUpperCase())
        .single();

      if (propertyError || !property) {
        toast.error(t('residentOnboarding.propertySetup.errors.invalidCode'));
        setIsSubmitting(false);
        return;
      }

      // Create property membership - DIRECT INSERT (RLS is disabled)
      // This is NOT the creator, just a regular resident joining
      const { data: membershipData, error: memberError } = await supabase
        .from('property_members')
        .insert({
          property_id: property.id,
          user_id: currentUserId,
          role: 'resident',
          status: 'active',
          is_creator: false, // Not the creator
        })
        .select()
        .single();

      if (memberError) {
        console.error('❌ Error creating membership:', memberError);
        throw memberError;
      }

      console.log('✅ Membership created:', membershipData);

      // Store property info in sessionStorage
      sessionStorage.setItem('currentProperty', JSON.stringify({
        id: property.id,
        title: property.title || 'Ma Colocation',
        city: property.city || '',
        address: property.address || '',
        invitation_code: property.invitation_code,
        is_creator: false, // Not the creator
      }));

      toast.success(t('residentOnboarding.propertySetup.success.joined'));

      // Store property data for welcome modal
      setPropertyCreatedData({
        id: property.id,
        title: property.title || 'Ma Colocation',
        city: property.city || '',
        invitation_code: property.invitation_code || '',
        owner_code: '', // Standard residents don't see owner code in join flow
      });

      // Show Resident welcome modal
      setShowResidentWelcome(true);
    } catch (error: any) {
      console.error('❌ Error joining property:', error);
      toast.error(`${t('residentOnboarding.propertySetup.errors.error')}: ${error.message || t('residentOnboarding.propertySetup.errors.unknown')}`);
      setIsSubmitting(false);
    }
  };

  const skipForNow = () => {
    // Redirect to hub - they'll be prompted to setup property there
    router.push('/hub');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 flex items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 superellipse-3xl mx-auto mb-4 flex items-center justify-center"
               style={{
                 background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)'
               }}>
            <Home className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('residentOnboarding.propertySetup.title')}
          </h1>
          <p className="text-gray-600 mb-4">
            {t('residentOnboarding.propertySetup.description')}
          </p>
          <button
            onClick={skipForNow}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            {t('residentOnboarding.propertySetup.skipForNow')}
          </button>
        </motion.div>

        {/* Choice Mode */}
        {mode === 'choice' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Create Property Card */}
            <Card
              onClick={() => setMode('create')}
              className="p-8 cursor-pointer hover:shadow-xl transition-all border-2 border-transparent hover:border-orange-300 bg-white"
            >
              <div className="text-center">
                <div className="w-16 h-16 superellipse-2xl mx-auto mb-4 flex items-center justify-center"
                     style={{
                       background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)'
                     }}>
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('residentOnboarding.propertySetup.choice.create.title')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('residentOnboarding.propertySetup.choice.create.description')}
                </p>
                <Button className="w-full superellipse-xl bg-gradient-to-r from-[#e05747] via-[#ff651e] to-[#ff9014]">
                  {t('residentOnboarding.propertySetup.choice.create.button')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>

            {/* Join Property Card */}
            <Card
              onClick={() => setMode('join')}
              className="p-8 cursor-pointer hover:shadow-xl transition-all border-2 border-transparent hover:border-orange-300 bg-white"
            >
              <div className="text-center">
                <div className="w-16 h-16 superellipse-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('residentOnboarding.propertySetup.choice.join.title')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('residentOnboarding.propertySetup.choice.join.description')}
                </p>
                <Button className="w-full superellipse-xl bg-gradient-to-r from-blue-500 to-indigo-600">
                  {t('residentOnboarding.propertySetup.choice.join.button')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Create Mode */}
        {mode === 'create' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-8 bg-white">
              <Button
                variant="ghost"
                onClick={() => setMode('choice')}
                className="mb-6"
              >
                ← {t('common.back')}
              </Button>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('residentOnboarding.propertySetup.createForm.title')}
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('residentOnboarding.propertySetup.createForm.name')} *</Label>
                  <Input
                    id="name"
                    placeholder={t('residentOnboarding.propertySetup.createForm.namePlaceholder')}
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="superellipse-xl mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="address">{t('residentOnboarding.propertySetup.createForm.address')} *</Label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="address"
                      placeholder={t('residentOnboarding.propertySetup.createForm.addressPlaceholder')}
                      value={createForm.address}
                      onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                      className="superellipse-xl pl-10"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">{t('residentOnboarding.propertySetup.createForm.city')} *</Label>
                    <Input
                      id="city"
                      placeholder={t('residentOnboarding.propertySetup.createForm.cityPlaceholder')}
                      value={createForm.city}
                      onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                      className="superellipse-xl mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="postal_code">{t('residentOnboarding.propertySetup.createForm.postalCode')}</Label>
                    <Input
                      id="postal_code"
                      placeholder={t('residentOnboarding.propertySetup.createForm.postalCodePlaceholder')}
                      value={createForm.postal_code}
                      onChange={(e) => setCreateForm({ ...createForm, postal_code: e.target.value })}
                      className="superellipse-xl mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="total_rooms">{t('residentOnboarding.propertySetup.createForm.totalRooms')}</Label>
                  <div className="relative mt-2">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="total_rooms"
                      type="number"
                      min="1"
                      max="20"
                      value={createForm.total_rooms}
                      onChange={(e) => setCreateForm({ ...createForm, total_rooms: parseInt(e.target.value) || 2 })}
                      className="superellipse-xl pl-10"
                    />
                  </div>
                </div>

                <Button
                  onClick={createProperty}
                  disabled={isSubmitting}
                  className="w-full superellipse-xl bg-gradient-to-r from-[#e05747] via-[#ff651e] to-[#ff9014] hover:shadow-lg transition-shadow mt-6"
                >
                  {isSubmitting ? t('residentOnboarding.propertySetup.createForm.creating') : t('residentOnboarding.propertySetup.createForm.submit')}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Join Mode */}
        {mode === 'join' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-8 bg-white">
              <Button
                variant="ghost"
                onClick={() => setMode('choice')}
                className="mb-6"
              >
                ← {t('common.back')}
              </Button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 superellipse-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('residentOnboarding.propertySetup.joinForm.title')}
                </h2>
                <p className="text-gray-600">
                  {t('residentOnboarding.propertySetup.joinForm.description')}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="joinCode">{t('residentOnboarding.propertySetup.joinForm.codeLabel')}</Label>
                  <Input
                    id="joinCode"
                    placeholder={t('residentOnboarding.propertySetup.joinForm.codePlaceholder')}
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="superellipse-xl mt-2 text-center text-lg font-mono"
                  />
                </div>

                <Button
                  onClick={joinProperty}
                  disabled={isSubmitting}
                  className="w-full superellipse-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg transition-shadow"
                >
                  {isSubmitting ? t('residentOnboarding.propertySetup.joinForm.connecting') : t('residentOnboarding.propertySetup.joinForm.submit')}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Welcome Modals */}
      {showMainResidentWelcome && propertyCreatedData && (
        <MainResidentWelcome
          propertyData={propertyCreatedData}
          onClose={() => {
            setShowMainResidentWelcome(false);
            router.push('/hub');
          }}
        />
      )}

      {showResidentWelcome && propertyCreatedData && (
        <ResidentWelcome
          propertyData={propertyCreatedData}
          onClose={() => {
            setShowResidentWelcome(false);
            router.push('/hub');
          }}
        />
      )}
    </div>
  );
}
