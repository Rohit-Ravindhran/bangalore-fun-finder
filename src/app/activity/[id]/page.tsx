import type { Metadata } from 'next'
import { getActivityById, fetchActivities } from '@/services/activityService'
import ActivityDetail from '@/views/ActivityDetail'

export const revalidate = 3600 // 1 hour

export async function generateStaticParams() {
  const activities = await fetchActivities()
  return activities.map((a) => ({ id: a.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const activity = await getActivityById(id)

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
      url: `https://happeningsbangalore.com/activity/${id}`,
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

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const activity = await getActivityById(id)
  return <ActivityDetail initialActivity={activity} />
}
