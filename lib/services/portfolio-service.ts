/**
 * Portfolio Service
 * Aggregates portfolio data for the Owner Portfolio Hub
 * Combines: Properties, Applications, Performance data
 */

import { createClient } from '@/lib/auth/supabase-client';
import { differenceInDays } from 'date-fns';

// Types
export interface PropertyStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  rented: number;
  vacant: number;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  reviewing: number;
  approved: number;
  rejected: number;
  individual: number;
  group: number;
}

export interface PerformanceStats {
  totalMonthlyRent: number;
  occupancyRate: number;
  avgRentPerProperty: number;
  totalViews: number;
  totalInquiries: number;
}

export interface PortfolioOverview {
  properties: PropertyStats;
  applications: ApplicationStats;
  performance: PerformanceStats;
  lastUpdated: string;
}

export type PortfolioActionType = 'application_pending' | 'property_draft' | 'property_vacant' | 'application_new';

export interface PortfolioAction {
  id: string;
  type: PortfolioActionType;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  href: string;
  count?: number;
  createdAt: string;
}

export interface PropertyPreview {
  id: string;
  title: string;
  city: string;
  status: 'published' | 'draft' | 'archived';
  monthlyRent: number;
  bedrooms: number;
  mainImage?: string;
  views: number;
  inquiries: number;
  daysVacant?: number;
  isRented: boolean;
}

class PortfolioService {
  private supabase = createClient();

