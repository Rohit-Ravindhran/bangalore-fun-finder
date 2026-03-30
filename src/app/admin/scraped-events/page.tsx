import ProtectedRoute from '@/components/ProtectedRoute'
import AdminScrapedEvents from '@/views/AdminScrapedEvents'
export default function Page() {
  return <ProtectedRoute><AdminScrapedEvents /></ProtectedRoute>
}
