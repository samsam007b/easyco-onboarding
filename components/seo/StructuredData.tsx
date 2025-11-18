/**
 * Structured Data Component
 *
 * Injects JSON-LD structured data into the page <head>.
 * Improves SEO with rich snippets in search results.
 *
 * @example
 * ```tsx
 * <StructuredData data={generatePropertyStructuredData(property)} />
 * ```
 */

interface StructuredDataProps {
  data: Record<string, any> | Array<Record<string, any>>;
}

export default function StructuredData({ data }: StructuredDataProps) {
  // Handle both single object and array of objects
  const structuredData = Array.isArray(data) ? data : [data];

  return (
    <>
      {structuredData.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item, null, 0), // Minified for production
          }}
        />
      ))}
    </>
  );
}

/**
 * Organization Structured Data Component
 * Add to root layout for site-wide organization data
 */
export function OrganizationStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EasyCo',
    description: 'Plateforme de colocation fiable et compatible en Belgique',
    url: 'https://easyco.be',
    logo: 'https://easyco.be/logo.png',
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

  return <StructuredData data={data} />;
}

/**
 * Website Structured Data Component
 * Add to root layout for site-wide website data
 */
export function WebsiteStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EasyCo',
    url: 'https://easyco.be',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://easyco.be/properties/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <StructuredData data={data} />;
}
