import { getFilteredActivitiesBySection, fetchCategories } from '@/services/activityService'
import Index from '@/views/Index'

export const revalidate = 1800 // 30 minutes

export default async function Page() {
  const [initialActivities, initialCategories] = await Promise.all([
    getFilteredActivitiesBySection('all', 'newest'),
    fetchCategories(),
  ])

  return <Index initialActivities={initialActivities} initialCategories={initialCategories} />
}
