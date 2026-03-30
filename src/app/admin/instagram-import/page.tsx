import ProtectedRoute from '@/components/ProtectedRoute'
import ActivityAddFromInstagram from '@/views/ActivityAddFromInstagram'
export default function Page() {
  return <ProtectedRoute><ActivityAddFromInstagram /></ProtectedRoute>
}
