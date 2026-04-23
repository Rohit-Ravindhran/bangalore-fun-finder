import type { Metadata } from 'next'
import { getActivityBySlug, fetchActivities } from '@/services/activityService'
import { activitySlug } from '@/lib/utils'
import ActivityDetail from '@/views/ActivityDetail'

export const revalidate = 3600 // 1 hour

export async function generateStaticParams() {
  const activities = await fetchActivities()
  return activities.map((a) => ({ slug: activitySlug(a.title, a.id) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const activity = await getActivityBySlug(slug)

  if (!activity) return { title: 'Activity Not Found | Happenings Bangalore' }

  const description =
    activity.description ||
    `${activity.title} at ${activity.location}${activity.priceRange ? ` · ${activity.priceRange}` : ''}`

  return {
    title: `${activity.title} | Happenings Bangalore`,
    description,
    keywords: [activity.title, activity.location, 'Bangalore', ...(activity.tags ?? [])].join(', '),
    openGraph: {
      title: activity.title,
      description,
      type: 'article',
      url: `https://happeningsbangalore.com/activity/${slug}`,
      images: activity.image
        ? [{ url: activity.image, alt: activity.title }]
        : [{ url: 'https://happeningsbangalore.com/assets/og-image.jpg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: activity.title,
      description,
      images: activity.image ? [activity.image] : [],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const activity = await getActivityBySlug(slug)
  return <ActivityDetail initialActivity={activity} />
}
