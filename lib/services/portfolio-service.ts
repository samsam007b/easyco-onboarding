/**
 * Portfolio Service
 * Aggregates portfolio data for the Owner Portfolio Hub
 * Combines: Properties, Applications, Performance data
 */

import { createClient } from '@/lib/auth/supabase-client';
import { differenceInDays } from 'date-fns';

// ============================================================================
// i18n TRANSLATIONS
// ============================================================================
type Language = 'fr' | 'en' | 'nl' | 'de';

let currentLang: Language = 'fr';

export function setPortfolioServiceLanguage(lang: Language) {
  currentLang = lang;
}

const translations = {
  actions: {
    pendingApplications: {
      title: {
        fr: (count: number) => `${count} candidature${count > 1 ? 's' : ''} en attente`,
        en: (count: number) => `${count} pending application${count > 1 ? 's' : ''}`,
        nl: (count: number) => `${count} wachtende aanvra${count > 1 ? 'gen' : 'ag'}`,
        de: (count: number) => `${count} ausstehende Bewerbung${count > 1 ? 'en' : ''}`,
      },
      description: {
        fr: 'Des candidats attendent votre réponse',
        en: 'Applicants are waiting for your response',
        nl: 'Aanvragers wachten op uw antwoord',
        de: 'Bewerber warten auf Ihre Antwort',
      },
    },
    draftProperties: {
      title: {
        fr: (count: number) => `${count} bien${count > 1 ? 's' : ''} en brouillon`,
        en: (count: number) => `${count} draft propert${count > 1 ? 'ies' : 'y'}`,
        nl: (count: number) => `${count} conceptwoning${count > 1 ? 'en' : ''}`,
        de: (count: number) => `${count} Entwurfsimmobilie${count > 1 ? 'n' : ''}`,
      },
      description: {
        fr: 'Publiez vos biens pour recevoir des candidatures',
        en: 'Publish your properties to receive applications',
        nl: 'Publiceer uw woningen om aanvragen te ontvangen',
        de: 'Veröffentlichen Sie Ihre Immobilien, um Bewerbungen zu erhalten',
      },
    },
    vacantProperties: {
      title: {
        fr: (count: number) => `${count} bien${count > 1 ? 's' : ''} vacant${count > 1 ? 's' : ''} depuis 30j+`,
        en: (count: number) => `${count} propert${count > 1 ? 'ies' : 'y'} vacant for 30d+`,
        nl: (count: number) => `${count} woning${count > 1 ? 'en' : ''} leeg voor 30d+`,
        de: (count: number) => `${count} Immobilie${count > 1 ? 'n' : ''} seit 30+ Tagen leer`,
      },
      description: {
        fr: 'Pensez à ajuster le prix ou les annonces',
        en: 'Consider adjusting price or listings',
        nl: 'Overweeg prijs of advertenties aan te passen',
        de: 'Preis oder Anzeigen anpassen',
      },
    },
    newApplications: {
      title: {
        fr: (count: number) => `${count} nouvelle${count > 1 ? 's' : ''} candidature${count > 1 ? 's' : ''}`,
        en: (count: number) => `${count} new application${count > 1 ? 's' : ''}`,
        nl: (count: number) => `${count} nieuwe aanvra${count > 1 ? 'gen' : 'ag'}`,
        de: (count: number) => `${count} neue Bewerbung${count > 1 ? 'en' : ''}`,
      },
      description: {
        fr: 'Reçues dans les dernières 24h',
        en: 'Received in the last 24h',
        nl: 'Ontvangen in de laatste 24u',
        de: 'In den letzten 24h erhalten',
      },
    },
  },
};

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

/** Internal type for property data from database queries */
interface PropertyData {
  id: string;
  title?: string;
  status?: 'published' | 'draft' | 'archived';
  monthly_rent?: number;
  views_count?: number;
  inquiries_count?: number;
}

class PortfolioService {
  // Create fresh client for each request to ensure user session is current
  private getSupabase() {
    return createClient();
  }

