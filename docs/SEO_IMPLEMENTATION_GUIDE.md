# 🔍 SEO Implementation Guide

## Overview

EasyCo now has a comprehensive SEO system with dynamic metadata, Open Graph support, structured data (JSON-LD), and automatic sitemap generation.

---

## Quick Start

### 1. Page Metadata

All pages should export metadata using Next.js 14's `generateMetadata` function:

```typescript
import { generatePropertyMetadata } from '@/lib/seo/metadata-generator';
import { Metadata } from 'next';

// Static metadata
export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about EasyCo...',
};

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const property = await fetchProperty(params.id);
  return generatePropertyMetadata(property);
}
```

---

## Available Metadata Generators

### 1. `generateDefaultMetadata()`

Base metadata for the site. Already applied to root layout.

```typescript
import { generateDefaultMetadata } from '@/lib/seo/metadata-generator';

export const metadata = generateDefaultMetadata();
```

### 2. `generatePropertyMetadata(property)`

For property detail pages.

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const property = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .single();

  return generatePropertyMetadata(property.data);
}
```

**Generates:**
- Title: "Appartement 3 chambres Bruxelles - €1200/mois | EasyCo"
- Description: Property description (160 chars max)
- Open Graph images with property photo
- Twitter Card with large image
- Canonical URL

### 3. `generateProfileMetadata(profile)`

For user profile pages (should be `noindex` for privacy).

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const profile = await fetchProfile(params.id);
  return generateProfileMetadata(profile);
}
```

### 4. `generateArticleMetadata(article)`

For blog posts and articles.

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await fetchArticle(params.slug);
  return generateArticleMetadata(article);
}
```

**Generates:**
- Open Graph type: 'article'
- Published/modified times
- Author information
- Article tags and category

### 5. `generateSearchMetadata(params)`

For search and listing pages.

```typescript
export async function generateMetadata({ searchParams }): Promise<Metadata> {
  return generateSearchMetadata({
    city: searchParams.city,
    propertyType: searchParams.type,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    page: searchParams.page,
  });
}
```

**Generates:**
- "Colocation à Bruxelles | EasyCo"
- "Appartements en colocation à Bruxelles €800-1200/mois"
- Robots: noindex for page > 1

---

## Structured Data (JSON-LD)

### Usage

Import and use the StructuredData component:

```tsx
import StructuredData from '@/components/seo/StructuredData';
import { generatePropertyStructuredData } from '@/lib/seo/metadata-generator';

