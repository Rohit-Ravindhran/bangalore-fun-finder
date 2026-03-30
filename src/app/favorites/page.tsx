import type { Metadata } from 'next'
import Favorites from '@/views/Favorites'

export const metadata: Metadata = {
  title: 'My Favourites | Happenings Bangalore',
  description: 'View your saved favourite activities and experiences in Bangalore.',
}

export default function Page() {
  return <Favorites />
}
