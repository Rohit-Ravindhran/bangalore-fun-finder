import ProtectedRoute from '@/components/ProtectedRoute'
import ActivityAddFromBMS from '@/views/ActivityAddFromBMS'
export default function Page() {
  return <ProtectedRoute><ActivityAddFromBMS /></ProtectedRoute>
}
