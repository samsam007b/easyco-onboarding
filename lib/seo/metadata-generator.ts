/**
 * SEO Metadata Generator
 *
 * Centralized system for generating dynamic metadata for all pages.
 * Supports Open Graph, Twitter Cards, and JSON-LD structured data.
 *
 * @example
 * ```tsx
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const property = await fetchProperty(params.id);
 *   return generatePropertyMetadata(property);
 * }
 * ```
 */

import { Metadata } from 'next';

// Base configuration
const SITE_CONFIG = {
  name: 'EasyCo',
  description: 'Trouve ta coloc idéale à Bruxelles, Liège, Gand. Vérification d\'identité, matching intelligent, groupes pré-formés. Évite les arnaques.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://easyco.be',
  ogImage: '/og-image.jpg',
  twitterHandle: '@EasyCoBE',
  locale: 'fr_BE',
  alternateLocales: ['en_US', 'nl_BE', 'de_DE'],
};

/**
 * Generate default metadata for the site
 */
export function generateDefaultMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: `${SITE_CONFIG.name} — Colocation fiable et compatible en Belgique`,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    keywords: [
      'colocation Bruxelles',
      'coliving Belgique',
      'coloc Liège',
      'coloc Gand',
      'appartement partagé',
      'kot étudiant',
      'roommate Brussels',
      'shared apartment Belgium',
      'verified roommates',
      'compatible coliving',
    ],
    authors: [{ name: 'EasyCo Team' }],
    creator: 'EasyCo',
    publisher: 'EasyCo',
    applicationName: SITE_CONFIG.name,

    // Open Graph
    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      alternateLocale: SITE_CONFIG.alternateLocales,
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      title: `${SITE_CONFIG.name} — Colocation fiable en Belgique`,
      description: SITE_CONFIG.description,
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} - Plateforme de colocation fiable`,
        },
      ],
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
      title: `${SITE_CONFIG.name} — Colocation fiable en Belgique`,
      description: SITE_CONFIG.description,
      images: ['/twitter-card.jpg'],
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },

    // Icons
    icons: {
      icon: [
        { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/icons/icon-152x152.png', sizes: '152x152' },
        { url: '/icons/icon-180x180.png', sizes: '180x180' },
      ],
    },

    // Manifest
    manifest: '/manifest.json',

    // Other
    category: 'Real Estate',
  };
}

/**
 * Generate metadata for a property page
 */
export function generatePropertyMetadata(property: {
  id: string;
  title: string;
  description: string;
  monthly_rent: number;
  city: string;
  address?: string;
  available_rooms: number;
  property_type: string;
  images?: string[];
}): Metadata {
  const title = `${property.title} - ${property.city} | ${SITE_CONFIG.name}`;
  const description = property.description?.slice(0, 160) ||
    `${property.property_type} à ${property.city} - €${property.monthly_rent}/mois - ${property.available_rooms} chambres disponibles`;

  const imageUrl = property.images?.[0] || SITE_CONFIG.ogImage;
  const propertyUrl = `${SITE_CONFIG.url}/properties/${property.id}`;

  return {
    title,
    description,
    keywords: [
      `colocation ${property.city}`,
      `appartement ${property.city}`,
      `${property.property_type} ${property.city}`,
      'coliving Belgium',
      'roommates Belgium',
    ],

    openGraph: {
      type: 'article',
      url: propertyUrl,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },

    alternates: {
      canonical: propertyUrl,
    },
  };
}

/**
 * Generate metadata for a user profile page
 */
export function generateProfileMetadata(profile: {
  id: string;
  full_name: string;
  bio?: string;
  city?: string;
  age?: number;
  occupation?: string;
  avatar_url?: string;
  user_type: 'searcher' | 'owner' | 'resident';
}): Metadata {
  const typeLabel = {
    searcher: 'Chercheur',
    owner: 'Propriétaire',
    resident: 'Colocataire',
  }[profile.user_type];

  const title = `${profile.full_name} - ${typeLabel} | ${SITE_CONFIG.name}`;
  const description = profile.bio?.slice(0, 160) ||
    `${profile.full_name}, ${typeLabel}${profile.city ? ` à ${profile.city}` : ''}${profile.occupation ? ` - ${profile.occupation}` : ''}`;

  const imageUrl = profile.avatar_url || `${SITE_CONFIG.url}/default-avatar.jpg`;
  const profileUrl = `${SITE_CONFIG.url}/profiles/${profile.id}`;

  return {
    title,
    description,

    openGraph: {
      type: 'profile',
      url: profileUrl,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 400,
          height: 400,
          alt: profile.full_name,
        },
      ],
      firstName: profile.full_name.split(' ')[0],
      lastName: profile.full_name.split(' ').slice(1).join(' '),
    },

    twitter: {
      card: 'summary',
      title,
      description,
      images: [imageUrl],
    },

    alternates: {
      canonical: profileUrl,
    },

    robots: {
      index: false, // Don't index user profiles for privacy
      follow: false,
    },
  };
}

/**
 * Generate metadata for blog/article pages
 */
export function generateArticleMetadata(article: {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  updatedAt?: Date;
  category: string;
  tags: string[];
  coverImage?: string;
}): Metadata {
  const title = `${article.title} | ${SITE_CONFIG.name} Blog`;
  const description = article.excerpt?.slice(0, 160);
  const imageUrl = article.coverImage || SITE_CONFIG.ogImage;
  const articleUrl = `${SITE_CONFIG.url}/blog/${article.id}`;

  return {
    title,
    description,
    keywords: [...article.tags, article.category, 'colocation', 'coliving'],
    authors: [{ name: article.author }],

    openGraph: {
      type: 'article',
      url: articleUrl,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      publishedTime: article.publishedAt.toISOString(),
      modifiedTime: article.updatedAt?.toISOString(),
      authors: [article.author],
      section: article.category,
      tags: article.tags,
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },

    alternates: {
      canonical: articleUrl,
    },
  };
}

/**
 * Generate metadata for search/listing pages
 */
export function generateSearchMetadata(params: {
  city?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
}): Metadata {
  const { city, propertyType, minPrice, maxPrice, page = 1 } = params;

  let title = 'Rechercher une colocation';
  let description = 'Trouve ta colocation idéale en Belgique';

  if (city) {
    title = `Colocation à ${city}`;
    description = `Découvre les meilleures colocations à ${city}`;
  }

  if (propertyType) {
    const typeLabel = {
      apartment: 'Appartements',
      house: 'Maisons',
      studio: 'Studios',
    }[propertyType] || propertyType;

    title = city
      ? `${typeLabel} en colocation à ${city}`
      : `${typeLabel} en colocation`;
  }

  if (minPrice || maxPrice) {
    const priceRange = minPrice && maxPrice
      ? `€${minPrice}-${maxPrice}`
      : minPrice
      ? `à partir de €${minPrice}`
      : `jusqu'à €${maxPrice}`;

    description += ` ${priceRange}/mois`;
  }

  if (page > 1) {
    title += ` - Page ${page}`;
  }

  title += ` | ${SITE_CONFIG.name}`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      type: 'website',
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },

    robots: {
      index: page === 1, // Only index first page
      follow: true,
    },
  };
}

