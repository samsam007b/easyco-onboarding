'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Home, Users, MapPin, Sparkles, Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PropertyInfo {
  id: string;
  title: string;
  city: string;
  address: string;
  memberCount: number;
  hasPhoto: boolean;
}

interface CompletionData {
  percentage: number;
  nextSteps: string[];
}

export default function ResidenceHeader() {
  const router = useRouter();
  const supabase = createClient();
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);
  const [completion, setCompletion] = useState<CompletionData>({ percentage: 0, nextSteps: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPropertyInfo();
  }, []);

  const loadPropertyInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Try to get from sessionStorage first (faster, avoids RLS issues)
      const cachedProperty = sessionStorage.getItem('currentProperty');
      let propertyId: string | null = null;
      let propertyData: any = null;

      if (cachedProperty) {
        try {
          propertyData = JSON.parse(cachedProperty);
          propertyId = propertyData.id;
          console.log('✅ Using cached property from sessionStorage');
        } catch (e) {
          console.error('Error parsing cached property:', e);
        }
      }

      // If not in cache, query from database using SECURITY DEFINER function
      if (!propertyId) {
        const { data: membershipData, error: memberError } = await supabase
          .rpc('get_user_property_membership', { p_user_id: user.id });

        if (memberError || !membershipData?.property_id) {
          console.log('❌ No property membership found, redirecting to setup...');
          router.push('/hub/setup-property');
          return;
        }

        propertyId = membershipData.property_id;

        // Fetch property details
        const { data: property } = await supabase
          .from('properties')
          .select('id, title, city, address, images')
          .eq('id', propertyId)
          .single();

        if (!property) return;
        propertyData = property;

        // Cache it for next time
        sessionStorage.setItem('currentProperty', JSON.stringify({
          id: property.id,
          title: property.title,
          city: property.city,
          address: property.address
        }));
      }

      // If we only have cached data, fetch full property details
      if (!propertyData.images) {
        const { data: property } = await supabase
          .from('properties')
          .select('id, title, city, address, images')
          .eq('id', propertyId)
          .single();

        if (property) {
          propertyData = property;
        }
      }

      // Count members using SECURITY DEFINER function
      const { data: memberCount } = await supabase
        .rpc('count_property_members', { p_property_id: propertyId });

      // Check if property has photo
      const hasPhoto = propertyData.images && propertyData.images.length > 0;

      setPropertyInfo({
        id: propertyData.id,
        title: propertyData.title,
        city: propertyData.city,
        address: propertyData.address,
        memberCount: memberCount || 1,
        hasPhoto,
      });

      // Calculate completion
      await calculateCompletion(propertyData.id, memberCount || 1, hasPhoto);

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading property info:', error);
      setIsLoading(false);
    }
  };

  const calculateCompletion = async (propertyId: string, memberCount: number, hasPhoto: boolean) => {
    let percentage = 20; // Base: residence created
    const nextSteps: string[] = [];

    // Check member count (20%)
    if (memberCount >= 2) {
      percentage += 20;
    } else {
      nextSteps.push('Inviter des colocataires');
    }

    // Check if photo added (15%)
    if (hasPhoto) {
      percentage += 15;
    } else {
      nextSteps.push('Ajouter une photo de la résidence');
    }

    // Check expenses (30% total)
    const { count: expenseCount } = await supabase
      .from('expenses')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId);

    if (expenseCount && expenseCount >= 1) {
      percentage += 15; // First expense
      if (expenseCount >= 3) {
        percentage += 15; // 3+ expenses
      } else {
        nextSteps.push(`Ajouter ${3 - expenseCount} dépenses de plus`);
      }
    } else {
      nextSteps.push('Créer votre première dépense');
    }

    // Check tasks (15%)
    const { count: taskCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId);

    if (taskCount && taskCount >= 1) {
      percentage += 15;
    } else {
      nextSteps.push('Configurer des tâches');
    }

    setCompletion({ percentage, nextSteps });
  };

  if (isLoading || !propertyInfo) {
    return (
      <div className="bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] p-4 rounded-2xl mb-6 animate-pulse">
        <div className="h-16 bg-white/20 rounded-xl"></div>
      </div>
    );
  }

  const isComplete = completion.percentage >= 100;

  return (
    <Card className="bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] p-6 rounded-2xl mb-6 border-none shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Property Info */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
            <Home className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white mb-1 truncate">
              {propertyInfo.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{propertyInfo.city}</span>
              </div>

              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{propertyInfo.memberCount} {propertyInfo.memberCount > 1 ? 'colocataires' : 'colocataire'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={() => router.push('/hub/finances')}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-1" />
            Dépense
          </Button>

          <Button
            onClick={() => router.push('/hub/invite')}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur"
            variant="outline"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Inviter
          </Button>
        </div>
      </div>

      {/* Progress Section */}
      {!isComplete && completion.nextSteps.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm">
                Complétez votre résidence
              </span>
            </div>
            <span className="text-white font-bold text-sm">
              {completion.percentage}%
            </span>
          </div>

          <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/20 mb-3">
            <div
              className="h-full transition-all"
              style={{
                width: `${completion.percentage}%`,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {completion.nextSteps.slice(0, 3).map((step, index) => (
              <span
                key={index}
                className="text-xs bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full"
              >
                {step}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Celebration for completion */}
      {isComplete && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-medium">
              🎉 Félicitations ! Votre résidence est complète !
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
