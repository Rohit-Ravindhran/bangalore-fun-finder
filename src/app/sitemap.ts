import type { MetadataRoute } from 'next'
import { fetchActivities } from '@/services/activityService'

const BASE_URL = 'https://happeningsbangalore.com'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const activities = await fetchActivities()

  const activityUrls: MetadataRoute.Sitemap = activities.map((a) => ({
    url: `${BASE_URL}/activity/${a.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const blogSlugs = [
    'bangalore-weekend-april-4-5',
    'things-to-do-in-bangalore',
    'cafes-in-indiranagar',
    'rooftop-spots-bangalore',
    'weekend-treks-bangalore',
    'hidden-places-in-bangalore',
    'bangalore-morning-spots',
  ]

  const blogUrls: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...blogSlugs.map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...blogUrls,
    ...activityUrls,
  ]
}
