import { SupabaseClient } from '@supabase/supabase-js';
import {
  PropertyComparison,
  ComparisonWithProperties,
  CreateComparisonInput,
} from '@/types/comparison.types';
import { Property } from '@/types/property.types';

export class ComparisonService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Create a new property comparison
   */
  async createComparison(input: CreateComparisonInput): Promise<PropertyComparison> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    if (input.property_ids.length < 2 || input.property_ids.length > 3) {
      throw new Error('Comparison must include 2-3 properties');
    }

    const { data, error } = await this.supabase
      .from('property_comparisons')
      .insert({
        user_id: user.id,
        name: input.name,
        property_ids: input.property_ids,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get all comparisons for current user
   */
  async getUserComparisons(): Promise<PropertyComparison[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('property_comparisons')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Get a single comparison with full property details
   */
  async getComparisonWithProperties(comparisonId: string): Promise<ComparisonWithProperties> {
    const { data: comparison, error: compError } = await this.supabase
      .from('property_comparisons')
      .select('*')
      .eq('id', comparisonId)
      .single();

    if (compError) throw compError;

    // Fetch all properties
    const { data: properties, error: propError } = await this.supabase
      .from('properties')
      .select('*')
      .in('id', comparison.property_ids);

    if (propError) throw propError;

    // Sort properties in the same order as property_ids
    const sortedProperties = comparison.property_ids
      .map((id: string) => properties?.find((p: Property) => p.id === id))
      .filter((p: Property | undefined): p is Property => p !== undefined);

    return {
      ...comparison,
      properties: sortedProperties,
    };
  }

  /**
   * Get properties for comparison (without saving)
   */
  async getPropertiesForComparison(propertyIds: string[]): Promise<Property[]> {
    if (propertyIds.length < 2 || propertyIds.length > 3) {
      throw new Error('Comparison must include 2-3 properties');
    }

    const { data: properties, error } = await this.supabase
      .from('properties')
      .select('*')
      .in('id', propertyIds);

    if (error) throw error;

    // Sort properties in the same order as propertyIds
    const sortedProperties = propertyIds
      .map((id) => properties?.find((p: Property) => p.id === id))
      .filter((p: Property | undefined): p is Property => p !== undefined);

    return sortedProperties;
  }

  /**
   * Delete a comparison
   */
  async deleteComparison(comparisonId: string): Promise<void> {
    const { error } = await this.supabase
      .from('property_comparisons')
      .delete()
      .eq('id', comparisonId);

    if (error) throw error;
  }

  /**
   * Update comparison name
   */
  async updateComparisonName(comparisonId: string, name: string): Promise<void> {
    const { error } = await this.supabase
      .from('property_comparisons')
      .update({ name })
      .eq('id', comparisonId);

    if (error) throw error;
  }
}
