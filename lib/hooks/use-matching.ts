'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import {
  calculateMatchScore,
  getMatchQuality,
  type UserPreferences,
  type PropertyFeatures,
  type MatchResult,
} from '@/lib/services/matching-service';

export interface PropertyWithMatch {
  id: string;
  title: string;
  price: number;
  city: string;
  neighborhood?: string;
  address?: string;
  bedrooms: number;
  bathrooms: number;
  furnished: boolean;
  balcony?: boolean;
  parking?: boolean;
  available_from?: string;
  min_lease_duration_months?: number;
  max_lease_duration_months?: number;
  smoking_allowed?: boolean;
  pets_allowed?: boolean;
  images?: string[];
  description?: string;
  matchResult?: MatchResult;
  matchQuality?: ReturnType<typeof getMatchQuality>;
}

export function useMatching(userId?: string) {
  const supabase = createClient();
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [propertiesWithMatches, setPropertiesWithMatches] = useState<PropertyWithMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user preferences from user_profiles
  const loadUserPreferences = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('user_id, min_budget, max_budget, preferred_cities, preferred_neighborhoods, cleanliness_level, noise_tolerance, guest_frequency, smoking, pets, min_bedrooms, min_bathrooms, furnished_preference, wants_balcony, wants_parking, desired_move_in_date, desired_lease_duration_months, age_range_min, age_range_max')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      // Map profile data to UserPreferences
      // This assumes you have a preferences JSONB field or individual columns
      const prefs: UserPreferences = {
        min_budget: profile.min_budget,
        max_budget: profile.max_budget,
        preferred_cities: profile.preferred_cities,
        preferred_neighborhoods: profile.preferred_neighborhoods,
        cleanliness_level: profile.cleanliness_level,
        noise_tolerance: profile.noise_tolerance,
        guest_frequency: profile.guest_frequency,
        smoking: profile.smoking,
        pets: profile.pets,
        min_bedrooms: profile.min_bedrooms,
        min_bathrooms: profile.min_bathrooms,
        furnished: profile.furnished_preference,
        balcony: profile.wants_balcony,
        parking: profile.wants_parking,
        desired_move_in_date: profile.desired_move_in_date,
        desired_lease_duration_months: profile.desired_lease_duration_months,
        age_range_min: profile.age_range_min,
        age_range_max: profile.age_range_max,
      };

      setUserPreferences(prefs);
    } catch (error: any) {
      // FIXME: Use logger.error - Failed to load user preferences
      setUserPreferences(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId, supabase]);

  // Load properties and calculate matches
  const loadPropertiesWithMatches = useCallback(
    async (filters?: { city?: string; maxPrice?: number; minBedrooms?: number }) => {
      setIsLoading(true);

      try {
        let query = supabase
          .from('properties')
          .select('id, title, price, city, neighborhood, address, bedrooms, bathrooms, furnished, balcony, parking, available_from, min_lease_duration_months, max_lease_duration_months, smoking_allowed, pets_allowed, images, description, status, created_at')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        // Apply filters
        if (filters?.city) {
          query = query.eq('city', filters.city);
        }
        if (filters?.maxPrice) {
          query = query.lte('price', filters.maxPrice);
        }
        if (filters?.minBedrooms) {
          query = query.gte('bedrooms', filters.minBedrooms);
        }

        const { data: properties, error } = await query;

        if (error) throw error;

        // Calculate match scores for each property
        const propertiesWithScores: PropertyWithMatch[] = (properties || []).map((property) => {
          let matchResult: MatchResult | undefined;
          let matchQuality: ReturnType<typeof getMatchQuality> | undefined;

          if (userPreferences) {
            const propertyFeatures: PropertyFeatures = {
              price: property.price,
              city: property.city,
              neighborhood: property.neighborhood,
              address: property.address,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              furnished: property.furnished,
              balcony: property.balcony,
              parking: property.parking,
              available_from: property.available_from,
              min_lease_duration_months: property.min_lease_duration_months,
              max_lease_duration_months: property.max_lease_duration_months,
              smoking_allowed: property.smoking_allowed,
              pets_allowed: property.pets_allowed,
            };

            matchResult = calculateMatchScore(userPreferences, propertyFeatures);
            matchQuality = getMatchQuality(matchResult.score);
          }

          return {
            id: property.id,
            title: property.title,
            price: property.price,
            city: property.city,
            neighborhood: property.neighborhood,
            address: property.address,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            furnished: property.furnished,
            balcony: property.balcony,
            parking: property.parking,
            available_from: property.available_from,
            min_lease_duration_months: property.min_lease_duration_months,
            max_lease_duration_months: property.max_lease_duration_months,
            smoking_allowed: property.smoking_allowed,
            pets_allowed: property.pets_allowed,
            images: property.images,
            description: property.description,
            matchResult,
            matchQuality,
          };
        });

        // Sort by match score (highest first)
        propertiesWithScores.sort((a, b) => {
          if (!a.matchResult || !b.matchResult) return 0;
          return b.matchResult.score - a.matchResult.score;
        });

        setPropertiesWithMatches(propertiesWithScores);
      } catch (error: any) {
        // FIXME: Use logger.error - Failed to load properties with matches
        setPropertiesWithMatches([]);
      } finally {
        setIsLoading(false);
      }
    },
    [userPreferences, supabase]
  );

  // Calculate match for a single property
  const calculateMatch = useCallback(
    (property: PropertyFeatures): MatchResult | null => {
      if (!userPreferences) return null;
      return calculateMatchScore(userPreferences, property);
    },
    [userPreferences]
  );

  // Update user preferences
  const updateUserPreferences = useCallback(
    async (newPreferences: Partial<UserPreferences>): Promise<boolean> => {
      if (!userId) return false;

      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            min_budget: newPreferences.min_budget,
            max_budget: newPreferences.max_budget,
            preferred_cities: newPreferences.preferred_cities,
            preferred_neighborhoods: newPreferences.preferred_neighborhoods,
            cleanliness_level: newPreferences.cleanliness_level,
            noise_tolerance: newPreferences.noise_tolerance,
            guest_frequency: newPreferences.guest_frequency,
            smoking: newPreferences.smoking,
            pets: newPreferences.pets,
            min_bedrooms: newPreferences.min_bedrooms,
            min_bathrooms: newPreferences.min_bathrooms,
            furnished_preference: newPreferences.furnished,
            wants_balcony: newPreferences.balcony,
            wants_parking: newPreferences.parking,
            desired_move_in_date: newPreferences.desired_move_in_date,
            desired_lease_duration_months: newPreferences.desired_lease_duration_months,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        if (error) throw error;

        // Update local state
        setUserPreferences((prev) => ({
          ...prev,
          ...newPreferences,
        } as UserPreferences));

        // Recalculate matches
        await loadPropertiesWithMatches();

        return true;
      } catch (error: any) {
        // FIXME: Use logger.error - Failed to update user preferences
        return false;
      }
    },
    [userId, supabase, loadPropertiesWithMatches]
  );

  // Get top matches (above certain threshold)
  const getTopMatches = useCallback(
    (minScore: number = 70): PropertyWithMatch[] => {
      return propertiesWithMatches.filter(
        (p) => p.matchResult && p.matchResult.score >= minScore
      );
    },
    [propertiesWithMatches]
  );

  // Initial load
  useEffect(() => {
    if (userId) {
      loadUserPreferences();
    }
  }, [userId, loadUserPreferences]);

  return {
    userPreferences,
    propertiesWithMatches,
    isLoading,
    loadUserPreferences,
    loadPropertiesWithMatches,
    calculateMatch,
    updateUserPreferences,
    getTopMatches,
  };
}
