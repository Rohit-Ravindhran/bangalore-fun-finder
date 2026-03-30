import type { Metadata } from 'next'
import Terms from '@/views/Terms'

export const metadata: Metadata = {
  title: 'Terms of Service | Happenings Bangalore',
  description: 'Read the Terms of Service for Happenings Bangalore.',
}

export default function Page() {
  return <Terms />
}
