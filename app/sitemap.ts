/**
 * Dynamic Sitemap Generator
 *
 * Generates sitemap.xml for all public pages in the application.
 * Automatically includes properties, blog posts, and static pages.
 *
 * Accessible at: https://easyco.be/sitemap.xml
 */

import { MetadataRoute } from 'next';
import { createClient } from '@/lib/auth/supabase-server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://easyco.be';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Static pages
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/properties`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/properties/browse`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // Fetch published properties
  const { data: properties } = await supabase
    .from('properties')
    .select('id, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false })
    .limit(1000); // Limit to prevent massive sitemaps

  const propertyPages = (properties || []).map((property) => ({
    url: `${SITE_URL}/properties/${property.id}`,
    lastModified: new Date(property.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Fetch blog posts (if blog table exists)
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(500);

    blogPages = (posts || []).map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    // Blog table might not exist yet
    console.log('Blog posts not available for sitemap');
  }

  // City-specific search pages
  const cities = ['bruxelles', 'liege', 'gand', 'anvers', 'namur', 'charleroi'];
  const cityPages = cities.map((city) => ({
    url: `${SITE_URL}/properties/search?city=${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Combine all pages
  return [...staticPages, ...propertyPages, ...blogPages, ...cityPages];
}
