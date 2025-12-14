/**
 * usePropertyPermissions Hook
 *
 * Provides permission checking functionality based on user's role in a property
 * Supports: owner, main_resident, resident roles
 */

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/supabase-client';

export type PropertyRole = 'owner' | 'main_resident' | 'resident' | null;

export type Permission =
  | 'view_property'
  | 'edit_property'
  | 'delete_property'
  | 'manage_members'
  | 'view_invitation_codes'
  | 'view_owner_code'
  | 'manage_documents'
  | 'manage_finances'
  | 'manage_rules'
  | 'upload_documents';

interface PropertyMembership {
  role: PropertyRole;
  is_creator: boolean;
  property_id: string;
}

interface UsePropertyPermissionsReturn {
  role: PropertyRole;
  isCreator: boolean;
  isOwner: boolean;
  isMainResident: boolean;
  isStandardResident: boolean;
  hasPermission: (permission: Permission) => boolean;
  canEditProperty: boolean;
  canManageMembers: boolean;
  canViewOwnerCode: boolean;
  canManageFinances: boolean;
  loading: boolean;
}

/**
 * Permission matrix - defines what each role can do
 */
const PERMISSIONS: Record<PropertyRole, Permission[]> = {
  owner: [
    'view_property',
    'edit_property',
    'delete_property',
    'manage_members',
    'view_invitation_codes',
    'view_owner_code',
    'manage_documents',
    'manage_finances',
    'manage_rules',
  ],
  main_resident: [
    'view_property',
    'edit_property',
    'manage_members',
    'view_invitation_codes',
    'view_owner_code',
    'manage_documents',
    'manage_finances',
    'manage_rules',
  ],
  resident: [
    'view_property',
    'view_invitation_codes',
    'manage_finances',
    'manage_rules',
    'upload_documents',
  ],
  null: [],
};

export function usePropertyPermissions(propertyId?: string): UsePropertyPermissionsReturn {
  const [membership, setMembership] = useState<PropertyMembership | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    loadMembership();
  }, [propertyId]);

  const loadMembership = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !propertyId) {
        setMembership(null);
        setLoading(false);
        return;
      }

      // Get user's membership in this property
      const { data, error } = await supabase
        .from('property_members')
        .select('role, is_creator, property_id')
        .eq('property_id', propertyId)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error || !data) {
        setMembership(null);
      } else {
        setMembership({
          role: data.role as PropertyRole,
          is_creator: data.is_creator || false,
          property_id: data.property_id,
        });
      }
    } catch (error) {
      console.error('Error loading property membership:', error);
      setMembership(null);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!membership || !membership.role) return false;
    return PERMISSIONS[membership.role]?.includes(permission) || false;
  };

  return {
    role: membership?.role || null,
    isCreator: membership?.is_creator || false,
    isOwner: membership?.role === 'owner',
    isMainResident: membership?.role === 'main_resident',
    isStandardResident: membership?.role === 'resident',
    hasPermission,
    canEditProperty: hasPermission('edit_property'),
    canManageMembers: hasPermission('manage_members'),
    canViewOwnerCode: hasPermission('view_owner_code'),
    canManageFinances: hasPermission('manage_finances'),
    loading,
  };
}

/**
 * Hook to get current user's property ID from their membership
 */
export function useCurrentProperty() {
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadCurrentProperty();
  }, []);

  const loadCurrentProperty = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPropertyId(null);
        setLoading(false);
        return;
      }

      // Try sessionStorage first (fastest)
      const cachedProperty = sessionStorage.getItem('currentProperty');
      if (cachedProperty) {
        try {
          const parsed = JSON.parse(cachedProperty);
          setPropertyId(parsed.id);
          setLoading(false);
          return;
        } catch (e) {
          console.error('Error parsing cached property', e);
        }
      }

      // Query from database
      const { data: membershipData } = await supabase
        .rpc('get_user_property_membership', { p_user_id: user.id });

      if (membershipData?.property_id) {
        setPropertyId(membershipData.property_id);

        // Cache it
        sessionStorage.setItem('currentProperty', JSON.stringify({
          id: membershipData.property_id,
        }));
      } else {
        setPropertyId(null);
      }
    } catch (error) {
      console.error('Error loading current property:', error);
      setPropertyId(null);
    } finally {
      setLoading(false);
    }
  };

  return { propertyId, loading, refresh: loadCurrentProperty };
}
