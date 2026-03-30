import type { Metadata } from 'next'
import Privacy from '@/views/Privacy'

export const metadata: Metadata = {
  title: 'Privacy Policy | Happenings Bangalore',
  description: 'Read the Privacy Policy for Happenings Bangalore.',
}

export default function Page() {
  return <Privacy />
}
