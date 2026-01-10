'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PropertyCodesCard from '@/components/settings/PropertyCodesCard';
import { useLanguage } from '@/lib/i18n/use-language';

interface PropertyCodes {
  property_id: string;
  property_title: string;
  invitation_code: string;
  owner_code: string | null;
  is_creator: boolean;
}

export default function PrivateCodesPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('settings')?.privateCodes;
  const [isLoading, setIsLoading] = useState(true);
  const [codes, setCodes] = useState<PropertyCodes | null>(null);

  useEffect(() => {
    loadCodes();
  }, []);

  const loadCodes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get user's property membership
      const { data: membership, error: memberError } = await supabase
        .from('property_members')
        .select('property_id, is_creator')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (memberError || !membership) {
        console.error('No property membership found');
        setIsLoading(false);
        return;
      }

      // Get property with codes
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('id, title, invitation_code, owner_code')
        .eq('id', membership.property_id)
        .single();

      if (propertyError || !property) {
        console.error('Property not found');
        setIsLoading(false);
        return;
      }

      setCodes({
        property_id: property.id,
        property_title: property.title,
        invitation_code: property.invitation_code,
        owner_code: property.owner_code,
        is_creator: membership.is_creator,
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading codes:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-resident-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (!codes) {
    return (
      <div className="min-h-screen bg-resident-50/30 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center">
          <div className="w-16 h-16 superellipse-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t?.noResidence?.title?.[language] || 'No residence found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {t?.noResidence?.description?.[language] || 'You must first create or join a residence to access the codes.'}
          </p>
          <Button
            onClick={() => router.push('/onboarding/resident/property-setup')}
            className="superellipse-xl bg-resident-500"
          >
            {t?.noResidence?.button?.[language] || 'Set up my residence'}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-resident-50/30">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/settings')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t?.back?.[language] || 'Back to settings'}
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 superellipse-3xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t?.title?.[language] || 'Private Codes'}</h1>
          <p className="text-gray-600 text-lg">
            {t?.subtitle?.[language] || 'Invitation codes for'} {codes.property_title}
          </p>
        </motion.div>

        {/* Codes Cards - Using shared component */}
        <PropertyCodesCard
          invitationCode={codes.invitation_code}
          ownerCode={codes.owner_code}
          isCreator={codes.is_creator}
          propertyTitle={codes.property_title}
          variant="default"
          showCreatorBadge={true}
        />
      </div>
    </div>
  );
}
