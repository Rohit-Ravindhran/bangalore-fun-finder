import type { MetadataRoute } from 'next'

const BASE_URL = 'https://happeningsbangalore.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/admin/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin', '/admin/'],
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/'],
        crawlDelay: 1,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