  /**
   * Get comprehensive overview for Portfolio Hub
   */
  async getPortfolioOverview(userId: string): Promise<PortfolioOverview> {
    const supabase = this.getSupabase();
    try {
      // Fetch properties for this owner
      const { data: properties } = await supabase
        .from('properties')
        .select('id, title, status, monthly_rent, views_count, inquiries_count')
        .eq('owner_id', userId);

      if (!properties || properties.length === 0) {
        return this.getEmptyOverview();
      }

      const propertyIds = properties.map(p => p.id);

      // Fetch residents once for both property and performance stats (avoids duplicate query)
      // Note: no is_active column, all residents are considered active
      const { data: residents } = await this.getSupabase()
        .from('property_residents')
        .select('property_id')
        .in('property_id', propertyIds);

      const rentedPropertyIds = new Set(residents?.map(r => r.property_id) || []);

      // Fetch application stats in parallel while computing other stats
      const [propertyStats, applicationStats, performanceStats] = await Promise.all([
        Promise.resolve(this.getPropertyStatsSync(properties, rentedPropertyIds)),
        this.getApplicationStats(propertyIds),
        Promise.resolve(this.getPerformanceStatsSync(properties, rentedPropertyIds)),
      ]);

      return {
        properties: propertyStats,
        applications: applicationStats,
        performance: performanceStats,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('[Portfolio] ERROR: Failed to fetch overview:', error);
      return this.getEmptyOverview();
    }
  }

  /**
   * Get property statistics (sync - uses pre-fetched rentedPropertyIds)
   */
  private getPropertyStatsSync(properties: PropertyData[], rentedPropertyIds: Set<string>): PropertyStats {
    const published = properties.filter(p => p.status === 'published').length;
    const draft = properties.filter(p => p.status === 'draft').length;
    const archived = properties.filter(p => p.status === 'archived').length;
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
      const { data: applications } = await this.getSupabase()
        .from('applications')
        .select('id, status')
        .in('property_id', propertyIds);

      // Group applications
      const { data: groupApplications } = await this.getSupabase()
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
      console.error('[Portfolio] ERROR: Failed to fetch application stats:', error);
      return { total: 0, pending: 0, reviewing: 0, approved: 0, rejected: 0, individual: 0, group: 0 };
    }
  }

  /**
   * Get performance statistics (sync - uses pre-fetched rentedPropertyIds)
   */
  private getPerformanceStatsSync(properties: PropertyData[], rentedPropertyIds: Set<string>): PerformanceStats {
    const publishedProperties = properties.filter(p => p.status === 'published');
    const totalMonthlyRent = publishedProperties.reduce((sum, p) => sum + (p.monthly_rent || 0), 0);
    const avgRentPerProperty = publishedProperties.length > 0
      ? Math.round(totalMonthlyRent / publishedProperties.length)
      : 0;

    const totalViews = properties.reduce((sum, p) => sum + (p.views_count || 0), 0);
    const totalInquiries = properties.reduce((sum, p) => sum + (p.inquiries_count || 0), 0);

    // Calculate occupancy rate from pre-fetched data
    const rentedCount = rentedPropertyIds.size;
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
      const { data: properties } = await this.getSupabase()
        .from('properties')
        .select('id, title, status, created_at')
        .eq('owner_id', userId);

      if (!properties) return [];

      const propertyIds = properties.map(p => p.id);

      // 1. Pending applications
      const { data: pendingApps } = await this.getSupabase()
        .from('applications')
        .select('id')
        .in('property_id', propertyIds)
        .eq('status', 'pending');

      const { data: pendingGroupApps } = await this.getSupabase()
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
          title: translations.actions.pendingApplications.title[currentLang](totalPending),
          description: translations.actions.pendingApplications.description[currentLang],
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
          title: translations.actions.draftProperties.title[currentLang](draftProperties.length),
          description: translations.actions.draftProperties.description[currentLang],
          href: '/dashboard/owner/properties',
          count: draftProperties.length,
          createdAt: new Date().toISOString(),
        });
      }

      // 3. Vacant properties (published but no tenant for > 30 days)
      const publishedIds = properties.filter(p => p.status === 'published').map(p => p.id);

      if (publishedIds.length > 0) {
        // Note: no is_active column, all residents are considered active
        const { data: residents } = await this.getSupabase()
          .from('property_residents')
          .select('property_id')
          .in('property_id', publishedIds);

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
            title: translations.actions.vacantProperties.title[currentLang](longVacant.length),
            description: translations.actions.vacantProperties.description[currentLang],
            href: '/dashboard/owner/properties',
            count: longVacant.length,
            createdAt: new Date().toISOString(),
          });
        }
      }

      // 4. New applications in last 24h
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data: newApps } = await this.getSupabase()
        .from('applications')
        .select('id')
        .in('property_id', propertyIds)
        .gte('created_at', yesterday.toISOString());

      const { data: newGroupApps } = await this.getSupabase()
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
          title: translations.actions.newApplications.title[currentLang](totalNew),
          description: translations.actions.newApplications.description[currentLang],
          href: '/dashboard/owner/applications',
          count: totalNew,
          createdAt: new Date().toISOString(),
        });
      }

      // Sort by severity
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return actions.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    } catch (error) {
      console.error('[Portfolio] ERROR: Failed to fetch actions:', error);
      return [];
    }
  }

  /**
   * Get recent properties preview
   */
  async getRecentProperties(userId: string, limit: number = 3): Promise<PropertyPreview[]> {
    try {
      const { data: properties } = await this.getSupabase()
        .from('properties')
        .select('id, title, city, status, monthly_rent, bedrooms, images, views_count, inquiries_count, created_at')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!properties) return [];

      // Get rented status
      // Note: no is_active column, all residents are considered active
      const propertyIds = properties.map(p => p.id);
      const { data: residents } = await this.getSupabase()
        .from('property_residents')
        .select('property_id, move_in_date')
        .in('property_id', propertyIds);

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
      console.error('[Portfolio] ERROR: Failed to fetch recent properties:', error);
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
