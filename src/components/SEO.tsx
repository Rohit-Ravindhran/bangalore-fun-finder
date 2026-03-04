import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'event';
  noindex?: boolean;
  schema?: object;
}

const defaultMeta = {
  siteName: 'Happenings Bangalore',
  title: 'Happenings Bangalore | Discover & Book Fun Things To Do',
  description: 'Explore the best things to do in Bangalore – from unique date packages, weekend getaways, and adventure activities to food trails. Curated experiences for everyone.',
  keywords: 'Things to do in Bangalore, Bangalore activities, Bangalore date ideas, couple packages Bangalore, Bangalore weekend plans, curated experiences, what to do in Bangalore today, Bangalore outings',
  image: 'https://happeningsbangalore.com/assets/og-image.jpg',
  url: 'https://happeningsbangalore.com',
};

export const SEO = ({
  title,
  description = defaultMeta.description,
  keywords = defaultMeta.keywords,
  image = defaultMeta.image,
  url,
  type = 'website',
  noindex = false,
  schema,
}: SEOProps) => {
  const fullTitle = title 
    ? `${title} | ${defaultMeta.siteName}` 
    : defaultMeta.title;
  
  const canonicalUrl = url || defaultMeta.url;

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: defaultMeta.siteName,
    url: defaultMeta.url,
    description: defaultMeta.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://happeningsbangalore.com/?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={defaultMeta.siteName} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>
    </Helmet>
  );
};

// Helper to generate Activity schema
export const generateActivitySchema = (activity: {
  id: string;
  name: string;
  description: string;
  image?: string;
  location?: string;
  price?: number;
  startDate?: string;
  endDate?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: activity.name,
  description: activity.description,
  image: activity.image,
  url: `https://happeningsbangalore.com/activity/${activity.id}`,
  location: {
    '@type': 'Place',
    name: activity.location || 'Bangalore',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      addressCountry: 'IN',
    },
  },
  ...(activity.price && {
    offers: {
      '@type': 'Offer',
      price: activity.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  }),
  ...(activity.startDate && { startDate: activity.startDate }),
  ...(activity.endDate && { endDate: activity.endDate }),
  organizer: {
    '@type': 'Organization',
    name: 'Happenings Bangalore',
    url: 'https://happeningsbangalore.com',
  },
});

// Helper to generate breadcrumb schema
export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export default SEO;
