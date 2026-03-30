import type { Metadata } from 'next'
import About from '@/views/About'

export const metadata: Metadata = {
  title: 'About Us | Happenings Bangalore',
  description:
    'Learn about Happenings Bangalore — your curated guide to the best things to do, see, and experience in the city.',
  openGraph: {
    title: 'About Us | Happenings Bangalore',
    description:
      'Learn about Happenings Bangalore — your curated guide to the best things to do, see, and experience in the city.',
    url: 'https://happeningsbangalore.com/about',
  },
}

export default function Page() {
  return <About />
}
