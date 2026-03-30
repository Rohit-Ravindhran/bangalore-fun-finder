import type { Metadata } from 'next'
import Contact from '@/views/Contact'

export const metadata: Metadata = {
  title: 'Contact Us | Happenings Bangalore',
  description:
    'Get in touch with the Happenings Bangalore team. Suggest an activity, report an issue, or just say hello.',
  openGraph: {
    title: 'Contact Us | Happenings Bangalore',
    url: 'https://happeningsbangalore.com/contact',
  },
}

export default function Page() {
  return <Contact />
}