  /**
   * Get comprehensive overview for Portfolio Hub
   */
  async getPortfolioOverview(userId: string): Promise<PortfolioOverview> {
    try {
      // Fetch properties for this owner
      const { data: properties } = await this.supabase
        .from('properties')
        .select('id, title, status, monthly_rent, views_count, inquiries_count')
        .eq('owner_id', userId);

      if (!properties || properties.length === 0) {
        return this.getEmptyOverview();
      }

      const propertyIds = properties.map(p => p.id);

      // Fetch all data in parallel
      const [propertyStats, applicationStats, performanceStats] = await Promise.all([
        this.getPropertyStats(properties),
        this.getApplicationStats(propertyIds),
        this.getPerformanceStats(properties, propertyIds),
      ]);

      return {
        properties: propertyStats,
        applications: applicationStats,
        performance: performanceStats,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('[Portfolio] ❌ Failed to fetch overview:', error);
      return this.getEmptyOverview();
    }
  }

  /**
   * Get property statistics
   */
  private async getPropertyStats(properties: any[]): Promise<PropertyStats> {
    const published = properties.filter(p => p.status === 'published').length;
    const draft = properties.filter(p => p.status === 'draft').length;
    const archived = properties.filter(p => p.status === 'archived').length;

    // Get rented properties (those with active residents)
    const propertyIds = properties.map(p => p.id);
    const { data: residents } = await this.supabase
      .from('property_residents')
      .select('property_id')
      .in('property_id', propertyIds)
      .eq('is_active', true);

    const rentedPropertyIds = new Set(residents?.map(r => r.property_id) || []);
    const rented = rentedPropertyIds.size;
    const vacant = published - rented;

    return {
      total: properties.length,
      published,
      draft,
      archived,
      rented,
      vacant: Math.max(0, vacant),
    };
  }

  /**
   * Get application statistics
   */
  private async getApplicationStats(propertyIds: string[]): Promise<ApplicationStats> {
    try {
      // Individual applications
      const { data: applications } = await this.supabase
        .from('applications')
        .select('id, status')
        .in('property_id', propertyIds);

      // Group applications
      const { data: groupApplications } = await this.supabase
        .from('group_applications')
        .select('id, status')
        .in('property_id', propertyIds);

      const individual = applications?.length || 0;
      const group = groupApplications?.length || 0;
      const total = individual + group;

      const allApps = [...(applications || []), ...(groupApplications || [])];

      const pending = allApps.filter(a => a.status === 'pending').length;
      const reviewing = allApps.filter(a => a.status === 'reviewing').length;
      const approved = allApps.filter(a => a.status === 'approved').length;
      const rejected = allApps.filter(a => a.status === 'rejected').length;

      return {
        total,
        pending,
        reviewing,
        approved,
        rejected,
        individual,
        group,
      };
    } catch (error) {
      console.error('[Portfolio] ❌ Failed to fetch application stats:', error);
      return { total: 0, pending: 0, reviewing: 0, approved: 0, rejected: 0, individual: 0, group: 0 };
    }
  }

  /**
   * Get performance statistics
   */
  private async getPerformanceStats(properties: any[], propertyIds: string[]): Promise<PerformanceStats> {
    const publishedProperties = properties.filter(p => p.status === 'published');
    const totalMonthlyRent = publishedProperties.reduce((sum, p) => sum + (p.monthly_rent || 0), 0);
    const avgRentPerProperty = publishedProperties.length > 0
      ? Math.round(totalMonthlyRent / publishedProperties.length)
      : 0;

    const totalViews = properties.reduce((sum, p) => sum + (p.views_count || 0), 0);
    const totalInquiries = properties.reduce((sum, p) => sum + (p.inquiries_count || 0), 0);

    // Calculate occupancy rate
    const { data: residents } = await this.supabase
      .from('property_residents')
      .select('property_id')
      .in('property_id', propertyIds)
      .eq('is_active', true);

    const rentedCount = new Set(residents?.map(r => r.property_id) || []).size;
    const occupancyRate = publishedProperties.length > 0
      ? Math.round((rentedCount / publishedProperties.length) * 100)
      : 0;

    return {
      totalMonthlyRent,
      occupancyRate,
      avgRentPerProperty,
      totalViews,
      totalInquiries,
    };
  }

  /**
   * Get actions requiring attention
   */
  async getPortfolioActions(userId: string): Promise<PortfolioAction[]> {
    try {
      const actions: PortfolioAction[] = [];

      // Fetch properties
      const { data: properties } = await this.supabase
        .from('properties')
        .select('id, title, status, created_at')
        .eq('owner_id', userId);

      if (!properties) return [];

      const propertyIds = properties.map(p => p.id);

      // 1. Pending applications
      const { data: pendingApps } = await this.supabase
        .from('applications')
        .select('id')
        .in('property_id', propertyIds)
        .eq('status', 'pending');

      const { data: pendingGroupApps } = await this.supabase
        .from('group_applications')
        .select('id')
        .in('property_id', propertyIds)
        .eq('status', 'pending');

      const totalPending = (pendingApps?.length || 0) + (pendingGroupApps?.length || 0);

      if (totalPending > 0) {
        actions.push({
          id: 'pending-applications',
          type: 'application_pending',
          severity: totalPending >= 5 ? 'critical' : 'warning',
          title: `${totalPending} candidature${totalPending > 1 ? 's' : ''} en attente`,
          description: 'Des candidats attendent votre réponse',
          href: '/dashboard/owner/applications',
          count: totalPending,
          createdAt: new Date().toISOString(),
        });
      }

      // 2. Draft properties
      const draftProperties = properties.filter(p => p.status === 'draft');
      if (draftProperties.length > 0) {
        actions.push({
          id: 'draft-properties',
          type: 'property_draft',
          severity: 'info',
          title: `${draftProperties.length} bien${draftProperties.length > 1 ? 's' : ''} en brouillon`,
          description: 'Publiez vos biens pour recevoir des candidatures',
          href: '/dashboard/owner/properties',
          count: draftProperties.length,
          createdAt: new Date().toISOString(),
        });
      }

      // 3. Vacant properties (published but no tenant for > 30 days)
      const publishedIds = properties.filter(p => p.status === 'published').map(p => p.id);

      if (publishedIds.length > 0) {
        const { data: residents } = await this.supabase
          .from('property_residents')
          .select('property_id')
          .in('property_id', publishedIds)
          .eq('is_active', true);

        const rentedIds = new Set(residents?.map(r => r.property_id) || []);
        const vacantProperties = properties.filter(
          p => p.status === 'published' && !rentedIds.has(p.id)
        );

        // Check how long they've been vacant (simplified: use created_at as proxy)
        const longVacant = vacantProperties.filter(p => {
          const daysSinceCreated = differenceInDays(new Date(), new Date(p.created_at));
          return daysSinceCreated > 30;
        });

        if (longVacant.length > 0) {
          actions.push({
            id: 'vacant-properties',
            type: 'property_vacant',
            severity: longVacant.length >= 2 ? 'warning' : 'info',
            title: `${longVacant.length} bien${longVacant.length > 1 ? 's' : ''} vacant${longVacant.length > 1 ? 's' : ''} depuis 30j+`,
            description: 'Pensez à ajuster le prix ou les annonces',
            href: '/dashboard/owner/properties',
            count: longVacant.length,
            createdAt: new Date().toISOString(),
          });
        }
      }

      // 4. New applications in last 24h
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data: newApps } = await this.supabase
        .from('applications')
        .select('id')
        .in('property_id', propertyIds)
        .gte('created_at', yesterday.toISOString());

      const { data: newGroupApps } = await this.supabase
        .from('group_applications')
        .select('id')
        .in('property_id', propertyIds)
        .gte('created_at', yesterday.toISOString());

      const totalNew = (newApps?.length || 0) + (newGroupApps?.length || 0);

      if (totalNew > 0) {
        actions.push({
          id: 'new-applications',
          type: 'application_new',
          severity: 'info',
          title: `${totalNew} nouvelle${totalNew > 1 ? 's' : ''} candidature${totalNew > 1 ? 's' : ''}`,
          description: 'Reçues dans les dernières 24h',
          href: '/dashboard/owner/applications',
          count: totalNew,
          createdAt: new Date().toISOString(),
        });
      }

      // Sort by severity
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return actions.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    } catch (error) {
      console.error('[Portfolio] ❌ Failed to fetch actions:', error);
      return [];
    }
  }