export default function PropertyPage({ property }) {
  const structuredData = generatePropertyStructuredData(property);

  return (
    <>
      <StructuredData data={structuredData} />
      {/* Page content */}
    </>
  );
}
```

### Available Structured Data Generators

#### 1. Property/Accommodation

```typescript
const data = generatePropertyStructuredData({
  id: property.id,
  title: property.title,
  description: property.description,
  monthly_rent: property.monthly_rent,
  city: property.city,
  address: property.address,
  latitude: property.latitude,
  longitude: property.longitude,
  available_rooms: property.available_rooms,
  property_type: property.property_type,
  images: property.images,
  owner: { name: property.owner_name },
});
```

**Enables:**
- Price snippets in search results
- Location pins on Google Maps
- Property carousel in search

#### 2. Organization

```typescript
const data = generateOrganizationStructuredData();
```

**Enables:**
- Knowledge panel in search
- Social media links
- Contact information

#### 3. Breadcrumbs

```typescript
const data = generateBreadcrumbStructuredData([
  { name: 'Home', url: '/' },
  { name: 'Properties', url: '/properties' },
  { name: 'Brussels', url: '/properties?city=brussels' },
  { name: property.title, url: `/properties/${property.id}` },
]);
```

**Enables:**
- Breadcrumb navigation in search results
- Better site structure understanding

#### 4. FAQ

```typescript
const data = generateFAQStructuredData([
  {
    question: 'How does the matching work?',
    answer: 'Our algorithm analyzes your preferences...',
  },
  {
    question: 'Is verification required?',
    answer: 'Yes, all users must verify their identity...',
  },
]);
```

**Enables:**
- Rich FAQ snippets in search
- Expandable answers in search results

---

## Sitemap

### Automatic Generation

Sitemap is automatically generated at `/sitemap.xml` with:

- ✅ All static pages (home, about, pricing, etc.)
- ✅ All published properties (up to 1000)
- ✅ All blog posts (up to 500)
- ✅ City-specific search pages
- ✅ Automatic lastModified dates
- ✅ Priority and changeFrequency hints

### Manual Trigger

Sitemap regenerates on every request in development, and is cached in production.

To force regeneration in production:
1. Redeploy the app
2. Or implement revalidation in your deployment pipeline

---

## Robots.txt

### Automatic Generation

Robots.txt is automatically generated at `/robots.txt` with:

- ✅ Allow public pages
- ✅ Disallow private pages (/dashboard, /admin, /auth)
- ✅ Block AI training bots (GPTBot, ChatGPT, CCBot)
- ✅ Sitemap reference
- ✅ Host declaration

### Customization

Edit `/app/robots.ts` to modify rules.

---

## Open Graph Images

### Current Setup

- Default OG image: `/og-image.jpg` (1200x630px)
- Twitter card: `/twitter-card.jpg`
- Property images: First property photo

### Dynamic OG Image Generation (Future)

Consider implementing `@vercel/og` for dynamic OG images:

```typescript
// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  return new ImageResponse(
    (
      <div style={{
        background: 'linear-gradient(to bottom, #FFA040, #FFD080)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <h1 style={{ fontSize: 60 }}>{title}</h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

---

## Best Practices

### ✅ DO

1. **Use semantic HTML:**
   ```tsx
   <article>
     <h1>Property Title</h1>
     <section>Details</section>
   </article>
   ```

2. **Include alt text on images:**
   ```tsx
   <img src={image} alt="Living room of 3-bedroom apartment in Brussels" />
   ```

3. **Use proper heading hierarchy:**
   ```tsx
   <h1>Main Title</h1>
   <h2>Section</h2>
   <h3>Subsection</h3>
   ```

4. **Add canonical URLs:**
   ```typescript
   metadata: {
     alternates: {
       canonical: 'https://easyco.be/properties/123'
     }
   }
   ```

5. **Keep titles under 60 characters**
6. **Keep descriptions under 160 characters**
7. **Use unique metadata for each page**

### ❌ DON'T

1. **Don't index private pages:**
   ```typescript
   metadata: {
     robots: {
       index: false,
       follow: false,
     }
   }
   ```

2. **Don't duplicate content**
3. **Don't stuff keywords**
4. **Don't use generic titles like "Page 1"**

---

## Testing Your SEO

### 1. Google Rich Results Test

https://search.google.com/test/rich-results

Paste your URL to test structured data.

### 2. Facebook Sharing Debugger

https://developers.facebook.com/tools/debug/

Test Open Graph tags.

### 3. Twitter Card Validator

https://cards-dev.twitter.com/validator

Test Twitter cards.

### 4. Google Search Console

https://search.google.com/search-console

Monitor indexing, sitemap, and search performance.

### 5. Local Testing

```bash
# View sitemap
curl http://localhost:3000/sitemap.xml

# View robots.txt
curl http://localhost:3000/robots.txt

# Test metadata
curl -s http://localhost:3000/properties/123 | grep -o '<title>.*</title>'
```

---

## Performance Impact

- **Metadata generation:** ~0ms (static)
- **Sitemap generation:** ~50-200ms (database queries)
- **Structured data:** ~1KB per page
- **Total SEO system:** <5KB

---

## Migration Checklist

- [ ] Add metadata to all public pages
- [ ] Add structured data to property pages
- [ ] Add structured data to blog posts
- [ ] Test sitemap.xml
- [ ] Test robots.txt
- [ ] Submit sitemap to Google Search Console
- [ ] Test Open Graph with Facebook debugger
- [ ] Test Twitter cards
- [ ] Verify rich results in Google
- [ ] Set up Google Analytics
- [ ] Monitor Core Web Vitals

---

## Examples

### Property Page

```tsx
// app/properties/[id]/page.tsx
import { generatePropertyMetadata, generatePropertyStructuredData } from '@/lib/seo/metadata-generator';
import StructuredData from '@/components/seo/StructuredData';

export async function generateMetadata({ params }): Promise<Metadata> {
  const property = await fetchProperty(params.id);
  return generatePropertyMetadata(property);
}

export default async function PropertyPage({ params }) {
  const property = await fetchProperty(params.id);
  const structuredData = generatePropertyStructuredData(property);

  return (
    <>
      <StructuredData data={structuredData} />
      <article>
        <h1>{property.title}</h1>
        {/* Content */}
      </article>
    </>
  );
}
```

### Search Page

```tsx
// app/properties/search/page.tsx
import { generateSearchMetadata } from '@/lib/seo/metadata-generator';

export async function generateMetadata({ searchParams }): Promise<Metadata> {
  return generateSearchMetadata({
    city: searchParams.city,
    propertyType: searchParams.type,
    page: parseInt(searchParams.page || '1'),
  });
}
```

---

## Future Enhancements

1. **Dynamic OG Images** - Generate property-specific OG images
2. **Video Structured Data** - For property video tours
3. **Review Structured Data** - For property reviews
4. **Event Structured Data** - For open houses/viewings
5. **Local Business Structured Data** - For office locations
6. **Multi-language Sitemaps** - Separate sitemaps per language

---

**Last Updated:** 2025-11-17
**Version:** 1.0.0