/**
 * Generate JSON-LD structured data for property
 */
export function generatePropertyStructuredData(property: {
  id: string;
  title: string;
  description: string;
  monthly_rent: number;
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  available_rooms: number;
  property_type: string;
  images?: string[];
  owner: {
    name: string;
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    name: property.title,
    description: property.description,
    url: `${SITE_CONFIG.url}/properties/${property.id}`,
    image: property.images || [SITE_CONFIG.ogImage],
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.city,
      addressCountry: 'BE',
      ...(property.address && { streetAddress: property.address }),
    },
    ...(property.latitude && property.longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: property.latitude,
        longitude: property.longitude,
      },
    }),
    offers: {
      '@type': 'Offer',
      price: property.monthly_rent,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
    },
    numberOfRooms: property.available_rooms,
    provider: {
      '@type': 'Person',
      name: property.owner.name,
    },
  };
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    sameAs: [
      'https://www.facebook.com/EasyCoBE',
      'https://www.instagram.com/easyco.be',
      'https://twitter.com/EasyCoBE',
      'https://www.linkedin.com/company/easyco-be',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@easyco.be',
      availableLanguage: ['fr', 'en', 'nl', 'de'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BE',
    },
  };
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

/**
 * Generate JSON-LD structured data for FAQ
 */
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