  /**
   * Get recent properties preview
   */
  async getRecentProperties(userId: string, limit: number = 3): Promise<PropertyPreview[]> {
    try {
      const { data: properties } = await this.supabase
        .from('properties')
        .select('id, title, city, status, monthly_rent, bedrooms, images, views_count, inquiries_count, created_at')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!properties) return [];

      // Get rented status
      const propertyIds = properties.map(p => p.id);
      const { data: residents } = await this.supabase
        .from('property_residents')
        .select('property_id, move_in_date')
        .in('property_id', propertyIds)
        .eq('is_active', true);

      const rentedMap = new Map(residents?.map(r => [r.property_id, r.move_in_date]) || []);

      return properties.map(p => {
        const isRented = rentedMap.has(p.id);
        const daysVacant = !isRented && p.status === 'published'
          ? differenceInDays(new Date(), new Date(p.created_at))
          : undefined;

        return {
          id: p.id,
          title: p.title,
          city: p.city,
          status: p.status,
          monthlyRent: p.monthly_rent || 0,
          bedrooms: p.bedrooms || 0,
          mainImage: p.images?.[0] || undefined,
          views: p.views_count || 0,
          inquiries: p.inquiries_count || 0,
          isRented,
          daysVacant,
        };
      });
    } catch (error) {
      console.error('[Portfolio] ❌ Failed to fetch recent properties:', error);
      return [];
    }
  }

  private getEmptyOverview(): PortfolioOverview {
    return {
      properties: { total: 0, published: 0, draft: 0, archived: 0, rented: 0, vacant: 0 },
      applications: { total: 0, pending: 0, reviewing: 0, approved: 0, rejected: 0, individual: 0, group: 0 },
      performance: { totalMonthlyRent: 0, occupancyRate: 0, avgRentPerProperty: 0, totalViews: 0, totalInquiries: 0 },
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const portfolioService = new PortfolioService();
